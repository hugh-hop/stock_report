import { Mecha, GAME_CONFIG, Particle, HitSpark, GameState } from './config'
import { drawBackground } from './backgrounds'
import { drawMecha } from './sprites'
import { drawParticles, drawSparks } from './effects'

export function render(
  ctx: CanvasRenderingContext2D,
  p1: Mecha,
  p2: Mecha,
  particles: Particle[],
  sparks: HitSpark[],
  gameState: GameState,
  roundTimer: number,
  readyTimer: number
) {
  ctx.imageSmoothingEnabled = false

  drawBackground(ctx)

  drawMecha(ctx, p1)
  drawMecha(ctx, p2)

  drawSparks(ctx, sparks)
  drawParticles(ctx, particles)

  drawHud(ctx, p1, p2, roundTimer)

  if (gameState === 'ready') {
    drawReadyOverlay(ctx, readyTimer)
  }

  if (gameState === 'ko') {
    drawKoOverlay(ctx)
  }
}

function drawHud(ctx: CanvasRenderingContext2D, p1: Mecha, p2: Mecha, roundTimer: number) {
  const barWidth = 200
  const barHeight = 12
  const barY = 16
  const energyBarHeight = 4
  const energyBarY = barY + barHeight + 3

  ctx.fillStyle = '#1a1a2e'
  ctx.fillRect(20, barY - 2, barWidth + 4, barHeight + 4)
  ctx.fillRect(GAME_CONFIG.canvasWidth - 24 - barWidth, barY - 2, barWidth + 4, barHeight + 4)

  const p1HpWidth = (p1.hp / p1.maxHp) * barWidth
  const p1HpColor = p1.hp > 50 ? '#00d4ff' : p1.hp > 25 ? '#ffaa00' : '#ff3366'
  ctx.fillStyle = '#0a0a1a'
  ctx.fillRect(22, barY, barWidth, barHeight)
  ctx.fillStyle = p1HpColor
  ctx.fillRect(22, barY, p1HpWidth, barHeight)
  ctx.fillStyle = 'rgba(255,255,255,0.3)'
  ctx.fillRect(22, barY, p1HpWidth, barHeight / 2)

  const p2HpWidth = (p2.hp / p2.maxHp) * barWidth
  const p2HpColor = p2.hp > 50 ? '#ff3366' : p2.hp > 25 ? '#ffaa00' : '#ff3366'
  const p2BarX = GAME_CONFIG.canvasWidth - 22 - barWidth
  ctx.fillStyle = '#0a0a1a'
  ctx.fillRect(p2BarX, barY, barWidth, barHeight)
  ctx.fillStyle = p2HpColor
  ctx.fillRect(p2BarX + barWidth - p2HpWidth, barY, p2HpWidth, barHeight)
  ctx.fillStyle = 'rgba(255,255,255,0.3)'
  ctx.fillRect(p2BarX + barWidth - p2HpWidth, barY, p2HpWidth, barHeight / 2)

  ctx.fillStyle = '#1a1a2e'
  ctx.fillRect(20, energyBarY - 1, barWidth + 4, energyBarHeight + 2)
  ctx.fillRect(GAME_CONFIG.canvasWidth - 24 - barWidth, energyBarY - 1, barWidth + 4, energyBarHeight + 2)

  const p1EnergyWidth = (p1.energy / p1.maxEnergy) * barWidth
  ctx.fillStyle = '#0a0a1a'
  ctx.fillRect(22, energyBarY, barWidth, energyBarHeight)
  ctx.fillStyle = '#ffd700'
  ctx.fillRect(22, energyBarY, p1EnergyWidth, energyBarHeight)

  const p2EnergyWidth = (p2.energy / p2.maxEnergy) * barWidth
  ctx.fillStyle = '#0a0a1a'
  ctx.fillRect(p2BarX, energyBarY, barWidth, energyBarHeight)
  ctx.fillStyle = '#ffd700'
  ctx.fillRect(p2BarX + barWidth - p2EnergyWidth, energyBarY, p2EnergyWidth, energyBarHeight)

  ctx.font = '8px monospace'
  ctx.textAlign = 'left'
  ctx.fillStyle = '#00d4ff'
  ctx.fillText(p1.name, 22, barY - 4)
  ctx.textAlign = 'right'
  ctx.fillStyle = '#ff3366'
  ctx.fillText(p2.name, GAME_CONFIG.canvasWidth - 22, barY - 4)

  ctx.textAlign = 'center'
  ctx.font = 'bold 16px monospace'
  ctx.fillStyle = '#ffd700'
  const timerStr = String(Math.max(0, Math.ceil(roundTimer)))
  ctx.fillText(timerStr, GAME_CONFIG.canvasWidth / 2, barY + 12)
}

function drawReadyOverlay(ctx: CanvasRenderingContext2D, readyTimer: number) {
  ctx.fillStyle = 'rgba(0,0,0,0.5)'
  ctx.fillRect(0, 0, GAME_CONFIG.canvasWidth, GAME_CONFIG.canvasHeight)

  ctx.textAlign = 'center'
  ctx.font = 'bold 24px monospace'

  if (readyTimer > 120) {
    ctx.fillStyle = '#ffd700'
    ctx.fillText('READY', GAME_CONFIG.canvasWidth / 2, GAME_CONFIG.canvasHeight / 2)
  } else if (readyTimer > 0) {
    const count = Math.ceil(readyTimer / 60)
    ctx.fillStyle = '#ff3366'
    ctx.font = 'bold 32px monospace'
    ctx.fillText(String(count), GAME_CONFIG.canvasWidth / 2, GAME_CONFIG.canvasHeight / 2)
  }
}

function drawKoOverlay(ctx: CanvasRenderingContext2D) {
  ctx.textAlign = 'center'
  ctx.font = 'bold 28px monospace'
  ctx.fillStyle = '#ff3366'
  ctx.fillText('K.O.!', GAME_CONFIG.canvasWidth / 2, GAME_CONFIG.canvasHeight / 2 - 10)
}
