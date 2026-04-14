import { useState, useEffect, useRef } from 'react';

/*
  A multi-angle car component.
  We render several "views" of the car (front-quarter, side, rear-quarter)
  and cross-fade between them based on a `progress` prop (0 → 1).

  progress 0.0  = front-left quarter view
  progress 0.5  = perfect side profile
  progress 1.0  = rear-right quarter view
*/

function FrontQuarterView({ opacity }) {
  return (
    <g opacity={opacity} style={{ transition: 'opacity 0.15s ease' }}>
      {/* Shadow */}
      <ellipse cx="440" cy="330" rx="280" ry="22" fill="url(#shadow3d)" opacity="0.5" />

      {/* Body — front-quarter angle, foreshortened */}
      <path d="M120 255 L145 240 L200 225 L260 195 L320 172 L400 158 L500 150 L600 148 L680 152 L740 165 L780 182 L800 200 L810 220 L812 240 L810 260 L805 275 L800 285 L130 285 L122 270 Z" fill="url(#bodyGrad3d)" />

      {/* Roof */}
      <path d="M310 172 L400 155 L520 148 L620 148 L680 155 L700 168 L680 170 L600 162 L500 160 L400 163 L340 175 Z" fill="url(#roofGrad3d)" />

      {/* Front face — visible due to angle */}
      <path d="M120 255 L145 240 L200 225 L200 280 L130 285 L122 270 Z" fill="#172554" />

      {/* Front grille */}
      <path d="M135 248 L185 232 L195 238 L195 268 L185 272 L135 268 Z" fill="#0B1120" />
      {[0, 1, 2, 3, 4].map(i => (
        <line key={`g${i}`} x1={140} y1={245 + i * 5} x2={190} y2={235 + i * 5} stroke="#1E293B" strokeWidth="1" />
      ))}

      {/* Headlight — front */}
      <path d="M140 242 L175 230 L185 234 L185 245 L170 248 L140 250 Z" fill="#DBEAFE" opacity="0.9" />
      <path d="M148 244 L170 236 L178 238 L178 244 L165 246 L148 248 Z" fill="white" opacity="0.7" />
      {/* Headlight beam */}
      <ellipse cx="115" cy="250" rx="30" ry="12" fill="#93C5FD" opacity="0.12" />

      {/* Windshield */}
      <path d="M270 195 L380 162 L520 152 L520 168 L380 172 L300 192 Z" fill="#93C5FD" opacity="0.3" />

      {/* Side windows */}
      <path d="M525 153 L620 153 L660 162 L660 172 L525 168 Z" fill="#93C5FD" opacity="0.22" />

      {/* A-pillar */}
      <path d="M520 150 L528 170 L515 170 L510 152 Z" fill="url(#bodyGrad3d)" />

      {/* Door lines */}
      <path d="M510 175 L515 280" stroke="#172554" strokeWidth="0.8" opacity="0.35" />
      <path d="M360 185 L368 280" stroke="#172554" strokeWidth="0.8" opacity="0.25" />

      {/* Door handle */}
      <rect x="420" y="218" width="24" height="3.5" rx="1.75" fill="#93C5FD" opacity="0.25" />

      {/* Side skirt */}
      <path d="M220 278 L790 278 L800 285 L220 285 Z" fill="#0B1120" opacity="0.5" />

      {/* Side air vent */}
      <g opacity="0.35">
        <line x1="260" y1="240" x2="310" y2="235" stroke="#172554" strokeWidth="1.2" />
        <line x1="262" y1="245" x2="308" y2="240" stroke="#172554" strokeWidth="1.2" />
        <line x1="264" y1="250" x2="306" y2="245" stroke="#172554" strokeWidth="1.2" />
      </g>

      {/* Rear section */}
      <path d="M790 195 L805 215 L812 240 L810 260 L805 275 L800 285 L785 285 L783 265 L785 235 L790 210 Z" fill="#172554" />

      {/* Tail light */}
      <path d="M792 200 L802 218 L808 245 L805 260 L798 268 L790 260 L790 220 Z" fill="#EF4444" opacity="0.75" />
      <path d="M795 210 L800 222 L804 240 L802 252 L797 258 L794 248 L794 225 Z" fill="#FCA5A5" opacity="0.5" />

      {/* Body highlight */}
      <path d="M200 228 L350 198 L520 185 L700 190 L790 205" stroke="url(#highlight3d)" strokeWidth="1.5" fill="none" opacity="0.5" />

      {/* Front wheel */}
      <ellipse cx="300" cy="285" rx="42" ry="40" fill="#111827" />
      <ellipse cx="300" cy="285" rx="36" ry="34" fill="#1F2937" />
      <ellipse cx="300" cy="285" rx="28" ry="27" fill="#374151" />
      {[0, 60, 120, 180, 240, 300].map(a => (
        <line key={`fw${a}`} x1={300 + 10 * Math.cos(a * Math.PI / 180)} y1={285 + 10 * Math.sin(a * Math.PI / 180) * 0.96} x2={300 + 26 * Math.cos(a * Math.PI / 180)} y2={285 + 25 * Math.sin(a * Math.PI / 180) * 0.96} stroke="#6B7280" strokeWidth="3" strokeLinecap="round" />
      ))}
      <ellipse cx="300" cy="285" rx="11" ry="10" fill="#4B5563" />
      <ellipse cx="300" cy="285" rx="5" ry="4.5" fill="#9CA3AF" />
      <ellipse cx="300" cy="285" rx="42" ry="40" fill="none" stroke="#1F2937" strokeWidth="6" />

      {/* Rear wheel */}
      <ellipse cx="710" cy="285" rx="42" ry="40" fill="#111827" />
      <ellipse cx="710" cy="285" rx="36" ry="34" fill="#1F2937" />
      <ellipse cx="710" cy="285" rx="28" ry="27" fill="#374151" />
      {[0, 60, 120, 180, 240, 300].map(a => (
        <line key={`rw${a}`} x1={710 + 10 * Math.cos(a * Math.PI / 180)} y1={285 + 10 * Math.sin(a * Math.PI / 180) * 0.96} x2={710 + 26 * Math.cos(a * Math.PI / 180)} y2={285 + 25 * Math.sin(a * Math.PI / 180) * 0.96} stroke="#6B7280" strokeWidth="3" strokeLinecap="round" />
      ))}
      <ellipse cx="710" cy="285" rx="11" ry="10" fill="#4B5563" />
      <ellipse cx="710" cy="285" rx="5" ry="4.5" fill="#9CA3AF" />
      <ellipse cx="710" cy="285" rx="42" ry="40" fill="none" stroke="#1F2937" strokeWidth="6" />
    </g>
  );
}

