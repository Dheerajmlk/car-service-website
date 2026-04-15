import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { ShoppingCart, Menu, X, ChevronDown, User, Heart, LogOut, Settings, Wrench, MapPin, Search } from 'lucide-react';
import API from '../../api/axios';



const navLinks = [
  { label: 'Buy Cars', href: '/bikes' },
  { label: 'Sell Car', href: '/sell' },
  { label: 'Service', href: '/services' },
  { label: 'Parts', href: '/parts' },
  { label: 'Featured', href: '/featured' },
  { label: 'Bestseller', href: '/bestseller' },
  { label: 'Contact', href: '/contact' },
];

export default function Navbar() {
  const { user, logout } = useAuth();
  const { itemCount } = useCart();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const [pincode, setPincode] = useState(() => localStorage.getItem('selectedPincode') || '');
  const [isDeliverable, setIsDeliverable] = useState(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Auto-save & check availability when 6-digit pincode entered
  useEffect(() => {
    if (pincode.length === 6) {
      const saved = localStorage.getItem('selectedPincode');
      if (saved !== pincode) {
        localStorage.setItem('selectedPincode', pincode);
        window.dispatchEvent(new Event('pincode-updated'));
      }
      API.get('/store/parts', { params: { pincode, limit: 1 } })
        .then(({ data }) => setIsDeliverable((data.total || 0) > 0))
        .catch(() => setIsDeliverable(false));
    } else if (pincode.length === 0) {
      setIsDeliverable(null);
      if (localStorage.getItem('selectedPincode')) {
        localStorage.removeItem('selectedPincode');
        window.dispatchEvent(new Event('pincode-updated'));
      }
    } else {
      setIsDeliverable(null);
    }
  }, [pincode]);

  // Sync pincode when another component updates it
  useEffect(() => {
    const handlePincodeUpdate = () => {
      const saved = localStorage.getItem('selectedPincode') || '';
      setPincode(prev => prev !== saved ? saved : prev);
    };
    window.addEventListener('pincode-updated', handlePincodeUpdate);
    return () => window.removeEventListener('pincode-updated', handlePincodeUpdate);
  }, []);

  const handleSearchSubmit = (e) => {
    e?.preventDefault();
    if (searchQuery.trim().length >= 1) {
      setSearchOpen(false);
      setMobileOpen(false);
      navigate(`/bikes?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  const handleLogout = () => {
    logout();
    localStorage.removeItem('selectedPincode');
    setPincode('');
    window.dispatchEvent(new Event('pincode-updated'));
    navigate('/');
    setDropdownOpen(false);
  };

  return (
    <nav style={{ background: 'rgba(255, 255, 255, 0.92)', backdropFilter: 'blur(16px)', borderBottom: '1px solid #E5E7EB' }} className="sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div style={{ background: '#1E3A8A', borderRadius: '8px', padding: '6px 12px' }}>
              <span style={{ fontFamily: 'Rajdhani, sans-serif', fontWeight: 800, color: 'white', fontSize: '1.2rem', letterSpacing: '0.05em' }}>AUTO</span>
            </div>
            <span style={{ fontFamily: 'Rajdhani, sans-serif', fontWeight: 900, color: '#0F172A', fontSize: '1.35rem', letterSpacing: '0.03em' }}>
              XPRESS
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                style={{
                  color: location.pathname.startsWith(link.href) ? '#1E3A8A' : '#475569',
                  padding: '0.5rem 1rem',
                  borderRadius: '6px',
                  fontSize: '0.9rem',
                  fontWeight: location.pathname.startsWith(link.href) ? 700 : 500,
                  textDecoration: 'none',
                  transition: 'all 0.2s',
                  fontFamily: 'Rajdhani, sans-serif',
                  letterSpacing: '0.04em'
                }}
                onMouseEnter={(e) => { if (!location.pathname.startsWith(link.href)) e.target.style.color = '#1E3A8A'; }}
                onMouseLeave={(e) => { if (!location.pathname.startsWith(link.href)) e.target.style.color = '#475569'; }}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-3">
            {/* Search — visible on all screens */}
            <div style={{ position: 'relative' }}>
              {!searchOpen ? (
                <button onClick={() => { setSearchOpen(true); setTimeout(() => document.getElementById('nav-search-input')?.focus(), 100); }}
                  style={{ color: '#0F172A', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', transition: 'color 0.2s' }}
                  onMouseEnter={e => e.currentTarget.style.color = '#1E3A8A'}
                  onMouseLeave={e => e.currentTarget.style.color = '#0F172A'}>
                  <Search size={20} />
                </button>
              ) : (
                <form onSubmit={handleSearchSubmit} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#F8FAFC', border: '1px solid #E5E7EB', borderRadius: '8px', padding: '0.3rem 0.7rem', position: 'absolute', right: 0, top: '50%', transform: 'translateY(-50%)', width: 'max(200px, 45vw)', maxWidth: '280px', zIndex: 10 }}>
                  <Search size={14} style={{ color: '#1E3A8A', flexShrink: 0 }} />
                  <input
                    id="nav-search-input"
                    type="text"
                    placeholder="Search cars, parts..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onBlur={() => { if (!searchQuery) setSearchOpen(false); }}
                    style={{ background: 'none', border: 'none', outline: 'none', color: '#0F172A', flex: 1, minWidth: 0, fontSize: '0.82rem', fontWeight: 600 }}
                  />
                  {searchQuery && (
                    <button type="button" onClick={() => { setSearchQuery(''); setSearchOpen(false); }} style={{ background: 'none', border: 'none', color: '#888', cursor: 'pointer', fontSize: '1rem', lineHeight: 1 }}>×</button>
                  )}
                </form>
              )}
            </div>

            {/* Pincode Input */}
            <div className="hidden md:flex items-center gap-1.5" style={{ background: '#F8FAFC', border: '1px solid #E5E7EB', borderRadius: '8px', padding: '0.3rem 0.7rem' }}>
              <MapPin size={13} style={{ color: '#1E3A8A', flexShrink: 0 }} />
              <input
                type="text"
                placeholder="Pincode"
                maxLength="6"
                value={pincode}
                onChange={e => setPincode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                style={{ background: 'none', border: 'none', outline: 'none', color: '#0F172A', width: 62, fontSize: '0.82rem', fontWeight: 600 }}
              />
              {isDeliverable !== null && (
                <span style={{ fontSize: '0.68rem', fontWeight: 700, color: isDeliverable ? '#10B981' : '#EF4444', whiteSpace: 'nowrap' }}>
                  {isDeliverable ? '✓' : '✗'}
                </span>
              )}
            </div>

            {/* Cart */}
            <Link to="/cart" style={{ position: 'relative', color: '#0F172A', display: 'flex', alignItems: 'center', transition: 'color 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.color = '#1E3A8A'}
              onMouseLeave={e => e.currentTarget.style.color = '#0F172A'}>
              <ShoppingCart size={20} />
              {itemCount > 0 && (
                <span style={{
                  position: 'absolute', top: '-8px', right: '-8px',
                  background: '#1E3A8A', color: 'white', borderRadius: '50%',
                  width: '18px', height: '18px', fontSize: '0.7rem',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700,
                }}>
                  {itemCount}
                </span>
              )}
            </Link>

            {/* User Menu */}
            {user ? (
              <div style={{ position: 'relative' }}>
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '0.3rem',
                    background: '#FFF', border: '1px solid #E5E7EB',
                    borderRadius: '8px', padding: '0.35rem 0.6rem', color: '#0F172A',
                    cursor: 'pointer', fontSize: '0.8rem', fontWeight: 700,
                    transition: 'all 0.2s'
                  }}
                >
                  {dropdownOpen ? (
                    <X size={18} style={{ color: '#1E3A8A' }} />
                  ) : (
                    <>
                      {user.avatar ? (
                        <img src={user.avatar} alt={user.name} style={{ width: 24, height: 24, borderRadius: '50%', objectFit: 'cover' }} />
                      ) : (
                        <div style={{ width: 24, height: 24, borderRadius: '50%', background: '#1E3A8A', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 700, color: 'white' }}>
                          {user.name?.charAt(0).toUpperCase()}
                        </div>
                      )}
                      <span className="hidden sm:block">{user.name?.split(' ')[0]}</span>
                      <ChevronDown size={14} />
                    </>
                  )}
                </button>

                {dropdownOpen && (
                  <div style={{
                    position: 'absolute', right: 0, top: '110%',
                    background: '#FFFFFF', border: '1px solid #E5E7EB',
                    borderRadius: '12px', minWidth: '200px', zIndex: 100,
                    boxShadow: '0 12px 40px rgba(0,0,0,0.1)',
                    overflow: 'hidden',
                  }}>
                    <div style={{ padding: '0.5rem 0' }}>
                      <Link to="/profile" onClick={() => setDropdownOpen(false)} style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '0.6rem 1rem', color: '#475569', textDecoration: 'none', fontSize: '0.88rem', fontWeight: 500, transition: 'all 0.15s' }}
                        onMouseEnter={(e) => { e.currentTarget.style.background = '#F8FAFC'; e.currentTarget.style.color = '#1E3A8A'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#475569'; }}>
                        <User size={15} /> My Profile
                      </Link>
                      <Link to="/my-bookings" onClick={() => setDropdownOpen(false)} style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '0.6rem 1rem', color: '#475569', textDecoration: 'none', fontSize: '0.88rem', fontWeight: 500, transition: 'all 0.15s' }}
                        onMouseEnter={(e) => { e.currentTarget.style.background = '#F8FAFC'; e.currentTarget.style.color = '#1E3A8A'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#475569'; }}>
                        <Wrench size={15} /> My Bookings
                      </Link>
                      <Link to="/wishlist" onClick={() => setDropdownOpen(false)} style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '0.6rem 1rem', color: '#475569', textDecoration: 'none', fontSize: '0.88rem', fontWeight: 500, transition: 'all 0.15s' }}
                        onMouseEnter={(e) => { e.currentTarget.style.background = '#F8FAFC'; e.currentTarget.style.color = '#1E3A8A'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#475569'; }}>
                        <Heart size={15} /> Wishlist
                      </Link>
                      {user.role === 'admin' && (
                        <Link to="/admin" onClick={() => setDropdownOpen(false)} style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '0.6rem 1rem', color: '#1E3A8A', textDecoration: 'none', fontSize: '0.88rem', fontWeight: 600, transition: 'all 0.15s' }}
                          onMouseEnter={(e) => { e.currentTarget.style.background = '#F8FAFC'; }}
                          onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}>
                          <Settings size={15} /> Admin Panel
                        </Link>
                      )}
                    </div>
                    <div style={{ borderTop: '1px solid #E5E7EB' }}>
                      <button onClick={handleLogout} style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '0.6rem 1rem', color: '#EF4444', background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.88rem', width: '100%', transition: 'all 0.15s' }}
                        onMouseEnter={(e) => { e.currentTarget.style.background = '#FEF2F2'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}>
                        <LogOut size={15} /> Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-1.5 whitespace-nowrap">
                <Link to="/login" className="btn-outline-dark" style={{ padding: '0.4rem 0.8rem', fontSize: '0.7rem', fontWeight: 700 }}>Login</Link>
                <Link to="/register" className="btn-primary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.7rem', fontWeight: 700 }}>Sign Up</Link>
              </div>
            )}


            {/* Mobile hamburger */}
            <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden" style={{ color: '#0F172A', background: 'none', border: 'none', cursor: 'pointer' }}>
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Mobile Nav */}
        {mobileOpen && (
          <div style={{ borderTop: '1px solid #E5E7EB', padding: '1rem 0' }}>
            {/* Pincode in mobile */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#F8FAFC', border: '1px solid #E5E7EB', borderRadius: '8px', padding: '0.5rem 0.8rem', marginBottom: '0.75rem' }}>
              <MapPin size={14} style={{ color: '#1E3A8A', flexShrink: 0 }} />
              <input
                type="text"
                placeholder="Enter Pincode"
                maxLength="6"
                value={pincode}
                onChange={e => setPincode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                style={{ background: 'none', border: 'none', outline: 'none', color: '#0F172A', flex: 1, fontSize: '0.9rem' }}
              />
              {isDeliverable !== null && (
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: isDeliverable ? '#10B981' : '#EF4444' }}>
                  {isDeliverable ? '✓ Available' : '✗ Not Available'}
                </span>
              )}
            </div>
            {navLinks.map((link) => (
              <Link key={link.href} to={link.href} onClick={() => setMobileOpen(false)}
                style={{ display: 'block', color: '#334155', textDecoration: 'none', padding: '0.55rem 0', fontSize: '0.88rem', fontWeight: 500, borderBottom: '1px solid #F1F5F9' }}>
                {link.label}
              </Link>
            ))}
            {/* Mobile user actions */}
            {user ? (
              <div style={{ borderTop: '1px solid #E5E7EB', marginTop: '0.5rem', paddingTop: '0.5rem' }}>
                <Link to="/profile" onClick={() => setMobileOpen(false)} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#334155', textDecoration: 'none', padding: '0.5rem 0', fontSize: '0.88rem', fontWeight: 500 }}>
                  <User size={14} /> My Profile
                </Link>
                <Link to="/my-bookings" onClick={() => setMobileOpen(false)} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#334155', textDecoration: 'none', padding: '0.5rem 0', fontSize: '0.88rem', fontWeight: 500 }}>
                  <Wrench size={14} /> My Bookings
                </Link>
                <Link to="/wishlist" onClick={() => setMobileOpen(false)} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#334155', textDecoration: 'none', padding: '0.5rem 0', fontSize: '0.88rem', fontWeight: 500 }}>
                  <Heart size={14} /> Wishlist
                </Link>
                {user.role === 'admin' && (
                  <Link to="/admin" onClick={() => setMobileOpen(false)} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#1E3A8A', textDecoration: 'none', padding: '0.5rem 0', fontSize: '0.88rem', fontWeight: 700 }}>
                    <Settings size={14} /> Admin Panel
                  </Link>
                )}
                <button onClick={() => { handleLogout(); setMobileOpen(false); }} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#EF4444', background: 'none', border: 'none', cursor: 'pointer', padding: '0.5rem 0', fontSize: '0.88rem', fontWeight: 600, width: '100%' }}>
                  <LogOut size={14} /> Logout
                </button>
              </div>
            ) : (
              <div style={{ borderTop: '1px solid #E5E7EB', marginTop: '0.5rem', paddingTop: '0.75rem', display: 'flex', gap: '0.5rem' }}>
                <Link to="/login" onClick={() => setMobileOpen(false)} className="btn-outline-dark" style={{ padding: '0.5rem 1.2rem', fontSize: '0.82rem', fontWeight: 700, flex: 1, justifyContent: 'center' }}>Login</Link>
                <Link to="/register" onClick={() => setMobileOpen(false)} className="btn-primary" style={{ padding: '0.5rem 1.2rem', fontSize: '0.82rem', fontWeight: 700, flex: 1, justifyContent: 'center' }}>Sign Up</Link>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
