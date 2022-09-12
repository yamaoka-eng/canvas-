import { DrawCircle } from "./debug.js"

class Enemy extends DrawCircle {
  constructor(game){
    super(game)
    this.frameX = 0
    this.frameY = 0
    this.frameXfps = 20
    this.frameInterval = 1000/this.frameXfps
    this.frameTimer = 0
    this.fps = 60
    this.markedForDeletion = false
  }
  update(deltaTime){
    this.x -= (this.speedX + this.game.speed) * (deltaTime/(1000/this.fps))
    this.y += this.speedY
    if (this.frameTimer > this.frameInterval) {
      this.frameTimer = 0
      this.frameX < this.maxFrame ? this.frameX++ : this.frameX=0
    } else {
      this.frameTimer += deltaTime
    }
    if (this.x < 0 - this.width) this.markedForDeletion = true
  }
  draw(ctx){
    super.draw(ctx)
    ctx.drawImage(this.image, this.frameX * this.spriteWidth, 0, this.spriteWidth, this.spriteHeight, this.x, this.y, this.width, this.height)
  }
}

export class FlyingEnemy extends Enemy {
  constructor(game){
    super(game)
    this.image = enemy_fly
    this.game = game
    this.spriteWidth = 60
    this.spriteHeight = 44
    this.randomSize = Math.random()
    this.randomSize = this.randomSize < 0.5 ? this.randomSize + 1 : this.randomSize
    this.width = this.spriteWidth * this.randomSize
    this.height = this.spriteHeight * this.randomSize
    this.x = this.game.width
    this.y = Math.random() * this.game.height * 0.5
    this.speedX = Math.random() + 1
    this.speedY = 0
    this.maxFrame = 5
    this.angle = 0
    this.va = Math.random() * 0.1 + 0.05
  }
  update(deltaTime){
    super.update(deltaTime)
    this.angle += this.va
    this.y += Math.sin(this.angle) * (deltaTime/(1000/this.fps))
  }
}

export class GroundEnemy extends Enemy {
  constructor(game){
    super()
    this.image = enemy_plant
    this.game = game
    this.spriteWidth = 60
    this.spriteHeight = 87
    this.randomSize = Math.random()
    this.randomSize = this.randomSize < 0.4 ? this.randomSize + 0.4 : this.randomSize
    this.width = this.spriteWidth * this.randomSize
    this.height = this.spriteHeight * this.randomSize
    this.x = this.game.width
    this.y = this.game.height - this.height - this.game.groundMargin
    this.speedX = 0
    this.speedY = 0
    this.maxFrame = 1
  }
  update(deltaTime){
    super.update(deltaTime)
  }
}

export class ClumbingEnemy extends Enemy {
  constructor(game){
    super()
    this.image = enemy_spider_big
    this.game = game
    this.spriteWidth = 120
    this.spriteHeight = 144
    this.randomSize = Math.random()
    this.randomSize = this.randomSize > 0.7 ? this.randomSize - 0.3 : this.randomSize + 0.2
    this.width = this.spriteWidth * this.randomSize
    this.height = this.spriteHeight * this.randomSize
    this.x = Math.random() * this.game.width + this.game.width * 0.2
    this.y = 0 - this.height
    this.randomMaxY = Math.random()
    this.randomMaxY = this.randomMaxY < 0.3 ? this.randomMaxY + 0.3 : this.randomMaxY
    this.maxY = this.game.height * 0.8 * this.randomMaxY - this.height
    this.speedX = 0
    this.speedY = Math.random() * 0.2 + 0.1
    this.maxFrame = 5
  }
  update(deltaTime){
    this.y += this.speedY * deltaTime
    if (this.y > this.maxY) this.speedY = -this.speedY
    if (this.y < 0 - this.height * 2) this.speedY = -this.speedY
    super.update(deltaTime)
  }
  draw(ctx){
    ctx.beginPath()
    ctx.moveTo(this.x + this.width/2, 0)
    ctx.lineTo(this.x + this.width/2, this.y + this.height/2)
    ctx.stroke()
    super.draw(ctx)
  }
}