function SideView({ opacity }) {
  return (
    <g opacity={opacity} style={{ transition: 'opacity 0.15s ease' }}>
      <ellipse cx="450" cy="322" rx="310" ry="18" fill="url(#shadow3d)" opacity="0.5" />
      <path d="M100 260 L115 248 L165 240 L220 210 L290 185 L370 168 L460 160 L570 158 L660 160 L730 170 L775 185 L800 205 L815 225 L820 245 L818 262 L815 272 L100 272 L95 265 Z" fill="url(#bodyGrad3d)" />
      <path d="M280 185 L370 166 L470 158 L580 158 L660 165 L690 178 L660 180 L570 172 L470 170 L370 175 L310 190 Z" fill="url(#roofGrad3d)" />
      <path d="M290 188 L370 168 L470 160 L470 176 L370 178 L320 192 Z" fill="#93C5FD" opacity="0.32" />
      <path d="M585 160 L660 168 L690 180 L660 182 L580 175 Z" fill="#93C5FD" opacity="0.22" />
      <path d="M475 159 L580 159 L600 166 L600 176 L475 176 Z" fill="#93C5FD" opacity="0.28" />
      <path d="M470 158 L478 178 L465 178 L460 160 Z" fill="url(#bodyGrad3d)" />
      <path d="M462 182 L466 272" stroke="#172554" strokeWidth="0.8" opacity="0.35" />
      <path d="M335 190 L342 272" stroke="#172554" strokeWidth="0.8" opacity="0.25" />
      <rect x="385" y="218" width="25" height="3.5" rx="1.75" fill="#93C5FD" opacity="0.25" />
      <path d="M110 252 L140 242 L155 245 L155 260 L140 264 L110 260 Z" fill="#DBEAFE" opacity="0.85" />
      <path d="M116 254 L135 247 L148 250 L148 258 L135 260 L116 258 Z" fill="white" opacity="0.6" />
      <ellipse cx="88" cy="258" rx="28" ry="10" fill="#93C5FD" opacity="0.12" />
      <path d="M800 210 L815 228 L820 248 L818 262 L815 272 L802 272 L800 258 L802 230 Z" fill="#172554" />
      <path d="M804 215 L812 232 L816 250 L814 262 L808 266 L804 255 L805 235 Z" fill="#EF4444" opacity="0.75" />
      <path d="M806 222 L810 235 L813 248 L811 257 L808 260 L806 250 L806 235 Z" fill="#FCA5A5" opacity="0.5" />
      <path d="M185 270 L795 270 L800 272 L185 272 Z" fill="#0B1120" opacity="0.5" />
      <g opacity="0.35">
        <line x1="225" y1="245" x2="275" y2="240" stroke="#172554" strokeWidth="1.2" />
        <line x1="227" y1="250" x2="273" y2="245" stroke="#172554" strokeWidth="1.2" />
        <line x1="229" y1="255" x2="271" y2="250" stroke="#172554" strokeWidth="1.2" />
      </g>
      <path d="M155 245 L350 205 L520 192 L700 198 L800 215" stroke="url(#highlight3d)" strokeWidth="1.5" fill="none" opacity="0.5" />

      {/* Wheels */}
      <circle cx="270" cy="272" r="42" fill="#111827" />
      <circle cx="270" cy="272" r="36" fill="#1F2937" />
      <circle cx="270" cy="272" r="28" fill="#374151" />
      {[0, 60, 120, 180, 240, 300].map(a => (
        <line key={`sw1${a}`} x1={270 + 10 * Math.cos(a * Math.PI / 180)} y1={272 + 10 * Math.sin(a * Math.PI / 180)} x2={270 + 26 * Math.cos(a * Math.PI / 180)} y2={272 + 26 * Math.sin(a * Math.PI / 180)} stroke="#6B7280" strokeWidth="3" strokeLinecap="round" />
      ))}
      <circle cx="270" cy="272" r="11" fill="#4B5563" />
      <circle cx="270" cy="272" r="5" fill="#9CA3AF" />
      <circle cx="270" cy="272" r="42" fill="none" stroke="#1F2937" strokeWidth="6" />

      <circle cx="690" cy="272" r="42" fill="#111827" />
      <circle cx="690" cy="272" r="36" fill="#1F2937" />
      <circle cx="690" cy="272" r="28" fill="#374151" />
      {[0, 60, 120, 180, 240, 300].map(a => (
        <line key={`sw2${a}`} x1={690 + 10 * Math.cos(a * Math.PI / 180)} y1={272 + 10 * Math.sin(a * Math.PI / 180)} x2={690 + 26 * Math.cos(a * Math.PI / 180)} y2={272 + 26 * Math.sin(a * Math.PI / 180)} stroke="#6B7280" strokeWidth="3" strokeLinecap="round" />
      ))}
      <circle cx="690" cy="272" r="11" fill="#4B5563" />
      <circle cx="690" cy="272" r="5" fill="#9CA3AF" />
      <circle cx="690" cy="272" r="42" fill="none" stroke="#1F2937" strokeWidth="6" />
    </g>
  );
}

