declare module '@modelcontextprotocol/sdk' {
  export interface Content {
    type: string;
    text?: string;
    json?: any;
    [key: string]: any;
  }

  export interface CallToolResult {
    content: Content[];
  }

  export class McpServer {
    constructor(options: {
      name: string;
      version: string;
      capabilities: {
        resources?: Record<string, any>;
        tools?: Record<string, any>;
      };
    });

    tool(
      name: string,
      description: string,
      schema: any,
      handler: (args: any) => Promise<CallToolResult>
    ): this;

    connect(transport: any): Promise<void>;
  }

  export class StdioServerTransport {
    constructor();
  }
}