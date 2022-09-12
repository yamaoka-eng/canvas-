/** @type {HTMLCanvasElement} */

const canvas = document.getElementById('canvas1')
const ctx = canvas.getContext('2d')
CANVAS_WIDTH = canvas.width = 500
CANVAS_HEIGHT = canvas.height = 700
const explosions = []
let canvasPosition = canvas.getBoundingClientRect()
let gameFrame = 0

class Explosion {
  constructor(x, y) {
    this.image = new Image()
    this.image.src = './assets/boom.png'
    this.spriteWidth = 200
    this.spriteHeight = 179
    this.width = this.spriteWidth * 0.7
    this.height = this.spriteHeight * 0.7
    this.x = x
    this.y = y
    this.timer = 0
    this.frame = 0
    this.flapSpeed = 500
    this.sound = new Audio('./assets/boom.wav')
    // 弧度0 - 6.2 之间等于 0-360度
    this.angle = Math.random() * 6.2
  }
  update(){
    this.timer++
    if (this.frame === 0) this.sound.play()
    if (this.timer % this.flapSpeed === 0) {
      console.log(this.timer)
      this.frame++
    }
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

const createAnimation = e => {
  let positionX = e.x - canvasPosition.left
  let positionY = e.y - canvasPosition.top
  explosions.push(new Explosion(positionX, positionY))
  console.log(explosions)
}

window.addEventListener('click', createAnimation)

function animate(){
  ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)
  explosions.forEach((itme, index)=>{
    itme.update()
    itme.draw()
    if (itme.frame > 4) {
      explosions.splice(index, 1)
    }
  })
  requestAnimationFrame(animate)
}
animate()