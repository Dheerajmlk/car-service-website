import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { ShoppingCart, Star, Heart } from 'lucide-react';

export default function PartCard({ part }) {
  const { items, addToCart, updateQty } = useCart();
  const cartItem = items.find(i => i._id === part._id);
  const { wishlist = [], toggleWishlist } = useAuth();
  const isWishlisted = Array.isArray(wishlist) && wishlist.includes(part._id);
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
    if (!selectedPincode || !Array.isArray(part.pincodePricing) || part.pincodePricing.length === 0) return null;
    return part.pincodePricing.find(p => p.pincode === selectedPincode.trim()) || null;
  }, [part.pincodePricing, selectedPincode]);

  const effectivePrice = pincodeData ? Number(pincodeData.price) : (part.discountedPrice || part.price);
  const effectiveOriginalPrice = pincodeData?.originalPrice ? Number(pincodeData.originalPrice) : part.price;
  const effectiveStock = pincodeData ? Number(pincodeData.inventory) : part.stock;
  const effectiveLocation = pincodeData?.location || null;

  const discount = effectiveOriginalPrice && effectiveOriginalPrice > effectivePrice
    ? Math.round(((effectiveOriginalPrice - effectivePrice) / effectiveOriginalPrice) * 100)
    : 0;

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
      <Link to={`/parts/${part._id}`} style={{ textDecoration: 'none', height: '100%', display: 'flex', flexDirection: 'column' }}>
        {/* Image Section */}
        <div style={{ position: 'relative', height: '180px', background: '#F8FAFC', overflow: 'hidden' }}>
          <img
            src={part.images?.[0] || 'https://via.placeholder.com/400x300/F8FAFC/1E3A8A?text=No+Image'}
            alt={part.name}
            style={{
              width: '100%', height: '100%', objectFit: 'contain', padding: '1.2rem',
              transform: hovered ? 'scale(1.05)' : 'scale(1)',
              transition: 'transform 0.4s ease',
            }}
          />

          {/* Heart — smaller */}
          <button
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleWishlist(part._id); }}
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

          {/* Badge */}
          {part.condition === 'new' && (
            <div style={{ position: 'absolute', top: 10, left: 10 }}>
              <span style={{
                background: '#DCFCE7', color: '#166534',
                fontSize: '0.6rem', fontWeight: 700,
                padding: '3px 10px', borderRadius: '999px',
                letterSpacing: '0.04em', textTransform: 'uppercase',
                border: '1px solid #BBF7D0'
              }}>
                NEW
              </span>
            </div>
          )}
          {/* Out of stock overlay */}
          {effectiveStock === 0 && (
            <div style={{
              position: 'absolute', inset: 0,
              background: 'rgba(255,255,255,0.7)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              backdropFilter: 'blur(1px)', zIndex: 5
            }}>
              <span style={{
                color: '#0F172A', fontWeight: 800, fontSize: '0.75rem',
                letterSpacing: '0.1em', textTransform: 'uppercase',
                padding: '0.35rem 1rem', border: '2px solid #0F172A',
                background: '#FFF', borderRadius: '999px',
              }}>SOLD OUT</span>
            </div>
          )}
        </div>

        {/* Content Section */}
        <div style={{ padding: '0.85rem', flex: 1, display: 'flex', flexDirection: 'column', background: '#FFFFFF' }}>
          {/* Category */}
          <div style={{ marginBottom: '0.4rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{
              fontSize: '0.62rem', color: '#1E3A8A',
              textTransform: 'uppercase', fontWeight: 700,
              letterSpacing: '0.06em', fontFamily: 'Rajdhani, sans-serif'
            }}>
              {part.category?.replace('_', ' ')}
            </span>
          </div>

          {/* Name */}
          <h3 className="product-card-title" style={{
            color: '#0F172A', fontWeight: 800, fontSize: '0.85rem',
            lineHeight: 1.2, marginBottom: '0.3rem',
            fontFamily: 'Rajdhani, sans-serif', letterSpacing: '0.02em',
            textTransform: 'uppercase',
            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'
          }}>
            {part.name}
          </h3>

          {part.brand && (
            <p style={{ color: '#94A3B8', fontSize: '0.7rem', fontWeight: 600, marginBottom: '0.3rem' }}>
              {part.brand}
            </p>
          )}
          {/* Ratings */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '3px', marginBottom: '0.4rem' }}>
            <div style={{ display: 'flex', gap: '1px' }}>
              {[1, 2, 3, 4, 5].map(i => (
                <Star key={i} size={9} fill="#FFB400" color="#FFB400" />
              ))}
            </div>
            <span style={{ color: '#94A3B8', fontSize: '0.65rem', fontWeight: 500, marginLeft: '2px' }}>
              ({part.numReviews || 12})
            </span>
          </div>

          {/* Price + CTA */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto' }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.6rem' }}>
              <span className="product-card-price" style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: '1.25rem', fontWeight: 900, color: '#1E3A8A', lineHeight: 1 }}>
                ₹{effectivePrice?.toLocaleString('en-IN')}
              </span>
            </div>

            <div style={{ display: 'flex', gap: '0.4rem' }}>
              {cartItem ? (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  background: '#F8FAFC',
                  borderRadius: '6px',
                  padding: '2px 6px',
                  border: '1px solid #E5E7EB'
                }}>
                  <button
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); updateQty(part._id, cartItem.quantity - 1); }}
                    style={{
                      width: 22, height: 22, borderRadius: '4px', border: 'none',
                      background: '#1E3A8A', color: 'white', display: 'flex',
                      alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
                      fontSize: '0.9rem', fontWeight: 900
                    }}
                  >-</button>
                  <span style={{ fontSize: '0.82rem', fontWeight: 800, color: '#0F172A', fontFamily: 'Rajdhani, sans-serif', minWidth: '15px', textAlign: 'center' }}>
                    {cartItem.quantity}
                  </span>
                  <button
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); updateQty(part._id, cartItem.quantity + 1); }}
                    style={{
                      width: 22, height: 22, borderRadius: '4px', border: 'none',
                      background: '#1E3A8A', color: 'white', display: 'flex',
                      alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
                      fontSize: '0.9rem', fontWeight: 900
                    }}
                  >+</button>
                </div>
              ) : (
                <button
                  className="product-card-btn"
                  onClick={(e) => { e.preventDefault(); e.stopPropagation(); addToCart({ ...part, effectivePrice }); }}
                  disabled={effectiveStock === 0}
                  style={{
                    height: '28px',
                    padding: '0 0.7rem',
                    background: effectiveStock === 0 ? '#E2E8F0' : '#1E3A8A',
                    border: 'none', borderRadius: '6px', color: 'white',
                    cursor: effectiveStock === 0 ? 'not-allowed' : 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    transition: 'all 0.25s',
                    gap: '0.3rem', fontWeight: 800, fontFamily: 'Rajdhani, sans-serif', fontSize: '0.65rem', letterSpacing: '0.04em'
                  }}
                >
                  <ShoppingCart size={13} /> ADD
                </button>
              )}
            </div>
          </div>
        </div>
      </Link>
    </div>

  );
}
