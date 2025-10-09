# Motion Canvas MCP Server

This server provides MCP (Model Context Protocol) integration for Motion Canvas, allowing Claude and other AI tools to interact with your Motion Canvas projects. The server is implemented in TypeScript and follows the MCP specification.

## Features

- Create new Motion Canvas scenes from templates
- Search the Motion Canvas API documentation
- Inspect running animations through localhost

## Setup

1. Install dependencies:

```bash
cd motion-canvas-mcp
npm install
```

2. Build the TypeScript code:

```bash
npm run build
```

3. Start the server:

```bash
npm start
```

You can also start the server with debug output:

```bash
npm run debug
```

Or run in development mode with auto-reload:

```bash
npm run dev
```

## Usage with Claude Code

### Creating a New Scene

Claude can help create new Motion Canvas scenes through this MCP server. Example:

```
Create a new Motion Canvas scene called "particle-system" that animates moving particles.
```

### API Documentation Search

Claude can search through the Motion Canvas documentation:

```
Search the Motion Canvas API for information about the Circle component.
```

## MCP Tools

### create_scene

Creates a new Motion Canvas scene from a template.

Parameters:
- `sceneName` (string, required): Name of the scene to create
- `template` (string, optional): Template to use ('basic' or 'animation'), defaults to 'basic'

### search_api

Searches the Motion Canvas API documentation.

Parameters:
- `query` (string, required): Search query
- `category` (string, optional): Category to filter by ('core', '2d', or 'all'), defaults to 'all'

## Configuration

The server assumes your Motion Canvas project is located at `../animations` relative to the server directory. If your project is elsewhere, edit the `MOTION_CANVAS_PATH` variable in `server.js`.

## Requirements

- Node.js 18+
- TypeScript 5.x
- Motion Canvas 3.x project

## Development

TypeScript source files are located in the `src` directory and compiled to the `dist` directory.

For more information on the MCP standard, visit [modelcontextprotocol.io](https://modelcontextprotocol.io/)