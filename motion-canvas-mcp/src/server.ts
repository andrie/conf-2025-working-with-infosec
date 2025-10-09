import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs-extra';
import { z } from 'zod';
import { safeExecute, McpError, ErrorType, formatSuccess, Content } from './utils.js';

// Import MCP SDK for STDIO transport
import { McpServer as MCP } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';

class McpServer {
  private server: MCP;
  private tools: Map<string, any> = new Map();

  constructor() {
    this.server = new MCP({
      name: 'motion-canvas',
      version: '1.0.0',
      capabilities: {
        resources: {
          scene_templates: {
            type: 'collection',
            description: 'Templates for creating new Motion Canvas scenes'
          },
          api_documentation: {
            type: 'collection',
            description: 'Motion Canvas API documentation'
          }
        },
        tools: {}
      }
    });
  }

  registerTool(name: string, schema: any, callback: any) {
    // Register tool with MCP server
    console.error(`Registering tool: ${name}`);
    this.server.registerTool(name, schema, callback);
    this.tools.set(name, { schema, callback });
  }

  async start() {
    // Connect to STDIO transport
    const stdioTransport = new StdioServerTransport();
    await this.server.connect(stdioTransport);
    console.error('Motion Canvas MCP Server running on stdio');
  }
}

// No longer need a custom transport class as we use StdioServerTransport

// Get current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Path to Motion Canvas project
const MOTION_CANVAS_PATH = path.join(__dirname, '..', '..', 'animations');

/**
 * Generate scene content based on template
 */
function generateSceneContent(template: string, sceneName: string): string {
  switch (template) {
    case 'basic':
      return `import {makeScene2D, Circle, Rect, Txt} from '@motion-canvas/2d';
import {all, createRef, waitFor} from '@motion-canvas/core';

export default makeScene2D(function* (view) {
  // Create references
  const circleRef = createRef<Circle>();
  const rectRef = createRef<Rect>();
  const textRef = createRef<Txt>();

  // Add elements to the scene
  view.add(
    <>
      <Circle
        ref={circleRef}
        x={-200}
        y={0}
        width={200}
        height={200}
        fill="#ff5555"
      />

      <Rect
        ref={rectRef}
        x={200}
        y={0}
        width={200}
        height={200}
        fill="#5555ff"
        radius={20}
      />

      <Txt
        ref={textRef}
        y={-250}
        fontSize={60}
        fontFamily="Arial"
        fill="#ffffff"
        text="${sceneName}"
      />
    </>
  );

  // Animate elements
  yield* waitFor(1);

  yield* all(
    circleRef().animate({
      to: {
        scale: 1.5,
      },
      duration: 1,
    }),
    rectRef().animate({
      to: {
        rotation: 180,
      },
      duration: 1,
    }),
    textRef().animate({
      to: {
        fontSize: 80,
      },
      duration: 1,
    })
  );

  yield* waitFor(1);

  yield* all(
    circleRef().animate({
      to: {
        scale: 1,
      },
      duration: 1,
    }),
    rectRef().animate({
      to: {
        rotation: 0,
      },
      duration: 1,
    }),
    textRef().animate({
      to: {
        fontSize: 60,
      },
      duration: 1,
    })
  );

  yield* waitFor(1);
});
`;

    case 'animation':
      return `import {makeScene2D, Circle, Line, Node} from '@motion-canvas/2d';
import {all, chain, createRef, waitFor} from '@motion-canvas/core';

export default makeScene2D(function* (view) {
  // Create references
  const containerRef = createRef<Node>();
  const circleRef = createRef<Circle>();
  const lineRef = createRef<Line>();

  // Add elements to the scene
  view.add(
    <Node ref={containerRef}>
      <Circle
        ref={circleRef}
        x={0}
        y={0}
        width={100}
        height={100}
        fill="#ffcc00"
      />

      <Line
        ref={lineRef}
        points={[
          [-200, 0],
          [0, 0],
        ]}
        stroke="#ffffff"
        lineWidth={5}
        endArrow
      />
    </Node>
  );

  // Animation sequence
  yield* waitFor(1);

  // Move circle along path
  yield* chain(
    circleRef().animate({
      to: {
        x: 200,
      },
      duration: 2,
    }),

    circleRef().animate({
      to: {
        y: 200,
      },
      duration: 2,
    }),

    circleRef().animate({
      to: {
        x: -200,
      },
      duration: 2,
    }),

    circleRef().animate({
      to: {
        y: 0,
      },
      duration: 2,
    })
  );

  // Animate line to follow circle
  yield* all(
    lineRef().animate({
      to: {
        points: [
          [-200, 0],
          [-200, 0],
        ],
      },
      duration: 1,
    }),

    containerRef().animate({
      to: {
        rotation: 360,
      },
      duration: 2,
    })
  );

  yield* waitFor(1);
});
`;

    default:
      return `import {makeScene2D} from '@motion-canvas/2d';
import {createRef, waitFor} from '@motion-canvas/core';

export default makeScene2D(function* (view) {
  // Scene implementation
  yield* waitFor(1);
});
`;
  }
}

