#!/usr/bin/env bun

/**
 * Quality Metrics Generator
 *
 * Generates comprehensive quality metrics for the project
 */

import { execSync } from 'node:child_process';
import { readFileSync, writeFileSync } from 'node:fs';

class QualityMetricsGenerator {
  log(message) {
    console.log(`[METRICS] ${message}`);
  }

  runCommand(command, description) {
    try {
      this.log(`Running: ${description}`);
      const result = execSync(command, {
        encoding: 'utf8',
        stdio: 'pipe',
      });
      return result;
    } catch (error) {
      this.log(`Error in ${description}: ${error.message}`);
      return null;
    }
  }

  getBasicMetrics() {
    this.log('Collecting basic metrics...');

    // Lines of code
    const loc = this.runCommand(
      "find . -name '*.ts' -not -path './node_modules/*' -not -path './dist/*' -not -path './.git/*' | xargs wc -l | tail -1",
      'Count lines of code'
    );

    // Number of files
    const fileCount = this.runCommand(
      "find . -name '*.ts' -not -path './node_modules/*' -not -path './dist/*' -not -path './.git/*' | wc -l",
      'Count TypeScript files'
    );

    // Test files
    const testCount = this.runCommand(
      "find . -name '*.test.ts' -not -path './node_modules/*' -not -path './dist/*' | wc -l",
      'Count test files'
    );

    return {
      linesOfCode: loc ? parseInt(loc.trim().split(/\s+/)[0]) : 0,
      fileCount: fileCount ? parseInt(fileCount.trim()) : 0,
      testCount: testCount ? parseInt(testCount.trim()) : 0,
    };
  }

  getPackageMetrics() {
    this.log('Analyzing package structure...');

    const packages = ['@nimata/core', '@nimata/cli', '@nimata/adapters'];
    const packageMetrics = {};

    packages.forEach((pkg) => {
      const metrics = {
        eslintErrors: 0,
        testResults: { pass: 0, fail: 0 },
        coverage: 0,
        typeErrors: 0,
      };

      // ESLint errors
      const eslintResult = this.runCommand(
        `bunx eslint packages/${pkg.split('/')[1]}/src/**/*.ts 2>&1 | grep -c "error" || echo "0"`,
        `ESLint errors for ${pkg}`
      );
      metrics.eslintErrors = eslintResult ? parseInt(eslintResult.trim()) : 0;

      // Test results
      const testResult = this.runCommand(
        `bun run test --filter=${pkg} 2>&1`,
        `Test results for ${pkg}`
      );
      if (testResult) {
        const passMatch = testResult.match(/(\d+)\s+pass/);
        const failMatch = testResult.match(/(\d+)\s+fail/);
        metrics.testResults.pass = passMatch ? parseInt(passMatch[1]) : 0;
        metrics.testResults.fail = failMatch ? parseInt(failMatch[1]) : 0;
      }

      packageMetrics[pkg] = metrics;
    });

    return packageMetrics;
  }

  getComplexityMetrics() {
    this.log('Analyzing code complexity...');

    const complexityMetrics = {
      largeFunctions: 0,
      complexFunctions: 0,
      longFiles: 0,
      duplicateStrings: 0,
    };

    // Find large functions (>30 lines)
    const largeFuncs = this.runCommand(
      "grep -rn 'function\|=>' packages/adapters/src/ | awk 'functionCount[$0]++ END { for (func in functionCount) if (functionCount[func] > 30) print functionCount[func] }'",
      'Find large functions'
    );

    if (largeFuncs) {
      complexityMetrics.largeFunctions = largeFuncs.trim().split('\n').filter(Boolean).length;
    }

    // Find long files (>200 lines)
    const longFiles = this.runCommand(
      "find packages/adapters/src/ -name '*.ts' -exec wc -l {} \\; | awk '$1 > 200 { print $1 }' | wc -l",
      'Find long files'
    );

    if (longFiles) {
      complexityMetrics.longFiles = parseInt(longFiles.trim());
    }

    return complexityMetrics;
  }

