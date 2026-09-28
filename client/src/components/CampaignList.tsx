import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

interface Campaign {
  id: string;
  title: string;
  description: string;
  totalCoupons: number;
  issuedCount: number;
  startsAt: string;
  expiresAt: string | null;
}

interface CampaignListProps {
  token: string;
}

export default function CampaignList({ token }: CampaignListProps) {
  const queryClient = useQueryClient();

  const { data: campaigns, isLoading } = useQuery({
    queryKey: ['campaigns'],
    queryFn: async () => {
      const response = await axios.get('/api/campaigns');
      return response.data;
    },
  });

  const { data: myClaims } = useQuery({
    queryKey: ['my-coupons'],
    queryFn: async () => {
      const response = await axios.get('/api/claims', {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    },
  });

  const claimMutation = useMutation({
    mutationFn: async (campaignId: string) => {
      const response = await axios.post(
        '/api/claims',
        { campaignId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['campaigns'] });
      queryClient.invalidateQueries({ queryKey: ['my-coupons'] });
    },
  });

  const handleClaim = (campaignId: string) => {
    claimMutation.mutate(campaignId);
  };

  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '200px' }}>
        <div style={{ color: '#666', fontSize: '16px' }}>Loading campaigns...</div>
      </div>
    );
  }

  return (
    <div>
      <h2 style={{ fontSize: '32px', fontWeight: '700', marginBottom: '8px', color: '#1a1a1a' }}>
        Available Campaigns
      </h2>
      <p style={{ color: '#666', marginBottom: '32px', fontSize: '15px' }}>
        Claim your exclusive coupons before they run out
      </p>
      
      {campaigns?.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 20px', background: 'white', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
          <h3 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '8px', color: '#1a1a1a' }}>No campaigns available</h3>
          <p style={{ color: '#666' }}>Check back later for new promotions</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '24px' }}>
          {campaigns?.map((campaign: Campaign) => {
            const available = Math.max(0, campaign.totalCoupons - campaign.issuedCount);
            const percentage = Math.min(100, (campaign.issuedCount / campaign.totalCoupons) * 100);
            const isSoldOut = available === 0;
            const hasClaimed = myClaims?.some((claim: any) => claim.campaignId === campaign.id);

            return (
              <div 
                key={campaign.id} 
                style={{ 
                  background: 'white', 
                  padding: '28px', 
                  borderRadius: '16px', 
                  boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                  border: isSoldOut ? '2px solid #e5e7eb' : hasClaimed ? '2px solid #10b981' : '2px solid transparent',
                  transition: 'transform 0.2s, box-shadow 0.2s'
                }}
                onMouseEnter={(e) => {
                  if (!isSoldOut && !hasClaimed) {
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.boxShadow = '0 8px 30px rgba(0,0,0,0.12)';
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.08)';
                }}
              >
                <div style={{ marginBottom: '16px' }}>
                  <span style={{ 
                    display: 'inline-block', 
                    padding: '6px 12px', 
                    background: isSoldOut ? '#f3f4f6' : hasClaimed ? '#d1fae5' : '#dbeafe', 
                    color: isSoldOut ? '#6b7280' : hasClaimed ? '#047857' : '#1e40af', 
                    borderRadius: '20px', 
                    fontSize: '12px', 
                    fontWeight: '600',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}>
                    {isSoldOut ? 'Sold Out' : hasClaimed ? 'Claimed' : 'Available'}
                  </span>
                </div>
                
                <h3 style={{ fontSize: '22px', fontWeight: '700', marginBottom: '8px', color: '#1a1a1a' }}>
                  {campaign.title}
                </h3>
                
                <p style={{ color: '#666', marginBottom: '20px', fontSize: '15px', lineHeight: '1.5' }}>
                  {campaign.description}
                </p>
                
                <div style={{ marginBottom: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '14px' }}>
                    <span style={{ color: '#666' }}>Progress</span>
                    <span style={{ fontWeight: '600', color: '#1a1a1a' }}>
                      {available} / {campaign.totalCoupons} left
                    </span>
                  </div>
                  <div style={{ 
                    height: '8px', 
                    background: '#e5e7eb', 
                    borderRadius: '4px', 
                    overflow: 'hidden' 
                  }}>
                    <div 
                      style={{ 
                        height: '100%', 
                        background: isSoldOut ? '#9ca3af' : hasClaimed ? '#10b981' : '#6366f1', 
                        width: `${percentage}%`,
                        transition: 'width 0.3s ease'
                      }} 
                    />
                  </div>
                </div>
                
                <button
                  onClick={() => handleClaim(campaign.id)}
                  disabled={isSoldOut || hasClaimed || claimMutation.isPending}
                  style={{
                    width: '100%',
                    padding: '14px',
                    background: isSoldOut ? '#d1d5db' : hasClaimed ? '#10b981' : '#6366f1',
                    color: 'white',
                    border: 'none',
                    borderRadius: '10px',
                    cursor: (isSoldOut || hasClaimed || claimMutation.isPending) ? 'not-allowed' : 'pointer',
                    fontSize: '16px',
                    fontWeight: '600',
                    transition: 'background 0.2s'
                  }}
                >
                  {claimMutation.isPending ? 'Claiming...' : (isSoldOut ? 'Sold Out' : hasClaimed ? 'Already Claimed' : 'Claim Coupon')}
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
