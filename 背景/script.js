const canvas = document.getElementById('canvas1')
const ctx = canvas.getContext('2d')
const CANVAS_WIDTH = canvas.width = 800
const CANVAS_HEIGHT = canvas.height = 700

let gameSpeed = 10
let gameFrame = 0

let backgroundLayer1 = new Image()
let backgroundLayer2 = new Image()
let backgroundLayer3 = new Image()
let backgroundLayer4 = new Image()
let backgroundLayer5 = new Image()

backgroundLayer1.src = './assets/layer-1.png'
backgroundLayer2.src = './assets/layer-2.png'
backgroundLayer3.src = './assets/layer-3.png'
backgroundLayer4.src = './assets/layer-4.png'
backgroundLayer5.src = './assets/layer-5.png'

window.addEventListener('load', ()=>{
  const showGameSpeed = document.getElementById('showGameSpeed')
  showGameSpeed.innerHTML = gameSpeed

  const input = document.getElementById('slider')
  input.value = gameSpeed
  input.addEventListener('change', (e) => {
    gameSpeed = e.target.value
    showGameSpeed.innerHTML = gameSpeed
  })

  class layer{
    constructor(image, speedModifier){
      this.x = 0
      this.y = 0
      this.width = 2400
      this.height = 700
      this.x2 = this.width
      this.image = image
      this.speedModifier = speedModifier
      this.speed = gameSpeed * this.speedModifier
    }
    update(){
      this.speed = gameSpeed * this.speedModifier
      if (this.x < -this.width) this.x = 0
      this.x = this.x - this.speed
    }
    draw(){
      ctx.drawImage(this.image, this.x, this.y, this.width, this.height)
      ctx.drawImage(this.image, this.x + this.width, this.y, this.width, this.height)
    }
  }

  let layer1 = new layer(backgroundLayer1, 0.2)
  let layer2 = new layer(backgroundLayer2, 0.4)
  let layer3 = new layer(backgroundLayer3, 0.6)
  let layer4 = new layer(backgroundLayer4, 0.8)
  let layer5 = new layer(backgroundLayer5, 1)

  const ganmeObjs = [ layer1, layer2, layer3, layer4, layer5 ]

  function animate() {
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)
    ganmeObjs.forEach(obj => {
      obj.update()
      obj.draw()
    })
    gameFrame --
    requestAnimationFrame(animate)
  }
  animate()
})
