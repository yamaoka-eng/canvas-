/** @type {HTMLCanvasElement} */
const canvas = document.getElementById('canvas1')
const ctx = canvas.getContext('2d')
canvas.width = window.innerWidth
canvas.height = window.innerHeight

const collisionCanvas = document.getElementById('collisionCanvas')
const collisionCtx = collisionCanvas.getContext('2d')
collisionCanvas.width = window.innerWidth
collisionCanvas.height = window.innerHeight

ctx.font = '50px Impact'
let gameFrame = 0
let score = 0
let gameOver = false

let timeToNextRaven = 0
// 定义下一个乌鸦出现的间隔
let ravenInterval = 500
let lastTime = 0
let ravens = []
let explosions = []
let particles = []

window.addEventListener('click', e => {
  // 获取点击位置中1个像素的颜色
  const { data } = collisionCtx.getImageData(e.x, e.y, 1, 1)
  ravens.forEach(item => {
    if (item.randomColors[0] == data[0] && item.randomColors[1] == data[1] && item.randomColors[2] == data[2]) {
      item.markedForDeletion = true
      explosions.push(new Explosion(item.x + item.width/2, item.y + item.height/2, item.zoom))
      score++
    } 
  })
})

// 绘制计分板
function drawScore(){
  ctx.fillStyle = 'black'
  ctx.fillText('Score: ' + score, 50, 75)
  ctx.fillStyle = 'white'
  ctx.fillText('Score: ' + score, 55, 80)
}
// 绘制游戏结束
function drawGameOver(){
  ctx.save()
  ctx.textAlign = 'center'
  ctx.fillStyle = 'black'
  ctx.fillText('Game Over', canvas.width/2, canvas.height/2)
  ctx.fillStyle = 'white'
  ctx.fillText('Game Over', canvas.width/2 + 5, canvas.height/2 + 5)
  ctx.restore()
}

// 乌鸦类
class Raven{
  constructor(){
    this.image = new Image()
    this.image.src = './assets/raven.png'
    this.spriteWidth = 271
    this.spriteHeight = 194
    this.zoom = Math.random() + 0.4
    this.width = this.spriteWidth * 0.7 * this.zoom
    this.height = this.spriteHeight * 0.7 * this.zoom
    this.x = canvas.width
    this.y = Math.random() * (canvas.height - this.height)
    this.directionX = Math.random() * 5 + 2
    this.directionY = Math.random() * 5 - 2.5
    this.frame = 0
    this.timer = 0
    this.frameSpeed = Math.floor(25 / this.directionX)
    this.markedForDeletion = false
    this.randomColors = [Math.floor(Math.random() * 255), Math.floor(Math.random() * 255), Math.floor(Math.random() * 255)]
    this.color = `rgb(${this.randomColors[0]},${this.randomColors[1]},${this.randomColors[2]})`
    // 随机出现轨迹
    this.hasTrail = Math.random() > 0.5
  }
  update(){
    this.timer++
    if (this.timer % this.frameSpeed === 0 ) {
      this.frame > 4 ? this.frame = 0 : this.frame++
      if (this.hasTrail) {
        for (let i = 0; i < 4; i++) {
          particles.push(new Particle(this.x + (this.width * 0.7), this.y + this.height/2, this.width, this.color))
        }
      }
    }
    this.x -= this.directionX
    this.y += this.directionY
    if (this.y < 0 || this.y > canvas.height - this.height) this.directionY = -this.directionY
    if (this.x < -this.width) this.markedForDeletion = true
    if (this.x < 0 - this.width) gameOver = true
  }
  draw(){
    collisionCtx.fillStyle = this.color
    collisionCtx.fillRect(this.x, this.y, this.width, this.height)
    ctx.drawImage(this.image, this.frame * this.spriteWidth, 0, this.spriteWidth, this.spriteHeight, this.x, this.y, this.width, this.height)
  }
}

// 爆炸类
class Explosion {
  constructor(x, y, zoom) {
    this.image = new Image()
    this.image.src = './assets/boom.png'
    this.spriteWidth = 200
    this.spriteHeight = 179
    this.width = this.spriteWidth * 0.8 * zoom
    this.height = this.spriteHeight * 0.8 * zoom
    this.x = x
    this.y = y
    this.timer = 0
    this.frame = 0
    this.flapSpeed = 15
    this.sound = new Audio('./assets/boom.wav')
    // 弧度0 - 6.2 之间等于 0-360度
    this.angle = Math.random() * 6.2
    this.markedForDeletion = false
  }
  update(){
    this.timer++
    if (this.frame === 0) this.sound.play()
    if (this.timer % this.flapSpeed === 0) {
      this.frame++
    }
    if (this.frame > 4) this.markedForDeletion = true
  }
  draw(){
    // 绘制状态保存
    ctx.save()
    ctx.translate(this.x, this.y)
    ctx.rotate(this.angle)
    ctx.drawImage(this.image, this.frame * this.spriteWidth, 0, this.spriteWidth, this.spriteHeight, 0 - this.width/2, 0 - this.height/2, this.width, this.height)
    // 恢复
    ctx.restore()
  }
}

// 粒子轨迹
class Particle {
  constructor(x, y, size, color){
    this.x = x
    this.y = y + Math.random() * (size/6) - (size/12)
    this.radius = Math.random() * size/11
    this.maxRadius = Math.random() * size/5 + 4
    this.markedForDeletion = false
    this.speedX = Math.random() * 1 + 0.4
    this.color = color
  }
  update(){
    this.x += this.speedX
    this.radius += 0.3
    if (this.radius > this.maxRadius) this.radius = this.maxRadius
    if (this.radius >= this.maxRadius) this.markedForDeletion = true 
  }
  draw(){
    // 状态只对当前操作生效
    ctx.save()
    // 绘制路径
    ctx.beginPath()
    // 粒子越大越透明
    ctx.globalAlpha = 1 - this.radius/this.maxRadius
    ctx.fillStyle = this.color
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2)
    ctx.fill()
    ctx.restore()
  }
}

function animate(timestamp){
  collisionCtx.clearRect(0, 0, collisionCanvas.width, collisionCanvas.height)
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  // 计算动画帧数
  let deltatime = timestamp - lastTime
  lastTime = timestamp
  timeToNextRaven += deltatime
  if (timeToNextRaven > ravenInterval) {
    ravens.push(new Raven())
    timeToNextRaven = 0
    // 以宽度升序排列越后绘制层级越高（大的乌鸦会覆盖小的乌鸦）
    ravens.sort((a, b)=>{
      return a.width - b.width
    })
  }
  // 越靠后渲染层级越高
  [...particles, ...ravens, ...explosions].forEach(item=>{
    item.update()
    item.draw()
  })
  drawScore()
  ravens = ravens.filter(raven=>!raven.markedForDeletion)
  explosions = explosions.filter(explosion=>!explosion.markedForDeletion)
  particles = particles.filter(particle=>!particle.markedForDeletion)
  if (!gameOver) requestAnimationFrame(animate)
  else drawGameOver()
}
animate(0)
