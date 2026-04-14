import { useState, useEffect } from 'react';

export default function HeroCar({ className, style }) {
  const [rotation, setRotation] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const maxScroll = window.innerHeight; // Adjust based on hero section height
      const rotationAngle = (scrollY / maxScroll) * 30 - 15; // Rotate from -15 to 15 degrees
      setRotation(rotationAngle);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <svg
      className={className}
      style={{
        ...style,
        transform: `rotateY(${rotation}deg)`,
        transition: 'transform 0.1s ease-out'
      }}
      viewBox="0 0 900 300"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Shadow under car */}
      <ellipse cx="450" cy="272" rx="320" ry="18" fill="url(#shadow)" opacity="0.5" />

      {/* Body - sleek sports car profile */}
      <path
        d="M150 210 L160 200 L200 195 L240 170 L280 148 L340 130 L400 122 L480 118 L560 118 L620 120 L680 128 L720 140 L745 155 L760 170 L770 185 L775 200 L775 215 L770 225 L760 232 L150 232 L142 225 L140 218 Z"
        fill="url(#bodyGrad)"
      />

      {/* Roof line - coupe profile */}
      <path
        d="M280 148 L340 130 L400 122 L480 118 L540 118 L580 120 L620 128 L640 138 L620 140 L560 135 L480 132 L400 134 L340 140 L300 152 Z"
        fill="url(#roofGrad)"
      />

      {/* Windshield */}
      <path
        d="M285 150 L340 132 L400 125 L470 122 L470 135 L400 136 L345 141 L300 154 Z"
        fill="#93C5FD"
        opacity="0.35"
      />

      {/* Rear window */}
      <path
        d="M575 122 L620 130 L640 140 L620 141 L580 136 L560 132 Z"
        fill="#93C5FD"
        opacity="0.25"
      />

      {/* Side windows */}
      <path
        d="M475 123 L555 123 L570 128 L575 135 L475 135 Z"
        fill="#93C5FD"
        opacity="0.3"
      />

      {/* Window pillar */}
      <path d="M470 122 L475 135 L468 135 L465 123 Z" fill="url(#bodyGrad)" />

      {/* Door line */}
      <path d="M465 140 L465 225" stroke="#172554" strokeWidth="0.8" opacity="0.4" />
      <path d="M345 145 L350 225" stroke="#172554" strokeWidth="0.8" opacity="0.3" />

      {/* Door handle */}
      <rect x="380" y="172" width="22" height="3" rx="1.5" fill="#93C5FD" opacity="0.3" />

      {/* Front bumper */}
      <path
        d="M150 210 L160 200 L180 196 L180 225 L150 232 L142 225 L140 218 Z"
        fill="url(#bumperGrad)"
      />

      {/* Headlight */}
      <path
        d="M155 202 L170 198 L175 204 L175 215 L165 218 L155 215 Z"
        fill="#DBEAFE"
        opacity="0.9"
      />
      <path
        d="M158 205 L168 202 L170 206 L170 212 L164 214 L158 212 Z"
        fill="white"
        opacity="0.7"
      />

      {/* Headlight beam glow */}
      <ellipse cx="140" cy="210" rx="25" ry="10" fill="#93C5FD" opacity="0.15" />

      {/* Rear bumper */}
      <path
        d="M760 170 L770 185 L775 200 L775 215 L770 225 L760 232 L750 232 L748 220 L750 195 L755 178 Z"
        fill="url(#bumperGrad)"
      />

      {/* Tail light */}
      <path
        d="M762 180 L768 190 L770 205 L768 215 L760 218 L758 200 L760 185 Z"
        fill="#EF4444"
        opacity="0.8"
      />
      <path
        d="M764 188 L767 195 L768 205 L766 210 L762 212 L761 200 L762 192 Z"
        fill="#FCA5A5"
        opacity="0.6"
      />

      {/* Side skirt / lower trim */}
      <path
        d="M210 225 L230 230 L730 230 L745 225 L745 232 L210 232 Z"
        fill="#0F172A"
        opacity="0.6"
      />

      {/* Side air vent */}
      <g opacity="0.4">
        <line x1="250" y1="195" x2="290" y2="192" stroke="#172554" strokeWidth="1" />
        <line x1="252" y1="199" x2="288" y2="196" stroke="#172554" strokeWidth="1" />
        <line x1="254" y1="203" x2="286" y2="200" stroke="#172554" strokeWidth="1" />
      </g>

      {/* Front wheel well */}
      <path
        d="M210 232 C210 200 270 195 290 195 C310 195 340 200 340 232"
        fill="#0B1120"
      />

      {/* Front wheel */}
      <circle cx="275" cy="232" r="38" fill="#111827" />
      <circle cx="275" cy="232" r="34" fill="#1F2937" />
      <circle cx="275" cy="232" r="28" fill="#374151" />
      {/* Spokes */}
      {[0, 60, 120, 180, 240, 300].map((angle) => (
        <line
          key={`fs${angle}`}
          x1={275 + 10 * Math.cos((angle * Math.PI) / 180)}
          y1={232 + 10 * Math.sin((angle * Math.PI) / 180)}
          x2={275 + 26 * Math.cos((angle * Math.PI) / 180)}
          y2={232 + 26 * Math.sin((angle * Math.PI) / 180)}
          stroke="#6B7280"
          strokeWidth="3"
          strokeLinecap="round"
        />
      ))}
      <circle cx="275" cy="232" r="11" fill="#4B5563" />
      <circle cx="275" cy="232" r="7" fill="#6B7280" />
      <circle cx="275" cy="232" r="3" fill="#9CA3AF" />
      {/* Tire */}
      <circle cx="275" cy="232" r="38" fill="none" stroke="#1F2937" strokeWidth="6" />

      {/* Rear wheel well */}
      <path
        d="M600 232 C600 200 660 195 680 195 C700 195 740 200 740 232"
        fill="#0B1120"
      />

      {/* Rear wheel */}
      <circle cx="670" cy="232" r="38" fill="#111827" />
      <circle cx="670" cy="232" r="34" fill="#1F2937" />
      <circle cx="670" cy="232" r="28" fill="#374151" />
      {[0, 60, 120, 180, 240, 300].map((angle) => (
        <line
          key={`rs${angle}`}
          x1={670 + 10 * Math.cos((angle * Math.PI) / 180)}
          y1={232 + 10 * Math.sin((angle * Math.PI) / 180)}
          x2={670 + 26 * Math.cos((angle * Math.PI) / 180)}
          y2={232 + 26 * Math.sin((angle * Math.PI) / 180)}
          stroke="#6B7280"
          strokeWidth="3"
          strokeLinecap="round"
        />
      ))}
      <circle cx="670" cy="232" r="11" fill="#4B5563" />
      <circle cx="670" cy="232" r="7" fill="#6B7280" />
      <circle cx="670" cy="232" r="3" fill="#9CA3AF" />
      <circle cx="670" cy="232" r="38" fill="none" stroke="#1F2937" strokeWidth="6" />

      {/* Highlight strip along body */}
      <path
        d="M175 198 L280 168 L400 155 L550 152 L680 158 L745 175"
        stroke="url(#highlightGrad)"
        strokeWidth="1.5"
        fill="none"
        opacity="0.6"
      />

      {/* Top edge highlight */}
      <path
        d="M285 149 L400 124 L480 119 L560 119 L620 127"
        stroke="white"
        strokeWidth="0.5"
        fill="none"
        opacity="0.2"
      />

      <defs>
        <linearGradient id="bodyGrad" x1="150" y1="120" x2="150" y2="240">
          <stop offset="0%" stopColor="#1E3A8A" />
          <stop offset="45%" stopColor="#1E3A8A" />
          <stop offset="100%" stopColor="#172554" />
        </linearGradient>
        <linearGradient id="roofGrad" x1="400" y1="115" x2="400" y2="145">
          <stop offset="0%" stopColor="#2563EB" />
          <stop offset="100%" stopColor="#1E3A8A" />
        </linearGradient>
        <linearGradient id="bumperGrad" x1="0" y1="190" x2="0" y2="235">
          <stop offset="0%" stopColor="#1E3A8A" />
          <stop offset="100%" stopColor="#0F172A" />
        </linearGradient>
        <linearGradient id="highlightGrad" x1="175" y1="0" x2="745" y2="0">
          <stop offset="0%" stopColor="transparent" />
          <stop offset="30%" stopColor="#93C5FD" />
          <stop offset="70%" stopColor="#93C5FD" />
          <stop offset="100%" stopColor="transparent" />
        </linearGradient>
        <radialGradient id="shadow" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor="#0F172A" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#0F172A" stopOpacity="0" />
        </radialGradient>
      </defs>
    </svg>
  );
}
