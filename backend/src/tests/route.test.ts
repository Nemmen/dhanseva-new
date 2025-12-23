#!/usr/bin/env node

/**
 * Mock API Tester - Tests without actual database
 * For use when database is not available
 */

import axios from 'axios';
import { writeFileSync } from 'fs';
import { join } from 'path';

interface TestResult {
  phase: string;
  routeName: string;
  method: string;
  endpoint: string;
  status: 'PASS' | 'FAIL' | 'SKIP';
  statusCode?: number;
  error?: string;
  expectedCode: number;
  response?: any;
  duration: number;
}

class RouteTester {
  private results: TestResult[] = [];
  private baseURL: string;
  
  private testEmails = {
    user: 'sujalsinha2001@gmail.com',
    dsa: 'sujalmilind300@gmail.com',
    employee: 'krsujalsinha2003@gmail.com',
  };
  private password = 'TestPassword123!';

  constructor(baseURL: string = 'http://localhost:5000') {
    this.baseURL = baseURL;
  }

  private async recordTest(test: TestResult) {
    this.results.push(test);
    const icon = test.status === 'PASS' ? '✅' : test.status === 'FAIL' ? '❌' : '⏭️';
    const detail = test.statusCode ? `[${test.statusCode}]` : '[CONNECTION ERROR]';
    //console.log(`${icon} ${test.phase.padEnd(10)} | ${test.routeName.padEnd(25)} | ${test.method.padEnd(4)} ${test.endpoint.padEnd(30)} ${detail.padEnd(20)} | ${test.duration}ms`);
    if (test.error) {
      //console.log(`   └─ Error: ${test.error}`);
    }
  }

  async testRoute(phase: string, routeName: string, method: string, endpoint: string, body?: any, expectedCode: number = 200) {
    const start = Date.now();
    try {
      const url = `${this.baseURL}${endpoint}`;
      let response;
      
      if (method === 'GET') {
        response = await axios.get(url, { validateStatus: () => true });
      } else if (method === 'POST') {
        response = await axios.post(url, body, { validateStatus: () => true });
      } else if (method === 'PUT') {
        response = await axios.put(url, body, { validateStatus: () => true });
      } else if (method === 'DELETE') {
        response = await axios.delete(url, { validateStatus: () => true });
      }

      const isPass = response!.status === expectedCode;
      
      await this.recordTest({
        phase,
        routeName,
        method,
        endpoint,
        status: isPass ? 'PASS' : 'FAIL',
        statusCode: response!.status,
        expectedCode,
        error: !isPass ? `Expected ${expectedCode}, got ${response!.status}` : undefined,
        response: response!.data,
        duration: Date.now() - start,
      });
    } catch (error: any) {
      await this.recordTest({
        phase,
        routeName,
        method,
        endpoint,
        status: 'FAIL',
        error: error.message || 'Connection failed',
        expectedCode,
        duration: Date.now() - start,
      });
    }
  }

