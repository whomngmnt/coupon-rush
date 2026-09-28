import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import AuthForm from './components/AuthForm';
import CampaignList from './components/CampaignList';
import MyCoupons from './components/MyCoupons';
import CreateCampaign from './components/CreateCampaign';
import { useState } from 'react';

const queryClient = new QueryClient();

type Tab = 'campaigns' | 'my-coupons' | 'create';

function App() {
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [activeTab, setActiveTab] = useState<Tab>('campaigns');

  const handleLogin = (accessToken: string) => {
    setToken(accessToken);
    localStorage.setItem('token', accessToken);
  };

  const handleLogout = () => {
    setToken(null);
    localStorage.removeItem('token');
    setActiveTab('campaigns');
  };

  return (
    <QueryClientProvider client={queryClient}>
      <div style={{ minHeight: '100vh', background: '#f8fafc' }}>
        <header style={{ 
          background: 'white', 
          borderBottom: '1px solid #e5e7eb', 
          padding: '20px 40px',
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
          position: 'sticky',
          top: 0,
          zIndex: 100
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <h1 style={{ fontSize: '24px', fontWeight: '700', color: '#1a1a1a', margin: 0 }}>
              CouponRush
            </h1>
          </div>
          {token && (
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <button 
                onClick={() => setActiveTab('campaigns')}
                style={{
                  padding: '10px 20px',
                  background: activeTab === 'campaigns' ? '#6366f1' : '#f3f4f6',
                  color: activeTab === 'campaigns' ? 'white' : '#374151',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '600',
                  transition: 'background 0.2s'
                }}
              >
                Campaigns
              </button>
              <button 
                onClick={() => setActiveTab('my-coupons')}
                style={{
                  padding: '10px 20px',
                  background: activeTab === 'my-coupons' ? '#6366f1' : '#f3f4f6',
                  color: activeTab === 'my-coupons' ? 'white' : '#374151',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '600',
                  transition: 'background 0.2s'
                }}
              >
                My Coupons
              </button>
              <button 
                onClick={() => setActiveTab('create')}
                style={{
                  padding: '10px 20px',
                  background: activeTab === 'create' ? '#6366f1' : '#f3f4f6',
                  color: activeTab === 'create' ? 'white' : '#374151',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '600',
                  transition: 'background 0.2s'
                }}
              >
                Create Campaign
              </button>
              <button 
                onClick={handleLogout}
                style={{
                  padding: '10px 20px',
                  background: '#fee2e2',
                  color: '#dc2626',
                  border: '1px solid #fecaca',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '600',
                  transition: 'background 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = '#fecaca'}
                onMouseLeave={(e) => e.currentTarget.style.background = '#fee2e2'}
              >
                Logout
              </button>
            </div>
          )}
        </header>
        <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px' }}>
          {token ? (
            <>
              {activeTab === 'campaigns' && <CampaignList token={token} />}
              {activeTab === 'my-coupons' && <MyCoupons token={token} />}
              {activeTab === 'create' && <CreateCampaign token={token} />}
            </>
          ) : (
            <AuthForm onLogin={handleLogin} />
          )}
        </main>
      </div>
    </QueryClientProvider>
  );
}

export default App;
