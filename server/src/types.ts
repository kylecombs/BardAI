// Shared type definitions for the MCP server

/**
 * Placeholder type for server configuration
 */
export interface ServerConfig {
  port: number;
  name: string;
  version: string;
}

/**
 * Configuration for the external API client
 */
export interface ApiClientConfig {
  /** Base URL for the API */
  baseUrl: string;
  /** Request timeout in milliseconds */
  timeout: number;
  /** Default headers to include with requests */
  headers: Record<string, string>;
}

/**
 * Generic API response wrapper
 */
export interface ApiResponse<T> {
  /** Whether the request was successful */
  success: boolean;
  /** Response data (when successful) */
  data?: T;
  /** Error message (when unsuccessful) */
  error?: string;
}
