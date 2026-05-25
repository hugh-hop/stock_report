import { Mecha } from './config'

function drawPixel(ctx: CanvasRenderingContext2D, x: number, y: number, color: string) {
  ctx.fillStyle = color
  ctx.fillRect(x, y, 2, 2)
}

function drawRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  color: string
) {
  ctx.fillStyle = color
  ctx.fillRect(x, y, w, h)
}

export function drawMecha(ctx: CanvasRenderingContext2D, mecha: Mecha) {
  ctx.save()

  const cx = mecha.x + mecha.width / 2
  const cy = mecha.y + mecha.height / 2

  if (mecha.state === 'hurt' && mecha.animFrame % 2 === 0) {
    ctx.globalAlpha = 0.5
  }

  if (mecha.state === 'ko') {
    ctx.translate(cx, cy)
    ctx.rotate(Math.PI / 2 * (mecha.facing === 'right' ? 1 : -1))
    ctx.translate(-cx, -cy)
  }

  const x = mecha.x
  const y = mecha.y
  const c = mecha.color
  const ac = mecha.accentColor
  const dark = '#1a1a2e'
  const light = '#ffffff'
  const metal = '#888899'

  const walkOffset = mecha.state === 'walk' ? Math.sin(mecha.animFrame * Math.PI / 2) * 2 : 0
  const breathe = mecha.state === 'idle' ? Math.sin(mecha.animTimer * 0.15) * 0.5 : 0

  drawRect(ctx, x + 8, y + 2 + breathe, 16, 6, c)
  drawRect(ctx, x + 6, y + 4 + breathe, 4, 4, c)
  drawRect(ctx, x + 22, y + 4 + breathe, 4, 4, c)
  drawPixel(ctx, x + 12, y + 4 + breathe, light)
  drawPixel(ctx, x + 18, y + 4 + breathe, light)
  drawRect(ctx, x + 10, y + 6 + breathe, 4, 2, ac)

  drawRect(ctx, x + 6, y + 8 + breathe, 20, 14, c)
  drawRect(ctx, x + 8, y + 10 + breathe, 16, 10, dark)
  drawRect(ctx, x + 10, y + 12 + breathe, 4, 4, ac)
  drawRect(ctx, x + 16, y + 12 + breathe, 4, 4, c)
  drawRect(ctx, x + 12, y + 18 + breathe, 8, 2, metal)

  if (mecha.state === 'defend') {
    drawRect(ctx, x + 4, y + 8 + breathe, 24, 14, 'rgba(255,255,255,0.3)')
    drawRect(ctx, x + 6, y + 10 + breathe, 20, 10, 'rgba(255,255,255,0.15)')
  }

  const armY = y + 10 + breathe
  if (mecha.state === 'attack') {
    const isHeavy = mecha.attackType === 'heavy'
    const progress = 1 - mecha.stateTimer / (isHeavy ? 25 : 15)
    const punchExtend = Math.sin(progress * Math.PI) * (isHeavy ? 12 : 8)

    if (mecha.facing === 'right') {
      drawRect(ctx, x + 26, armY, punchExtend, 6, c)
      drawRect(ctx, x + 26 + punchExtend, armY - 1, 4, 8, ac)
      if (isHeavy) {
        drawRect(ctx, x + 26 + punchExtend + 2, armY - 2, 6, 10, '#ffd700')
      }
      drawRect(ctx, x + 2, armY, 4, 8, c)
      drawRect(ctx, x, armY + 2, 2, 4, ac)
    } else {
      drawRect(ctx, x - punchExtend - 4, armY, punchExtend, 6, c)
      drawRect(ctx, x - punchExtend - 8, armY - 1, 4, 8, ac)
      if (isHeavy) {
        drawRect(ctx, x - punchExtend - 12, armY - 2, 6, 10, '#ffd700')
      }
      drawRect(ctx, x + 26, armY, 4, 8, c)
      drawRect(ctx, x + 28, armY + 2, 2, 4, ac)
    }
  } else if (mecha.state === 'defend') {
    if (mecha.facing === 'right') {
      drawRect(ctx, x + 24, armY, 4, 10, c)
      drawRect(ctx, x + 22, armY + 2, 2, 6, ac)
      drawRect(ctx, x + 2, armY, 4, 10, c)
      drawRect(ctx, x, armY + 2, 2, 6, ac)
    } else {
      drawRect(ctx, x + 4, armY, 4, 10, c)
      drawRect(ctx, x + 8, armY + 2, 2, 6, ac)
      drawRect(ctx, x + 26, armY, 4, 10, c)
      drawRect(ctx, x + 28, armY + 2, 2, 6, ac)
    }
  } else {
    const armSwing = walkOffset
    drawRect(ctx, x + 2, armY + armSwing, 4, 8, c)
    drawRect(ctx, x, armY + 2 + armSwing, 2, 4, ac)
    drawRect(ctx, x + 26, armY - armSwing, 4, 8, c)
    drawRect(ctx, x + 28, armY + 2 - armSwing, 2, 4, ac)
  }

  const legBase = y + 22 + breathe
  const legSwing = walkOffset
  drawRect(ctx, x + 8, legBase, 6, 10 + (mecha.state === 'jump' ? -4 : 0), c)
  drawRect(ctx, x + 6, legBase + 8, 8, 4, ac)
  drawRect(ctx, x + 18, legBase, 6, 10 + (mecha.state === 'jump' ? -4 : 0), c)
  drawRect(ctx, x + 18, legBase + 8, 8, 4, ac)

  if (mecha.state === 'walk') {
    drawRect(ctx, x + 6 + legSwing, legBase + 10, 8, 2, metal)
    drawRect(ctx, x + 18 - legSwing, legBase + 10, 8, 2, metal)
  }

  if (mecha.state === 'attack' && mecha.attackType === 'heavy') {
    const progress = 1 - mecha.stateTimer / 25
    if (progress > 0.3 && progress < 0.7) {
      ctx.globalAlpha = 0.3
      drawRect(ctx, x - 4, y - 4, mecha.width + 8, mecha.height + 8, c)
      ctx.globalAlpha = 1
    }
  }

  ctx.restore()
}
