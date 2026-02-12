# MCP Inspector Guide

## What is MCP Inspector?

The [MCP Inspector](https://github.com/modelcontextprotocol/inspector) is an official debugging tool from the Model Context Protocol team. It provides a web-based interface to:

- Connect to MCP servers and inspect their capabilities
- Test tools (callable functions) with custom parameters
- View resources (data/content exposed by the server)
- Debug request/response cycles in real-time
- Verify server behavior before integrating with clients

This guide shows you how to use MCP Inspector to test your local MCP server.

## Prerequisites

- MCP server running locally (see server README)
- Node.js installed (comes with npx)

## Launching MCP Inspector

### Method 1: Using npm Script (Recommended)

From the `server/` directory:

```bash
npm run inspect
```

This runs the MCP Inspector and opens it in your default browser.

### Method 2: Using npx Directly

From anywhere in your project:

```bash
npx @modelcontextprotocol/inspector
```

This downloads and runs the latest version of MCP Inspector.

## Connecting to Your Local MCP Server

Once MCP Inspector launches in your browser:

1. **Start your MCP server first** (in a separate terminal):
   ```bash
   cd server
   npm run dev
   ```

   You should see: `MCP server running → http://localhost:3000/mcp`

2. **In the Inspector interface**, locate the connection form

3. **Enter the MCP endpoint URL**:
   ```
   http://localhost:3000/mcp
   ```

4. **Click "Connect"**

5. **Verify connection**: You should see the server name ("my-app") and version ("0.1.0") displayed

## Test Scenarios

### Scenario 1: Get Items Tool

The `get_items` tool returns all items from the server's in-memory store.

**How to test:**

1. In MCP Inspector, navigate to the **Tools** section
2. Find and click on **"get_items"**
3. This tool requires **no parameters** (empty input schema)
4. Click **"Call Tool"** or **"Execute"**

**Expected response:**

```json
{
  "content": [
    {
      "type": "text",
      "text": "0 items found."
    }
  ],
  "structuredContent": {
    "items": []
  }
}
```

**Notes:**
- Initially, the items array will be empty
- The count will update after adding items with `add_item`
- The text content shows a human-readable count
- The structuredContent contains the actual items array

### Scenario 2: Add Item Tool

The `add_item` tool adds a new item to the server's in-memory store.

**How to test:**

1. In MCP Inspector, navigate to the **Tools** section
2. Find and click on **"add_item"**
3. This tool requires a **name** parameter (string, minimum 1 character)
4. Enter test data in the parameter form:
   ```json
   {
     "name": "Test Widget"
   }
   ```
5. Click **"Call Tool"** or **"Execute"**

**Expected response:**

```json
{
  "content": [
    {
      "type": "text",
      "text": "Added \"Test Widget\"."
    }
  ],
  "structuredContent": {
    "items": [
      {
        "id": "550e8400-e29b-41d4-a716-446655440000",
        "name": "Test Widget"
      }
    ]
  }
}
```

**Notes:**
- The `id` will be a randomly generated UUID
- The text content confirms the item was added
- The structuredContent contains the updated items array with all items
- You can call this multiple times to add more items

**Test variations:**

Try adding multiple items:
```json
{ "name": "Dashboard Widget" }
{ "name": "Settings Panel" }
{ "name": "Analytics Chart" }
```

Then call `get_items` again to see all items:
```json
{
  "content": [
    {
      "type": "text",
      "text": "3 items found."
    }
  ],
  "structuredContent": {
    "items": [
      { "id": "...", "name": "Test Widget" },
      { "id": "...", "name": "Dashboard Widget" },
      { "id": "...", "name": "Settings Panel" },
      { "id": "...", "name": "Analytics Chart" }
    ]
  }
}
```

### Scenario 3: Widget Resource

The `my-widget` resource exposes the built React widget as an HTML resource.

**How to test:**

1. In MCP Inspector, navigate to the **Resources** section
2. Find and click on **"my-widget"**
3. The URI should be: `ui://widget/main.html`
4. Click **"Read Resource"** or **"View"**

**Expected response:**

```json
{
  "contents": [
    {
      "uri": "ui://widget/main.html",
      "mimeType": "text/html+skybridge",
      "text": "<!doctype html><html>...</html>",
      "_meta": {
        "openai/widgetPrefersBorder": true
      }
    }
  ]
}
```

**Notes:**
- The `text` field contains the full HTML content of your built widget
- The `mimeType` is `text/html+skybridge` (special format for OpenAI widgets)
- The `_meta` field contains widget preferences for ChatGPT
- This is the same HTML that will be displayed when the widget is invoked in ChatGPT

**Viewing the HTML:**
- Some inspectors allow you to preview the HTML in an iframe
- You can copy the HTML and open it in a browser to see the rendered widget
- The widget should display the current items state

## Understanding Server Metadata

The MCP server exposes metadata in tool and resource definitions:

### Tool Metadata (`_meta` fields)

Both `get_items` and `add_item` include OpenAI-specific metadata:

```json
{
  "openai/outputTemplate": "ui://widget/main.html",
  "openai/toolInvocation/invoking": "Loading items…",
  "openai/toolInvocation/invoked": "Items loaded."
}
```

**What these mean:**
- `outputTemplate`: Tells ChatGPT to render the widget after calling this tool
- `invoking`: Message shown in ChatGPT while the tool is executing
- `invoked`: Message shown in ChatGPT after the tool completes

### Resource Metadata

The widget resource includes:

```json
{
  "openai/widgetPrefersBorder": true
}
```

**What this means:**
- Tells ChatGPT to render the widget with a border for better visual separation

## Troubleshooting

### Inspector Can't Connect

**Error**: "Failed to connect" or "Connection refused"

**Solutions**:
1. **Verify MCP server is running**:
   ```bash
   curl http://localhost:3000/
   ```
   Should return: `OK`

2. **Check the correct endpoint**:
   - Use `http://localhost:3000/mcp` (with `/mcp` path)
   - NOT `http://localhost:3000/` (root path is health check only)

3. **Check the port**:
   - Default is 3000
   - If you changed PORT in server/.env, use that port instead
   - Example: `http://localhost:8080/mcp`

4. **Check for CORS issues**:
   - The server has CORS enabled (`Access-Control-Allow-Origin: *`)
   - Should work from any origin

### Tool Call Fails

**Error**: "Invalid parameters" or "Validation error"

**Solutions**:
1. **Check parameter format**:
   - `add_item` requires `{ "name": "string" }`
   - `name` must be at least 1 character long
   - Use valid JSON format

2. **Check parameter types**:
   - `name` must be a string, not a number or boolean
   - Example: `{ "name": "Widget" }` ✅
   - Example: `{ "name": 123 }` ❌

### Resource Not Found

**Error**: "Resource not found" or "404"

**Solutions**:
1. **Check the resource URI**:
   - Should be: `ui://widget/main.html`
   - This is a logical URI, not an HTTP URL

2. **Verify widget is built**:
   ```bash
   cd web
   npm run build
   ```

3. **Check server/src/index.ts**:
   - Verify the widget HTML is being read from `../web/dist/index.html`
   - Path is relative to the server directory

### Inspector Shows Empty Response

**Possible causes**:
1. **Server crashed**: Check the terminal running `npm run dev`
2. **Invalid session**: Disconnect and reconnect in Inspector
3. **Network timeout**: Check if server is still responding to `/` health check

## Tips & Best Practices

### Development Workflow

1. **Keep server running** in one terminal tab
2. **Keep Inspector open** in your browser
3. **Make code changes** in your editor
4. **Server auto-restarts** (if using nodemon/tsx watch mode)
5. **Refresh Inspector connection** after server restart
6. **Re-test your changes** in Inspector

### Testing Strategies

**Test in this order:**
1. ✅ Health check (`curl http://localhost:3000/`)
2. ✅ Connect Inspector to `/mcp` endpoint
3. ✅ View available tools and resources
4. ✅ Test simple tools first (`get_items`)
5. ✅ Test tools with parameters (`add_item`)
6. ✅ View resources (`my-widget`)
7. ✅ Test edge cases (empty strings, special characters)

### State Management

**Remember**: The MCP server stores items **in memory**
- Items are lost when server restarts
- Each server instance has independent state
- Great for testing, not for production data persistence

**To reset state**: Restart the MCP server
```bash
# In the terminal running npm run dev
# Press Ctrl+C to stop
# Then restart:
npm run dev
```

### Debugging Tool Responses

**Use structuredContent for complex data:**
- The `content` field is for human-readable text
- The `structuredContent` field is for structured data (objects, arrays)
- ChatGPT and other clients can consume `structuredContent` programmatically

**Example**:
```json
{
  "content": [{ "type": "text", "text": "3 items found." }],
  "structuredContent": { "items": [...] }
}
```

## Next Steps

Once you've verified your MCP server with Inspector:

1. **Test with ChatGPT**: See [ChatGPT Dev Mode Guide](./chatgpt-dev-mode.md)
2. **Expose with ngrok**: See [ngrok Setup Guide](./ngrok-setup.md)
3. **Run verification tests**: See [Verification Checklist](./verification-checklist.md)

## Additional Resources

- [MCP Inspector GitHub](https://github.com/modelcontextprotocol/inspector)
- [MCP Documentation](https://modelcontextprotocol.io/)
- [MCP Specification](https://spec.modelcontextprotocol.io/)
- [MCP SDK Documentation](https://github.com/modelcontextprotocol/sdk)

## Summary

MCP Inspector is essential for:
- ✅ Verifying tools work correctly before ChatGPT integration
- ✅ Testing parameter validation and error handling
- ✅ Debugging request/response formats
- ✅ Viewing resource content and metadata
- ✅ Understanding server capabilities without a full client

Use it frequently during development to catch issues early and ensure your MCP server behaves as expected.
