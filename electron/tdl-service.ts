import { ipcMain } from "electron";
import { getTdjson } from "prebuilt-tdlib";
import * as tdl from "tdl";
import type * as Td from "tdlib-types";

interface TDLResponse {
  success: boolean;
  data?: any;
  error?: string;
}

export class TDLService {
  private client: any = null;
  private isInitialized = false;
  private apiId = 0;
  private apiHash = "your_api_hash_here";
  private currentAuthState: Td.AuthorizationState = { _: "authorizationStateWaitTdlibParameters" };

  constructor() {
    this.setupIPCHandlers();
  }

  private log(content: any) {
    console.log(`[TDL]\tLOG:\t${content}`);
  }

  private error(content: any) {
    console.error(`[TDL]\tERROR:\t${content}`);
  }

  private setupIPCHandlers() {
    ipcMain.handle("tdl-init", async () => {
      return await this.initialize(this.apiId, this.apiHash);
    });

    ipcMain.handle("tdl-login-with-phone", async (_, phoneNumber: string) => {
      return await this.loginWithPhone(phoneNumber);
    });

    ipcMain.handle("tdl-submit-auth-code", async (_, code: string) => {
      return await this.submitAuthCode(code);
    });

    ipcMain.handle("tdl-get-auth-state", async () => {
      return await this.getAuthState();
    });

    ipcMain.handle("tdl-get-current-user", async () => {
      return await this.getCurrentUser();
    });

    ipcMain.handle("tdl-logout", async () => {
      return await this.logout();
    });

    ipcMain.handle("tdl-close", async () => {
      return await this.close();
    });

    ipcMain.handle("tdl-submit-password", async (_, password: string) => {
      return await this.submitPassword(password);
    });

    ipcMain.handle("tdl-register-user", async (_, firstName: string, lastName?: string) => {
      return await this.registerUser(firstName, lastName);
    });

    ipcMain.handle("tdl-get-password", async (_, passwordHint: string) => {
      return await this.getPassword(passwordHint);
    });
  }

  private async getAuthState(): Promise<TDLResponse> {
    try {
      if (!this.client || !this.isInitialized)
        return { success: false, error: "TDL not initialized" };

      return { success: true, data: this.currentAuthState._ };
    } catch (error) {
      this.error(error);
      return { success: false, error: error instanceof Error ? error.message : "Unknown error" };
    }
  }

  private async initialize(apiId?: number, apiHash?: string): Promise<TDLResponse> {
    try {
      if (!apiId || !apiHash)
        return { success: false, error: "No API_ID or API_HASH were provided" };

      if (this.isInitialized) return { success: true };

      const tdjsonPath = getTdjson();
      if (!(tdl as any).__teleflyConfigured) {
        tdl.configure({
          tdjson: tdjsonPath,
          verbosityLevel: 1,
        });
        (tdl as any).__teleflyConfigured = true;
      }

      this.client = tdl.createClient({
        apiId: this.apiId,
        apiHash: this.apiHash,
      });

      this.client.on("error", (error: any) => {
        this.error(error);
      });

      this.client.on("update", (update: any) => {
        if (update._ === "updateAuthorizationState") {
          this.currentAuthState = update.authorization_state;
          this.log(this.currentAuthState._);
        }
      });

      this.isInitialized = true;

      return {
        success: true,
      };
    } catch (error) {
      this.error(`Failed to initialize TDL due to: ${error}`);
      return { success: false, error: error instanceof Error ? error.message : "Unknown error" };
    }
  }

  private async loginWithPhone(phoneNumber: string): Promise<TDLResponse> {
    try {
      this.log(`Logging in with phone number: ${phoneNumber}`);

      if (!this.client || !this.isInitialized)
        return { success: false, error: "TDL not initialized" };

      if (this.currentAuthState._ !== "authorizationStateWaitPhoneNumber")
        return {
          success: false,
          error: `Cannot phone number with state: ${this.currentAuthState}`,
        };

      this.client.invoke({
        _: "setAuthenticationPhoneNumber",
        phone_number: phoneNumber,
      });

      return { success: true };
    } catch (error) {
      this.error(error);
      return { success: false, error: error instanceof Error ? error.message : "Unknown error" };
    }
  }

