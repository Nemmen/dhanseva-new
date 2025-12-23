import axios, { AxiosInstance } from 'axios';

interface TestResult {
  phase: string;
  routeName: string;
  method: string;
  endpoint: string;
  status: 'PASS' | 'FAIL';
  statusCode?: number;
  error?: string;
  response?: any;
  duration: number;
}

class ApiTester {
  private client: AxiosInstance;
  private results: TestResult[] = [];
  private testEmails = {
    user: 'sujalsinha2001@gmail.com',
    dsa: 'sujalmilind300@gmail.com',
    employee: 'krsujalsinha2003@gmail.com',
  };
  private password = 'TestPassword123!';
  private cookies: { [key: string]: string } = {};

  constructor(baseURL: string = 'http://localhost:5000') {
    this.client = axios.create({
      baseURL,
      validateStatus: () => true, // Don't throw on any status
      withCredentials: true,
    });
  }

  private async recordTest(test: TestResult) {
    this.results.push(test);
    const status = test.status === 'PASS' ? '✅' : '❌';
    //console.log(`${status} [${test.phase}] ${test.method} ${test.endpoint} - ${test.statusCode || 'ERROR'} (${test.duration}ms)`);
    if (test.error) {
      //console.log(`   Error: ${test.error}`);
    }
  }

  async testPhaseUser() {
    //console.log('\n========== PHASE 1: USER REGISTRATION & AUTH ==========\n');

    // Test 1.1: User Registration
    const start1 = Date.now();
    try {
      const response = await this.client.post('/api/auth/register', {
        email: this.testEmails.user,
        password: this.password,
        role: 'USER',
      });
      await this.recordTest({
        phase: 'Phase 1',
        routeName: 'User Registration',
        method: 'POST',
        endpoint: '/api/auth/register',
        status: response.status === 201 ? 'PASS' : 'FAIL',
        statusCode: response.status,
        error: response.status !== 201 ? response.data?.message : undefined,
        response: response.data,
        duration: Date.now() - start1,
      });
    } catch (error: any) {
      await this.recordTest({
        phase: 'Phase 1',
        routeName: 'User Registration',
        method: 'POST',
        endpoint: '/api/auth/register',
        status: 'FAIL',
        error: error.message,
        duration: Date.now() - start1,
      });
    }

    // Test 1.2: Send OTP
    const start2 = Date.now();
    try {
      const response = await this.client.post('/api/otp/send', {
        email: this.testEmails.user,
      });
      await this.recordTest({
        phase: 'Phase 1',
        routeName: 'Send OTP',
        method: 'POST',
        endpoint: '/api/otp/send',
        status: response.status === 200 ? 'PASS' : 'FAIL',
        statusCode: response.status,
        error: response.status !== 200 ? response.data?.message : undefined,
        response: response.data,
        duration: Date.now() - start2,
      });
    } catch (error: any) {
      await this.recordTest({
        phase: 'Phase 1',
        routeName: 'Send OTP',
        method: 'POST',
        endpoint: '/api/otp/send',
        status: 'FAIL',
        error: error.message,
        duration: Date.now() - start2,
      });
    }

    // Test 1.3: User Login
    const start3 = Date.now();
    try {
      const response = await this.client.post('/api/auth/login', {
        email: this.testEmails.user,
        password: this.password,
      });
      await this.recordTest({
        phase: 'Phase 1',
        routeName: 'User Login',
        method: 'POST',
        endpoint: '/api/auth/login',
        status: response.status === 200 ? 'PASS' : 'FAIL',
        statusCode: response.status,
        error: response.status !== 200 ? response.data?.message : undefined,
        response: response.data,
        duration: Date.now() - start3,
      });

      // Store cookie for authenticated requests
      if (response.headers['set-cookie']) {
        const cookieString = response.headers['set-cookie'][0];
        this.cookies.user = cookieString;
      }
    } catch (error: any) {
      await this.recordTest({
        phase: 'Phase 1',
        routeName: 'User Login',
        method: 'POST',
        endpoint: '/api/auth/login',
        status: 'FAIL',
        error: error.message,
        duration: Date.now() - start3,
      });
    }

    // Test 1.4: Get Current User
    const start4 = Date.now();
    try {
      const response = await this.client.get('/api/auth/me', {
        headers: this.cookies.user ? { Cookie: this.cookies.user } : {},
      });
      await this.recordTest({
        phase: 'Phase 1',
        routeName: 'Get Current User',
        method: 'GET',
        endpoint: '/api/auth/me',
        status: response.status === 200 ? 'PASS' : 'FAIL',
        statusCode: response.status,
        error: response.status !== 200 ? response.data?.message : undefined,
        response: response.data,
        duration: Date.now() - start4,
      });
    } catch (error: any) {
      await this.recordTest({
        phase: 'Phase 1',
        routeName: 'Get Current User',
        method: 'GET',
        endpoint: '/api/auth/me',
        status: 'FAIL',
        error: error.message,
        duration: Date.now() - start4,
      });
    }

    // Test 1.5: Get All Services
    const start5 = Date.now();
    try {
      const response = await this.client.get('/api/services?page=1&limit=10');
      await this.recordTest({
        phase: 'Phase 1',
        routeName: 'Get All Services',
        method: 'GET',
        endpoint: '/api/services',
        status: response.status === 200 ? 'PASS' : 'FAIL',
        statusCode: response.status,
        error: response.status !== 200 ? response.data?.message : undefined,
        response: response.data,
        duration: Date.now() - start5,
      });
    } catch (error: any) {
      await this.recordTest({
        phase: 'Phase 1',
        routeName: 'Get All Services',
        method: 'GET',
        endpoint: '/api/services',
        status: 'FAIL',
        error: error.message,
        duration: Date.now() - start5,
      });
    }

    // Test 1.6: User Logout
    const start6 = Date.now();
    try {
      const response = await this.client.post('/api/auth/logout', {}, {
        headers: this.cookies.user ? { Cookie: this.cookies.user } : {},
      });
      await this.recordTest({
        phase: 'Phase 1',
        routeName: 'User Logout',
        method: 'POST',
        endpoint: '/api/auth/logout',
        status: response.status === 200 ? 'PASS' : 'FAIL',
        statusCode: response.status,
        error: response.status !== 200 ? response.data?.message : undefined,
        response: response.data,
        duration: Date.now() - start6,
      });
    } catch (error: any) {
      await this.recordTest({
        phase: 'Phase 1',
        routeName: 'User Logout',
        method: 'POST',
        endpoint: '/api/auth/logout',
        status: 'FAIL',
        error: error.message,
        duration: Date.now() - start6,
      });
    }
  }

