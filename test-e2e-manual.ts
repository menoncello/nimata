import { spawn } from 'bun';
import { mkdtemp, rm } from 'node:fs/promises';
import { join } from 'node:path';
import { tmpdir } from 'node:os';

const tempDir = await mkdtemp(join(tmpdir(), 'nimata-test-'));
console.log('Temp dir:', tempDir);

const cliBin = join(process.cwd(), 'apps/cli/bin/nimata');

const proc = spawn({
  cmd: [cliBin, 'init', 'end-to-end-test'],
  cwd: tempDir,
  stdin: 'pipe',
  stdout: 'pipe',
  stderr: 'pipe',
});

// Send inputs
const inputs = [
  'End to End Test Project\n',
  'A comprehensive test project for E2E validation\n',
  'Test Author\n',
  'MIT\n',
  '2\n',
  '1 2\n',
  '1\n',
];

if (proc.stdin && typeof proc.stdin !== 'number') {
  for (const input of inputs) {
    proc.stdin.write(input);
    await new Promise((r) => setTimeout(r, 100));
  }
  proc.stdin.end();
}

const exitCode = await proc.exited;
const stdout = proc.stdout ? await new Response(proc.stdout as ReadableStream).text() : '';
const stderr = proc.stderr ? await new Response(proc.stderr as ReadableStream).text() : '';

console.log('\n===== EXIT CODE =====');
console.log(exitCode);

console.log('\n===== STDOUT =====');
console.log(stdout);

console.log('\n===== STDERR =====');
console.log(stderr);

// Check if directory was created
const { existsSync } = await import('node:fs');
const projectDir = join(tempDir, 'end-to-end-test');
console.log('\n===== DIRECTORY CHECK =====');
console.log('Project dir exists:', existsSync(projectDir));

// Cleanup
await rm(tempDir, { recursive: true, force: true });