  async runAllTests() {
    //console.log('\n🚀 Starting API Route Test Suite for Dhanseva Platform\n');
    //console.log('=' .repeat(150));
    //console.log('PHASE      | ROUTE NAME                | METHOD | ENDPOINT                       | STATUS               | DURATION');
    //console.log('=' .repeat(150));

    // PHASE 1: USER REGISTRATION & AUTH
    //console.log('\n📍 PHASE 1: USER REGISTRATION & AUTHENTICATION\n');
    
    await this.testRoute('Phase 1', 'User Registration', 'POST', '/api/auth/register', {
      email: this.testEmails.user,
      password: this.password,
      role: 'USER'
    }, 201);

    await this.testRoute('Phase 1', 'Send OTP', 'POST', '/api/otp/send', {
      email: this.testEmails.user
    }, 200);

    await this.testRoute('Phase 1', 'User Login', 'POST', '/api/auth/login', {
      email: this.testEmails.user,
      password: this.password
    }, 200);

    await this.testRoute('Phase 1', 'Get Current User', 'GET', '/api/auth/me', undefined, 401); // Expect failure without proper auth

    await this.testRoute('Phase 1', 'Get All Services', 'GET', '/api/services?page=1&limit=10', undefined, 200);

    await this.testRoute('Phase 1', 'User Logout', 'POST', '/api/auth/logout', {}, 200);

    // PHASE 2: DSA REGISTRATION & AUTH
    //console.log('\n📍 PHASE 2: DSA REGISTRATION & AUTHENTICATION\n');
    
    await this.testRoute('Phase 2', 'DSA Registration', 'POST', '/api/auth/register', {
      email: this.testEmails.dsa,
      password: this.password,
      role: 'DSA'
    }, 201);

    await this.testRoute('Phase 2', 'DSA Login', 'POST', '/api/auth/login', {
      email: this.testEmails.dsa,
      password: this.password
    }, 200);

    await this.testRoute('Phase 2', 'DSA Logout', 'POST', '/api/auth/logout', {}, 200);

    // PHASE 3: EMPLOYEE REGISTRATION & AUTH
    //console.log('\n📍 PHASE 3: EMPLOYEE REGISTRATION & AUTHENTICATION\n');
    
    await this.testRoute('Phase 3', 'Employee Registration', 'POST', '/api/auth/register', {
      email: this.testEmails.employee,
      password: this.password,
      role: 'EMPLOYEE'
    }, 201);

    await this.testRoute('Phase 3', 'Employee Login', 'POST', '/api/auth/login', {
      email: this.testEmails.employee,
      password: this.password
    }, 200);

    await this.testRoute('Phase 3', 'Employee Logout', 'POST', '/api/auth/logout', {}, 200);

    // ERROR CASES
    //console.log('\n📍 ERROR CASES\n');
    
    await this.testRoute('Error Cases', 'Invalid Email Format', 'POST', '/api/auth/register', {
      email: 'invalidemail',
      password: this.password,
      role: 'USER'
    }, 400);

    await this.testRoute('Error Cases', 'Weak Password', 'POST', '/api/auth/register', {
      email: 'newuser@test.com',
      password: '123',
      role: 'USER'
    }, 400);

    await this.testRoute('Error Cases', 'Invalid Role', 'POST', '/api/auth/register', {
      email: 'newuser@test.com',
      password: this.password,
      role: 'INVALID'
    }, 400);

    await this.testRoute('Error Cases', 'Wrong Password Login', 'POST', '/api/auth/login', {
      email: this.testEmails.user,
      password: 'WrongPassword123!'
    }, 401);

    await this.testRoute('Error Cases', 'Non-existent User', 'POST', '/api/auth/login', {
      email: 'nonexistent@test.com',
      password: this.password
    }, 401);

    await this.testRoute('Error Cases', '404 Route', 'GET', '/api/nonexistent', undefined, 404);
  }

