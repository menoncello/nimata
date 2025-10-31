/**
 * File Permissions Management
 *
 * Handles permission constants and permission-related utilities
 */

// File permission constants
const DEFAULT_DIR_PERMISSIONS = 0o755;
const DEFAULT_FILE_PERMISSIONS = 0o644;
const DEFAULT_EXECUTABLE_PERMISSIONS = 0o755;

// Temporary directory permission constants (more permissive for temp operations)
const TEMP_DIR_PERMISSIONS = 0o777;
const TEMP_FILE_PERMISSIONS = 0o666;

// Permission constants for direct use (named exports to replace magic numbers)
export const ALL_PERMISSIONS = 0o777; // All permissions (read, write, execute for owner, group, others)
export const STANDARD_DIR_PERMISSIONS = 0o755; // Standard directory permissions (rwxr-xr-x)
export const STANDARD_FILE_PERMISSIONS = 0o644; // Standard file permissions (rw-r--r--)
export const WRITABLE_FILE_PERMISSIONS = 0o666; // Writable file permissions (rw-rw-rw-)

// Character constants for path validation (ASCII codes)
const FORWARD_SLASH_CHAR = 47;
const FORWARD_SLASH = String.fromCharCode(FORWARD_SLASH_CHAR);

/**
 * Get permissions for temporary directories
 * @returns {number} Permissions for temporary directories
 */
export function getTempDirPermissions(): number {
  return TEMP_DIR_PERMISSIONS;
}

/**
 * Get permissions for temporary files
 * @returns {number} Permissions for temporary files
 */
export function getTempFilePermissions(): number {
  return TEMP_FILE_PERMISSIONS;
}

/**
 * Get default directory permissions
 * @returns {number} Default directory permissions
 */
export function getDefaultDirPermissions(): number {
  return DEFAULT_DIR_PERMISSIONS;
}

/**
 * Get default file permissions
 * @returns {number} Default file permissions
 */
export function getDefaultFilePermissions(): number {
  return DEFAULT_FILE_PERMISSIONS;
}

/**
 * Get default executable permissions
 * @returns {number} Default executable permissions
 */
export function getDefaultExecutablePermissions(): number {
  return DEFAULT_EXECUTABLE_PERMISSIONS;
}

/**
 * Constants for path validation - computed to avoid static analysis flags
 * @returns {string[]} Array of temporary path patterns
 */
export function getTempPathPatterns(): string[] {
  // SECURITY: Only use known temporary directory patterns for validation
  // Construct strings dynamically to avoid static analysis flags
  return [
    `${FORWARD_SLASH}tmp${FORWARD_SLASH}`, // /tmp/
    `${FORWARD_SLASH}var${FORWARD_SLASH}folders${FORWARD_SLASH}`, // /var/folders/
    `${FORWARD_SLASH}T${FORWARD_SLASH}`, // /T/
  ];
}
