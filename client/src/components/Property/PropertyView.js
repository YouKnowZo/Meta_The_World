import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import api from '../../api/api';
import toast from 'react-hot-toast';
import './PropertyView.css';

const PropertyView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState(false);

  useEffect(() => {
    fetchProperty();
  }, [id]);

  const fetchProperty = async () => {
    try {
      const response = await api.get(`/properties/${id}`);
      setProperty(response.data);
    } catch (error) {
      toast.error('Failed to load property');
      navigate('/world');
    } finally {
      setLoading(false);
    }
  };

  const handlePurchase = async () => {
    if (!user) {
      toast.error('Please login to purchase');
      return;
    }

    if (window.confirm(`Purchase ${property.name} for ${property.price.toLocaleString()} MTC?`)) {
      setPurchasing(true);
      try {
        const response = await api.post(`/properties/${id}/purchase`, {
          buyerId: user.id
        });
        
        if (response.data.success) {
          toast.success('Property purchased successfully!');
          fetchProperty();
          // Update user wallet in store
          user.wallet.balance = response.data.newBalance;
        }
      } catch (error) {
        toast.error(error.response?.data?.error || 'Purchase failed');
      } finally {
        setPurchasing(false);
      }
    }
  };

  if (loading) {
    return <div className="property-view loading">Loading...</div>;
  }

  if (!property) {
    return <div className="property-view">Property not found</div>;
  }

  const isOwner = property.owner?._id === user?.id || property.owner === user?.id;
  const canPurchase = property.listed && !isOwner && user?.wallet?.balance >= property.price;

  return (
    <div className="property-view">
      <div className="property-header">
        <Link to="/world" className="btn-back">← Back to World</Link>
        <h1>{property.name}</h1>
      </div>

      <div className="property-content">
        <div className="property-main">
          <div className="property-image-placeholder">
            <div className="image-placeholder">
              <span>3D Property View</span>
            </div>
          </div>

          <div className="property-details">
            <div className="detail-row">
              <span className="label">Type:</span>
              <span className="value capitalize">{property.type}</span>
            </div>
            <div className="detail-row">
              <span className="label">Location:</span>
              <span className="value">{property.location.region}</span>
            </div>
            <div className="detail-row">
              <span className="label">Coordinates:</span>
              <span className="value">
                ({property.location.x}, {property.location.y}, {property.location.z})
              </span>
            </div>
            <div className="detail-row">
              <span className="label">Size:</span>
              <span className="value">
                {property.size.width} × {property.size.height} × {property.size.depth}
              </span>
            </div>
            <div className="detail-row">
              <span className="label">Price:</span>
              <span className="value price">{property.price.toLocaleString()} MTC</span>
            </div>
            <div className="detail-row">
              <span className="label">Status:</span>
              <span className={`value status ${property.listed ? 'listed' : 'owned'}`}>
                {property.listed ? 'For Sale' : 'Owned'}
              </span>
            </div>
            {property.owner && (
              <div className="detail-row">
                <span className="label">Owner:</span>
                <span className="value">{property.owner.username || 'Unknown'}</span>
              </div>
            )}
            {property.listingAgent && (
              <div className="detail-row">
                <span className="label">Listing Agent:</span>
                <span className="value">{property.listingAgent.username || 'Unknown'}</span>
              </div>
            )}
            {property.commissionRate > 0 && (
              <div className="detail-row">
                <span className="label">Agent Commission:</span>
                <span className="value">
                  {(property.commissionRate * 100).toFixed(1)}% 
                  ({(property.price * property.commissionRate).toLocaleString()} MTC)
                </span>
              </div>
            )}
            <div className="detail-row">
              <span className="label">Views:</span>
              <span className="value">{property.viewCount}</span>
            </div>
          </div>

          {property.description && (
            <div className="property-description">
              <h3>Description</h3>
              <p>{property.description}</p>
            </div>
          )}

          {property.features && property.features.length > 0 && (
            <div className="property-features">
              <h3>Features</h3>
              <ul>
                {property.features.map((feature, index) => (
                  <li key={index}>
                    <strong>{feature.name}:</strong> {feature.value}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="property-actions">
          {isOwner && (
            <div className="owner-actions">
              <h3>Owner Actions</h3>
              {!property.listed && (
                <button className="btn-list" onClick={() => navigate(`/property/${id}/list`)}>
                  List for Sale
                </button>
              )}
            </div>
          )}

          {canPurchase && (
            <div className="purchase-section">
              <h3>Purchase Property</h3>
              <p className="purchase-price">{property.price.toLocaleString()} MTC</p>
              <p className="your-balance">
                Your Balance: {user.wallet.balance.toLocaleString()} MTC
              </p>
              <button
                className="btn-purchase"
                onClick={handlePurchase}
                disabled={purchasing}
              >
                {purchasing ? 'Processing...' : 'Purchase Now'}
              </button>
            </div>
          )}

          {property.listed && !canPurchase && !isOwner && (
            <div className="purchase-section">
              <p className="insufficient-funds">
                Insufficient funds. You need {property.price.toLocaleString()} MTC
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PropertyView;
