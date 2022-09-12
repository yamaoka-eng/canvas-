/** @type {HTMLCanvasElement} */
const canvas = document.getElementById('canvas1')
const ctx = canvas.getContext('2d')
CANVAS_WIDTH = canvas.width = 500
CANVAS_HEIGHT = canvas.height = 900
const numberOfEnemies = 10
const enemiseArray = []

let gameFrame = 0

// 悬停抖动
class Enemy1 {
  constructor(){
    this.enemyImage = new Image()
    this.enemyImage.src = './assets/enemy1.png'
    this.spriteWidth = 293
    this.spriteHeight = 155
    this.width = this.spriteWidth / 2.5
    this.height = this.spriteHeight / 2.5
    // 保持在画面中的随机位置
    this.x = Math.random() * (canvas.width - this.width)
    this.y = Math.random() * (canvas.height - this.height)
    this.frame = 0
    // 随机切图帧数
    this.flapSpeed = Math.floor(Math.random() * 3 + 1)
  }
  update(){
    this.y += Math.random() * 5 - 2.5
    this.x += Math.random() * 5 - 2.5
    if (gameFrame % this.flapSpeed === 0) {
      this.frame > 4 ? this.frame = 0 : this.frame++
    }
  }
  draw(){
    // ctx.strokeRect(this.x, this.y, this.width, this.height)
    ctx.drawImage(this.enemyImage, this.frame * this.spriteWidth, 0, this.spriteWidth, this.spriteHeight, this.x, this.y, this.width, this.height)
  }
}

// 向左正弦波运动
class Enemy2{
  constructor(){
    this.enemyImage = new Image()
    this.enemyImage.src = './assets/enemy2.png'
    this.speed = Math.random() * 4 + 1
    this.spriteWidth = 266
    this.spriteHeight = 188
    this.width = this.spriteWidth / 2.5
    this.height = this.spriteHeight / 2.5
    this.x = Math.random() * (canvas.width - this.width)
    this.y = Math.random() * (canvas.height - this.height)
    this.frame = 0
    this.flapSpeed = Math.floor(Math.random() * 3 + 1)
    this.angle = 0
    this.angleSpeed = Math.random() * 0.08
    this.curve = Math.ceil(Math.random() * 5)
  }
  update(){
    this.y += this.curve * Math.sin(this.angle += this.angleSpeed)
    this.x -= this.speed
    if (this.x + this.width < 0) this.x = canvas.width
    if (gameFrame % this.flapSpeed === 0) {
      this.frame > 4 ? this.frame = 0 : this.frame++
    }
  }
  draw(){
    ctx.drawImage(this.enemyImage, this.frame * this.spriteWidth, 0, this.spriteWidth, this.spriteHeight, this.x, this.y, this.width, this.height)
  }
}

// 以中心 正弦 + 余弦 运动
class Enemy3{
  constructor(){
    this.enemyImage = new Image()
    this.enemyImage.src = './assets/enemy3.png'
    this.speed = Math.random() * 4 + 1
    this.spriteWidth = 218
    this.spriteHeight = 177
    this.width = this.spriteWidth / 2.5
    this.height = this.spriteHeight / 2.5
    this.x = Math.random() * (canvas.width - this.width)
    this.y = Math.random() * (canvas.height - this.height)
    this.frame = 0
    this.flapSpeed = Math.floor(Math.random() * 3 + 1)
    this.angle = Math.random() * 100
    this.angleSpeed = Math.random() * 0.7 + 0.5
  }
  update(){
    this.x = canvas.width/2 * Math.cos(this.angle * Math.PI/90) + (canvas.width/2 - this.width/2)
    this.y = canvas.height/2 * Math.sin(this.angle * Math.PI/270) + (canvas.height/2 - this.height/2)
    this.angle += this.angleSpeed
    if (gameFrame % this.flapSpeed === 0) this.frame > 4 ? this.frame = 0 : this.frame++
  }
  draw(){
    ctx.drawImage(this.enemyImage, this.frame * this.spriteWidth, 0, this.spriteWidth, this.spriteHeight, this.x, this.y, this.width, this.height)
  }
}

// 重置位置
class Enemy4{
  constructor(){
    this.enemyImage = new Image()
    this.enemyImage.src = './assets/enemy4.png'
    this.speed = Math.random() * 4 + 1
    this.spriteWidth = 213
    this.spriteHeight = 212
    this.width = this.spriteWidth / 2.5
    this.height = this.spriteHeight / 2.5
    this.x = Math.random() * (canvas.width - this.width)
    this.y = Math.random() * (canvas.height - this.height)
    this.newX = Math.random() * (canvas.width - this.width)
    this.newY = Math.random() * (canvas.height - this.height)
    this.frame = 0
    this.flapSpeed = Math.floor(Math.random() * 3 + 1)
    this.interval = Math.floor(Math.random() * 200 + 50)
  }
  update(){
    if (gameFrame % this.interval === 0) {
      this.newX = Math.random() * (canvas.width - this.width)
      this.newY = Math.random() * (canvas.height - this.height)
    }
    this.x -= (this.x - this.newX)/66
    this.y -= (this.y - this.newY)/66
    this.angle += this.angleSpeed
    if (gameFrame % this.flapSpeed === 0) this.frame > 4 ? this.frame = 0 : this.frame++
  }
  draw(){
    ctx.drawImage(this.enemyImage, this.frame * this.spriteWidth, 0, this.spriteWidth, this.spriteHeight, this.x, this.y, this.width, this.height)
  }
}

for (let i = 0; i < numberOfEnemies; i++) {
  enemiseArray.push(new Enemy2())
}

function animate(){
  ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)
  enemiseArray.forEach(enemy => {
    enemy.update()
    enemy.draw()
  })
  gameFrame++
  requestAnimationFrame(animate)
}
animate()
