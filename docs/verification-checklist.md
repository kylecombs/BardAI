# End-to-End Verification Checklist

This checklist walks you through verifying your complete local development setup, from starting the MCP server to testing it with ChatGPT. Follow these steps in order to confirm everything is working correctly.

## Overview

This verification process covers:
1. Starting and verifying the local MCP server
2. Exposing the server with ngrok
3. Testing with MCP Inspector
4. Configuring and testing with ChatGPT

**Estimated time**: 15-20 minutes

**Prerequisites**:
- Node.js installed
- ngrok installed (see [ngrok setup guide](./ngrok-setup.md))
- ChatGPT Plus/Pro account or OpenAI API access

---

## Step 1: Start Local MCP Server

### Actions

Open a terminal and start the MCP server:

```bash
cd server
npm run dev
```

### Expected Output

You should see output like:

```
MCP server running → http://localhost:3000/mcp
```

### Verification

1. **Check the health endpoint** (in a new terminal or browser):
   ```bash
   curl http://localhost:3000/
   ```

   **Expected response**: `OK`

2. **Check the port**:
   - Default port is `3000`
   - If you set a `PORT` environment variable, verify it's using that port
   - The server should log the actual URL it's running on

### Troubleshooting

| Issue | Solution |
|-------|----------|
| `npm: command not found` | Install Node.js from [nodejs.org](https://nodejs.org) |
| `Error: Cannot find module` | Run `npm install` in the server directory |
| `EADDRINUSE: address already in use` | Port 3000 is occupied. Either: <br>• Stop the other process using port 3000<br>• Set a different PORT: `PORT=3001 npm run dev` |
| Server starts but crashes immediately | Check the error logs for missing dependencies or syntax errors |

### ✅ Success Criteria

- [x] Server starts without errors
- [x] Health check returns `OK`
- [x] Terminal shows "MCP server running" message

---

## Step 2: Verify Health Check

### Actions

Test the server's root endpoint:

```bash
curl http://localhost:3000/
```

Or open in a browser:
```
http://localhost:3000/
```

### Expected Output

**Terminal response**:
```
OK
```

**Browser response**:
```
OK
```

**Status code**: `200 OK`

### Troubleshooting

| Issue | Solution |
|-------|----------|
| `Connection refused` | MCP server is not running. Go back to Step 1. |
| `Connection timeout` | Check if you're using the correct port (default 3000) |
| Different output or error | Check server logs for errors in the terminal running `npm run dev` |

### ✅ Success Criteria

- [x] Health endpoint returns `OK`
- [x] HTTP status code is `200`
- [x] No errors in server logs

---

## Step 3: Start ngrok Tunnel

### Actions

In a **new terminal window** (keep the MCP server running):

```bash
cd server
npm run ngrok
```

**Note**: Keep both terminal windows open (MCP server and ngrok).

### Expected Output

You should see ngrok's status interface:

```
ngrok

Session Status                online
Account                       Your Name (Plan: Free)
Version                       3.x.x
Region                        United States (us)
Latency                       -
Web Interface                 http://127.0.0.1:4040
Forwarding                    https://abc123xyz.ngrok.app -> http://localhost:3000

Connections                   ttl     opn     rt1     rt5     p50     p90
                              0       0       0.00    0.00    0.00    0.00
```

**Key information to note**:
- **Forwarding URL**: `https://abc123xyz.ngrok.app` (yours will be different)
- **Local endpoint**: `http://localhost:3000`
- **Web Interface**: `http://127.0.0.1:4040`

### Verification

1. **Copy the forwarding URL** from the output
   - It will look like: `https://[random-string].ngrok.app`
   - Example: `https://7a8f-123-456-789-012.ngrok.app`

2. **Test the tunnel** in your browser or terminal:
   ```bash
   curl https://[your-ngrok-url].ngrok.app/
   ```

   **Expected response**: `OK`

### Troubleshooting

| Issue | Solution |
|-------|----------|
| `ngrok: command not found` | Install ngrok. See [ngrok setup guide](./ngrok-setup.md) |
| `Connection refused` | Ensure MCP server is running (Step 1) |
| `Session expired` | Set up ngrok auth token: <br>`ngrok config add-authtoken YOUR_TOKEN` <br>Get token from [dashboard.ngrok.com](https://dashboard.ngrok.com/get-started/your-authtoken) |
| `Tunnel not found` | ngrok session may have ended. Restart ngrok. |
| `Invalid host header` | Use: `ngrok http 3000 --host-header="localhost:3000"` |

### ✅ Success Criteria

- [x] ngrok displays "Session Status: online"
- [x] Forwarding URL is displayed (https://xxx.ngrok.app)
- [x] Testing the ngrok URL returns `OK`
- [x] No connection errors in ngrok output

---

## Step 4: Test MCP Endpoint via ngrok

### Actions

Test the MCP endpoint through ngrok:

```bash
curl https://[your-ngrok-url].ngrok.app/mcp
```

Replace `[your-ngrok-url]` with your actual ngrok URL from Step 3.

**Example**:
```bash
curl https://abc123xyz.ngrok.app/mcp
```

### Expected Output

The MCP endpoint should return a response (the exact format depends on the MCP protocol, but you should not see an error).

**Typical responses**:
- JSON object with MCP protocol information
- Error about missing session ID (this is OK - it means the endpoint exists)
- HTTP 405 "Method Not Allowed" (this is OK - MCP endpoint expects POST, not GET)

**What matters**: The endpoint is reachable and responds (not 404 or connection error).

### Verification

1. **Check response is not 404**:
   ```bash
   curl -i https://[your-ngrok-url].ngrok.app/mcp
   ```

   Look for status code in the first line:
   - ✅ `HTTP/2 200` or `HTTP/2 405` or `HTTP/2 400` = Good (endpoint exists)
   - ❌ `HTTP/2 404` = Bad (endpoint not found)

2. **Check ngrok web interface**:
   - Open http://127.0.0.1:4040 in a browser
   - You should see your curl request logged
   - Status should not be 404

### Troubleshooting

| Issue | Solution |
|-------|----------|
| `404 Not Found` | Check the URL includes `/mcp` at the end |
| `Connection refused` | Verify both MCP server and ngrok are running |
| `502 Bad Gateway` | MCP server may have crashed. Check server terminal for errors. |
| `Tunnel not found` | ngrok session ended. Restart ngrok (Step 3). |

### ✅ Success Criteria

- [x] MCP endpoint returns a response (not 404)
- [x] Request appears in ngrok web interface (http://127.0.0.1:4040)
- [x] No connection errors

---

## Step 5: Connect MCP Inspector

### Actions

In a **new terminal window**:

```bash
cd server
npm run inspect
```

This will open MCP Inspector in your browser.

### Expected Output

**Terminal**:
```
Starting MCP Inspector...
Open http://localhost:6274 in your browser
```

**Browser**: MCP Inspector interface opens automatically

### Inspector Connection Steps

1. **In the MCP Inspector interface**, find the connection form
2. **Enter the MCP endpoint URL**:
   ```
   http://localhost:3000/mcp
   ```
   (Use localhost, not ngrok URL, for Inspector)
3. **Click "Connect"**
4. **Verify connection success**:
   - Should show server name: "my-app"
   - Should show version: "0.1.0"
   - Should list available tools and resources

### Expected Tools & Resources

After connecting, you should see:

**Tools**:
- `get_items` - Returns all items
- `add_item` - Adds an item by name

**Resources**:
- `my-widget` - Interactive widget at `ui://widget/main.html`

### Troubleshooting

| Issue | Solution |
|-------|----------|
| Inspector won't open | Check if port 6274 is available. Try closing and restarting. |
| "Connection failed" | Ensure MCP server is running (Step 1). Use `http://localhost:3000/mcp`, not ngrok URL. |
| "Connection timeout" | Check if you're using the correct port (default 3000) |
| No tools/resources shown | Server may have errors. Check server terminal logs. |
| Inspector shows empty response | Server may have crashed. Restart server (Step 1). |

### ✅ Success Criteria

- [x] MCP Inspector opens in browser
- [x] Connection to localhost:3000/mcp succeeds
- [x] Server name "my-app" is displayed
- [x] 2 tools listed (get_items, add_item)
- [x] 1 resource listed (my-widget)

---

## Step 6: Test Tools in MCP Inspector

Now test each tool to verify they work correctly.

### Test 6A: get_items Tool

**Actions**:
1. In MCP Inspector, navigate to **Tools** section
2. Click on **"get_items"**
3. Click **"Call Tool"** or **"Execute"** (no parameters required)

**Expected Response**:
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

**✅ Success**: Tool returns 0 items (initially empty)

### Test 6B: add_item Tool

**Actions**:
1. In MCP Inspector, navigate to **Tools** section
2. Click on **"add_item"**
3. Enter parameter in the form:
   ```json
   {
     "name": "Test Widget"
   }
   ```
4. Click **"Call Tool"** or **"Execute"**

**Expected Response**:
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

**Notes**:
- The `id` will be a different UUID each time
- The items array now contains one item

**✅ Success**: Tool adds item and returns it with a UUID

### Test 6C: get_items Again (Verify State)

**Actions**:
1. Call **get_items** again

**Expected Response**:
```json
{
  "content": [
    {
      "type": "text",
      "text": "1 items found."
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

**✅ Success**: State is persisted, item from 6B is still there

### Test 6D: my-widget Resource

**Actions**:
1. In MCP Inspector, navigate to **Resources** section
2. Find and click on **"my-widget"**
3. URI should show: `ui://widget/main.html`
4. Click **"Read Resource"** or **"View"**

**Expected Response**:
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

**Notes**:
- The `text` field contains the full HTML of your widget
- The HTML should start with `<!doctype html>`
- The mimeType is `text/html+skybridge`

**✅ Success**: Resource returns HTML content

### Troubleshooting

| Issue | Solution |
|-------|----------|
| "Invalid parameters" | Check JSON format. `add_item` requires `{"name": "string"}` |
| "Tool call failed" | Check server logs for errors. Restart server if needed. |
| "Resource not found" | Widget may not be built. Run: `cd web && npm run build` |
| State not persisted | State is in-memory only. Restarting server clears items. |
| Empty response | Server crashed. Check logs and restart. |

### ✅ Success Criteria

- [x] get_items returns 0 items initially
- [x] add_item successfully adds an item
- [x] add_item returns item with UUID
- [x] get_items returns the added item
- [x] my-widget resource returns HTML content

---

## Step 7: Configure ChatGPT with ngrok URL

Now connect ChatGPT to your MCP server using the ngrok URL from Step 3.

### Actions

1. **Get your MCP endpoint URL**:
   - Take your ngrok URL from Step 3: `https://[random].ngrok.app`
   - Append `/mcp`: `https://[random].ngrok.app/mcp`
   - Example: `https://abc123xyz.ngrok.app/mcp`

2. **Open ChatGPT configuration**:
   - **ChatGPT Plus/Pro**: Profile → My GPTs → Create → Configure → Actions
   - **API Platform**: platform.openai.com → Settings → MCP Servers
   - **Desktop App**: Preferences → Advanced → MCP Servers (if available)

   See [ChatGPT Dev Mode Guide](./chatgpt-dev-mode.md) for detailed instructions.

3. **Add your MCP server**:
   - **Server Name**: "My Dev MCP Server" (or any name)
   - **Server URL**: `https://[your-ngrok-url].ngrok.app/mcp`
   - **Authentication**: None (for development)
   - **Privacy**: Private/Only Me

4. **Save configuration**

### Expected Result

- Configuration saves successfully
- Connection status shows "Connected" or green indicator
- Available tools should be listed (get_items, add_item)
- Available resources should be listed (my-widget)

### Troubleshooting

| Issue | Solution |
|-------|----------|
| "Connection failed" | Verify ngrok is running (Step 3). Test URL in browser. |
| "Invalid URL" | Ensure URL uses `https://` and includes `/mcp` path |
| "Server unreachable" | Check both MCP server and ngrok are running |
| Tools not appearing | Disconnect and reconnect. Check server logs. |
| ngrok URL changed | You need to update ChatGPT config each time ngrok restarts |

### ✅ Success Criteria

- [x] ChatGPT configuration saved
- [x] Connection status is successful
- [x] Tools are visible in ChatGPT interface
- [x] No connection errors

---

## Step 8: Verify ChatGPT Integration

### Test 8A: Get Items via ChatGPT

**Actions**:

Start a new chat in ChatGPT and send:

```
Can you get all items from the MCP server?
```

**Expected Behavior**:
1. ChatGPT recognizes it should use the `get_items` tool
2. ChatGPT calls the tool
3. ChatGPT displays the results

**Expected Response** (from ChatGPT):
```
I found 1 item in the MCP server:
- Test Widget (ID: 550e8400-...)

[Widget may be displayed here]
```

**Server Logs** (check your MCP server terminal):
```
[timestamp] Tool call: get_items
```

**✅ Success**: ChatGPT successfully calls get_items and displays results

### Test 8B: Add Item via ChatGPT

**Actions**:

In the same chat, send:

```
Can you add an item called "Dashboard Component" to the MCP server?
```

**Expected Behavior**:
1. ChatGPT recognizes it should use the `add_item` tool
2. ChatGPT calls the tool with parameter: `{"name": "Dashboard Component"}`
3. ChatGPT confirms the item was added

**Expected Response** (from ChatGPT):
```
I've successfully added "Dashboard Component" to the MCP server.
Item ID: 7f3a2b1c-...

[Widget may be displayed here]
```

**Server Logs**:
```
[timestamp] Tool call: add_item with args: {"name":"Dashboard Component"}
```

**✅ Success**: ChatGPT successfully calls add_item with correct parameters

### Test 8C: Combined Workflow

**Actions**:

Send:

```
Add three items: "Header", "Footer", and "Sidebar", then show me all items.
```

**Expected Behavior**:
1. ChatGPT calls `add_item` three times with different names
2. ChatGPT calls `get_items` to show all items
3. ChatGPT displays the complete list

**Expected Response**:
```
I've added all three items. Here's the complete list:
1. Test Widget (ID: 550e8400-...)
2. Dashboard Component (ID: 7f3a2b1c-...)
3. Header (ID: a1b2c3d4-...)
4. Footer (ID: e5f6g7h8-...)
5. Sidebar (ID: i9j0k1l2-...)

[Widget displaying all items]
```

**Server Logs**:
```
[timestamp] Tool call: add_item {"name":"Header"}
[timestamp] Tool call: add_item {"name":"Footer"}
[timestamp] Tool call: add_item {"name":"Sidebar"}
[timestamp] Tool call: get_items
```

**✅ Success**: ChatGPT performs multiple operations in sequence

### Test 8D: View Widget

**Actions**:

Send:

```
Can you show me the widget?
```

**Expected Behavior**:
1. ChatGPT accesses the `my-widget` resource
2. ChatGPT renders the widget in the interface
3. Widget displays the current items

**Expected Response**:
- Interactive widget appears in ChatGPT
- Widget shows all current items
- Widget has border (from `widgetPrefersBorder: true` metadata)

**✅ Success**: Widget renders correctly in ChatGPT

### Troubleshooting

| Issue | Solution |
|-------|----------|
| ChatGPT doesn't call tools | Be more explicit: "Use the get_items tool from the MCP server" |
| "Server unreachable" | Check ngrok is still running. May need to update URL in ChatGPT. |
| Tools called but errors | Check MCP server logs for error details. Restart if needed. |
| Widget doesn't render | Verify widget resource returns HTML in Inspector (Step 6D) |
| Old data shown | State is in-memory. If you restarted server, items were cleared. |
| Connection lost | ngrok URL changed. Update ChatGPT configuration with new URL. |

### ✅ Success Criteria

- [x] ChatGPT successfully calls get_items
- [x] ChatGPT successfully calls add_item with parameters
- [x] ChatGPT can perform multiple operations in sequence
- [x] Widget renders correctly in ChatGPT interface
- [x] Server logs show all tool calls

---

## Final Verification Summary

### All Systems Check

Use this quick checklist to verify your complete setup:

```
□ MCP Server
  □ Server is running (npm run dev)
  □ Health check returns OK
  □ Server logs show no errors

□ ngrok Tunnel
  □ ngrok is running (npm run ngrok)
  □ Forwarding URL is active
  □ Tunnel test returns OK
  □ Web interface accessible (http://127.0.0.1:4040)

□ MCP Inspector
  □ Inspector connects to localhost:3000/mcp
  □ Shows server name "my-app"
  □ Lists 2 tools (get_items, add_item)
  □ Lists 1 resource (my-widget)
  □ get_items tool works
  □ add_item tool works
  □ my-widget resource returns HTML

□ ChatGPT Integration
  □ ChatGPT configured with ngrok MCP URL
  □ Connection status is successful
  □ Tools are visible in ChatGPT
  □ get_items works in ChatGPT
  □ add_item works in ChatGPT
  □ Widget renders in ChatGPT
  □ Multiple operations work in sequence
```

### Common Issues & Quick Fixes

| Symptom | Quick Fix |
|---------|-----------|
| Everything stopped working | Check if ngrok or server crashed. Restart both. |
| ChatGPT can't connect | ngrok URL changed. Update ChatGPT configuration. |
| Items disappeared | Server restarted (state is in-memory). This is normal. |
| 404 errors | Check URL includes `/mcp` path |
| Connection refused | Ensure server is running (Step 1) |
| Old/stale data | Restart server to clear in-memory state |

### Development Workflow Recap

**Typical workflow after verification**:

1. **Keep running**:
   - Terminal 1: `npm run dev` (MCP server)
   - Terminal 2: `npm run ngrok` (tunnel)

2. **Make code changes** in your editor

3. **Server auto-restarts** (if using watch mode)

4. **Test changes**:
   - Quick test: MCP Inspector (localhost)
   - Full test: ChatGPT (via ngrok)

5. **If ngrok restarts**:
   - Copy new ngrok URL
   - Update ChatGPT configuration
   - Continue testing

---

## Next Steps

### After Successful Verification

✅ **Your development environment is ready!**

You can now:

1. **Develop new MCP tools**
   - Add new tools in `server/src/index.ts`
   - Test with Inspector
   - Verify with ChatGPT

2. **Develop the widget**
   - Modify React code in `web/src/`
   - Run `npm run build` in web directory
   - Restart MCP server to load new widget
   - Test in ChatGPT

3. **Add new resources**
   - Register new resources in server code
   - Test access via Inspector
   - Verify rendering in ChatGPT

4. **Iterate rapidly**
   - Make changes
   - Server auto-restarts (or manually restart)
   - Test immediately in Inspector or ChatGPT
   - No need to restart ngrok

### Additional Resources

- [ngrok Setup Guide](./ngrok-setup.md) - Detailed ngrok configuration
- [MCP Inspector Guide](./mcp-inspector.md) - Advanced Inspector usage
- [ChatGPT Dev Mode Guide](./chatgpt-dev-mode.md) - ChatGPT integration details
- [MCP Documentation](https://modelcontextprotocol.io/) - Official MCP docs
- [MCP Specification](https://spec.modelcontextprotocol.io/) - Protocol details

---

## Troubleshooting Reference

### Server Won't Start

1. Check Node.js is installed: `node --version`
2. Install dependencies: `cd server && npm install`
3. Check port availability: `lsof -i :3000` (macOS/Linux) or `netstat -ano | findstr :3000` (Windows)
4. Try different port: `PORT=3001 npm run dev`
5. Check for syntax errors in server code

### ngrok Issues

1. Verify installation: `ngrok --version`
2. Set auth token: `ngrok config add-authtoken YOUR_TOKEN`
3. Check firewall settings
4. Try manual command: `ngrok http 3000`
5. Check ngrok status: [status.ngrok.com](https://status.ngrok.com)

### Inspector Connection Issues

1. Verify server is running: `curl http://localhost:3000/`
2. Use localhost URL, not ngrok URL
3. Check for CORS errors in browser console
4. Restart Inspector: kill process and run `npm run inspect` again
5. Try npx directly: `npx @modelcontextprotocol/inspector`

### ChatGPT Connection Issues

1. Verify ngrok is running and active
2. Test ngrok URL in browser: `https://[your-url].ngrok.app/`
3. Ensure URL uses HTTPS (not HTTP)
4. Ensure URL includes `/mcp` path
5. Remove and re-add server configuration in ChatGPT
6. Check server logs for errors when ChatGPT tries to connect
7. Verify ngrok URL hasn't changed (restart creates new URL)

### State Management Issues

**Remember**: Items are stored **in memory**
- Restarting the server clears all items
- Each server instance has independent state
- This is normal for development
- Add database/persistence for production use

### Widget Not Rendering

1. Build the widget: `cd web && npm run build`
2. Verify HTML exists: `cat web/dist/index.html`
3. Check server reads widget: Look for `readFileSync` in `server/src/index.ts`
4. Restart server after rebuilding widget
5. Test resource in Inspector first
6. Check for JavaScript errors in ChatGPT browser console

---

## Validation Complete ✅

If you've completed all steps successfully:

- ✅ Local MCP server is running and healthy
- ✅ ngrok tunnel is active and forwarding traffic
- ✅ MCP Inspector can connect and test tools
- ✅ ChatGPT is configured and can call tools
- ✅ Widget renders correctly in ChatGPT

**Your development environment is fully operational!**

You're ready to build and test MCP integrations with ChatGPT.

---

**Questions or issues?**

Review the detailed guides:
- [MCP Inspector Guide](./mcp-inspector.md)
- [ngrok Setup Guide](./ngrok-setup.md)
- [ChatGPT Dev Mode Guide](./chatgpt-dev-mode.md)
