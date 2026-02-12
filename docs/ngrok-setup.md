# ngrok Setup Guide

This guide walks you through setting up ngrok to expose your local MCP server to the internet. This is essential for testing your server with external services like ChatGPT.

## What is ngrok?

ngrok is a tool that creates secure tunnels to your localhost, allowing external services to access your local development server. It provides a public URL that forwards traffic to your local machine.

## Installation

Choose the installation method that works best for your platform:

### macOS (via Homebrew)

```bash
brew install ngrok/ngrok/ngrok
```

### Linux/macOS/Windows (via npm)

```bash
npm install -g ngrok
```

### Manual Installation (Any Platform)

1. Visit [ngrok.com/download](https://ngrok.com/download)
2. Download the appropriate version for your operating system
3. Extract the archive
4. Move the ngrok binary to a directory in your PATH (e.g., `/usr/local/bin` on macOS/Linux)

### Verify Installation

```bash
ngrok --version
```

## Authentication Setup

While ngrok works without authentication for basic usage, setting up an auth token provides:
- Extended session duration (sessions don't expire after 2 hours)
- More concurrent tunnels
- Access to additional features

### Get Your Auth Token

1. Sign up for a free account at [ngrok.com](https://ngrok.com)
2. Navigate to [dashboard.ngrok.com/get-started/your-authtoken](https://dashboard.ngrok.com/get-started/your-authtoken)
3. Copy your auth token

### Configure Auth Token

```bash
ngrok config add-authtoken YOUR_AUTH_TOKEN_HERE
```

This command saves your auth token to the ngrok configuration file (`~/.ngrok2/ngrok.yml` on macOS/Linux or `%USERPROFILE%\.ngrok2\ngrok.yml` on Windows).

## Using ngrok with the MCP Server

### Starting the MCP Server

First, ensure your MCP server is running:

```bash
cd server
npm run dev
```

The server will start on port 3000 by default (or the port specified in your `PORT` environment variable).

### Starting ngrok (Easy Method)

We've provided a convenient npm script for running ngrok:

```bash
cd server
npm run ngrok
```

This script will:
- Start ngrok tunneling to the MCP server
- Use port 3000 by default
- Respect the `PORT` environment variable if set

### Starting ngrok (Manual Method)

If you prefer to run ngrok directly:

```bash
# Default port (3000)
ngrok http 3000

# Custom port
ngrok http 8080

# With environment variable
PORT=8080 ngrok http ${PORT}
```

### Understanding the ngrok Output

When ngrok starts, you'll see output like this:

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

**Key information:**
- **Forwarding URL**: `https://abc123xyz.ngrok.app` - This is your public URL
- **Local endpoint**: `http://localhost:3000` - Your local server
- **Web Interface**: `http://127.0.0.1:4040` - ngrok's inspection interface

## ngrok URL Format

Your ngrok URL will look like this:

```
https://[random-string].ngrok.app
```

For example:
- `https://abc123xyz.ngrok.app`
- `https://7a8f-123-456-789-012.ngrok.app`

### Accessing Your MCP Endpoint

If your MCP server's endpoint is at `/mcp`, your full MCP endpoint URL will be:

```
https://[random-string].ngrok.app/mcp
```

For example:
- `https://abc123xyz.ngrok.app/mcp`

## Using with ChatGPT

Once ngrok is running, you can use your ngrok URL with ChatGPT:

1. Copy the `https://` forwarding URL from the ngrok output
2. Append `/mcp` to get your full MCP endpoint URL
3. Use this URL in ChatGPT's custom GPT configuration or MCP server settings

Example:
```
MCP Endpoint: https://abc123xyz.ngrok.app/mcp
```

See the [ChatGPT Dev Mode Guide](./chatgpt-dev-mode.md) for detailed instructions on connecting ChatGPT to your MCP server.

## Testing Your Setup

### 1. Check Server Health

Visit your ngrok URL in a browser:
```
https://[your-ngrok-url].ngrok.app
```

You should see a response from your MCP server's health check endpoint.

### 2. Test MCP Endpoint

You can test the MCP endpoint:
```
https://[your-ngrok-url].ngrok.app/mcp
```

### 3. Use the ngrok Web Interface

Visit `http://127.0.0.1:4040` to see:
- All HTTP requests to your tunnel
- Request/response details
- Replay requests for debugging

## Troubleshooting

### ngrok command not found

**Problem**: Terminal says `ngrok: command not found`

**Solution**:
- Verify ngrok is installed: check installation steps above
- Make sure ngrok is in your PATH
- Try using the full path to ngrok: `/usr/local/bin/ngrok http 3000`

### Connection Refused

**Problem**: ngrok shows errors like "connection refused" or "failed to connect to localhost:3000"

**Solution**:
- Ensure your MCP server is running: `npm run dev` in the `server/` directory
- Verify the server is on the correct port: check the console output or your `.env` file
- Make sure the port number in ngrok matches your server port

### Session Expired

**Problem**: ngrok tunnel stops working after 2 hours

**Solution**:
- Add your auth token: see "Authentication Setup" section above
- Free accounts with auth tokens have much longer session durations

### Tunnel Not Found (502)

**Problem**: Visiting the ngrok URL shows "Tunnel [id] not found"

**Solution**:
- ngrok session may have ended - restart ngrok
- Check that ngrok is still running in your terminal
- Start a new ngrok tunnel

### Invalid Host Header

**Problem**: Seeing "Invalid Host header" errors

**Solution**: Add the `--host-header` flag:
```bash
ngrok http 3000 --host-header="localhost:3000"
```

## Tips & Best Practices

1. **Keep ngrok running**: Don't close the terminal window where ngrok is running
2. **Use auth tokens**: Set up authentication for longer sessions and better reliability
3. **Monitor traffic**: Use the web interface (`http://127.0.0.1:4040`) to debug issues
4. **Restart when needed**: If you restart your MCP server, you don't need to restart ngrok
5. **New URL each time**: Each time you start ngrok, you'll get a new random URL (unless you have a paid plan with reserved domains)

## Next Steps

- [Set up ChatGPT Dev Mode](./chatgpt-dev-mode.md) to connect ChatGPT to your MCP server
- [Use the MCP Inspector](./mcp-inspector.md) to test your MCP tools
- [Review the verification checklist](./verification-checklist.md) before deploying

## Additional Resources

- [ngrok Documentation](https://ngrok.com/docs)
- [ngrok Dashboard](https://dashboard.ngrok.com)
- [MCP Protocol Specification](https://spec.modelcontextprotocol.io/)