/**
 * Generate scene meta file content
 */
function generateSceneMetaContent(): string {
  return `{
  "version": 0,
  "timeEvents": [],
  "seed": 0
}`;
}

/**
 * Generate project file content
 */
function generateProjectContent(sceneName: string): string {
  return `import {makeProject} from '@motion-canvas/core';

import ${sceneName} from './scenes/${sceneName}?scene';

// import global styles
import '../global.css';

export default makeProject({
  scenes: [${sceneName}],
});`;
}

/**
 * Update vite.config.ts to include the new project
 */
async function updateViteConfig(sceneName: string): Promise<void> {
  const viteConfigPath = path.join(MOTION_CANVAS_PATH, 'vite.config.ts');

  try {
    let viteConfig = await fs.readFile(viteConfigPath, 'utf8');

    // Check if project is already included
    if (viteConfig.includes(`"./src/${sceneName}.ts"`)) {
      return; // Already included
    }

    // Find the project array
    const projectMatch = viteConfig.match(/projects\s*:\s*\[([\s\S]*?)\]/);

    if (!projectMatch) {
      throw new McpError('Could not find projects array in vite.config.ts', ErrorType.RUNTIME);
    }

    // Extract current projects
    const currentProjects = projectMatch[1].trim();

    // Add new project
    const newProjects = currentProjects
      ? `${currentProjects},\n    "./src/${sceneName}.ts"`
      : `"./src/${sceneName}.ts"`;

    // Update vite config
    viteConfig = viteConfig.replace(
      /projects\s*:\s*\[([\s\S]*?)\]/,
      `projects: [${newProjects}]`
    );

    await fs.writeFile(viteConfigPath, viteConfig);
  } catch (error) {
    console.error('Error updating vite.config.ts:', error);
    throw new McpError(`Failed to update vite.config.ts: ${error}`, ErrorType.SERVER);
  }
}

