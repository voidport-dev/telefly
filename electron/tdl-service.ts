import { ipcMain } from "electron";
import { getTdjson } from "prebuilt-tdlib";
import * as tdl from "tdl";
import type * as Td from "tdlib-types";

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
  }

  private async initialize(apiId?: number, apiHash?: string) {
    try {
      if (!apiId || !apiHash) return;

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
}
