import { create } from 'zustand'
import { GameState, Mecha, GAME_CONFIG, createMecha } from '@/game/config'

interface GameStore {
  gameState: GameState
  winner: number | null
  roundTimer: number
  player1: Mecha
  player2: Mecha
  startGame: () => void
  resetGame: () => void
  setGameState: (state: GameState) => void
  setWinner: (player: number | null) => void
  setRoundTimer: (time: number) => void
  updatePlayer: (playerNum: 1 | 2, updates: Partial<Mecha>) => void
}

export const useGameStore = create<GameStore>((set) => ({
  gameState: 'ready',
  winner: null,
  roundTimer: GAME_CONFIG.roundTime,
  player1: createMecha(150, 'right', '#00d4ff', '#0088cc', 'BLUE'),
  player2: createMecha(450, 'left', '#ff3366', '#cc1144', 'RED'),

  startGame: () =>
    set({
      gameState: 'ready',
      winner: null,
      roundTimer: GAME_CONFIG.roundTime,
      player1: createMecha(150, 'right', '#00d4ff', '#0088cc', 'BLUE'),
      player2: createMecha(450, 'left', '#ff3366', '#cc1144', 'RED'),
    }),

  resetGame: () =>
    set({
      gameState: 'ready',
      winner: null,
      roundTimer: GAME_CONFIG.roundTime,
      player1: createMecha(150, 'right', '#00d4ff', '#0088cc', 'BLUE'),
      player2: createMecha(450, 'left', '#ff3366', '#cc1144', 'RED'),
    }),

  setGameState: (gameState) => set({ gameState }),
  setWinner: (winner) => set({ winner }),
  setRoundTimer: (roundTimer) => set({ roundTimer }),

  updatePlayer: (playerNum, updates) =>
    set((state) => ({
      [`player${playerNum}`]: {
        ...state[`player${playerNum}`],
        ...updates,
      },
    })),
}))
