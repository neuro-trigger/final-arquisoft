import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate, Trend, Counter } from 'k6/metrics';

// Custom metrics for detailed analysis
export let errorRate = new Rate('errors');
export let responseTime = new Trend('response_time');
export let throughput = new Counter('requests_total');

// Test configuration for knee graph generation
export let options = {
  stages: [
    // Ramp-up phase: 1 to 50 users over 2 minutes
    { duration: '2m', target: 50 },
    // Steady state: 50 users for 2 minutes
    { duration: '2m', target: 50 },
    // Scale up: 50 to 200 users over 3 minutes
    { duration: '3m', target: 200 },
    // Steady state: 200 users for 3 minutes
    { duration: '3m', target: 200 },
    // Scale up: 200 to 500 users over 4 minutes
    { duration: '4m', target: 500 },
    // Steady state: 500 users for 3 minutes
    { duration: '3m', target: 500 },
    // Scale up: 500 to 1000 users over 5 minutes
    { duration: '5m', target: 1000 },
    // Steady state: 1000 users for 3 minutes
    { duration: '3m', target: 1000 },
    // Scale up: 1000 to 1500 users over 5 minutes
    { duration: '5m', target: 1500 },
    // Steady state: 1500 users for 3 minutes
    { duration: '3m', target: 1500 },
    // Final scale up: 1500 to 2000 users over 5 minutes
    { duration: '5m', target: 2000 },
    // Peak load: 2000 users for 5 minutes
    { duration: '5m', target: 2000 },
    // Ramp-down: 2000 to 0 users over 3 minutes
    { duration: '3m', target: 0 },
  ],
  thresholds: {
    http_req_duration: ['p(95)<5000'], // 95% of requests must complete below 5s
    http_req_failed: ['rate<0.1'],     // Error rate must be below 10%
  },
};

// Test configuration
const BASE_URL = 'https://34-49-196-23.nip.io';
const API_URL = `${BASE_URL}/api`;

// Test data for realistic scenarios
const testUsers = [
  { email: 'testuser1@example.com', password: 'TestPassword123!' },
  { email: 'testuser2@example.com', password: 'TestPassword123!' },
  { email: 'testuser3@example.com', password: 'TestPassword123!' },
  { email: 'testuser4@example.com', password: 'TestPassword123!' },
  { email: 'testuser5@example.com', password: 'TestPassword123!' },
];

// Helper function to get random test user
function getRandomUser() {
  return testUsers[Math.floor(Math.random() * testUsers.length)];
}

// Helper function to make authenticated request
function makeAuthenticatedRequest(url, method = 'GET', payload = null, cookies = {}) {
  const params = {
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    cookies: cookies,
  };

  let response;
  const startTime = Date.now();
  
  if (method === 'POST' && payload) {
    response = http.post(url, JSON.stringify(payload), params);
  } else if (method === 'PUT' && payload) {
    response = http.put(url, JSON.stringify(payload), params);
  } else if (method === 'DELETE') {
    response = http.del(url, null, params);
  } else {
    response = http.get(url, params);
  }
  
  const endTime = Date.now();
  const duration = endTime - startTime;
  
  // Record metrics
  responseTime.add(duration);
  throughput.add(1);
  errorRate.add(response.status >= 400);
  
  return response;
}

