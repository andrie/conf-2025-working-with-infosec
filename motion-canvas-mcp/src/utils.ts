// Define types for MCP server
export type Content = {
  type: string;
  text?: string;
  json?: any;
};

export type CallToolResult = {
  content: Content[];
};

/**
 * Enum for different error types in the Motion Canvas MCP server
 */
export enum ErrorType {
  VALIDATION = 'validation_error',
  NOT_FOUND = 'not_found',
  PERMISSION = 'permission_error',
  RUNTIME = 'runtime_error',
  SERVER = 'server_error',
}

/**
 * Custom error class for Motion Canvas MCP
 */
export class McpError extends Error {
  constructor(
    message: string,
    public readonly type: ErrorType = ErrorType.RUNTIME,
    public readonly details?: Record<string, unknown>
  ) {
    super(message);
    this.name = 'McpError';
  }
}

/**
 * Safely execute an async function with proper error handling for MCP
 *
 * @param fn The async function to execute
 * @param errorHandler Custom error handler function
 * @returns A promise that resolves to the CallToolResult
 */
export async function safeExecute<T>(
  fn: () => Promise<CallToolResult>,
  errorHandler?: (error: Error) => CallToolResult
): Promise<CallToolResult> {
  try {
    return await fn();
  } catch (error) {
    console.error('Error:', error);

    if (errorHandler) {
      return errorHandler(error instanceof Error ? error : new Error(String(error)));
    }

    // Default error handling
    const errorMessage = error instanceof Error ? error.message : String(error);
    const errorType = error instanceof McpError ? error.type : ErrorType.SERVER;
    const errorDetails = error instanceof McpError ? error.details : undefined;

    const content: Content[] = [
      {
        type: 'text',
        text: `Error: ${errorMessage}`,
      },
    ];

    if (errorDetails) {
      content.push({
        type: 'json',
        json: {
          error_type: errorType,
          details: errorDetails,
        },
      });
    }

    return { content };
  }
}

/**
 * Validate that a path exists
 *
 * @param path The path to check
 * @throws McpError if path doesn't exist
 */
export async function validatePathExists(path: string): Promise<void> {
  const fs = await import('fs-extra');
  try {
    await fs.access(path);
  } catch (error) {
    throw new McpError(`Path does not exist: ${path}`, ErrorType.NOT_FOUND);
  }
}

/**
 * Format success response
 *
 * @param message Main message text
 * @param data Optional data to include
 * @returns Formatted CallToolResult
 */
export function formatSuccess(message: string, data?: Record<string, unknown>): CallToolResult {
  const content: Content[] = [
    {
      type: 'text',
      text: message,
    },
  ];

  if (data) {
    content.push({
      type: 'json',
      json: data,
    });
  }

  return { content };
}