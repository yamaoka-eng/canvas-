class Particle {
  constructor(game, x, y){
    this.game = game
    this.x = x
    this.y = y
    this.markedForDeletion = false
    this.fps = 60
  }
  update(deltaTime){
    let fpsRatio = deltaTime/(1000/this.fps)
    this.x -= (this.speedX + this.game.speed) * fpsRatio
    this.y -= (this.speedY) * fpsRatio
    this.size -= this.size * 0.05 * fpsRatio
    if (this.size < 1) this.markedForDeletion = true 
  }
}

export class Dust extends Particle {
  constructor(game, x, y){
    super(game, x, y)
    this.size = Math.random() * 10 + 10
    this.speedX = Math.random()
    this.speedY = Math.random()
    this.color = 'rgba(0,0,0,0.2)'
  }
  draw(ctx){
    ctx.beginPath()
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
    ctx.fillStyle = this.color
    ctx.fill()
  }
}

export class Splash extends Particle {
  constructor(game, x, y){
    super(game, x + Math.random() * 10 - 5, y)
    this.image = fire
    this.size = Math.random() * 100 + 50
    this.speedX = Math.random() * 6 - 3
    this.speedY = Math.random() * 2 + 2
    this.gravity = 0
  }
  update(deltaTime){
    super.update(deltaTime)
    this.gravity += 0.1
    this.y += this.gravity
  }
  draw(ctx){
    ctx.drawImage(this.image, this.x, this.y, this.size, this.size)
  }
}

export class Fire extends Particle {
  constructor(game, x, y){
    super(game, x, y)
    this.image = fire
    this.size = Math.random() * 100 + 50
    this.speedX = 1
    this.speedY = 1
    this.angle = 0
    this.va = Math.random() * 0.2 - 0.1
  }
  update(deltaTime){
    super.update(deltaTime)
    this.angle += this.va
    this.y += Math.sin(this.angle * 5)
  }
  draw(ctx){
    ctx.save()
    ctx.translate(this.x, this.y)
    ctx.rotate(this.angle)
    ctx.drawImage(this.image, 0, 0, this.size, this.size)
    ctx.restore()
  }
}