  private async submitAuthCode(code: string): Promise<TDLResponse> {
    try {
      if (!this.client || !this.isInitialized)
        return { success: false, error: "TDL not initialized" };

      if (this.currentAuthState._ !== "authorizationStateWaitCode")
        return {
          success: false,
          error: `Cannot submit auth code with state: ${this.currentAuthState}`,
        };

      await this.client.invoke({
        _: "checkAuthenticationCode",
        code: code,
      });

      await new Promise((resolve) => setTimeout(resolve, 500));

      return { success: true };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : "Unknown error" };
    }
  }

  private async getPassword(passwordHint: string): Promise<{ success: boolean; error?: string }> {
    try {
      if (!this.client || !this.isInitialized) {
        return { success: false, error: "TDL not initialized" };
      }

      if (this.currentAuthState._ !== "authorizationStateWaitPassword") {
        return { success: false, error: "Not waiting for password" };
      }

      return { success: true };
    } catch (error) {
      console.error("Get password failed:", error);
      return { success: false, error: error instanceof Error ? error.message : "Unknown error" };
    }
  }

  private async submitPassword(password: string): Promise<{ success: boolean; error?: string }> {
    try {
      if (!this.client || !this.isInitialized) {
        return { success: false, error: "TDL not initialized" };
      }

      if (this.currentAuthState._ !== "authorizationStateWaitPassword") {
        return { success: false, error: "Not waiting for password" };
      }

      await this.client.invoke({
        _: "checkAuthenticationPassword",
        password: password,
      });

      // Wait a moment for the state to update
      await new Promise((resolve) => setTimeout(resolve, 500));

      return { success: true };
    } catch (error) {
      console.error("Password submission failed:", error);
      return { success: false, error: error instanceof Error ? error.message : "Unknown error" };
    }
  }

  private async registerUser(
    firstName: string,
    lastName?: string,
  ): Promise<{ success: boolean; error?: string }> {
    try {
      if (!this.client || !this.isInitialized) {
        return { success: false, error: "TDL not initialized" };
      }

      if (this.currentAuthState._ !== "authorizationStateWaitRegistration") {
        return { success: false, error: "Not waiting for registration" };
      }

      await this.client.invoke({
        _: "registerUser",
        first_name: firstName,
        last_name: lastName || "",
      });

      return { success: true };
    } catch (error) {
      console.error("User registration failed:", error);
      return { success: false, error: error instanceof Error ? error.message : "Unknown error" };
    }
  }

  private async close(): Promise<{ success: boolean; error?: string }> {
    try {
      if (this.client) {
        await this.client.close();
        this.client = null;
        this.isInitialized = false;
      }
      return { success: true };
    } catch (error) {
      console.error("Failed to close TDL client:", error);
      return { success: false, error: error instanceof Error ? error.message : "Unknown error" };
    }
  }

  private async logout(): Promise<{ success: boolean; error?: string }> {
    try {
      if (this.client && this.isInitialized) {
        await this.client.invoke({
          _: "logOut",
        });

        await this.client.close();
        this.client = null;
        this.isInitialized = false;
        this.currentAuthState = { _: "authorizationStateWaitTdlibParameters" };
      }
      return { success: true };
    } catch (error) {
      console.error("Failed to logout from TDL:", error);
      return { success: false, error: error instanceof Error ? error.message : "Unknown error" };
    }
  }

  private async getCurrentUser(): Promise<TDLResponse> {
    try {
      if (!this.client || !this.isInitialized) {
        return { success: false, error: "TDL not initialized" };
      }

      if (this.currentAuthState._ !== "authorizationStateReady") {
        return { success: false, error: "User not authorized" };
      }

      const me = await this.client.invoke({ _: "getMe" });

      if (me) {
        return {
          success: true,
          data: {
            id: me.id,
            firstName: me.first_name || "",
            lastName: me.last_name || "",
            username: me.username || "",
            phoneNumber: me.phone_number || "",
            isVerified: me.is_verified || false,
            isPremium: me.is_premium || false,
            status: me.status?._ || "",
            profilePhoto: me.profile_photo || null,
          },
        };
      }

      return { success: false, error: "Failed to get user info" };
    } catch (error) {
      console.error("Failed to get current user:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }
}
