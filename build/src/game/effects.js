export function updateParticles(particles) {
  return particles
    .map(p => ({
      ...p,
      x: p.x + p.vx,
      y: p.y + p.vy,
      vy: p.vy + 0.15,
      life: p.life - 1,
    }))
    .filter(p => p.life > 0)
}

export function updateSparks(sparks) {
  return sparks
    .map(s => ({ ...s, frame: s.frame + 1 }))
    .filter(s => s.frame < s.maxFrames)
}

export function drawParticles(ctx, particles) {
  for (const p of particles) {
    const alpha = p.life / p.maxLife
    ctx.globalAlpha = alpha
    ctx.fillStyle = p.color
    ctx.fillRect(Math.floor(p.x), Math.floor(p.y), p.size, p.size)
  }
  ctx.globalAlpha = 1
}

export function drawSparks(ctx, sparks) {
  for (const s of sparks) {
    const progress = s.frame / s.maxFrames
    const alpha = 1 - progress

    if (s.type === 'hit') {
      const size = 8 + progress * 12
      ctx.globalAlpha = alpha
      ctx.fillStyle = '#ffffff'
      ctx.fillRect(s.x - size / 2, s.y - size / 2, size, size)

      ctx.fillStyle = '#ffd700'
      ctx.globalAlpha = alpha * 0.7
      const innerSize = size * 0.6
      ctx.fillRect(s.x - innerSize / 2, s.y - innerSize / 2, innerSize, innerSize)
    } else {
      ctx.globalAlpha = alpha * 0.8
      ctx.strokeStyle = '#00d4ff'
      ctx.lineWidth = 2
      const shieldSize = 12 + progress * 8
      ctx.beginPath()
      ctx.arc(s.x, s.y, shieldSize, 0, Math.PI * 2)
      ctx.stroke()

      ctx.fillStyle = '#00d4ff'
      ctx.globalAlpha = alpha * 0.2
      ctx.beginPath()
      ctx.arc(s.x, s.y, shieldSize, 0, Math.PI * 2)
      ctx.fill()
    }
  }
  ctx.globalAlpha = 1
}

export function createKoExplosion(x, y, color) {
  const particles = []
  for (let i = 0; i < 20; i++) {
    const angle = (Math.PI * 2 * i) / 20
    const speed = 2 + Math.random() * 4
    particles.push({
      x,
      y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - 2,
      life: 30 + Math.random() * 20,
      maxLife: 50,
      color: i % 3 === 0 ? '#ffd700' : i % 3 === 1 ? color : '#ffffff',
      size: 2 + Math.random() * 2,
    })
  }
  return particles
}
