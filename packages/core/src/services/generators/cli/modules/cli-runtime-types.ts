/**
 * CLI Runtime Types Generator
 *
 * Generates CLI runtime type definitions
 */

/**
 * Generate runtime types
 * @returns Runtime type definitions
 */
export function generateRuntimeTypes(): string {
  return [generatePluginTypes(), generateHookTypes(), generateManagerInterfaces()].join('\n\n');
}

/**
 * Generate plugin-related types
 * @returns Plugin type definitions
 */
function generatePluginTypes(): string {
  return `/**
 * Plugin interface
 */
export interface CLIPlugin {
  name: string;
  version: string;
  description: string;
  initialize: (app: CLIApplication) => Promise<void>;
  destroy?: () => Promise<void>;
}

/**
 * Plugin manager interface
 */
export interface PluginManager {
  register(plugin: CLIPlugin): Promise<void>;
  unregister(pluginName: string): Promise<void>;
  get(pluginName: string): CLIPlugin | undefined;
  list(): CLIPlugin[];
  initializeAll(): Promise<void>;
  destroyAll(): Promise<void>;
}`;
}

/**
 * Generate hook-related types
 * @returns Hook type definitions
 */
function generateHookTypes(): string {
  return `/**
 * Hook function type
 */
export type HookFunction = (context: HookContext) => Promise<void>;

/**
 * Hook context interface
 */
export interface HookContext {
  command: CLICommand;
  event: 'before' | 'after' | 'error';
  args: unknown;
  options: unknown;
  result?: CommandResult;
  error?: Error;
  startTime: Date;
}

/**
 * Hook manager interface
 */
export interface HookManager {
  add(command: CLICommand, event: 'before' | 'after' | 'error', handler: HookFunction): void;
  remove(command: CLICommand, event: 'before' | 'after' | 'error', handler: HookFunction): void;
  execute(context: HookContext): Promise<void>;
}`;
}

/**
 * Generate manager interfaces (kept for compatibility)
 * @returns Manager interface definitions
 */
function generateManagerInterfaces(): string {
  return '';
}
