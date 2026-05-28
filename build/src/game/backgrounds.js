import { GAME_CONFIG } from './config.js'

let bgCanvas = null

function generateBackground() {
  if (bgCanvas) return bgCanvas

  bgCanvas = document.createElement('canvas')
  bgCanvas.width = GAME_CONFIG.canvasWidth
  bgCanvas.height = GAME_CONFIG.canvasHeight
  const ctx = bgCanvas.getContext('2d')

  const skyGrad = ctx.createLinearGradient(0, 0, 0, GAME_CONFIG.groundY)
  skyGrad.addColorStop(0, '#0a0a1a')
  skyGrad.addColorStop(0.5, '#0f0f2a')
  skyGrad.addColorStop(1, '#1a1a3a')
  ctx.fillStyle = skyGrad
  ctx.fillRect(0, 0, GAME_CONFIG.canvasWidth, GAME_CONFIG.groundY)

  for (let i = 0; i < 50; i++) {
    const sx = Math.random() * GAME_CONFIG.canvasWidth
    const sy = Math.random() * (GAME_CONFIG.groundY - 40)
    const brightness = Math.random() * 0.8 + 0.2
    ctx.fillStyle = `rgba(255, 255, 255, ${brightness})`
    ctx.fillRect(Math.floor(sx), Math.floor(sy), 1, 1)
  }

  ctx.fillStyle = '#0d0d1a'
  for (let bx = 0; bx < GAME_CONFIG.canvasWidth; bx += 40) {
    const bh = 20 + Math.random() * 40
    ctx.fillRect(bx, GAME_CONFIG.groundY - 60 - bh, 36, bh)
  }

  ctx.fillStyle = '#1a1a2e'
  for (let bx = 0; bx < GAME_CONFIG.canvasWidth; bx += 30) {
    const bh = 10 + Math.random() * 25
    ctx.fillRect(bx, GAME_CONFIG.groundY - 30 - bh, 28, bh)
  }

  ctx.fillStyle = '#2a2a3a'
  ctx.fillRect(0, GAME_CONFIG.groundY - 20, GAME_CONFIG.canvasWidth, 20)

  ctx.fillStyle = '#3a3a4a'
  ctx.fillRect(0, GAME_CONFIG.groundY, GAME_CONFIG.canvasWidth, GAME_CONFIG.canvasHeight - GAME_CONFIG.groundY)

  ctx.fillStyle = '#4a4a5a'
  for (let lx = 0; lx < GAME_CONFIG.canvasWidth; lx += 16) {
    ctx.fillRect(lx, GAME_CONFIG.groundY, 16, 2)
  }

  return bgCanvas
}

export function drawBackground(ctx) {
  const bg = generateBackground()
  ctx.drawImage(bg, 0, 0)
}

export function resetBackground() {
  bgCanvas = null
}
