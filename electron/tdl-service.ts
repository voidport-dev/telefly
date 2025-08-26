const tdl = require("tdl");
const { getTdjson } = require("prebuilt-tdlib");
import fs from "fs";
import path from "path";
import { ipcMain } from "electron";

export interface SimpleResult {
  success: boolean;
  error?: string;
}

export class TDLService {
  private client: any = null;
  private isInitialized = false;
  private defaultApiId = 0;
  private defaultApiHash = "your_api_hash_here";
  private currentAuthState: string = "authorizationStateWaitTdlibParameters";

  constructor() {
    this.setupIPCHandlers();
  }

  private setupIPCHandlers() {
    ipcMain.handle("tdl-init", async (event, apiId?: number, apiHash?: string) => {
      return await this.initialize(apiId, apiHash);
    });

    ipcMain.handle("tdl-init-default", async () => {
      return await this.initialize();
    });

    ipcMain.handle("tdl-login-phone", async (event, phoneNumber: string) => {
      return await this.loginWithPhone(phoneNumber);
    });

    ipcMain.handle("tdl-get-auth-code", async (event) => {
      return await this.getAuthCode();
    });

    ipcMain.handle("tdl-submit-auth-code", async (event, code: string) => {
      return await this.submitAuthCode(code);
    });

    ipcMain.handle("tdl-get-password", async (event, passwordHint: string) => {
      return await this.getPassword(passwordHint);
    });

    ipcMain.handle("tdl-submit-password", async (event, password: string) => {
      return await this.submitPassword(password);
    });

    ipcMain.handle("tdl-register-user", async (event, firstName: string, lastName?: string) => {
      return await this.registerUser(firstName, lastName);
    });

    ipcMain.handle("tdl-get-status", async () => {
      return await this.getStatus();
    });

    ipcMain.handle("tdl-get-auth-state", async () => {
      return await this.getCurrentAuthState();
    });

    ipcMain.handle("tdl-close", async () => {
      return await this.close();
    });

    ipcMain.handle("tdl-logout", async () => {
      return await this.logout();
    });

    ipcMain.handle("tdl-reset", async () => {
      return await this.reset();
    });

    ipcMain.handle("tdl-get-app-info", async () => {
      return await this.getAppInfo();
    });

    ipcMain.handle("tdl-get-current-user", async () => {
      return await this.getCurrentUser();
    });
  }

  private async initialize(
    apiId?: number,
    apiHash?: string,
  ): Promise<{ success: boolean; error?: string }> {
    try {
      if (this.isInitialized) {
        return { success: true };
      }

      const finalApiId = apiId || this.defaultApiId;
      const finalApiHash = apiHash || this.defaultApiHash;

      const tdjsonPath = getTdjson();
      // Ensure TDLib is configured only once per process
      if (!(tdl as any).__teleflyConfigured) {
        tdl.configure({
          tdjson: tdjsonPath,
          verbosityLevel: 1,
        });
        (tdl as any).__teleflyConfigured = true;
      }

      this.client = tdl.createClient({
        apiId: finalApiId,
        apiHash: finalApiHash,
        databaseDirectory: "_td_database",
        filesDirectory: "_td_files",
        tdlibParameters: {
          use_message_database: true,
          use_secret_chats: false,
          system_language_code: "en",
          application_version: "1.0",
          device_model: "Telefly Desktop",
          system_version: "Unknown",
          api_id: finalApiId,
          api_hash: finalApiHash,
          database_directory: "_td_database",
          files_directory: "_td_files",
          use_test_dc: false,
        },
      });

      this.client.on("error", (error: any) => {
        console.error("TDL Error:", error);
      });

      this.client.on("update", (update: any) => {
        if (update._ === "updateAuthorizationState") {
          this.currentAuthState = update.authorization_state._;
          console.log("Authorization state:", this.currentAuthState);
        }
      });

      this.isInitialized = true;
      return { success: true };
    } catch (error) {
      console.error("Failed to initialize TDL:", error);
      return { success: false, error: error instanceof Error ? error.message : "Unknown error" };
    }
  }

