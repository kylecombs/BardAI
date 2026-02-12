import { createServer } from "node:http";
import { readFileSync } from "node:fs";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { z } from "zod";

// Read your built widget HTML
const widgetHtml = readFileSync("../web/dist/index.html", "utf8");

// ---- Define your app state ----
// (replace with your actual domain logic)
let items: { id: string; name: string }[] = [];

function createAppServer() {
  const server = new McpServer({ name: "my-app", version: "0.1.0" });

  // Register the widget as a resource
  server.registerResource(
    "my-widget",
    "ui://widget/main.html",
    {},
    async () => ({
      contents: [
        {
          uri: "ui://widget/main.html",
          mimeType: "text/html+skybridge",
          text: widgetHtml,
          _meta: { "openai/widgetPrefersBorder": true },
        },
      ],
    })
  );

  // Register a tool
  server.registerTool(
    "get_items",
    {
      title: "Get items",
      description: "Returns all items.",
      inputSchema: {},
      _meta: {
        "openai/outputTemplate": "ui://widget/main.html",
        "openai/toolInvocation/invoking": "Loading items…",
        "openai/toolInvocation/invoked": "Items loaded.",
      },
    },
    async () => ({
      content: [{ type: "text", text: `${items.length} items found.` }],
      structuredContent: { items },
    })
  );

  server.registerTool(
    "add_item",
    {
      title: "Add item",
      description: "Adds an item by name.",
      inputSchema: { name: z.string().min(1) },
      _meta: {
        "openai/outputTemplate": "ui://widget/main.html",
        "openai/toolInvocation/invoking": "Adding item…",
        "openai/toolInvocation/invoked": "Item added.",
      },
    },
    async (args: { name: string }) => {
      const item = { id: crypto.randomUUID(), name: args.name };
      items.push(item);
      return {
        content: [{ type: "text", text: `Added "${item.name}".` }],
        structuredContent: { items },
      };
    }
  );

  return server;
}

// ---- HTTP Server ----
const port = Number(process.env.PORT ?? 3000);
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
    return res.end();
  }

  // Health check
  if (req.method === "GET" && url.pathname === "/") {
    return res.writeHead(200, { "content-type": "text/plain" }).end("OK");
  }

  // MCP endpoint
  if (url.pathname === MCP_PATH || url.pathname.startsWith(`${MCP_PATH}/`)) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Expose-Headers", "Mcp-Session-Id");

    const transport = new StreamableHTTPServerTransport({ sessionIdGenerator: () => crypto.randomUUID() });
    const server = createAppServer();
    await server.connect(transport);
    await transport.handleRequest(req, res);
    return;
  }

  // 404 for everything else (prevents ChatGPT connector wizard 502s)
  res.writeHead(404).end("Not Found");
});

httpServer.listen(port, () => {
  console.log(`MCP server running → http://localhost:${port}${MCP_PATH}`);
});