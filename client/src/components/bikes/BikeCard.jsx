import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Calendar, Gauge, MapPin, Star, ArrowRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { toggleWishlist as toggleWishlistApi } from '../../api/authApi';
import toast from 'react-hot-toast';

export default function CarCard({ car, bike, hideBadges = false }) {
  const target = car || bike;
  const { wishlist = [], toggleWishlist } = useAuth();
  const isWishlisted = Array.isArray(wishlist) && wishlist.includes(target?._id);
  const [hovered, setHovered] = useState(false);

  const [selectedPincode, setSelectedPincode] = useState(
    () => localStorage.getItem('selectedPincode') || ''
  );

  useEffect(() => {
    const handlePincodeUpdate = () => {
      setSelectedPincode(localStorage.getItem('selectedPincode') || '');
    };
    window.addEventListener('pincode-updated', handlePincodeUpdate);
    return () => window.removeEventListener('pincode-updated', handlePincodeUpdate);
  }, []);

  const pincodeData = useMemo(() => {
    if (!selectedPincode || !Array.isArray(target?.pincodePricing) || target?.pincodePricing.length === 0) return null;
    return target?.pincodePricing.find(p => p.pincode === selectedPincode.trim()) || null;
  }, [target?.pincodePricing, selectedPincode]);

  const effectivePrice = pincodeData ? Number(pincodeData.price) : (target?.discountedPrice || target?.price);
  const effectiveOriginalPrice = pincodeData?.originalPrice ? Number(pincodeData.originalPrice) : target?.price;
  const effectiveLocation = pincodeData?.location || target?.location?.city;

  const discount = effectiveOriginalPrice && effectiveOriginalPrice > effectivePrice
    ? Math.round(((effectiveOriginalPrice - effectivePrice) / effectiveOriginalPrice) * 100)
    : 0;

  const handleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(target?._id);
    toast.success(isWishlisted ? 'Removed from favorites' : 'Added to favorites');
  };

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: 'relative',
        borderRadius: '14px',
        overflow: 'hidden',
        background: '#FFF',
        display: 'flex',
        flexDirection: 'column',
        cursor: 'pointer',
        border: '1px solid #E5E7EB',
        boxShadow: hovered ? '0 12px 32px rgba(0, 0, 0, 0.08)' : '0 2px 8px rgba(0,0,0,0.04)',
        transform: hovered ? 'translateY(-4px)' : 'translateY(0)',
        transition: 'all 0.3s ease',
        height: '100%',
      }}
    >
      <Link to={`/bikes/${target?._id}`} style={{ textDecoration: 'none', height: '100%', display: 'flex', flexDirection: 'column' }}>
        {/* Image Section */}
        <div style={{ position: 'relative', height: '180px', background: '#F8FAFC', overflow: 'hidden' }}>
          <img
            src={target?.images?.[0] || 'https://via.placeholder.com/400x300/F8FAFC/1E3A8A?text=No+Image'}
            alt={target?.title}
            style={{
              width: '100%', height: '100%', objectFit: 'contain', padding: '1.2rem',
              transform: hovered ? 'scale(1.05)' : 'scale(1)',
              transition: 'transform 0.4s ease',
            }}
          />

          {/* Heart — smaller */}
          <button
            onClick={handleWishlist}
            style={{
              position: 'absolute', top: 10, right: 10,
              width: 28, height: 28, borderRadius: '50%',
              background: isWishlisted ? '#EF4444' : 'rgba(255, 255, 255, 0.9)',
              border: isWishlisted ? 'none' : '1px solid #E5E7EB',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer',
              transition: 'all 0.2s',
              boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
              zIndex: 10
            }}
          >
            <Heart size={12} fill={isWishlisted ? 'white' : 'none'} color={isWishlisted ? 'white' : '#64748B'} />
          </button>

          {/* Type Badge — pill-shaped */}
          <div style={{ position: 'absolute', top: 10, left: 10, display: 'flex', gap: '0.4rem' }}>
            <span style={{
              background: target?.type === 'new' ? '#DCFCE7' : '#EFF6FF',
              color: target?.type === 'new' ? '#166534' : '#1E3A8A',
              fontSize: '0.6rem', fontWeight: 700,
              padding: '3px 10px', borderRadius: '999px',
              letterSpacing: '0.04em', textTransform: 'uppercase',
              border: target?.type === 'new' ? '1px solid #BBF7D0' : '1px solid #DBEAFE'
            }}>
              {target?.type === 'new' ? 'CERTIFIED NEW' : 'PRE-OWNED'}
            </span>
          </div>
        </div>

        {/* Content Section */}
        <div style={{ padding: '0.85rem', flex: 1, display: 'flex', flexDirection: 'column', background: '#FFFFFF' }}>
          {/* Metadata */}
          <div style={{ marginBottom: '0.3rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', gap: '0.6rem' }}>
              <span style={{ color: '#1E3A8A', fontSize: '0.6rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '2px', fontFamily: 'Rajdhani, sans-serif' }}>
                <Calendar size={11} /> {target?.year}
              </span>
              <span style={{ color: '#64748B', fontSize: '0.65rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '2px', fontFamily: 'Rajdhani, sans-serif' }}>
                <Gauge size={11} /> {target?.kmDriven?.toLocaleString()} KM
              </span>
            </div>
          </div>

          {/* Title */}
          <h3 className="product-card-title" style={{
            color: '#0F172A', fontWeight: 800, fontSize: '0.85rem',
            lineHeight: 1.2, marginBottom: '0.3rem',
            fontFamily: 'Rajdhani, sans-serif', letterSpacing: '0.02em',
            textTransform: 'uppercase',
            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'
          }}>
            {target?.title || `${target?.brand} ${target?.model}`}
          </h3>

          {/* Brand */}
          <p style={{ color: '#64748B', fontSize: '0.75rem', fontWeight: 600, marginBottom: '0.3rem' }}>
            {target?.brand?.toUpperCase()} {target?.engineCC ? `• ${target?.engineCC}CC` : ''}
          </p>

          {/* Ratings */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '3px', marginBottom: '0.4rem' }}>
            <div style={{ display: 'flex', gap: '1px' }}>
              {[1, 2, 3, 4, 5].map(i => (
                <Star key={i} size={9} fill="#FFB400" color="#FFB400" />
              ))}
            </div>
            <span style={{ color: '#94A3B8', fontSize: '0.65rem', fontWeight: 500, marginLeft: '2px' }}>
              ({target?.numReviews || 24} reviews)
            </span>
          </div>

          {/* Price + Action */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto' }}>
            <span className="product-card-price" style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: '1.25rem', fontWeight: 900, color: '#1E3A8A', lineHeight: 1 }}>
              ₹{effectivePrice?.toLocaleString('en-IN')}
            </span>
            <div className="product-card-btn" style={{
              height: '30px', padding: '0 0.85rem',
              background: '#1E3A8A', borderRadius: '6px', color: 'white',
              display: 'flex', alignItems: 'center', gap: '0.35rem',
              fontSize: '0.68rem', fontWeight: 700, fontFamily: 'Rajdhani, sans-serif',
              letterSpacing: '0.04em',
              transition: 'all 0.25s'
            }}>
              DETAILS <ArrowRight size={13} />
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}
