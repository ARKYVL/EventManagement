const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

export const apiFetch = async (endpoint, options = {}) => {
  const token = localStorage.getItem('token');
  const fullUrl = `${BASE_URL}${endpoint}`;
  
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  // Safe request body logging
  let parsedBody = null;
  if (options.body) {
    try {
      parsedBody = JSON.parse(options.body);
    } catch {
      parsedBody = options.body;
    }
  }

  console.log(`[API REQUEST] ${options.method || 'GET'} -> ${fullUrl}`, { headers, body: parsedBody });

  let response;

  // 1. FAULT LOCATION: Network / Server Down / CORS
  try {
    response = await fetch(fullUrl, { ...options, headers });
  } catch (networkError) {
    console.error(`❌ [FAULT: NETWORK / SERVER CONNECTION] Request to ${fullUrl} failed.`, {
      reason: networkError.message,
      checkList: [
        'Is your backend Node/Express server running?',
        `Is the backend listening on ${BASE_URL}?`,
        'Is CORS middleware app.use(cors()) enabled in app.js?'
      ]
    });
    throw new Error('Network error: Unable to connect to backend server.');
  }

  // 2. FAULT LOCATION: HTTP Non-2xx Responses (Backend Errors)
  if (!response.ok) {
    let rawText = '';
    let errorDetails = null;

    // Safely extract HTML or JSON from error response
    try {
      rawText = await response.text();
      errorDetails = JSON.parse(rawText);
    } catch {
      errorDetails = rawText; // Fallback to raw string or HTML stack trace
    }

    const errorMessage = typeof errorDetails === 'object' && errorDetails?.error
      ? errorDetails.error
      : `HTTP ${response.status}: ${response.statusText}`;

    // Categorize specific HTTP faults
    if (response.status === 404) {
      console.error(`❌ [FAULT: MISSING BACKEND ROUTE (404)] Endpoint does not exist on Express server.`, {
        url: fullUrl,
        endpoint,
        responseBody: errorDetails,
        checkList: [
          `Did you register the route in app.js? (e.g. app.use('/api${endpoint.split('/')[1]}', ...))`,
          `Is the path inside your Express router matching "${endpoint}"?`
        ]
      });
    } else if (response.status === 401 || response.status === 403) {
      console.error(`❌ [FAULT: AUTHENTICATION / AUTHORIZATION (${response.status})]`, {
        url: fullUrl,
        responseBody: errorDetails,
        checkList: [
          'Is your JWT token saved in localStorage?',
          'Has the token expired or is process.env.JWT_SECRET mismatched?'
        ]
      });
    } else if (response.status >= 500) {
      console.error(`❌ [FAULT: BACKEND SERVER CRASH (${response.status})] Express threw an unhandled exception.`, {
        url: fullUrl,
        responseBody: errorDetails,
        checkList: [
          'Check your terminal running nodemon for the backend crash stack trace.',
          'Verify MySQL database connection in config/db.js.'
        ]
      });
    } else {
      console.error(`❌ [FAULT: CLIENT PAYLOAD / BAD REQUEST (${response.status})]`, {
        url: fullUrl,
        responseBody: errorDetails,
        sentBody: parsedBody,
        checkList: [
          'Check if req.body matches controller expectations.'
        ]
      });
    }

    throw new Error(errorMessage);
  }

  // 3. Handle Empty Responses (204 No Content)
  if (response.status === 204) {
    console.log(`[API SUCCESS 204] ${fullUrl} (No Content)`);
    return null;
  }

  // 4. FAULT LOCATION: Invalid JSON returned on Success (200 OK)
  try {
    const data = await response.json();
    console.log(`[API SUCCESS] ${options.method || 'GET'} -> ${fullUrl}`, data);
    return data;
  } catch (jsonError) {
    console.error(`❌ [FAULT: INVALID JSON RESPONSE] Server returned 200 OK but body is not valid JSON.`, {
      url: fullUrl,
      reason: jsonError.message,
      checkList: [
        'Ensure controller uses res.json(...) instead of res.send(...) or res.write(...).'
      ]
    });
    throw new Error('Received invalid JSON payload from server.');
  }
};