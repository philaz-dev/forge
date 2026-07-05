/**
 * Shared application configuration for Forge.
 *
 * Environment validation and feature flags are added in a later sprint.
 * For now this exposes a small, static app-config placeholder.
 */

export interface AppConfig {
  /** Human-readable application name. */
  appName: string;
  /** Current runtime environment. */
  environment: "development" | "test" | "production";
}

/** Default application configuration placeholder. */
export const appConfig: AppConfig = {
  appName: "Forge",
  environment: "development",
};