function RearQuarterView({ opacity }) {
  return (
    <g opacity={opacity} style={{ transition: 'opacity 0.15s ease' }}>
      <ellipse cx="460" cy="330" rx="280" ry="22" fill="url(#shadow3d)" opacity="0.5" />

      {/* Body — rear quarter, mirrored perspective */}
      <path d="M810 255 L790 240 L740 225 L680 195 L620 172 L540 158 L440 150 L340 148 L260 152 L200 165 L165 182 L148 200 L138 220 L136 240 L138 260 L142 275 L148 285 L810 285 L818 270 Z" fill="url(#bodyGrad3d)" />
      <path d="M630 172 L540 155 L420 148 L320 148 L260 155 L240 168 L260 170 L340 162 L440 160 L540 163 L600 175 Z" fill="url(#roofGrad3d)" />

      {/* Rear face */}
      <path d="M810 255 L790 240 L740 225 L740 280 L810 285 L818 270 Z" fill="#172554" />

      {/* Rear window */}
      <path d="M360 153 L260 162 L240 172 L260 174 L360 166 L420 160 Z" fill="#93C5FD" opacity="0.22" />

      {/* Side window */}
      <path d="M425 153 L530 158 L560 168 L560 176 L425 168 Z" fill="#93C5FD" opacity="0.28" />

      {/* Tail lights — large and prominent */}
      <path d="M752 230 L745 250 L745 275 L755 278 L758 260 L758 240 Z" fill="#EF4444" opacity="0.85" />
      <path d="M754 238 L750 252 L750 268 L755 270 L756 255 L756 245 Z" fill="#FCA5A5" opacity="0.6" />
      <path d="M775 235 L770 252 L770 275 L780 278 L782 260 L782 242 Z" fill="#EF4444" opacity="0.85" />
      <path d="M777 242 L773 254 L773 268 L778 270 L779 258 L779 248 Z" fill="#FCA5A5" opacity="0.6" />

      {/* License plate area */}
      <rect x="755" y="255" width="30" height="16" rx="2" fill="#1E293B" stroke="#334155" strokeWidth="0.5" />

      {/* Rear bumper diffuser */}
      <path d="M748 278 L805 278 L810 285 L748 285 Z" fill="#0B1120" opacity="0.6" />

      {/* Exhaust tips */}
      <ellipse cx="762" cy="283" rx="5" ry="3.5" fill="#374151" stroke="#4B5563" strokeWidth="1" />
      <ellipse cx="790" cy="283" rx="5" ry="3.5" fill="#374151" stroke="#4B5563" strokeWidth="1" />

      {/* Front section */}
      <path d="M148 200 L138 220 L136 240 L138 260 L142 275 L148 285 L160 285 L162 265 L160 235 L155 210 Z" fill="url(#bodyGrad3d)" />
      <path d="M150 205 L142 222 L138 242 L140 258 L145 268 L148 258 L148 230 Z" fill="#DBEAFE" opacity="0.6" />

      {/* Side skirt */}
      <path d="M155 278 L738 278 L748 285 L155 285 Z" fill="#0B1120" opacity="0.5" />

      {/* Door lines */}
      <path d="M430 175 L428 280" stroke="#172554" strokeWidth="0.8" opacity="0.35" />
      <path d="M580 185 L575 280" stroke="#172554" strokeWidth="0.8" opacity="0.25" />

      <rect x="500" y="218" width="24" height="3.5" rx="1.75" fill="#93C5FD" opacity="0.25" />

      {/* Body highlight */}
      <path d="M160 228 L300 198 L460 185 L650 190 L740 210" stroke="url(#highlight3d)" strokeWidth="1.5" fill="none" opacity="0.5" />

      {/* Front wheel (far side, slightly smaller) */}
      <ellipse cx="230" cy="285" rx="42" ry="40" fill="#111827" />
      <ellipse cx="230" cy="285" rx="36" ry="34" fill="#1F2937" />
      <ellipse cx="230" cy="285" rx="28" ry="27" fill="#374151" />
      {[0, 60, 120, 180, 240, 300].map(a => (
        <line key={`rqw1${a}`} x1={230 + 10 * Math.cos(a * Math.PI / 180)} y1={285 + 10 * Math.sin(a * Math.PI / 180) * 0.96} x2={230 + 26 * Math.cos(a * Math.PI / 180)} y2={285 + 25 * Math.sin(a * Math.PI / 180) * 0.96} stroke="#6B7280" strokeWidth="3" strokeLinecap="round" />
      ))}
      <ellipse cx="230" cy="285" rx="11" ry="10" fill="#4B5563" />
      <ellipse cx="230" cy="285" rx="5" ry="4.5" fill="#9CA3AF" />
      <ellipse cx="230" cy="285" rx="42" ry="40" fill="none" stroke="#1F2937" strokeWidth="6" />

      {/* Rear wheel (near side) */}
      <ellipse cx="640" cy="285" rx="42" ry="40" fill="#111827" />
      <ellipse cx="640" cy="285" rx="36" ry="34" fill="#1F2937" />
      <ellipse cx="640" cy="285" rx="28" ry="27" fill="#374151" />
      {[0, 60, 120, 180, 240, 300].map(a => (
        <line key={`rqw2${a}`} x1={640 + 10 * Math.cos(a * Math.PI / 180)} y1={285 + 10 * Math.sin(a * Math.PI / 180) * 0.96} x2={640 + 26 * Math.cos(a * Math.PI / 180)} y2={285 + 25 * Math.sin(a * Math.PI / 180) * 0.96} stroke="#6B7280" strokeWidth="3" strokeLinecap="round" />
      ))}
      <ellipse cx="640" cy="285" rx="11" ry="10" fill="#4B5563" />
      <ellipse cx="640" cy="285" rx="5" ry="4.5" fill="#9CA3AF" />
      <ellipse cx="640" cy="285" rx="42" ry="40" fill="none" stroke="#1F2937" strokeWidth="6" />
    </g>
  );
}

