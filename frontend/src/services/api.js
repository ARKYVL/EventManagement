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

  try {
    // Debug: Log outgoing request details
    console.log(`[API REQUEST] ${options.method || 'GET'} -> ${fullUrl}`, {
      headers,
      body: options.body ? JSON.parse(options.body) : null,
    });

    const response = await fetch(fullUrl, {
      ...options,
      headers,
    });

    // Handle non-2xx HTTP responses
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMessage = errorData.error || `HTTP ${response.status}: ${response.statusText}`;

      console.error(`[API ERROR RESPONSE] ${options.method || 'GET'} -> ${fullUrl}`, {
        status: response.status,
        statusText: response.statusText,
        errorData,
      });

      throw new Error(errorMessage);
    }

    // Handle empty responses (204 No Content)
    if (response.status === 204) {
      console.log(`[API SUCCESS 204] ${fullUrl} (No Content)`);
      return null;
    }

    const data = await response.json();

    // Debug: Log successful response payload
    console.log(`[API SUCCESS] ${options.method || 'GET'} -> ${fullUrl}`, data);
    return data;

  } catch (error) {
    // Debug: Catch network issues (e.g. server down, CORS errors) or thrown HTTP errors
    console.error(`[API CATCH ERROR] Failed request to ${fullUrl}:`, error.message);
    
    // Re-throw so page components can catch it and update UI state
    throw error;
  }
};