  async testPhaseDsa() {
    //console.log('\n========== PHASE 2: DSA REGISTRATION & AUTH ==========\n');

    // Test 2.1: DSA Registration
    const start1 = Date.now();
    try {
      const response = await this.client.post('/api/auth/register', {
        email: this.testEmails.dsa,
        password: this.password,
        role: 'DSA',
      });
      await this.recordTest({
        phase: 'Phase 2',
        routeName: 'DSA Registration',
        method: 'POST',
        endpoint: '/api/auth/register',
        status: response.status === 201 ? 'PASS' : 'FAIL',
        statusCode: response.status,
        error: response.status !== 201 ? response.data?.message : undefined,
        response: response.data,
        duration: Date.now() - start1,
      });
    } catch (error: any) {
      await this.recordTest({
        phase: 'Phase 2',
        routeName: 'DSA Registration',
        method: 'POST',
        endpoint: '/api/auth/register',
        status: 'FAIL',
        error: error.message,
        duration: Date.now() - start1,
      });
    }

    // Test 2.2: DSA Login
    const start2 = Date.now();
    try {
      const response = await this.client.post('/api/auth/login', {
        email: this.testEmails.dsa,
        password: this.password,
      });
      await this.recordTest({
        phase: 'Phase 2',
        routeName: 'DSA Login',
        method: 'POST',
        endpoint: '/api/auth/login',
        status: response.status === 200 ? 'PASS' : 'FAIL',
        statusCode: response.status,
        error: response.status !== 200 ? response.data?.message : undefined,
        response: response.data,
        duration: Date.now() - start2,
      });

      if (response.headers['set-cookie']) {
        const cookieString = response.headers['set-cookie'][0];
        this.cookies.dsa = cookieString;
      }
    } catch (error: any) {
      await this.recordTest({
        phase: 'Phase 2',
        routeName: 'DSA Login',
        method: 'POST',
        endpoint: '/api/auth/login',
        status: 'FAIL',
        error: error.message,
        duration: Date.now() - start2,
      });
    }

    // Test 2.3: DSA Logout
    const start3 = Date.now();
    try {
      const response = await this.client.post('/api/auth/logout', {}, {
        headers: this.cookies.dsa ? { Cookie: this.cookies.dsa } : {},
      });
      await this.recordTest({
        phase: 'Phase 2',
        routeName: 'DSA Logout',
        method: 'POST',
        endpoint: '/api/auth/logout',
        status: response.status === 200 ? 'PASS' : 'FAIL',
        statusCode: response.status,
        error: response.status !== 200 ? response.data?.message : undefined,
        response: response.data,
        duration: Date.now() - start3,
      });
    } catch (error: any) {
      await this.recordTest({
        phase: 'Phase 2',
        routeName: 'DSA Logout',
        method: 'POST',
        endpoint: '/api/auth/logout',
        status: 'FAIL',
        error: error.message,
        duration: Date.now() - start3,
      });
    }
  }

