import { useState } from 'react';
import axios from 'axios';

interface AuthFormProps {
  onLogin: (token: string) => void;
}

export default function AuthForm({ onLogin }: AuthFormProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const endpoint = isLogin ? '/auth/login' : '/auth/register';
      const response = await axios.post(`/api${endpoint}`, { email, password });

      onLogin(response.data.accessToken);
      setEmail('');
      setPassword('');
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.error || 'Authentication failed');
      } else {
        setError('Authentication failed');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setError('');
    setEmail('');
    setPassword('');
  };

  return (
    <div style={{ maxWidth: '420px', margin: '60px auto', padding: '40px', background: 'white', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
      <h2 style={{ fontSize: '28px', fontWeight: '600', marginBottom: '8px', color: '#1a1a1a' }}>
        {isLogin ? 'Welcome back' : 'Create account'}
      </h2>
      <p style={{ color: '#666', marginBottom: '32px', fontSize: '14px' }}>
        {isLogin ? 'Enter your credentials to access your account' : 'Sign up to start claiming coupons'}
      </p>
      
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div>
          <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500', color: '#333' }}>Email</label>
          <input
            type="email"
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={isLoading}
            style={{ 
              width: '100%', 
              padding: '12px 16px', 
              borderRadius: '8px', 
              border: '1px solid #e0e0e0', 
              fontSize: '15px',
              transition: 'border-color 0.2s',
              outline: 'none'
            }}
            onFocus={(e) => e.target.style.borderColor = '#6366f1'}
            onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
          />
        </div>
        
        <div>
          <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500', color: '#333' }}>Password</label>
          <input
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={isLoading}
            style={{ 
              width: '100%', 
              padding: '12px 16px', 
              borderRadius: '8px', 
              border: '1px solid #e0e0e0', 
              fontSize: '15px',
              transition: 'border-color 0.2s',
              outline: 'none'
            }}
            onFocus={(e) => e.target.style.borderColor = '#6366f1'}
            onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
          />
        </div>
        
        {error && (
          <div style={{ padding: '12px', background: '#fee2e2', border: '1px solid #fecaca', borderRadius: '8px', color: '#dc2626', fontSize: '14px' }}>
            {error}
          </div>
        )}
        
        <button 
          type="submit" 
          disabled={isLoading}
          style={{ 
            padding: '14px', 
            background: isLoading ? '#a5a6f6' : '#6366f1', 
            color: 'white', 
            border: 'none', 
            borderRadius: '8px', 
            cursor: isLoading ? 'not-allowed' : 'pointer',
            fontSize: '16px',
            fontWeight: '600',
            transition: 'background 0.2s'
          }}
        >
          {isLoading ? 'Processing...' : (isLogin ? 'Sign in' : 'Create account')}
        </button>
      </form>
      
      <p style={{ marginTop: '24px', textAlign: 'center', fontSize: '14px', color: '#666' }}>
        {isLogin ? "Don't have an account? " : 'Already have an account? '}
        <button 
          onClick={toggleMode} 
          disabled={isLoading}
          style={{ 
            background: 'none', 
            border: 'none', 
            color: '#6366f1', 
            cursor: isLoading ? 'not-allowed' : 'pointer', 
            fontWeight: '600',
            fontSize: '14px',
            padding: '0 4px'
          }}
        >
          {isLogin ? 'Sign up' : 'Sign in'}
        </button>
      </p>
    </div>
  );
}
