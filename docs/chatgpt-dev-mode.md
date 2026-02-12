# ChatGPT Developer Mode Guide

This guide shows you how to configure ChatGPT to connect to your local MCP server using ngrok. This enables you to test your MCP tools, resources, and widgets directly in ChatGPT during development.

## What is ChatGPT Developer Mode?

ChatGPT Developer Mode (also called Custom GPTs with Actions or Plugin Development) allows you to:

- Connect ChatGPT to custom MCP servers
- Test MCP tools in a real ChatGPT conversation
- View and interact with MCP resources and widgets
- Debug the integration between ChatGPT and your MCP server
- Develop and iterate on MCP features quickly

## Prerequisites

Before configuring ChatGPT, ensure you have:

1. **MCP server running locally**
   ```bash
   cd server
   npm run dev
   ```

2. **ngrok tunnel active** (exposing your local server to the internet)
   ```bash
   cd server
   npm run ngrok
   ```

   See the [ngrok setup guide](./ngrok-setup.md) for detailed instructions.

3. **Your ngrok URL** from the ngrok terminal output:
   ```
   Forwarding: https://abc123xyz.ngrok.app -> http://localhost:3000
   ```

## Accessing ChatGPT Developer Settings

### Option 1: ChatGPT Plus/Pro with Custom GPTs

If you have ChatGPT Plus or Pro, you can create a Custom GPT with MCP integration:

