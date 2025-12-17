

export function RobotAvatar({ size = 40, className = '' }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`drop-shadow-lg ${className}`}
    >
      {}
      <defs>
        <linearGradient id="robotGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#10b981" />
          <stop offset="100%" stopColor="#06b6d4" />
        </linearGradient>
        <linearGradient id="eyeGlow" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#34d399" />
          <stop offset="100%" stopColor="#22d3ee" />
        </linearGradient>
      </defs>

      {}
      <rect
        x="20"
        y="25"
        width="60"
        height="55"
        rx="8"
        fill="url(#robotGradient)"
        stroke="#047857"
        strokeWidth="3"
      />

      {}
      <line x1="50" y1="25" x2="50" y2="15" stroke="#047857" strokeWidth="3" />
      <circle cx="50" cy="12" r="4" fill="#34d399" className="animate-pulse" />

      {}
      <circle cx="35" cy="45" r="7" fill="url(#eyeGlow)" className="animate-pulse" />
      <circle cx="65" cy="45" r="7" fill="url(#eyeGlow)" className="animate-pulse" />
      
      {}
      <circle cx="35" cy="45" r="3" fill="#ffffff" />
      <circle cx="65" cy="45" r="3" fill="#ffffff" />

      {}
      <path
        d="M 30 65 Q 50 72 70 65"
        stroke="#ffffff"
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
      />

      {}
      <path
        d="M 27 55 L 25 58 L 27 58 L 25 61"
        stroke="#fbbf24"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M 73 55 L 75 58 L 73 58 L 75 61"
        stroke="#fbbf24"
        strokeWidth="2"
        strokeLinecap="round"
      />

      {}
      <circle cx="15" cy="35" r="2" fill="#34d399" opacity="0.8" className="animate-ping" />
      <circle cx="85" cy="40" r="2" fill="#22d3ee" opacity="0.8" className="animate-ping" style={{ animationDelay: '0.5s' }} />
      <circle cx="18" cy="65" r="2" fill="#10b981" opacity="0.8" className="animate-ping" style={{ animationDelay: '1s' }} />
      <circle cx="82" cy="70" r="2" fill="#06b6d4" opacity="0.8" className="animate-ping" style={{ animationDelay: '1.5s' }} />
    </svg>
  );
}

export function EnerNovaLogo({ size = 40, className = '' }: { size?: number; className?: string }) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 100 100"
      className={`transition-transform hover:scale-110 ${className}`}
      fill="none"
    >
      {}
      <defs>
        <linearGradient id="logoGradient1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#10b981" />
          <stop offset="50%" stopColor="#14b8a6" />
          <stop offset="100%" stopColor="#06b6d4" />
        </linearGradient>
        
        <linearGradient id="logoGradient2" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#34d399" />
          <stop offset="100%" stopColor="#10b981" />
        </linearGradient>
        
        <radialGradient id="glowEffect" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#10b981" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
        </radialGradient>
      </defs>
      
      {}
      <circle 
        cx="50" 
        cy="50" 
        r="48" 
        fill="none"
        stroke="#065f46"
        strokeWidth="3"
      />
      
      {}
      <circle 
        cx="50" 
        cy="50" 
        r="45" 
        fill="url(#glowEffect)"
        className="animate-pulse"
      />
      
      {}
      <circle 
        cx="50" 
        cy="50" 
        r="42" 
        fill="url(#logoGradient1)"
        stroke="#047857"
        strokeWidth="2"
      />
      
      {}
      <path
        d="M20 50 Q30 40, 40 50 T60 50 T80 50"
        stroke="rgba(255,255,255,0.2)"
        strokeWidth="3"
        fill="none"
        className="animate-pulse"
        style={{ animationDuration: '2s' }}
      />
      
      {}
      <path 
        d="M58 25 L42 50 L50 50 L38 75 L54 50 L 46 50 Z"
        fill="#ffffff"
        stroke="#065f46"
        strokeWidth="3"
        strokeLinejoin="round"
        className="drop-shadow-lg"
      />
      {}
      <path 
        d="M58 25 L42 50 L50 50 L38 75 L54 50 L46 50 Z"
        fill="#ffffff"
        stroke="#10b981"
        strokeWidth="1"
        strokeLinejoin="round"
      />
      
      {}
      <path
        d="M35 65 Q35 55, 45 55 Q50 55, 50 60 Q50 65, 45 70 Q35 70, 35 65"
        fill="url(#logoGradient2)"
        opacity="0.9"
        stroke="#065f46"
        strokeWidth="1.5"
      />
      
      {}
      <path
        d="M50 40 Q50 35, 55 35 Q60 35, 60 40 Q60 45, 55 48 Q50 48, 50 40"
        fill="url(#logoGradient2)"
        opacity="0.9"
        stroke="#065f46"
        strokeWidth="1.5"
      />
      
      {}
      <circle cx="28" cy="38" r="2" fill="#34d399" opacity="0.6" className="animate-ping" style={{ animationDuration: '3s' }} />
      <circle cx="72" cy="38" r="2" fill="#34d399" opacity="0.6" className="animate-ping" style={{ animationDuration: '2.5s', animationDelay: '0.5s' }} />
      <circle cx="30" cy="65" r="1.5" fill="#14b8a6" opacity="0.5" className="animate-ping" style={{ animationDuration: '2s', animationDelay: '1s' }} />
      <circle cx="70" cy="62" r="1.5" fill="#14b8a6" opacity="0.5" className="animate-ping" style={{ animationDuration: '3s', animationDelay: '0.3s' }} />
    </svg>
  );
}

export function EnerNovaCompact({ size = 32, className = '' }: { size?: number; className?: string }) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 100 100"
      className={className}
      fill="none"
    >
      <defs>
        <linearGradient id="compactGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#10b981" />
          <stop offset="100%" stopColor="#14b8a6" />
        </linearGradient>
      </defs>
      
      {}
      <circle 
        cx="50" 
        cy="50" 
        r="42" 
        fill="url(#compactGradient)"
      />
      
      {}
      <path 
        d="M58 25 L42 50 L50 50 L38 75 L54 50 L46 50 Z"
        fill="#ffffff"
        strokeWidth="1.5"
      />
    </svg>
  );
}

export function EnerNovaLoading({ size = 40, className = '' }: { size?: number; className?: string }) {
  return (
    <div className="relative inline-block">
      <EnerNovaCompact size={size} className={className} />
      <div 
        className="absolute inset-0 rounded-full border-4 border-emerald-600 border-t-transparent animate-spin"
        style={{ width: size, height: size }}
      />
    </div>
  );
}