export default function Car3D() {
  const containerRef = useRef(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const containerHeight = containerRef.current.offsetHeight;
      const viewportHeight = window.innerHeight;

      // Calculate scroll progress through the container
      const scrolled = -rect.top;
      const scrollableDistance = containerHeight - viewportHeight;
      const p = Math.max(0, Math.min(1, scrolled / scrollableDistance));
      setProgress(p);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Determine which views to show and their opacities
  // 0-0.35: front quarter → side
  // 0.35-0.65: side view
  // 0.65-1.0: side → rear quarter
  let frontOpacity = 0, sideOpacity = 0, rearOpacity = 0;

  if (progress <= 0.3) {
    frontOpacity = 1 - (progress / 0.3);
    sideOpacity = progress / 0.3;
  } else if (progress <= 0.7) {
    sideOpacity = 1;
  } else {
    sideOpacity = 1 - ((progress - 0.7) / 0.3);
    rearOpacity = (progress - 0.7) / 0.3;
  }

  // Wheel spin based on progress
  const wheelRotation = progress * 720;

  // Label that shows current view
  const viewLabel = progress < 0.25 ? 'Front Quarter' : progress < 0.45 ? 'Profile View' : progress < 0.55 ? 'Side Profile' : progress < 0.75 ? 'Rear Profile' : 'Rear Quarter';
  const progressPercent = Math.round(progress * 360);

  return (
    <div ref={containerRef} style={{ height: '300vh', position: 'relative' }}>
      <div style={{
        position: 'sticky', top: 0, height: '100vh',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        background: '#0F172A', overflow: 'hidden',
      }}>
        {/* Background elements */}
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 50% 40%, rgba(30,58,138,0.1) 0%, transparent 60%)', pointerEvents: 'none' }} />

        {/* Circular track / turntable indicator */}
        <div style={{
          position: 'absolute', width: '500px', height: '500px', maxWidth: '90vw', maxHeight: '90vw',
          borderRadius: '50%', border: '1px solid rgba(148,163,184,0.06)',
          top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
          pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute', width: '380px', height: '380px', maxWidth: '75vw', maxHeight: '75vw',
          borderRadius: '50%', border: '1px solid rgba(148,163,184,0.04)',
          top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
          pointerEvents: 'none',
        }} />

        {/* Top label */}
        <div style={{ position: 'absolute', top: 'clamp(1rem, 5vh, 2.5rem)', left: 0, right: 0, textAlign: 'center', zIndex: 5 }}>
          <p style={{ color: '#93C5FD', fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '0.3rem' }}>360° Showroom</p>
          <h2 style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: 'clamp(1.3rem, 3vw, 2.2rem)', fontWeight: 900, color: 'white' }}>
            Scroll to <span style={{ color: '#93C5FD' }}>Explore</span>
          </h2>
        </div>

        {/* The car SVG */}
        <svg
          viewBox="0 0 950 400"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{
            width: '600px', maxWidth: '92vw', height: 'auto',
            position: 'relative', zIndex: 2,
            filter: 'drop-shadow(0 20px 40px rgba(0,0,0,0.3))',
          }}
        >
          <FrontQuarterView opacity={frontOpacity} />
          <SideView opacity={sideOpacity} />
          <RearQuarterView opacity={rearOpacity} />

          <defs>
            <linearGradient id="bodyGrad3d" x1="0" y1="140" x2="0" y2="290">
              <stop offset="0%" stopColor="#1E3A8A" />
              <stop offset="50%" stopColor="#1E3A8A" />
              <stop offset="100%" stopColor="#172554" />
            </linearGradient>
            <linearGradient id="roofGrad3d" x1="400" y1="145" x2="400" y2="185">
              <stop offset="0%" stopColor="#2563EB" />
              <stop offset="100%" stopColor="#1E3A8A" />
            </linearGradient>
            <linearGradient id="highlight3d" x1="100" y1="0" x2="820" y2="0">
              <stop offset="0%" stopColor="transparent" />
              <stop offset="25%" stopColor="#93C5FD" />
              <stop offset="75%" stopColor="#93C5FD" />
              <stop offset="100%" stopColor="transparent" />
            </linearGradient>
            <radialGradient id="shadow3d" cx="0.5" cy="0.5" r="0.5">
              <stop offset="0%" stopColor="#0F172A" stopOpacity="0.7" />
              <stop offset="100%" stopColor="#0F172A" stopOpacity="0" />
            </radialGradient>
          </defs>
        </svg>

        {/* Platform / turntable base */}
        <div style={{
          position: 'absolute', bottom: 'clamp(12%, 18vh, 22%)',
          width: '55%', maxWidth: '500px', height: '4px',
          background: 'linear-gradient(90deg, transparent, rgba(148,163,184,0.15) 20%, rgba(148,163,184,0.15) 80%, transparent)',
          borderRadius: '2px',
        }} />

        {/* Bottom: view label + progress */}
        <div style={{ position: 'absolute', bottom: 'clamp(1rem, 4vh, 2rem)', left: 0, right: 0, textAlign: 'center', zIndex: 5 }}>
          <p style={{ fontFamily: 'Rajdhani, sans-serif', color: '#64748B', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: '0.6rem' }}>
            {viewLabel}
          </p>
          {/* Progress bar */}
          <div style={{ width: '120px', height: '3px', background: 'rgba(148,163,184,0.1)', borderRadius: '2px', margin: '0 auto', overflow: 'hidden' }}>
            <div style={{ width: `${progress * 100}%`, height: '100%', background: '#1E3A8A', borderRadius: '2px', transition: 'width 0.1s linear' }} />
          </div>
          <p style={{ color: '#475569', fontSize: '0.65rem', marginTop: '0.4rem', fontFamily: 'Rajdhani, sans-serif', fontWeight: 600 }}>{progressPercent}°</p>
        </div>

        {/* Scroll indicator */}
        {progress < 0.05 && (
          <div style={{ position: 'absolute', bottom: 'clamp(4rem, 10vh, 6rem)', left: '50%', transform: 'translateX(-50%)', animation: 'scrollBounce 2s infinite', zIndex: 5 }}>
            <div style={{ width: '20px', height: '32px', borderRadius: '10px', border: '2px solid rgba(148,163,184,0.3)', display: 'flex', justifyContent: 'center', paddingTop: '6px' }}>
              <div style={{ width: '3px', height: '8px', background: '#93C5FD', borderRadius: '2px' }} />
            </div>
          </div>
        )}

        <style>{`
          @keyframes scrollBounce {
            0%, 100% { transform: translateX(-50%) translateY(0); opacity: 1; }
            50% { transform: translateX(-50%) translateY(8px); opacity: 0.5; }
          }
        `}</style>
      </div>
    </div>
  );
}
