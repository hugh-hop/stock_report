import { useRef, useEffect, useCallback } from 'react'
import { GameEngine } from '@/game/engine'
import { GAME_CONFIG } from '@/game/config'

interface BattleScreenProps {
  onGameEnd: (winner: number | null) => void
}

export default function BattleScreen({ onGameEnd }: BattleScreenProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const engineRef = useRef<GameEngine | null>(null)
  const resultTriggered = useRef(false)

  const initEngine = useCallback(() => {
    if (!canvasRef.current) return

    if (engineRef.current) {
      engineRef.current.stop()
    }

    resultTriggered.current = false
    const engine = new GameEngine(canvasRef.current)
    engineRef.current = engine

    engine.setCallback((_p1, _p2, gameState, _timer, winner) => {
      if (gameState === 'result' && !resultTriggered.current) {
        resultTriggered.current = true
        setTimeout(() => onGameEnd(winner), 100)
      }
    })

    engine.start()
  }, [onGameEnd])

  useEffect(() => {
    initEngine()
    return () => {
      if (engineRef.current) {
        engineRef.current.stop()
      }
    }
  }, [initEngine])

  return (
    <div className="relative w-full h-full flex items-center justify-center bg-[#0a0a1a]">
      <canvas
        ref={canvasRef}
        width={GAME_CONFIG.canvasWidth}
        height={GAME_CONFIG.canvasHeight}
        className="block border-2 border-[#2a2a3a]"
        style={{
          imageRendering: 'pixelated',
          width: `${GAME_CONFIG.canvasWidth * GAME_CONFIG.pixelScale}px`,
          height: `${GAME_CONFIG.canvasHeight * GAME_CONFIG.pixelScale}px`,
          maxWidth: '100%',
          maxHeight: '100%',
          objectFit: 'contain',
        }}
      />
    </div>
  )
}
