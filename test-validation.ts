import { validateTargetDirectorySecurity } from './packages/core/src/services/validators/validation-helpers';

const tests = ['./test-project', 'test-project', '/absolute/path', process.cwd(), undefined];

for (const dir of tests) {
  if (!dir) {
    console.log('undefined:', 'skipped');
    continue;
  }
  const result = validateTargetDirectorySecurity(dir);
  console.log(`"${dir}":`, result);
}