  async testPhaseEmployee() {
    //console.log('\n========== PHASE 3: EMPLOYEE REGISTRATION & AUTH ==========\n');

    // Test 3.1: Employee Registration
    const start1 = Date.now();
    try {
      const response = await this.client.post('/api/auth/register', {
        email: this.testEmails.employee,
        password: this.password,
        role: 'EMPLOYEE',
      });
      await this.recordTest({
        phase: 'Phase 3',
        routeName: 'Employee Registration',
        method: 'POST',
        endpoint: '/api/auth/register',
        status: response.status === 201 ? 'PASS' : 'FAIL',
        statusCode: response.status,
        error: response.status !== 201 ? response.data?.message : undefined,
        response: response.data,
        duration: Date.now() - start1,
      });
    } catch (error: any) {
      await this.recordTest({
        phase: 'Phase 3',
        routeName: 'Employee Registration',
        method: 'POST',
        endpoint: '/api/auth/register',
        status: 'FAIL',
        error: error.message,
        duration: Date.now() - start1,
      });
    }

    // Test 3.2: Employee Login
    const start2 = Date.now();
    try {
      const response = await this.client.post('/api/auth/login', {
        email: this.testEmails.employee,
        password: this.password,
      });
      await this.recordTest({
        phase: 'Phase 3',
        routeName: 'Employee Login',
        method: 'POST',
        endpoint: '/api/auth/login',
        status: response.status === 200 ? 'PASS' : 'FAIL',
        statusCode: response.status,
        error: response.status !== 200 ? response.data?.message : undefined,
        response: response.data,
        duration: Date.now() - start2,
      });

      if (response.headers['set-cookie']) {
        const cookieString = response.headers['set-cookie'][0];
        this.cookies.employee = cookieString;
      }
    } catch (error: any) {
      await this.recordTest({
        phase: 'Phase 3',
        routeName: 'Employee Login',
        method: 'POST',
        endpoint: '/api/auth/login',
        status: 'FAIL',
        error: error.message,
        duration: Date.now() - start2,
      });
    }

    // Test 3.3: Employee Logout
    const start3 = Date.now();
    try {
      const response = await this.client.post('/api/auth/logout', {}, {
        headers: this.cookies.employee ? { Cookie: this.cookies.employee } : {},
      });
      await this.recordTest({
        phase: 'Phase 3',
        routeName: 'Employee Logout',
        method: 'POST',
        endpoint: '/api/auth/logout',
        status: response.status === 200 ? 'PASS' : 'FAIL',
        statusCode: response.status,
        error: response.status !== 200 ? response.data?.message : undefined,
        response: response.data,
        duration: Date.now() - start3,
      });
    } catch (error: any) {
      await this.recordTest({
        phase: 'Phase 3',
        routeName: 'Employee Logout',
        method: 'POST',
        endpoint: '/api/auth/logout',
        status: 'FAIL',
        error: error.message,
        duration: Date.now() - start3,
      });
    }
  }

  getResults() {
    return this.results;
  }

  async runAllTests() {
    try {
      await this.testPhaseUser();
      await this.testPhaseDsa();
      await this.testPhaseEmployee();
    } catch (error) {
      //console.error('Test suite error:', error);
    }
  }
}

export default ApiTester;
