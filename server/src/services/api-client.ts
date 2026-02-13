/**
 * External API client placeholder
 *
 * This module provides a pattern/template for future API integrations.
 * Replace placeholder values with actual API configuration when implementing.
 */

import type { ApiClientConfig, ApiResponse } from "../types.js";

/**
 * Default configuration for the API client
 */
const defaultConfig: ApiClientConfig = {
  baseUrl: "https://api.example.com",
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
};

/**
 * External API client for making HTTP requests to third-party services.
 *
 * Usage:
 * ```typescript
 * const client = new ApiClient({ baseUrl: 'https://api.example.com' });
 * const response = await client.healthCheck();
 * ```
 */
export class ApiClient {
  private readonly config: ApiClientConfig;

  constructor(config: Partial<ApiClientConfig> = {}) {
    this.config = { ...defaultConfig, ...config };
  }

  /**
   * Get the current configuration
   */
  getConfig(): Readonly<ApiClientConfig> {
    return this.config;
  }

  /**
   * Placeholder method for health check endpoint.
   * Replace with actual API endpoint when implementing.
   *
   * @returns Promise resolving to health check response
   */
  async healthCheck(): Promise<ApiResponse<{ status: string }>> {
    // Placeholder implementation - replace with actual fetch call
    // Example implementation:
    // const response = await fetch(`${this.config.baseUrl}/health`, {
    //   method: 'GET',
    //   headers: this.config.headers,
    // });
    // return response.json();

    return {
      success: true,
      data: { status: "ok" },
    };
  }
}

/**
 * Factory function to create an API client instance.
 *
 * @param config - Partial configuration to override defaults
 * @returns Configured ApiClient instance
 */
export function createApiClient(
  config: Partial<ApiClientConfig> = {}
): ApiClient {
  return new ApiClient(config);
}