1. **Navigate to ChatGPT**
   - Go to [chat.openai.com](https://chat.openai.com)
   - Log in with your ChatGPT Plus/Pro account

2. **Access GPT Builder**
   - Click your profile icon (bottom left)
   - Select **"My GPTs"**
   - Click **"Create a GPT"**

3. **Configure Custom GPT**
   - Switch to **"Configure"** tab
   - Scroll down to **"Actions"** section
   - Click **"Create new action"**

### Option 2: ChatGPT Developer Platform (API Users)

If you're using the OpenAI API with GPT-4 or newer models:

1. **Navigate to Platform Settings**
   - Go to [platform.openai.com](https://platform.openai.com)
   - Log in to your OpenAI account
   - Navigate to **"API Keys"** or **"Settings"**

2. **Access Plugin/MCP Settings**
   - Look for **"Plugins"**, **"Actions"**, or **"MCP Servers"**
   - Select **"Add Custom Server"** or **"New MCP Configuration"**

### Option 3: ChatGPT Desktop App (if available)

Some versions of the ChatGPT desktop app support MCP server configuration:

1. **Open Settings/Preferences**
   - Launch ChatGPT desktop app
   - Open **Settings** or **Preferences** (Cmd+, on Mac, Ctrl+, on Windows)

2. **Find Developer or Advanced Settings**
   - Look for **"Developer"**, **"Advanced"**, or **"Integrations"** section
   - Select **"MCP Servers"** or **"Custom Servers"**

## Adding Your Custom MCP Server URL

Once you're in the appropriate configuration screen:

### Step 1: Enter Server Details

You'll typically see fields for:

- **Server Name**: Give your server a descriptive name (e.g., "My MCP Dev Server")
- **Server URL**: This is your ngrok URL + `/mcp` path
- **Description** (optional): Describe what your MCP server does

### Step 2: Construct Your MCP Endpoint URL

Your MCP endpoint URL follows this format:

```
https://[your-ngrok-url].ngrok.app/mcp
```

**Example URLs:**
```
https://abc123xyz.ngrok.app/mcp
https://7a8f-123-456-789-012.ngrok.app/mcp
https://cool-elephant-12345.ngrok.app/mcp
```

**Important Notes:**
- ✅ Always use `https://` (ngrok provides HTTPS by default)
- ✅ Always include the `/mcp` path at the end
- ✅ Use the exact ngrok URL from your terminal output
- ❌ Don't use `http://` (ChatGPT requires HTTPS)
- ❌ Don't forget the `/mcp` path
- ❌ Don't use `localhost` URLs (ChatGPT can't access them)

### Step 3: Configure Server Settings (if available)

Depending on the interface, you may see additional options:

- **Authentication**: Leave as "None" or "No Auth" (for local development)
- **Timeout**: Use default or set to 30 seconds
- **Privacy**: Set to "Private" or "Only Me" during development
- **API Version**: Use latest or default MCP version

### Step 4: Save Configuration

- Click **"Save"**, **"Add Server"**, or **"Create"**
- ChatGPT will attempt to connect to your MCP server
- You should see a success message if the connection works

## Verifying the Connection

### Test the Connection

After adding your MCP server URL:

1. **Check Connection Status**
   - Look for a green indicator or "Connected" status
   - If you see an error, verify your ngrok tunnel is active

2. **View Available Tools**
   - Navigate to the tools or capabilities section
   - You should see:
     - `get_items` - Gets all items from the store
     - `add_item` - Adds a new item to the store

3. **View Available Resources**
   - Look for resources section
   - You should see:
     - `my-widget` - Interactive widget UI

### Test in a Conversation

Start a new chat and try these prompts:

**Test 1: Get Items**
```
Can you get all items from the MCP server?
```

Expected: ChatGPT calls the `get_items` tool and shows the results (initially 0 items).

**Test 2: Add Item**
```
Can you add an item called "Test Item" to the MCP server?
```

Expected: ChatGPT calls the `add_item` tool with the name parameter and confirms success.

**Test 3: View Widget**
```
Can you show me the widget?
```

Expected: ChatGPT accesses the `my-widget` resource and displays the interactive widget UI.

**Test 4: Combined Workflow**
```
Add three items: "Apple", "Banana", and "Cherry", then show me all items.
```

Expected: ChatGPT calls `add_item` three times, then calls `get_items` to verify.

## Troubleshooting

### Connection Failed / Server Unreachable

**Problem**: ChatGPT can't connect to your MCP server URL

**Solutions**:
1. **Verify ngrok is running**
   - Check that ngrok terminal is still active
   - Ensure you see "Session Status: online"

2. **Test the URL manually**
   - Open your ngrok URL in a browser: `https://[your-url].ngrok.app`
   - You should see a response from your MCP server
   - Try the MCP endpoint: `https://[your-url].ngrok.app/mcp`

3. **Check for HTTPS**
   - Ensure you're using `https://` not `http://`
   - ngrok provides HTTPS by default

4. **Verify the /mcp path**
   - Make sure you included `/mcp` at the end of the URL
   - The server endpoint is specifically at `/mcp`, not the root

### Tools Not Appearing

**Problem**: ChatGPT connected but doesn't show your tools

**Solutions**:
1. **Refresh or reconnect**
   - Remove the MCP server configuration
   - Re-add it with the same URL

2. **Check server logs**
   - Look at your MCP server terminal for errors
   - Ensure the server started successfully

3. **Test with MCP Inspector**
   - Use the [MCP Inspector](./mcp-inspector.md) to verify tools are available
   - If Inspector can't see tools, the server may have an issue

### "Invalid Response" or JSON Errors

**Problem**: ChatGPT shows errors about invalid responses

**Solutions**:
1. **Check server logs**
   - Look for errors in your MCP server terminal
   - The server may be returning malformed responses

2. **Restart the server**
   ```bash
   # In the server directory
   # Stop server (Ctrl+C)
   npm run dev
   ```

3. **Verify with MCP Inspector**
   - Test the same tool call in [MCP Inspector](./mcp-inspector.md)
   - If it works there but not in ChatGPT, check response format

### ngrok URL Changed

**Problem**: ChatGPT stopped working after restarting ngrok

**Solution**: Update the MCP server URL in ChatGPT settings
- Each time you restart ngrok, you get a new random URL
- Go back to ChatGPT settings and update the server URL
- Or keep ngrok running during your development session
- Consider using ngrok auth token for longer sessions (see [ngrok setup](./ngrok-setup.md))

### Tools Not Being Called

**Problem**: ChatGPT responds but doesn't call your MCP tools

**Solutions**:
1. **Be explicit in your prompts**
   - Instead of: "Get the items"
   - Try: "Use the get_items tool to retrieve all items from the MCP server"

2. **Check tool descriptions**
   - Ensure your tools have clear descriptions
   - ChatGPT uses descriptions to decide when to call tools

3. **Verify tool is enabled**
   - Some ChatGPT interfaces let you enable/disable specific tools
   - Check that your MCP tools are enabled

## Tips & Best Practices

### Development Workflow

1. **Keep terminals open**
   - Terminal 1: MCP server (`npm run dev`)
   - Terminal 2: ngrok tunnel (`npm run ngrok`)
   - Terminal 3: Free for git, testing, etc.

2. **Monitor server logs**
   - Watch the MCP server terminal for incoming requests
   - You'll see each tool call from ChatGPT in real-time

3. **Use MCP Inspector first**
   - Test new tools in [MCP Inspector](./mcp-inspector.md) before trying in ChatGPT
   - Easier to debug issues in Inspector's interface

4. **Stable ngrok sessions**
   - Set up ngrok auth token for longer sessions
   - Avoid restarting ngrok unless necessary
   - See [ngrok setup guide](./ngrok-setup.md)

### Understanding MCP Metadata

Your MCP server includes special metadata fields that control ChatGPT's behavior:

**openai/outputTemplate**: Tells ChatGPT to render the widget
```javascript
"openai/outputTemplate": {
  "html": true,
  "renderWidget": true
}
```

**openai/toolInvocation**: Messages shown to users during tool calls
```javascript
"openai/toolInvocation": {
  "startMessage": "Adding item...",
  "completeMessage": "Item added successfully!"
}
```

**openai/widgetPrefersBorder**: UI preference for widget rendering
```javascript
"openai/widgetPrefersBorder": true
```

These metadata fields help create a better user experience in ChatGPT.

### Security Notes for Development

⚠️ **Important Security Considerations:**

1. **ngrok URLs are public**
   - Anyone with your ngrok URL can access your MCP server
   - Don't share ngrok URLs publicly
   - Don't commit ngrok URLs to git
   - ngrok URLs are temporary and change each session (good for security)

2. **No authentication in dev mode**
   - This setup has no authentication for simplicity
   - Fine for local development
   - Add authentication before production deployment

3. **Don't expose sensitive data**
   - Be careful what data your MCP server returns
   - Remember responses may be visible in ChatGPT's interface
   - Don't include API keys, secrets, or sensitive info in responses

## Next Steps

Now that ChatGPT is connected to your MCP server:

1. **Test all tools**
   - Try each tool in a conversation
   - Verify responses are formatted correctly
   - Test error cases

2. **Test the widget**
   - Request the widget resource
   - Verify it renders correctly in ChatGPT
   - Test any interactive features

3. **Iterate on your implementation**
   - Modify tools in your MCP server code
   - Restart the server (ngrok keeps running)
   - Test changes in ChatGPT immediately

4. **Run the verification checklist**
   - See [verification-checklist.md](./verification-checklist.md) for comprehensive testing

## Additional Resources

- [ngrok Setup Guide](./ngrok-setup.md) - Set up ngrok for tunneling
- [MCP Inspector Guide](./mcp-inspector.md) - Debug with MCP Inspector
- [Verification Checklist](./verification-checklist.md) - Complete testing guide
- [OpenAI Platform Docs](https://platform.openai.com/docs) - Official API documentation
- [MCP Specification](https://spec.modelcontextprotocol.io/) - Model Context Protocol spec

## Common ChatGPT Configuration Paths

Since ChatGPT's interface changes frequently, here are common places to find MCP/Action settings:

- **Custom GPTs**: Profile → My GPTs → Create → Configure → Actions
- **ChatGPT Settings**: Profile → Settings → Beta Features → Plugins/MCP
- **API Platform**: platform.openai.com → Settings → Integrations → MCP Servers
- **Desktop App**: Preferences → Advanced → MCP Servers (if available)

If you can't find the exact option, search ChatGPT's settings for terms like:
- "MCP"
- "Actions"
- "Plugins"
- "Custom Servers"
- "Integrations"
- "Developer Mode"