// Main test function - simulates realistic user journey
export default function() {
  const user = getRandomUser();
  let cookies = {};
  
  // Test 1: Load homepage (public endpoint)
  let response = makeAuthenticatedRequest(BASE_URL);
  check(response, {
    'Homepage loads successfully': (r) => r.status === 200,
    'Homepage response time < 2s': (r) => r.timings.duration < 2000,
  });
  
  sleep(Math.random() * 2 + 1); // Random sleep 1-3 seconds
  
  // Test 2: Get country codes (public API endpoint)
  response = makeAuthenticatedRequest(`${API_URL}/country-codes`);
  check(response, {
    'Country codes API responds': (r) => r.status === 200,
    'Country codes response time < 1s': (r) => r.timings.duration < 1000,
  });
  
  sleep(Math.random() * 1 + 0.5); // Random sleep 0.5-1.5 seconds
  
  // Test 3: User login (authentication endpoint)
  const loginPayload = {
    email: user.email,
    password: user.password
  };
  
  response = http.post(`${API_URL}/login`, JSON.stringify(loginPayload), {
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
  });
  
  const loginSuccess = check(response, {
    'Login API responds': (r) => r.status === 200 || r.status === 404, // 404 is expected for non-existent test users
    'Login response time < 3s': (r) => r.timings.duration < 3000,
  });
  
  // Extract cookies from login response for subsequent requests
  if (response.cookies && response.cookies.accessToken) {
    cookies.accessToken = response.cookies.accessToken[0].value;
  }
  
  sleep(Math.random() * 1 + 0.5);
  
  // Test 4: Create user (if login failed, try to create user)
  if (response.status === 404) {
    const createUserPayload = {
      email: user.email,
      password: user.password,
      username: `testuser_${Math.floor(Math.random() * 10000)}`,
      phone: `+1555${Math.floor(Math.random() * 1000000).toString().padStart(7, '0')}`,
      first_name: 'Test',
      last_name: 'User',
      birthdate: '1990-01-01T00:00:00Z',
      code_id: 'eaa26500-4572-4ca8-8f32-03b0daaf02ce' // Assuming country code ID 1 exists
    };
    
    response = http.post(`${API_URL}/users`, JSON.stringify(createUserPayload), {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });
    
    check(response, {
      'User creation responds': (r) => r.status === 201 || r.status === 409, // 409 for already exists
      'User creation response time < 5s': (r) => r.timings.duration < 5000,
    });
    
    sleep(Math.random() * 1 + 0.5);
  }
  
  // Test 5: Get user profile (authenticated endpoint - may fail if not logged in)
  if (cookies.accessToken) {
    const userId = 'test-user-id'; // In real scenario, this would come from login response
    response = makeAuthenticatedRequest(`${API_URL}/users/${userId}`, 'GET', null, cookies);
    
    check(response, {
      'User profile request completed': (r) => r.status >= 200 && r.status < 500,
      'User profile response time < 2s': (r) => r.timings.duration < 2000,
    });
    
    sleep(Math.random() * 1 + 0.5);
  }
  
  // Test 6: Stress test - Multiple rapid requests to test scaling
  for (let i = 0; i < 3; i++) {
    response = makeAuthenticatedRequest(`${API_URL}/country-codes`);
    check(response, {
      [`Rapid request ${i+1} succeeds`]: (r) => r.status === 200,
    });
    sleep(0.1); // Very short sleep to create burst traffic
  }
  
  // Test 7: Frontend static resources (simulating browser behavior)
  response = makeAuthenticatedRequest(`${BASE_URL}/favicon.ico`);
  check(response, {
    'Static resource loads': (r) => r.status === 200 || r.status === 204 || r.status === 404,
  });
  
  // Random sleep between user sessions
  sleep(Math.random() * 3 + 1); // 1-4 seconds
}

// Setup function - runs once before the test
export function setup() {
  console.log('🚀 Starting Nova Performance Test');
  console.log(`📊 Testing from 1 to 2000 concurrent users`);
  console.log(`🎯 Target URL: ${BASE_URL}`);
  console.log(`⏱️  Total test duration: ~50 minutes`);
  console.log('📈 Monitoring HPA scaling behavior...');
  
  // Verify the system is accessible before starting
  const healthCheck = http.get(BASE_URL);
  if (healthCheck.status !== 200) {
    throw new Error(`System health check failed: ${healthCheck.status}`);
  }
  
  console.log('✅ System health check passed - starting load test');
  return { startTime: Date.now() };
}

// Teardown function - runs once after the test
export function teardown(data) {
  const duration = (Date.now() - data.startTime) / 1000 / 60; // Convert to minutes
  console.log(`🏁 Performance test completed in ${duration.toFixed(1)} minutes`);
  console.log('📊 Check the results for knee graph data');
  console.log('🔍 Monitor HPA scaling with: kubectl get hpa -n nova');
} 