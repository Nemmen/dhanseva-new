import ApiTester from './api.test';
import { writeFileSync } from 'fs';
import { join } from 'path';

async function runTests() {
  const tester = new ApiTester('http://localhost:5000');
  
  //console.log('🚀 Starting API Test Suite for Dhanseva Platform\n');
  //console.log(`Timestamp: ${new Date().toISOString()}\n`);

  await tester.runAllTests();

  const results = tester.getResults();
  
  // Summary
  const total = results.length;
  const passed = results.filter(r => r.status === 'PASS').length;
  const failed = results.filter(r => r.status === 'FAIL').length;

  //console.log('\n========== TEST SUMMARY ==========\n');
  //console.log(`Total Tests: ${total}`);
  //console.log(`✅ Passed: ${passed}`);
  //console.log(`❌ Failed: ${failed}`);
  //console.log(`Success Rate: ${((passed / total) * 100).toFixed(2)}%\n`);

  // Generate markdown report
  const markdownReport = generateMarkdownReport(results);
  const reportPath = join(process.cwd(), 'TEST_RESULTS.md');
  writeFileSync(reportPath, markdownReport);

  //console.log(`📄 Full report saved to: ${reportPath}\n`);
}

function generateMarkdownReport(results: any[]): string {
  const timestamp = new Date().toISOString();
  const total = results.length;
  const passed = results.filter(r => r.status === 'PASS').length;
  const failed = results.filter(r => r.status === 'FAIL').length;

  let markdown = `# 📋 Dhanseva API Test Results\n\n`;
  markdown += `**Generated:** ${timestamp}\n\n`;
  markdown += `## Summary\n\n`;
  markdown += `| Metric | Value |\n`;
  markdown += `|--------|-------|\n`;
  markdown += `| Total Tests | ${total} |\n`;
  markdown += `| ✅ Passed | ${passed} |\n`;
  markdown += `| ❌ Failed | ${failed} |\n`;
  markdown += `| Success Rate | ${((passed / total) * 100).toFixed(2)}% |\n\n`;

  // Group by phase
  const phases = ['Phase 1', 'Phase 2', 'Phase 3'];
  
  for (const phase of phases) {
    const phaseTests = results.filter(r => r.phase === phase);
    if (phaseTests.length === 0) continue;

    const phaseFailed = phaseTests.filter(r => r.status === 'FAIL').length;

    markdown += `## ${phase} - Results\n\n`;
    markdown += `**Status:** ${phaseFailed === 0 ? '✅ All Passed' : `❌ ${phaseFailed} Failed`}\n\n`;
    markdown += `| # | Route | Method | Endpoint | Status | Code | Duration |\n`;
    markdown += `|---|-------|--------|----------|--------|------|----------|\n`;

    phaseTests.forEach((test, idx) => {
      const statusEmoji = test.status === 'PASS' ? '✅' : '❌';
      markdown += `| ${idx + 1} | ${test.routeName} | ${test.method} | ${test.endpoint} | ${statusEmoji} ${test.status} | ${test.statusCode || 'N/A'} | ${test.duration}ms |\n`;
    });

    markdown += `\n`;

    // Failed tests details
    const failedTests = phaseTests.filter(r => r.status === 'FAIL');
    if (failedTests.length > 0) {
      markdown += `### 🔴 Failed Tests in ${phase}\n\n`;
      failedTests.forEach((test) => {
        markdown += `#### ${test.routeName}\n`;
        markdown += `- **Endpoint:** ${test.method} ${test.endpoint}\n`;
        markdown += `- **Status Code:** ${test.statusCode || 'Connection Failed'}\n`;
        markdown += `- **Error:** ${test.error || 'Unknown error'}\n`;
        if (test.response?.message) {
          markdown += `- **Server Response:** ${test.response.message}\n`;
        }
        markdown += `\n`;
      });
    }
  }

  // Error Summary
  const failedTests = results.filter(r => r.status === 'FAIL');
  if (failedTests.length > 0) {
    markdown += `## 🚨 Error Log\n\n`;
    markdown += `### Failed Routes Summary\n\n`;

    const errorMap: { [key: string]: string[] } = {};
    failedTests.forEach(test => {
      const key = `${test.method} ${test.endpoint}`;
      if (!errorMap[key]) errorMap[key] = [];
      errorMap[key].push(test.error || test.response?.message || 'Unknown');
    });

    Object.entries(errorMap).forEach(([route, errors]) => {
      markdown += `\n### ${route}\n`;
      markdown += '```\n';
      errors.forEach(err => {
        markdown += `• ${err}\n`;
      });
      markdown += '```\n';
    });
  }

  // Test Details
  markdown += `\n## Detailed Test Results\n\n`;
  
  results.forEach((test, idx) => {
    markdown += `### Test ${idx + 1}: ${test.routeName}\n`;
    markdown += `- **Phase:** ${test.phase}\n`;
    markdown += `- **Method:** ${test.method}\n`;
    markdown += `- **Endpoint:** ${test.endpoint}\n`;
    markdown += `- **Status:** ${test.status === 'PASS' ? '✅ PASS' : '❌ FAIL'}\n`;
    markdown += `- **Status Code:** ${test.statusCode || 'N/A'}\n`;
    markdown += `- **Duration:** ${test.duration}ms\n`;
    
    if (test.error) {
      markdown += `- **Error:** ${test.error}\n`;
    }
    
    if (test.response) {
      markdown += `- **Response:** \`\`\`json\n${JSON.stringify(test.response, null, 2)}\n\`\`\`\n`;
    }
    
    markdown += `\n---\n\n`;
  });

  return markdown;
}

runTests().catch(//console.error);
