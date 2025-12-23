# API Test Results

**Generated:** 2025-12-21T17:53:43.260Z

**Base URL:** http://localhost:5000/api

## Summary

- **Total Tests:** 18
- **Passed:** ✅ 2 (11.1%)
- **Failed:** ❌ 16 (88.9%)

## PHASE 1

| Endpoint | Method | Status | Code | Response Time | Error |
|----------|--------|--------|------|---------------|-------|
| /auth/register | POST | ❌ FAIL | 429 | N/A | {"success":false,"message":"Too many authentication attempts, please try again after 15 minutes.","retryAfter":"829"} |
| /auth/register | POST | ❌ FAIL | 429 | N/A | Request failed with status code 429 |
| /otp/send | POST | ❌ FAIL | 400 | N/A | Request failed with status code 400 |
| /otp/verify | POST | ❌ FAIL | 400 | N/A | Request failed with status code 400 |
| /auth/login | POST | ❌ FAIL | 429 | N/A | Request failed with status code 429 |
| /auth/me | GET | ❌ FAIL | 401 | N/A | Request failed with status code 401 |

## PHASE 2

| Endpoint | Method | Status | Code | Response Time | Error |
|----------|--------|--------|------|---------------|-------|
| /services | GET | ✅ PASS | 200 | 20ms | - |
| /services/category/:category | GET | ❌ FAIL | 500 | N/A | Request failed with status code 500 |
| /requests | POST | ❌ FAIL | 401 | N/A | [object Object] |
| /requests/my-requests | GET | ❌ FAIL | 401 | N/A | Request failed with status code 401 |

## PHASE 4

| Endpoint | Method | Status | Code | Response Time | Error |
|----------|--------|--------|------|---------------|-------|
| /auth/register (DSA) | POST | ❌ FAIL | 429 | N/A | Request failed with status code 429 |
| /auth/login (DSA) | POST | ❌ FAIL | 429 | N/A | Request failed with status code 429 |
| /dsa/register | POST | ❌ FAIL | 429 | N/A | [object Object] |
| /dsa/requests | GET | ❌ FAIL | 401 | N/A | Request failed with status code 401 |
| /dsa/export | GET | ❌ FAIL | 401 | N/A | Request failed with status code 401 |

## PHASE 5

| Endpoint | Method | Status | Code | Response Time | Error |
|----------|--------|--------|------|---------------|-------|
| /employee/requests | GET | ❌ FAIL | 401 | N/A | Expected - Employee role required |
| /employee/invite-dsa | POST | ❌ FAIL | 401 | N/A | Expected - Employee role required |
| /auth/logout | POST | ✅ PASS | 200 | 4ms | - |

## Failed Tests Details

### 1. POST /auth/register

- **Phase:** PHASE 1
- **Status Code:** 429
- **Error Message:** {"success":false,"message":"Too many authentication attempts, please try again after 15 minutes.","retryAfter":"829"}

**Recommended Fix:**
- Check endpoint implementation
- Verify request payload and authentication
- Review server logs for detailed error

### 2. POST /auth/register

- **Phase:** PHASE 1
- **Status Code:** 429
- **Error Message:** Request failed with status code 429

**Recommended Fix:**
- Check endpoint implementation
- Verify request payload and authentication
- Review server logs for detailed error

### 3. POST /otp/send

- **Phase:** PHASE 1
- **Status Code:** 400
- **Error Message:** Request failed with status code 400

**Recommended Fix:**
- Check endpoint implementation
- Verify request payload and authentication
- Review server logs for detailed error

### 4. POST /otp/verify

- **Phase:** PHASE 1
- **Status Code:** 400
- **Error Message:** Request failed with status code 400

**Recommended Fix:**
- Check endpoint implementation
- Verify request payload and authentication
- Review server logs for detailed error

### 5. POST /auth/login

- **Phase:** PHASE 1
- **Status Code:** 429
- **Error Message:** Request failed with status code 429

**Recommended Fix:**
- Check endpoint implementation
- Verify request payload and authentication
- Review server logs for detailed error

### 6. GET /auth/me

- **Phase:** PHASE 1
- **Status Code:** 401
- **Error Message:** Request failed with status code 401

**Recommended Fix:**
- Check endpoint implementation
- Verify request payload and authentication
- Review server logs for detailed error

### 7. GET /services/category/:category

- **Phase:** PHASE 2
- **Status Code:** 500
- **Error Message:** Request failed with status code 500

**Recommended Fix:**
- Check endpoint implementation
- Verify request payload and authentication
- Review server logs for detailed error

### 8. POST /requests

- **Phase:** PHASE 2
- **Status Code:** 401
- **Error Message:** [object Object]

**Recommended Fix:**
- Check endpoint implementation
- Verify request payload and authentication
- Review server logs for detailed error

### 9. GET /requests/my-requests

- **Phase:** PHASE 2
- **Status Code:** 401
- **Error Message:** Request failed with status code 401

**Recommended Fix:**
- Check endpoint implementation
- Verify request payload and authentication
- Review server logs for detailed error

### 10. POST /auth/register (DSA)

- **Phase:** PHASE 4
- **Status Code:** 429
- **Error Message:** Request failed with status code 429

**Recommended Fix:**
- Check endpoint implementation
- Verify request payload and authentication
- Review server logs for detailed error

### 11. POST /auth/login (DSA)

- **Phase:** PHASE 4
- **Status Code:** 429
- **Error Message:** Request failed with status code 429

**Recommended Fix:**
- Check endpoint implementation
- Verify request payload and authentication
- Review server logs for detailed error

### 12. POST /dsa/register

- **Phase:** PHASE 4
- **Status Code:** 429
- **Error Message:** [object Object]

**Recommended Fix:**
- Check endpoint implementation
- Verify request payload and authentication
- Review server logs for detailed error

### 13. GET /dsa/requests

- **Phase:** PHASE 4
- **Status Code:** 401
- **Error Message:** Request failed with status code 401

**Recommended Fix:**
- Check endpoint implementation
- Verify request payload and authentication
- Review server logs for detailed error

### 14. GET /dsa/export

- **Phase:** PHASE 4
- **Status Code:** 401
- **Error Message:** Request failed with status code 401

**Recommended Fix:**
- Check endpoint implementation
- Verify request payload and authentication
- Review server logs for detailed error

### 15. GET /employee/requests

- **Phase:** PHASE 5
- **Status Code:** 401
- **Error Message:** Expected - Employee role required

**Recommended Fix:**
- Check endpoint implementation
- Verify request payload and authentication
- Review server logs for detailed error

### 16. POST /employee/invite-dsa

- **Phase:** PHASE 5
- **Status Code:** 401
- **Error Message:** Expected - Employee role required

**Recommended Fix:**
- Check endpoint implementation
- Verify request payload and authentication
- Review server logs for detailed error

