import { createServer, type Server as HttpServer } from "node:http";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import type { ServerConfig } from "./types.js";

// Default server configuration
const DEFAULT_CONFIG: ServerConfig = {
  port: Number(process.env.PORT ?? 3001),
  name: "mcp-server",
  version: "1.0.0",
};

/**
 * Creates and configures an MCP server instance
 */
export function createMcpServer(config: Partial<ServerConfig> = {}): McpServer {
  const { name, version } = { ...DEFAULT_CONFIG, ...config };
  return new McpServer({ name, version });
}

/**
 * Sets up the HTTP server with MCP transport
 */
export function setupServer(
  config: Partial<ServerConfig> = {}
): { httpServer: HttpServer; mcpServer: McpServer } {
  const mergedConfig = { ...DEFAULT_CONFIG, ...config };
  const mcpServer = createMcpServer(mergedConfig);
  const MCP_PATH = "/mcp";

  const httpServer = createServer(async (req, res) => {
    const url = new URL(req.url!, `http://${req.headers.host ?? "localhost"}`);

    // CORS preflight
    if (req.method === "OPTIONS") {
      res.writeHead(204, {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, GET, DELETE, OPTIONS",
        "Access-Control-Allow-Headers": "content-type, mcp-session-id",
        "Access-Control-Expose-Headers": "Mcp-Session-Id",
      });
      res.end();
      return;
    }

    // Health check
    if (req.method === "GET" && url.pathname === "/") {
      res.writeHead(200, { "content-type": "text/plain" }).end("OK");
      return;
    }

    // MCP endpoint
    if (url.pathname === MCP_PATH || url.pathname.startsWith(`${MCP_PATH}/`)) {
      res.setHeader("Access-Control-Allow-Origin", "*");
      res.setHeader("Access-Control-Expose-Headers", "Mcp-Session-Id");

      const transport = new StreamableHTTPServerTransport({
        sessionIdGenerator: () => crypto.randomUUID(),
      });
      await mcpServer.connect(transport);
      await transport.handleRequest(req, res);
      return;
    }

    // 404 for everything else
    res.writeHead(404).end("Not Found");
  });

  return { httpServer, mcpServer };
}

/**
 * Starts the MCP server on the configured port
 */
export function startServer(config: Partial<ServerConfig> = {}): void {
  const mergedConfig = { ...DEFAULT_CONFIG, ...config };
  const { httpServer } = setupServer(mergedConfig);

  httpServer.listen(mergedConfig.port, () => {
    console.log(
      `MCP server running → http://localhost:${mergedConfig.port}/mcp`
    );
  });
}

// Re-export types
export type { ServerConfig } from "./types.js";

// Start the server when run directly
startServer();