// Main function to run the server
async function main() {
  try {
    // Initialize the MCP server
    const server = new McpServer();

    // Register tools
    // Create Scene Tool
    server.registerTool(
      'create_scene',
      {
        description: 'Creates a new Motion Canvas scene from a template',
        inputSchema: {
          sceneName: z.string().describe('Name of the scene to create'),
          template: z.enum(['basic', 'animation']).default('basic').describe('Template to use for the scene'),
        }
      },
      async ({ sceneName, template }: { sceneName: string; template: string }) => {
        return safeExecute(async () => {
          if (!sceneName) {
            throw new McpError('Scene name is required', ErrorType.VALIDATION);
          }

          // Generate safe filename
          const safeSceneName = sceneName
            .toLowerCase()
            .replace(/[^a-z0-9_-]/g, '_');

          // Create scene file paths
          const scenePath = path.join(MOTION_CANVAS_PATH, 'src', 'scenes', `${safeSceneName}.tsx`);
          const sceneMetaPath = path.join(MOTION_CANVAS_PATH, 'src', 'scenes', `${safeSceneName}.meta`);
          const projectPath = path.join(MOTION_CANVAS_PATH, 'src', `${safeSceneName}.ts`);

          // Check if scene already exists
          if (fs.existsSync(scenePath)) {
            throw new McpError('Scene already exists', ErrorType.VALIDATION, { sceneName: safeSceneName });
          }

          // Generate content for files
          const sceneContent = generateSceneContent(template, safeSceneName);
          const sceneMetaContent = generateSceneMetaContent();
          const projectContent = generateProjectContent(safeSceneName);

          // Write files
          await fs.outputFile(scenePath, sceneContent);
          await fs.outputFile(sceneMetaPath, sceneMetaContent);
          await fs.outputFile(projectPath, projectContent);

          // Update vite config
          await updateViteConfig(safeSceneName);

          return formatSuccess(`Scene ${safeSceneName} created successfully`, {
            name: safeSceneName,
            path: scenePath,
            projectPath: projectPath,
          });
        });
      }
    );

    // Search API Documentation Tool
    server.registerTool(
      'search_api',
      {
        description: 'Searches Motion Canvas API documentation',
        inputSchema: {
          query: z.string().describe('Search query'),
          category: z.string().default('all').describe('Category to search in (e.g. "core", "2d", or "all")'),
        }
      },
      async ({ query, category }: { query: string; category: string }) => {
        return safeExecute(async () => {
          if (!query) {
            throw new McpError('Search query is required', ErrorType.VALIDATION);
          }

          // Search TypeScript source files in Motion Canvas packages
          const mcPackagesPath = path.join(MOTION_CANVAS_PATH, 'node_modules', '@motion-canvas');
          // For TypeScript source files, we should look in the installed lib/types directory
          const coreTypesPath = path.join(mcPackagesPath, 'core', 'lib', 'types');
          // For 2D package, TypeScript definitions are scattered, so search in both lib and src
          const twoDLibPath = path.join(mcPackagesPath, '2d', 'lib');
          const twoDSrcPath = path.join(mcPackagesPath, '2d', 'src');

          // Perform a simple grep-like search in the TypeScript files
          type SearchResult = { section: string; content: string };
          let results: SearchResult[] = [];

          // Function to search in directory recursively
          const searchInDirectory = async (dirPath: string): Promise<void> => {
            try {
              const entries = await fs.readdir(dirPath, { withFileTypes: true });

              for (const entry of entries) {
                const fullPath = path.join(dirPath, entry.name);

                if (entry.isDirectory()) {
                  await searchInDirectory(fullPath);
                } else if (entry.name.endsWith('.d.ts')) {
                  try {
                    const content = await fs.readFile(fullPath, 'utf8');
                    if (content.toLowerCase().includes(query.toLowerCase())) {
                      const lines = content.split('\n');
                      const matchingLines = lines.filter(line =>
                        line.toLowerCase().includes(query.toLowerCase())
                      );

                      if (matchingLines.length > 0) {
                        results.push({
                          section: `### ${path.relative(mcPackagesPath, fullPath)}`,
                          content: matchingLines.join('\n'),
                        });
                      }
                    }
                  } catch (error) {
                    console.error(`Error reading file ${fullPath}:`, error);
                  }
                }
              }
            } catch (error) {
              console.error(`Error reading directory ${dirPath}:`, error);
            }
          };

          try {
            await searchInDirectory(coreTypesPath);
            await searchInDirectory(twoDLibPath);
            await searchInDirectory(twoDSrcPath);
          } catch (error) {
            console.error('Error searching TypeScript definition files:', error);
          }

          // Filter by category if specified
          if (category !== 'all') {
            results = results.filter(r => r.section.toLowerCase().includes(category.toLowerCase()));
          }

          // Format content for MCP response
          const content: Content[] = [
            {
              type: 'text',
              text: `Search results for "${query}" in category "${category}":`,
            },
          ];

          if (results.length === 0) {
            content.push({
              type: 'text',
              text: 'No results found',
            });
          } else {
            results.forEach(result => {
              content.push({
                type: 'text',
                text: result.section,
              });
              content.push({
                type: 'text',
                text: '```typescript\n' + result.content + '\n```',
              });
            });
          }

          return { content };
        });
      }
    );

    // Start the MCP server with stdio transport
    await server.start();
    console.error('Motion Canvas MCP Server started');
  } catch (error) {
    console.error("Error setting up MCP server:", error);
    process.exit(1);
  }
}

// Run the script generation
main().catch(error => {
  console.error("Unhandled error:", error);
  process.exit(1);
});