  public async reset(): Promise<SimpleResult> {
    try {
      await this.close();
      await purgeTDLibData();
      await recreateDirs();
      this.isInitialized = false;
      this.client = null;
      this.currentAuthState = "authorizationStateWaitTdlibParameters";
      return { success: true };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : "Unknown error" };
    }
  }

  private async loginWithPhone(phoneNumber: string): Promise<{ success: boolean; error?: string }> {
    try {
      if (!this.client || !this.isInitialized) {
        return { success: false, error: "TDL not initialized" };
      }

      // Check if we're in the correct state to set phone number
      if (this.currentAuthState !== "authorizationStateWaitPhoneNumber") {
        return {
          success: false,
          error: `Cannot set phone number in state: ${this.currentAuthState}`,
        };
      }

      await this.client.invoke({
        _: "setAuthenticationPhoneNumber",
        phone_number: phoneNumber,
      });

      return { success: true };
    } catch (error) {
      console.error("Phone login failed:", error);
      return { success: false, error: error instanceof Error ? error.message : "Unknown error" };
    }
  }

  private async getAuthCode(): Promise<{ success: boolean; error?: string }> {
    try {
      if (!this.client || !this.isInitialized) {
        return { success: false, error: "TDL not initialized" };
      }

      if (this.currentAuthState !== "authorizationStateWaitCode") {
        return { success: false, error: "Not waiting for auth code" };
      }

      return { success: true };
    } catch (error) {
      console.error("Get auth code failed:", error);
      return { success: false, error: error instanceof Error ? error.message : "Unknown error" };
    }
  }

  private async submitAuthCode(code: string): Promise<{ success: boolean; error?: string }> {
    try {
      if (!this.client || !this.isInitialized) {
        return { success: false, error: "TDL not initialized" };
      }

      if (this.currentAuthState !== "authorizationStateWaitCode") {
        return { success: false, error: "Not waiting for auth code" };
      }

      await this.client.invoke({
        _: "checkAuthenticationCode",
        code: code,
      });

      // Wait a moment for the state to update
      await new Promise((resolve) => setTimeout(resolve, 500));

      return { success: true };
    } catch (error) {
      console.error("Auth code submission failed:", error);
      return { success: false, error: error instanceof Error ? error.message : "Unknown error" };
    }
  }

  private async getPassword(passwordHint: string): Promise<{ success: boolean; error?: string }> {
    try {
      if (!this.client || !this.isInitialized) {
        return { success: false, error: "TDL not initialized" };
      }

      if (this.currentAuthState !== "authorizationStateWaitPassword") {
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

      if (this.currentAuthState !== "authorizationStateWaitPassword") {
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

      if (this.currentAuthState !== "authorizationStateWaitRegistration") {
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

  private async getCurrentAuthState(): Promise<{
    success: boolean;
    authState?: string;
    error?: string;
  }> {
    try {
      if (!this.client || !this.isInitialized) {
        return { success: false, error: "TDL not initialized" };
      }

      return { success: true, authState: this.currentAuthState };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : "Unknown error" };
    }
  }

  private async getStatus(): Promise<{
    success: boolean;
    status?: string;
    error?: string;
    user?: any;
  }> {
    try {
      if (!this.client || !this.isInitialized) {
        return { success: false, error: "TDL not initialized" };
      }

      if (this.currentAuthState === "authorizationStateReady") {
        try {
          const me = await this.client.invoke({ _: "getMe" });
          return { success: true, status: "logged_in", user: me };
        } catch (error) {
          return { success: false, status: "error_getting_user", error: "Failed to get user info" };
        }
      }

      return { success: true, status: this.currentAuthState };
    } catch (error) {
      return {
        success: false,
        status: "error",
        error: error instanceof Error ? error.message : "Unknown error",
      };
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
        this.currentAuthState = "authorizationStateWaitTdlibParameters";
      }
      return { success: true };
    } catch (error) {
      console.error("Failed to logout from TDL:", error);
      return { success: false, error: error instanceof Error ? error.message : "Unknown error" };
    }
  }

  private async getCurrentUser(): Promise<{
    success: boolean;
    user?: {
      id: number;
      firstName: string;
      lastName?: string;
      username?: string;
      phoneNumber?: string;
      isVerified: boolean;
      isPremium: boolean;
      status?: string;
      profilePhoto?: any;
    };
    error?: string;
  }> {
    try {
      if (!this.client || !this.isInitialized) {
        return { success: false, error: "TDL not initialized" };
      }

      if (this.currentAuthState !== "authorizationStateReady") {
        return { success: false, error: "User not authorized" };
      }

      const me = await this.client.invoke({ _: "getMe" });

      if (me) {
        return {
          success: true,
          user: {
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

  private async getAppInfo(): Promise<{
    success: boolean;
    apiId?: number;
    apiHash?: string;
    appTitle?: string;
    appShortName?: string;
    isInitialized?: boolean;
    error?: string;
  }> {
    try {
      if (!this.isInitialized) {
        return {
          success: true,
          apiId: this.defaultApiId,
          apiHash: this.defaultApiHash,
          appTitle: "telefly",
          appShortName: "telefly",
          isInitialized: false,
        };
      }

      return {
        success: true,
        apiId: this.client?.apiId || this.defaultApiId,
        apiHash: this.client?.apiHash || this.defaultApiHash,
        appTitle: "telefly",
        appShortName: "telefly",
        isInitialized: true,
      };
    } catch (error) {
      console.error("Failed to get app info:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }
}

export async function removeDirectory(target: string) {
  try {
    await fs.promises.rm(target, { recursive: true, force: true });
  } catch {}
}

export async function pathFromRoot(p: string) {
  try {
    return path.isAbsolute(p) ? p : path.join(process.cwd(), p);
  } catch {
    return p;
  }
}

export async function purgeTDLibData() {
  const dbDir = await pathFromRoot("_td_database");
  const filesDir = await pathFromRoot("_td_files");
  await removeDirectory(dbDir);
  await removeDirectory(filesDir);
}

export async function recreateDirs() {
  try {
    await fs.promises.mkdir("_td_database", { recursive: true });
    await fs.promises.mkdir("_td_files", { recursive: true });
  } catch {}
}

// SimpleResult declared above
