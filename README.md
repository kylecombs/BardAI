# BardAI

A Model Context Protocol (MCP) server implementation with web interface for managing items and widgets.

## Development Setup

This project uses a monorepo structure with the following main components:
- **server/** - MCP server implementation using Express and the MCP SDK
- **web/** - Vite + React web application
- **docs/** - Development guides and documentation

### Prerequisites

- Node.js (v18 or later)
- npm
- ngrok (for external access during development)

### Quick Start

1. **Install dependencies**
   ```bash
   npm install
   cd server && npm install
   cd ../web && npm install
   ```

2. **Start the MCP server**
   ```bash
   cd server
   npm run dev
   ```
   Server will be available at `http://localhost:3000`

3. **Start ngrok tunnel (in a separate terminal)**
   ```bash
   cd server
   npm run ngrok
   ```
   This exposes your local server via a public ngrok URL for ChatGPT integration.

4. **Test with MCP Inspector (optional)**
   ```bash
   cd server
   npm run inspect
   ```
   This launches the MCP Inspector tool for testing and debugging MCP tools.

5. **Start the web app (optional)**
   ```bash
   cd web
   npm run dev
   ```

### Common Commands

| Command | Description |
|---------|-------------|
| `cd server && npm run dev` | Start MCP server in watch mode |
| `cd server && npm run ngrok` | Start ngrok tunnel to expose local server |
| `cd server && npm run inspect` | Launch MCP Inspector for testing tools |
| `cd web && npm run dev` | Start web development server |

### Documentation

For detailed setup and integration guides, see the [docs/](./docs) directory:

- **[Development Documentation Index](./docs/README.md)** - Overview of all available guides
- **[ngrok Setup Guide](./docs/ngrok-setup.md)** - Configure ngrok for external access
- **[MCP Inspector Guide](./docs/mcp-inspector.md)** - Test and debug your MCP server
- **[ChatGPT Dev Mode](./docs/chatgpt-dev-mode.md)** - Connect ChatGPT to your local server
- **[Verification Checklist](./docs/verification-checklist.md)** - End-to-end setup verification

### Environment Variables

Environment variables can be configured using `.env` files:

- **server/.env** - Server configuration (PORT, etc.)
  - See `server/.env.example` for available options

- **web/.env** - Web app configuration (VITE_API_URL, etc.)
  - See `web/.env.example` for available options

### Project Structure

```
bard/
├── server/          # MCP server (Express + MCP SDK)
│   ├── src/         # Server source code
│   ├── .env.example # Environment variable template
│   └── package.json # Server dependencies and scripts
├── web/             # Web application (Vite + React)
│   ├── src/         # Web app source code
│   ├── .env.example # Environment variable template
│   └── package.json # Web app dependencies and scripts
├── docs/            # Development documentation
│   └── README.md    # Documentation index
└── package.json     # Root package configuration
```

### Getting Help

If you encounter issues during setup:
1. Check the [Verification Checklist](./docs/verification-checklist.md) for common troubleshooting steps
2. Review the specific guide for the component you're working with
3. Ensure all prerequisites are installed and environment variables are configured
