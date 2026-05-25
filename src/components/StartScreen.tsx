interface StartScreenProps {
  onStart: () => void
}

export default function StartScreen({ onStart }: StartScreenProps) {
  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center bg-[#0a0a1a] overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        {Array.from({ length: 60 }).map((_, i) => (
          <div
            key={i}
            className="absolute"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: '2px',
              height: '2px',
              backgroundColor: '#ffffff',
              opacity: 0.1 + Math.random() * 0.5,
              animation: `twinkle ${2 + Math.random() * 4}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 3}s`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 text-center mb-8">
        <h1
          className="text-5xl md:text-7xl font-bold mb-2 tracking-[0.3em]"
          style={{
            fontFamily: 'monospace',
            color: '#ffd700',
            textShadow: '0 0 20px #ffd700, 0 0 40px #ff8800, 0 0 60px #ff4400',
            animation: 'glow 2s ease-in-out infinite alternate',
          }}
        >
          MECHA
        </h1>
        <h2
          className="text-3xl md:text-5xl font-bold tracking-[0.5em]"
          style={{
            fontFamily: 'monospace',
            color: '#ffffff',
            textShadow: '0 0 10px #00d4ff, 0 0 20px #ff3366',
          }}
        >
          BATTLE
        </h2>
        <div
          className="mt-2 text-xs tracking-[0.2em]"
          style={{ fontFamily: 'monospace', color: '#4a4a5a' }}
        >
          PIXEL ARENA
        </div>
      </div>

      <div className="relative z-10 flex gap-6 mb-10 px-4 max-w-2xl w-full">
        <div
          className="flex-1 p-4 border-2"
          style={{
            borderColor: '#00d4ff',
            backgroundColor: 'rgba(0,212,255,0.05)',
            boxShadow: '0 0 10px rgba(0,212,255,0.1), inset 0 0 10px rgba(0,212,255,0.05)',
          }}
        >
          <div
            className="text-center mb-3 text-sm font-bold tracking-wider"
            style={{ fontFamily: 'monospace', color: '#00d4ff' }}
          >
            P1 - BLUE
          </div>
          <div className="space-y-1 text-xs" style={{ fontFamily: 'monospace', color: '#888899' }}>
            <div className="flex justify-between">
              <span>移动</span>
              <span style={{ color: '#ccccdd' }}>A / D</span>
            </div>
            <div className="flex justify-between">
              <span>跳跃</span>
              <span style={{ color: '#ccccdd' }}>W</span>
            </div>
            <div className="flex justify-between">
              <span>攻击</span>
              <span style={{ color: '#ccccdd' }}>J</span>
            </div>
            <div className="flex justify-between">
              <span>重击</span>
              <span style={{ color: '#ccccdd' }}>L</span>
            </div>
            <div className="flex justify-between">
              <span>防御</span>
              <span style={{ color: '#ccccdd' }}>K (按住)</span>
            </div>
          </div>
        </div>

        <div
          className="flex-1 p-4 border-2"
          style={{
            borderColor: '#ff3366',
            backgroundColor: 'rgba(255,51,102,0.05)',
            boxShadow: '0 0 10px rgba(255,51,102,0.1), inset 0 0 10px rgba(255,51,102,0.05)',
          }}
        >
          <div
            className="text-center mb-3 text-sm font-bold tracking-wider"
            style={{ fontFamily: 'monospace', color: '#ff3366' }}
          >
            P2 - RED
          </div>
          <div className="space-y-1 text-xs" style={{ fontFamily: 'monospace', color: '#888899' }}>
            <div className="flex justify-between">
              <span>移动</span>
              <span style={{ color: '#ccccdd' }}>← / →</span>
            </div>
            <div className="flex justify-between">
              <span>跳跃</span>
              <span style={{ color: '#ccccdd' }}>↑</span>
            </div>
            <div className="flex justify-between">
              <span>攻击</span>
              <span style={{ color: '#ccccdd' }}>1</span>
            </div>
            <div className="flex justify-between">
              <span>重击</span>
              <span style={{ color: '#ccccdd' }}>3</span>
            </div>
            <div className="flex justify-between">
              <span>防御</span>
              <span style={{ color: '#ccccdd' }}>2 (按住)</span>
            </div>
          </div>
        </div>
      </div>

      <button
        onClick={onStart}
        className="relative z-10 px-10 py-4 text-lg font-bold tracking-wider transition-all duration-200 hover:scale-110 active:scale-95"
        style={{
          fontFamily: 'monospace',
          backgroundColor: '#ffd700',
          color: '#0a0a1a',
          border: '4px solid #cc9900',
          boxShadow: '0 4px 0 #996600, 0 0 20px rgba(255,215,0,0.3)',
          imageRendering: 'pixelated',
        }}
      >
        开始战斗
      </button>

      <div
        className="relative z-10 mt-6 text-xs"
        style={{ fontFamily: 'monospace', color: '#4a4a5a' }}
      >
        重击消耗能量条 · 防御减免60%伤害 · 99秒限时
      </div>
    </div>
  )
}
