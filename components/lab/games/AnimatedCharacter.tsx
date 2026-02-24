'use client'

interface AnimatedCharacterProps {
  teamColor: 'blue' | 'red'
  isPulling: boolean
  position: number // 0-3 for different positions in the team
  isWinner?: boolean
}

export default function AnimatedCharacter({ 
  teamColor, 
  isPulling, 
  position,
  isWinner = false 
}: AnimatedCharacterProps) {
  const colorClasses = teamColor === 'blue' 
    ? 'fill-blue-500 stroke-blue-700' 
    : 'fill-red-500 stroke-red-700'
  
  const skinColor = '#FFD5A3'
  const shirtColor = teamColor === 'blue' ? '#3B82F6' : '#EF4444'
  const pantsColor = '#1E293B'

  return (
    <div 
      className={`relative transition-all duration-300 ${
        isPulling 
          ? 'animate-pull' 
          : isWinner 
            ? 'animate-celebrate' 
            : ''
      }`}
      style={{
        animation: isPulling 
          ? `pull-${teamColor} 0.6s ease-in-out` 
          : isWinner 
            ? 'celebrate 0.5s ease-in-out' 
            : 'none',
        transform: `translateX(${position * (teamColor === 'blue' ? -10 : 10)}px)`,
      }}
    >
      <svg 
        width="60" 
        height="80" 
        viewBox="0 0 60 80" 
        className="drop-shadow-lg"
      >
        {/* Head */}
        <circle 
          cx="30" 
          cy="20" 
          r="10" 
          fill={skinColor} 
          stroke="#D4A574" 
          strokeWidth="2"
        />
        
        {/* Hair */}
        <ellipse 
          cx="30" 
          cy="15" 
          rx="11" 
          ry="8" 
          fill="#4A3728"
        />
        
        {/* Eyes */}
        <circle cx="26" cy="20" r="2" fill="#000" />
        <circle cx="34" cy="20" r="2" fill="#000" />
        
        {/* Mouth - changes based on state */}
        {isWinner ? (
          <path 
            d="M 25 24 Q 30 27 35 24" 
            fill="none" 
            stroke="#000" 
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        ) : (
          <path 
            d="M 25 25 Q 30 23 35 25" 
            fill="none" 
            stroke="#000" 
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        )}
        
        {/* Body (Shirt) */}
        <rect 
          x="20" 
          y="30" 
          width="20" 
          height="25" 
          rx="3" 
          fill={shirtColor}
          stroke={teamColor === 'blue' ? '#2563EB' : '#DC2626'}
          strokeWidth="2"
        />
        
        {/* Arms - pulling position */}
        <g className={isPulling ? 'arm-pulling' : ''}>
          {/* Left arm */}
          <path 
            d={isPulling 
              ? teamColor === 'blue' 
                ? "M 20 35 Q 10 40 12 50" 
                : "M 20 35 Q 10 40 8 50"
              : "M 20 35 Q 15 45 18 55"
            }
            fill="none" 
            stroke={shirtColor} 
            strokeWidth="6"
            strokeLinecap="round"
          />
          
          {/* Right arm */}
          <path 
            d={isPulling 
              ? teamColor === 'blue' 
                ? "M 40 35 Q 50 40 48 50"
                : "M 40 35 Q 50 40 52 50"
              : "M 40 35 Q 45 45 42 55"
            }
            fill="none" 
            stroke={shirtColor} 
            strokeWidth="6"
            strokeLinecap="round"
          />
          
          {/* Hands */}
          <circle 
            cx={isPulling ? (teamColor === 'blue' ? '12' : '8') : '18'} 
            cy={isPulling ? '50' : '55'} 
            r="4" 
            fill={skinColor}
            stroke="#D4A574"
            strokeWidth="1"
          />
          <circle 
            cx={isPulling ? (teamColor === 'blue' ? '48' : '52') : '42'} 
            cy={isPulling ? '50' : '55'} 
            r="4" 
            fill={skinColor}
            stroke="#D4A574"
            strokeWidth="1"
          />
        </g>
        
        {/* Legs */}
        <g>
          {/* Left leg */}
          <rect 
            x="23" 
            y="55" 
            width="7" 
            height="20" 
            rx="2" 
            fill={pantsColor}
          />
          
          {/* Right leg */}
          <rect 
            x="30" 
            y="55" 
            width="7" 
            height="20" 
            rx="2" 
            fill={pantsColor}
          />
          
          {/* Shoes */}
          <ellipse 
            cx="26" 
            cy="76" 
            rx="5" 
            ry="3" 
            fill="#000"
          />
          <ellipse 
            cx="33" 
            cy="76" 
            rx="5" 
            ry="3" 
            fill="#000"
          />
        </g>
      </svg>
      
      <style jsx>{`
        @keyframes pull-blue {
          0%, 100% { transform: translateX(0) rotate(0deg); }
          50% { transform: translateX(-8px) rotate(-5deg); }
        }
        
        @keyframes pull-red {
          0%, 100% { transform: translateX(0) rotate(0deg); }
          50% { transform: translateX(8px) rotate(5deg); }
        }
        
        @keyframes celebrate {
          0%, 100% { transform: translateY(0) scale(1); }
          25% { transform: translateY(-10px) scale(1.1); }
          50% { transform: translateY(0) scale(1); }
          75% { transform: translateY(-5px) scale(1.05); }
        }
      `}</style>
    </div>
  )
}
