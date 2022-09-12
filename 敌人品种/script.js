/** @type {HTMLCanvasElement} */
document.addEventListener('DOMContentLoaded', ()=>{
  const canvas = document.getElementById('canvas1')
  const ctx = canvas.getContext('2d')
  canvas.width = 500
  canvas.height = 800

  let lastTime = 0
  let enemyType = {
    worm: 'worm',
    ghost: 'ghost',
    spider: 'spider'
  }

  class Game {
    constructor(ctx, width, height){
      this.ctx = ctx
      this.width = width
      this.height = height
      this.enemies = []
      this.enemyInterval = 500
      this.enemyTimer = 0
      this.enemyType = [enemyType.worm, enemyType.ghost, enemyType.spider]
    }
    update(deltaTime){
      if (this.enemyTimer > this.enemyInterval) {
        this.#addNewEnemy()
        this.enemyTimer = 0
      } else {
        this.enemyTimer += deltaTime
      }
      this.enemies.forEach(enemi => enemi.update(deltaTime))
      this.enemies = this.enemies.filter(enemi => !enemi.markedForDeletion)
    }
    draw(){
      this.enemies.sort((a,b)=> (a.y + a.height) - (b.y + b.height))
      this.enemies.forEach(enemi => enemi.draw(this.ctx))
    }
    #addNewEnemy(){
      const randomEnemy = Math.floor(Math.random() * this.enemyType.length)
      switch (this.enemyType[randomEnemy]) {
        case enemyType.worm:
          this.enemies.push(new Worm(this))
          break;
      
        case enemyType.ghost:
          this.enemies.push(new Ghost(this))
          break;

        case enemyType.spider:
          this.enemies.push(new Spider(this))
          break;
      }
    }
  }

  class Enemy {
    constructor(){
      this.markedForDeletion = false
      this.size = Math.random() * 0.3 + 0.3
      this.frame = 0
      this.timer = 0
      this.vx = Math.random() * 0.3 + 0.1
      this.vy = Math.random() * 0.3 + 0.1
    }
    update(deltaTime){
      this.x -= this.vx * deltaTime
      if (this.x < 0 - this.width) {
        this.markedForDeletion = true
      }
    }
    draw(ctx){
      this.timer++
      if (this.timer % Math.floor(1.5/this.vx) === 0) {
        this.frame > 4 ? this.frame = 0 : this.frame++
      }
      ctx.drawImage(this.image, this.frame * this.spriteWidth, 0, this.spriteWidth, this.spriteHeight, this.x, this.y, this.width, this.height)
    }
  }

  class Worm extends Enemy{
    constructor(game){
      super(game)
      this.image = worm
      this.spriteWidth = 229
      this.spriteHeight = 174
      this.width = this.spriteWidth * this.size
      this.height = this.spriteHeight * this.size
      this.x = game.width
      this.y = game.height -this.height + 3
    }
  }

  class Ghost extends Enemy{
    constructor(game){
      super(game)
      this.image = ghost
      this.spriteWidth = 261
      this.spriteHeight = 209
      this.width = this.spriteWidth * this.size
      this.height = this.spriteHeight * this.size
      this.x = game.width
      this.y = (game.height - this.height) * Math.random() * 0.71
      this.alpha = 1
      this.angle = 0
    }
    update(deltaTime){
      this.angle += 0.02
      this.alpha = Math.abs(Math.sin(this.angle * this.vx * 4))
      this.y +=  Math.sin(this.angle * 3)
      super.update(deltaTime)
    }
    draw(ctx){
      ctx.save()
      ctx.globalAlpha = this.alpha
      super.draw(ctx)
      ctx.restore()
    }
  }

  class Spider extends Enemy{
    constructor(game){
      super(game)
      this.image = spider
      this.spriteWidth = 310
      this.spriteHeight = 175
      this.width = this.spriteWidth * this.size
      this.height = this.spriteHeight * this.size
      this.x = (game.width - this.width) * Math.random()
      this.y = 0 - this.height
      this.maxY = game.height * 0.8 * Math.random() - this.height
    }
    update(deltaTime){
      this.y += this.vy * deltaTime
      if (this.y > this.maxY) this.vy = -this.vy
      if (this.y < 0 - this.height * 1.2) this.markedForDeletion = true
    }
    draw(ctx){
      ctx.beginPath()
      ctx.moveTo(this.x + this.width/2, 0)
      ctx.lineTo(this.x + this.width/2, this.y + this.height/2)
      ctx.stroke()
      super.draw(ctx)
    }
  }

  const game = new Game(ctx, canvas.width, canvas.height)

  function animate(timeStamp){
    const deltaTime = timeStamp - lastTime
    lastTime = timeStamp
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    game.update(deltaTime)
    game.draw()
    requestAnimationFrame(animate)
  }
  animate(0)
})
