# Installing the Motion Canvas MCP Server

Follow these steps to install and configure the Motion Canvas MCP server for use with Claude Code.

## Installation Steps

1. **Install dependencies**

```bash
cd motion-canvas-mcp
npm install
```

2. **Configure the server (optional)**

If needed, edit the `server.js` file to adjust the path to your Motion Canvas project:

```javascript
// Path to Motion Canvas project
const MOTION_CANVAS_PATH = path.join(__dirname, '..', 'animations');
```

3. **Configure Claude Code**

To make Claude Code aware of your MCP server, MCP configuration has been added to your project:

- The configuration file is at `.mcp.json`
- This tells Claude Code how to start and connect to your MCP server

```json
{
  "mcpServers": {
    "motion-canvas-server": {
      "command": "node",
      "args": ["/home/andrie/github/conf-2025-working-with-infosec/motion-canvas-mcp/server.js"],
      "env": {
        "PORT": "3030",
        "NODE_ENV": "production"
      }
    }
  }
}
```

4. **Start the server**

Start the server manually:

```bash
cd /home/andrie/github/conf-2025-working-with-infosec/motion-canvas-mcp
npm start
```

Or set it up as a service for automatic startup.

5. **Restart Claude Code session**

After configuring the MCP server, restart your Claude Code session for the changes to take effect.

## Verification

To verify the server is running correctly:

1. Open a web browser and navigate to `http://localhost:3030/mcp/resources`
2. You should see a JSON response listing available resources

## Troubleshooting

- **Server won't start**: Check for port conflicts or missing dependencies
- **File permission errors**: Ensure Node.js has access to the Motion Canvas project directory