// Dashboard.tsx (or wherever you want to test)
import { useState } from 'react';
import { api } from '../utils/axios';
 // Your custom axios instance with interceptors

export const TestRefresh = () => {
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const callProtectedRoute = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await api.get('/protected');
      setResult(JSON.stringify(response.data, null, 2));
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to call protected route');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Dashboard</h1>
      <button 
        onClick={callProtectedRoute}
        disabled={loading}
        style={{ padding: '10px 20px', margin: '10px 0' }}
      >
        {loading ? 'Loading...' : 'Test Protected API'}
      </button>

      {result && (
        <pre style={{ background: '#f4f4f4', padding: '10px', borderRadius: '5px' }}>
          {result}
        </pre>
      )}

      {error && <p style={{ color: 'red' }}>Error: {error}</p>}

      <p>
        <strong>Instructions to test auto-refresh:</strong>
        <br />
        1. Log in first.<br />
        2. Wait 15+ minutes (or open DevTools → Application → Cookies → delete "accessToken").<br />
        3. Click the button again.<br />
        4. If it succeeds → auto-refresh works! (interceptor called /refresh automatically)
      </p>
    </div>
  );
};