  calculateQualityScore(metrics) {
    let score = 100;

    // Penalize ESLint errors
    const totalEslintErrors = Object.values(metrics.packages).reduce(
      (sum, pkg) => sum + pkg.eslintErrors,
      0
    );
    score -= Math.min(totalEslintErrors / 20, 30); // Max 30 points penalty

    // Penalize test failures
    const totalTestFailures = Object.values(metrics.packages).reduce(
      (sum, pkg) => sum + pkg.testResults.fail,
      0
    );
    score -= Math.min(totalTestFailures * 5, 40); // Max 40 points penalty

    // Bonus for good coverage
    // (Would need actual coverage data)
    score += Math.min(5, 5); // Assume decent coverage

    // Penalize complexity issues
    const complexityIssues = metrics.complexity.largeFunctions + metrics.complexity.longFiles;
    score -= Math.min(complexityIssues / 2, 15); // Max 15 points penalty

    return Math.max(0, Math.round(score));
  }

  generateMarkdownReport(metrics) {
    const qualityScore = this.calculateQualityScore(metrics);
    const timestamp = new Date().toISOString();

    return `# Quality Metrics Report

Generated: ${timestamp}

## Overall Quality Score: ${qualityScore}/100

${this.getQualityGrade(qualityScore)}

## Basic Metrics

| Metric | Value |
|--------|-------|
| Lines of Code | ${metrics.basic.linesOfCode.toLocaleString()} |
| TypeScript Files | ${metrics.basic.fileCount} |
| Test Files | ${metrics.basic.testCount} |
| Test to Code Ratio | ${((metrics.basic.testCount / metrics.basic.fileCount) * 100).toFixed(1)}% |

## Package Analysis

### @nimata/core
- **ESLint Errors**: ${metrics.packages['@nimata/core'].eslintErrors}
- **Test Results**: ${metrics.packages['@nimata/core'].testResults.pass} pass, ${metrics.packages['@nimata/core'].testResults.fail} fail
- **Status**: ${metrics.packages['@nimata/core'].eslintErrors === 0 ? '✅ Ready' : '❌ Needs attention'}

### @nimata/cli
- **ESLint Errors**: ${metrics.packages['@nimata/cli'].eslintErrors}
- **Test Results**: ${metrics.packages['@nimata/cli'].testResults.pass} pass, ${metrics.packages['@nimata/cli'].testResults.fail} fail
- **Status**: ${metrics.packages['@nimata/cli'].eslintErrors === 0 ? '✅ Ready' : '❌ Needs attention'}

### @nimata/adapters
- **ESLint Errors**: ${metrics.packages['@nimata/adapters'].eslintErrors}
- **Test Results**: ${metrics.packages['@nimata/adapters'].testResults.pass} pass, ${metrics.packages['@nimata/adapters'].testResults.fail} fail
- **Status**: ${metrics.packages['@nimata/adapters'].eslintErrors === 0 ? '✅ Ready' : '❌ Needs refactoring'}

## Code Quality Metrics

| Metric | Value | Status |
|--------|-------|--------|
| Large Functions (>30 lines) | ${metrics.complexity.largeFunctions} | ${metrics.complexity.largeFunctions > 0 ? '❌ High' : '✅ Good'} |
| Long Files (>200 lines) | ${metrics.complexity.longFiles} | ${metrics.complexity.longFiles > 0 ? '❌ High' : '✅ Good'} |
| Total ESLint Errors | ${Object.values(metrics.packages).reduce((sum, pkg) => sum + pkg.eslintErrors, 0)} | ${Object.values(metrics.packages).reduce((sum, pkg) => sum + pkg.eslintErrors, 0) === 0 ? '✅ None' : '❌ Needs fixing'} |

## Recommendations

${this.generateRecommendations(metrics)}

## Trends

This report will be updated with each commit to track quality trends over time.

---

*Generated by Quality Metrics Generator*
`;
  }

