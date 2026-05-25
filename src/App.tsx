import { useState, useCallback } from 'react'
import StartScreen from '@/components/StartScreen'
import BattleScreen from '@/components/BattleScreen'
import ResultScreen from '@/components/ResultScreen'

type Screen = 'start' | 'battle' | 'result'

export default function App() {
  const [screen, setScreen] = useState<Screen>('start')
  const [winner, setWinner] = useState<number | null>(null)
  const [battleKey, setBattleKey] = useState(0)

  const handleStart = useCallback(() => {
    setBattleKey((k) => k + 1)
    setScreen('battle')
  }, [])

  const handleGameEnd = useCallback((w: number | null) => {
    setWinner(w)
    setScreen('result')
  }, [])

  const handleRestart = useCallback(() => {
    setWinner(null)
    setBattleKey((k) => k + 1)
    setScreen('battle')
  }, [])

  return (
    <div className="w-screen h-screen overflow-hidden bg-[#0a0a1a]">
      {screen === 'start' && <StartScreen onStart={handleStart} />}
      {screen === 'battle' && <BattleScreen key={battleKey} onGameEnd={handleGameEnd} />}
      {screen === 'result' && <ResultScreen winner={winner} onRestart={handleRestart} />}
    </div>
  )
}
