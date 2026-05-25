interface ResultScreenProps {
  winner: number | null
  onRestart: () => void
}

export default function ResultScreen({ winner, onRestart }: ResultScreenProps) {
  const winnerName = winner === 1 ? 'BLUE' : winner === 2 ? 'RED' : 'DRAW'
  const winnerColor = winner === 1 ? '#00d4ff' : winner === 2 ? '#ff3366' : '#ffd700'

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center bg-[#0a0a1a] overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        {Array.from({ length: 30 }).map((_, i) => (
          <div
            key={i}
            className="absolute rounded-sm"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${2 + Math.random() * 4}px`,
              height: `${2 + Math.random() * 4}px`,
              backgroundColor: ['#ffd700', '#ff3366', '#00d4ff', '#ffffff'][i % 4],
              opacity: 0.3 + Math.random() * 0.5,
              animation: `float ${2 + Math.random() * 3}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 2}s`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 text-center">
        <h1
          className="text-6xl font-bold mb-2 tracking-widest"
          style={{
            fontFamily: 'monospace',
            color: winnerColor,
            textShadow: `0 0 20px ${winnerColor}, 0 0 40px ${winnerColor}, 0 0 60px ${winnerColor}`,
            animation: 'pulse 1.5s ease-in-out infinite',
          }}
        >
          K.O.!
        </h1>

        <div
          className="text-3xl font-bold mb-8 tracking-wider"
          style={{
            fontFamily: 'monospace',
            color: winnerColor,
            textShadow: `0 0 10px ${winnerColor}`,
          }}
        >
          {winner === 0 ? '平局！' : `${winnerName} WINS!`}
        </div>

        <div
          className="mb-12 text-lg"
          style={{ fontFamily: 'monospace', color: '#888899' }}
        >
          {winner === 0 ? '势均力敌！' : winner === 1 ? '蓝方机甲获得胜利！' : '红方机甲获得胜利！'}
        </div>

        <button
          onClick={onRestart}
          className="px-8 py-4 text-lg font-bold tracking-wider transition-all duration-200 hover:scale-110 active:scale-95"
          style={{
            fontFamily: 'monospace',
            backgroundColor: '#ffd700',
            color: '#0a0a1a',
            border: '4px solid #cc9900',
            boxShadow: '0 4px 0 #996600, 0 0 20px rgba(255,215,0,0.3)',
            imageRendering: 'pixelated',
          }}
        >
          再来一局
        </button>
      </div>
    </div>
  )
}
