export function LogoIcon({ className = "w-10 h-10" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Logo AYEKOBINOU SERVICE"
    >
      <defs>
        <linearGradient id="mapGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#2D6043" />
          <stop offset="100%" stopColor="#1B3C2A" />
        </linearGradient>
        <linearGradient id="accentGradient" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#8A6246" />
          <stop offset="100%" stopColor="#C9A37E" />
        </linearGradient>
        <linearGradient id="leafGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#7EAA6A" />
          <stop offset="100%" stopColor="#557A46" />
        </linearGradient>
      </defs>

      {/* Fond écuelle / blason moderne adouci */}
      <rect
        x="6"
        y="6"
        width="108"
        height="108"
        rx="28"
        fill="url(#mapGradient)"
        stroke="url(#accentGradient)"
        strokeWidth="3.5"
      />

      {/* Cercle intérieur subtil */}
      <circle
        cx="60"
        cy="60"
        r="44"
        stroke="#FFFFFF"
        strokeOpacity="0.08"
        strokeWidth="1.5"
        strokeDasharray="4 3"
      />

      {/* Branche / Feuille agropastorale stylisée sur le dessus */}
      <path
        d="M60 22 C60 22, 68 28, 70 36 C64 36, 61 31, 60 22 Z"
        fill="url(#leafGradient)"
      />
      <path
        d="M60 22 C60 22, 52 28, 50 36 C56 36, 59 31, 60 22 Z"
        fill="url(#leafGradient)"
      />
      <circle cx="60" cy="22" r="2.5" fill="#E8D5B5" />

      {/* Monogramme typographique puissant MAP */}
      <g fill="#FCFBF7">
        {/* Lettre M */}
        <path
          d="M26 78 V44 H34 L43 63 L52 44 H60 V78 H52.5 V54 L44.5 70.5 H41.5 L33.5 54 V78 H26 Z"
        />

        {/* Lettre A stylisée avec chevron */}
        <path
          d="M63 78 L74 44 H82 L93 78 H84.5 L82.5 71 H73.5 L71.5 78 H63 Z M75.5 64.5 H80.5 L78 54.5 L75.5 64.5 Z"
        />

        {/* Lettre P */}
        <path
          d="M97 44 H108 C113.5 44 117 47.5 117 52.5 C117 57.5 113.5 61 108 61 H104.5 V78 H97 V44 Z M104.5 54.5 H107.5 C109.5 54.5 110.5 53.5 110.5 52.5 C110.5 51.5 109.5 50.5 107.5 50.5 H104.5 V54.5 Z"
          transform="translate(-6, 0) scale(0.92, 1)"
        />
      </g>

      {/* Épi doré / Sillon agropastoral en bas */}
      <path
        d="M36 88 Q60 94 84 88"
        stroke="url(#accentGradient)"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <circle cx="60" cy="91" r="2.5" fill="#C9A37E" />
    </svg>
  );
}

export default function Logo({
  variant = 'horizontal',
  size = 'md',
  farmName = 'AYEKOBINOU SERVICE',
  tagline = "Domaine d'élevage & vente de produits",
  showManager = true,
}: {
  variant?: 'horizontal' | 'icon' | 'stacked';
  size?: 'sm' | 'md' | 'lg';
  farmName?: string;
  tagline?: string;
  showManager?: boolean;
}) {
  const iconSizes = {
    sm: 'w-8 h-8',
    md: 'w-11 h-11',
    lg: 'w-16 h-16',
  };

  const avatarSizes = {
    sm: 'w-8 h-8',
    md: 'w-11 h-11 sm:w-12 sm:h-12',
    lg: 'w-14 h-14 sm:w-16 sm:h-16',
  };

  const textSizes = {
    sm: 'text-base',
    md: 'text-lg sm:text-xl',
    lg: 'text-2xl sm:text-3xl',
  };

  if (variant === 'icon') {
    return <LogoIcon className={iconSizes[size]} />;
  }

  return (
    <div className={`flex ${variant === 'stacked' ? 'flex-col items-center text-center' : 'items-center'} gap-2.5 sm:gap-3.5 group`}>
      {showManager && (
        <div className="relative shrink-0">
          <div className={`${avatarSizes[size]} rounded-full overflow-hidden border-2 border-[#557A46] shadow-xs ring-2 ring-[#234B35]/20 group-hover:ring-[#557A46] transition-all bg-[#234B35]`}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/responsable.jpg"
              alt="Responsable - AYEKOBINOU SERVICE"
              className="w-full h-full object-cover object-top scale-110"
            />
          </div>
          <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full" />
        </div>
      )}
      <LogoIcon className={`${iconSizes[size]} shrink-0 transition-transform duration-300 group-hover:scale-105`} />
      <div className="leading-tight">
        <span className={`block font-serif font-black ${textSizes[size]} text-[#234B35] tracking-tight`}>
          {farmName}
        </span>
        <span className="block text-[11px] font-semibold text-[#8A6246] tracking-wider uppercase">
          {tagline}
        </span>
      </div>
    </div>
  );
}
