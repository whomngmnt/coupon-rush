import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

interface MyCouponsProps {
  token: string;
}

interface Claim {
  id: string;
  campaignId: string;
  campaign: {
    title: string;
    description: string;
  };
  createdAt: string;
}

export default function MyCoupons({ token }: MyCouponsProps) {
  const { data: claims, isLoading } = useQuery({
    queryKey: ['my-coupons'],
    queryFn: async () => {
      const response = await axios.get('/api/claims', {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    },
  });

  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '200px' }}>
        <div style={{ color: '#666', fontSize: '16px' }}>Loading your coupons...</div>
      </div>
    );
  }

  return (
    <div>
      <h2 style={{ fontSize: '32px', fontWeight: '700', marginBottom: '8px', color: '#1a1a1a' }}>
        My Coupons
      </h2>
      <p style={{ color: '#666', marginBottom: '32px', fontSize: '15px' }}>
        Your claimed coupons and rewards
      </p>
      
      {claims?.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 20px', background: 'white', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
          <h3 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '8px', color: '#1a1a1a' }}>No coupons yet</h3>
          <p style={{ color: '#666', marginBottom: '24px' }}>Start claiming coupons from available campaigns</p>
          <button 
            onClick={() => window.location.reload()}
            style={{
              padding: '12px 24px',
              background: '#6366f1',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '15px',
              fontWeight: '600'
            }}
          >
            Browse Campaigns
          </button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '24px' }}>
          {claims?.map((claim: Claim) => (
            <div 
              key={claim.id} 
              style={{ 
                background: 'white', 
                padding: '28px', 
                borderRadius: '16px', 
                boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                border: '2px solid #dbeafe',
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              <div style={{ 
                position: 'absolute',
                top: '-10px',
                right: '-10px',
                background: '#6366f1',
                color: 'white',
                padding: '20px 30px',
                transform: 'rotate(45deg)',
                fontSize: '12px',
                fontWeight: '600'
              }}>
                CLAIMED
              </div>
              
              <h3 style={{ fontSize: '22px', fontWeight: '700', marginBottom: '8px', color: '#1a1a1a' }}>
                {claim.campaign.title}
              </h3>
              
              <p style={{ color: '#666', marginBottom: '20px', fontSize: '15px', lineHeight: '1.5' }}>
                {claim.campaign.description}
              </p>
              
              <div style={{ 
                padding: '12px', 
                background: '#f3f4f6', 
                borderRadius: '8px',
                fontSize: '13px',
                color: '#666'
              }}>
                Claimed on {new Date(claim.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