  generateReport() {
    const timestamp = new Date().toISOString();
    const total = this.results.length;
    const passed = this.results.filter(r => r.status === 'PASS').length;
    const failed = this.results.filter(r => r.status === 'FAIL').length;
    const skipped = this.results.filter(r => r.status === 'SKIP').length;

    //console.log('\n' + '=' .repeat(150));
    //console.log('\n📊 TEST SUMMARY\n');
    //console.log(`Total Tests: ${total}`);
    //console.log(`✅ Passed:   ${passed}`);
    //console.log(`❌ Failed:   ${failed}`);
    //console.log(`⏭️ Skipped:  ${skipped}`);
    //console.log(`Success Rate: ${((passed / (total - skipped)) * 100).toFixed(2)}%\n`);

    let markdown = `# 📋 Dhanseva API Route Test Results\n\n`;
    markdown += `**Generated:** ${timestamp}\n`;
    markdown += `**Server:** ${this.baseURL}\n\n`;

    markdown += `## Summary\n\n`;
    markdown += `| Metric | Value |\n`;
    markdown += `|--------|-------|\n`;
    markdown += `| Total Tests | ${total} |\n`;
    markdown += `| ✅ Passed | ${passed} |\n`;
    markdown += `| ❌ Failed | ${failed} |\n`;
    markdown += `| ⏭️ Skipped | ${skipped} |\n`;
    markdown += `| Success Rate | ${((passed / (total - skipped)) * 100).toFixed(2)}% |\n\n`;

    // Group by phase
    const phases = ['Phase 1', 'Phase 2', 'Phase 3', 'Error Cases'];
    
    for (const phase of phases) {
      const phaseTests = this.results.filter(r => r.phase === phase);
      if (phaseTests.length === 0) continue;

      const phasePassed = phaseTests.filter(r => r.status === 'PASS').length;
      const phaseFailed = phaseTests.filter(r => r.status === 'FAIL').length;

      markdown += `## ${phase}\n\n`;
      markdown += `**Status:** ${phaseFailed === 0 ? '✅ All Passed' : `❌ ${phaseFailed} Failed`}\n\n`;
      markdown += `| # | Route | Method | Endpoint | Expected | Actual | Duration | Result |\n`;
      markdown += `|---|-------|--------|----------|----------|--------|----------|--------|\n`;

      phaseTests.forEach((test, idx) => {
        const statusEmoji = test.status === 'PASS' ? '✅' : test.status === 'FAIL' ? '❌' : '⏭️';
        const actual = test.statusCode || 'N/A';
        markdown += `| ${idx + 1} | ${test.routeName} | ${test.method} | ${test.endpoint} | ${test.expectedCode} | ${actual} | ${test.duration}ms | ${statusEmoji} |\n`;
      });

      markdown += `\n`;

      // Failed tests details
      const failedTests = phaseTests.filter(r => r.status === 'FAIL');
      if (failedTests.length > 0) {
        markdown += `### 🔴 Failed Tests\n\n`;
        failedTests.forEach((test) => {
          markdown += `#### ${test.routeName}\n`;
          markdown += `- **Endpoint:** ${test.method} ${test.endpoint}\n`;
          markdown += `- **Expected Status Code:** ${test.expectedCode}\n`;
          markdown += `- **Actual Status Code:** ${test.statusCode || 'Connection Failed'}\n`;
          markdown += `- **Error:** ${test.error || 'Unknown error'}\n`;
          if (test.response?.message) {
            markdown += `- **Server Response:** ${test.response.message}\n`;
          }
          markdown += `\n`;
        });
      }
    }

    // Detailed Results
    markdown += `## Detailed Test Results\n\n`;
    
    this.results.forEach((test, idx) => {
      markdown += `### Test ${idx + 1}: ${test.routeName}\n`;
      markdown += `- **Phase:** ${test.phase}\n`;
      markdown += `- **Method:** ${test.method}\n`;
      markdown += `- **Endpoint:** ${test.endpoint}\n`;
      markdown += `- **Expected Code:** ${test.expectedCode}\n`;
      markdown += `- **Actual Code:** ${test.statusCode || 'N/A'}\n`;
      markdown += `- **Status:** ${test.status === 'PASS' ? '✅ PASS' : test.status === 'FAIL' ? '❌ FAIL' : '⏭️ SKIP'}\n`;
      markdown += `- **Duration:** ${test.duration}ms\n`;
      
      if (test.error) {
        markdown += `- **Error:** ${test.error}\n`;
      }
      
      markdown += `\n---\n\n`;
    });

    // Faulty Routes Summary
    const faultyRoutes = this.results.filter(r => r.status === 'FAIL');
    if (faultyRoutes.length > 0) {
      markdown += `## 🚨 Faulty Routes Summary\n\n`;
      markdown += `The following routes have failed tests:\n\n`;

      const routeErrorMap: { [key: string]: string[] } = {};
      faultyRoutes.forEach(test => {
        const key = `\`${test.method} ${test.endpoint}\``;
        if (!routeErrorMap[key]) routeErrorMap[key] = [];
        routeErrorMap[key].push(`Expected: ${test.expectedCode}, Got: ${test.statusCode || 'N/A'} - ${test.error}`);
      });

      Object.entries(routeErrorMap).forEach(([route, errors]) => {
        markdown += `### ${route}\n`;
        markdown += '```\n';
        errors.forEach((err, idx) => {
          markdown += `Error ${idx + 1}: ${err}\n`;
        });
        markdown += '```\n\n';
      });
    }

    return markdown;
  }

  getResults() {
    return this.results;
  }
}

// Main execution
async function main() {
  const tester = new RouteTester('http://localhost:5000');
  
  try {
    await tester.runAllTests();
    const markdown = tester.generateReport();
    
    const reportPath = join(process.cwd(), 'TEST_RESULTS.md');
    writeFileSync(reportPath, markdown);
    //console.log(`\n📄 Full report saved to: TEST_RESULTS.md\n`);
    
  } catch (error) {
    //console.error('Test execution error:', error);
    process.exit(1);
  }
}

main();
