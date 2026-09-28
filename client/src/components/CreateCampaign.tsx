import { useState } from 'react';
import axios from 'axios';
import { useQueryClient } from '@tanstack/react-query';

interface CreateCampaignProps {
  token: string;
}

export default function CreateCampaign({ token }: CreateCampaignProps) {
  const queryClient = useQueryClient();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [totalCoupons, setTotalCoupons] = useState('');
  const [startsAt, setStartsAt] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await axios.post(
        '/api/campaigns',
        {
          title,
          description,
          totalCoupons: parseInt(totalCoupons),
          startsAt: startsAt || new Date().toISOString(),
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setTitle('');
      setDescription('');
      setTotalCoupons('');
      setStartsAt('');
      queryClient.invalidateQueries({ queryKey: ['campaigns'] });
      alert('Campaign created successfully!');
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.error || 'Failed to create campaign');
      } else {
        setError('Failed to create campaign');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h2 style={{ fontSize: '32px', fontWeight: '700', marginBottom: '8px', color: '#1a1a1a' }}>
        Create Campaign
      </h2>
      <p style={{ color: '#666', marginBottom: '32px', fontSize: '15px' }}>
        Launch a new coupon campaign for your users
      </p>
      
      <div style={{ maxWidth: '600px', background: 'white', padding: '40px', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500', color: '#333' }}>
              Campaign Title
            </label>
            <input
              type="text"
              placeholder="Summer Sale 2024"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
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
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500', color: '#333' }}>
              Description
            </label>
            <textarea
              placeholder="Describe your campaign..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              disabled={isLoading}
              rows={4}
              style={{ 
                width: '100%', 
                padding: '12px 16px', 
                borderRadius: '8px', 
                border: '1px solid #e0e0e0', 
                fontSize: '15px',
                transition: 'border-color 0.2s',
                outline: 'none',
                resize: 'vertical'
              }}
              onFocus={(e) => e.target.style.borderColor = '#6366f1'}
              onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
            />
          </div>
          
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500', color: '#333' }}>
              Total Coupons
            </label>
            <input
              type="number"
              placeholder="100"
              value={totalCoupons}
              onChange={(e) => setTotalCoupons(e.target.value)}
              required
              min="1"
              max="10000"
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
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500', color: '#333' }}>
              Start Date (optional)
            </label>
            <input
              type="datetime-local"
              value={startsAt}
              onChange={(e) => setStartsAt(e.target.value)}
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
            {isLoading ? 'Creating...' : 'Create Campaign'}
          </button>
        </form>
      </div>
    </div>
  );
}