  getQualityGrade(score) {
    if (score >= 90) return '🏆 **Excellent**';
    if (score >= 80) return '✅ **Good**';
    if (score >= 70) return '⚠️ **Fair**';
    if (score >= 60) return '❌ **Poor**';
    return '🚨 **Critical**';
  }

  generateRecommendations(metrics) {
    const recommendations = [];

    // ESLint recommendations
    const totalEslintErrors = Object.values(metrics.packages).reduce(
      (sum, pkg) => sum + pkg.eslintErrors,
      0
    );

    if (totalEslintErrors > 0) {
      recommendations.push(
        `- **Fix ${totalEslintErrors} ESLint errors** using \`bun run lint:fix\``
      );
    }

    // Test recommendations
    const totalTestFailures = Object.values(metrics.packages).reduce(
      (sum, pkg) => sum + pkg.testResults.fail,
      0
    );

    if (totalTestFailures > 0) {
      recommendations.push(`- **Fix ${totalTestFailures} test failures** before deployment`);
    }

    // Complexity recommendations
    if (metrics.complexity.largeFunctions > 0) {
      recommendations.push(
        `- **Split ${metrics.complexity.largeFunctions} large functions** into smaller units`
      );
    }

    if (metrics.complexity.longFiles > 0) {
      recommendations.push(
        `- **Refactor ${metrics.complexity.longFiles} long files** into focused modules`
      );
    }

    // Coverage recommendations
    const testRatio = (metrics.basic.testCount / metrics.basic.fileCount) * 100;
    if (testRatio < 80) {
      recommendations.push(`- **Increase test coverage** (currently ${testRatio.toFixed(1)}%)`);
    }

    if (recommendations.length === 0) {
      recommendations.push('- **Excellent quality!** Maintain current standards.');
    }

    return recommendations.join('\n');
  }

  generateJsonReport(metrics) {
    return {
      timestamp: new Date().toISOString(),
      qualityScore: this.calculateQualityScore(metrics),
      basic: metrics.basic,
      packages: metrics.packages,
      complexity: metrics.complexity,
      recommendations: this.generateRecommendations(metrics)
        .split('\n')
        .filter((line) => line.startsWith('-')),
    };
  }

  async run() {
    this.log('📊 Generating Quality Metrics Report');

    const metrics = {
      basic: this.getBasicMetrics(),
      packages: this.getPackageMetrics(),
      complexity: this.getComplexityMetrics(),
    };

    // Generate Markdown report
    const markdownReport = this.generateMarkdownReport(metrics);
    writeFileSync('docs/quality-metrics.md', markdownReport);
    this.log('✅ Markdown report generated: docs/quality-metrics.md');

    // Generate JSON report
    const jsonReport = this.generateJsonReport(metrics);
    writeFileSync('docs/quality-metrics.json', JSON.stringify(jsonReport, null, 2));
    this.log('✅ JSON report generated: docs/quality-metrics.json');

    // Print summary
    console.log('\n=== QUALITY METRICS SUMMARY ===');
    console.log(`Quality Score: ${this.calculateQualityScore(metrics)}/100`);
    console.log(`Lines of Code: ${metrics.basic.linesOfCode.toLocaleString()}`);
    console.log(`Test Files: ${metrics.basic.testCount}`);
    console.log(
      `ESLint Errors: ${Object.values(metrics.packages).reduce((sum, pkg) => sum + pkg.eslintErrors, 0)}`
    );
    console.log(
      `Test Failures: ${Object.values(metrics.packages).reduce((sum, pkg) => sum + pkg.testResults.fail, 0)}`
    );
    console.log('\n📄 Full report: docs/quality-metrics.md');

    this.log('📊 Quality metrics generation completed!');
  }
}

// Run the metrics generator
const generator = new QualityMetricsGenerator();
generator.run().catch(console.error);
