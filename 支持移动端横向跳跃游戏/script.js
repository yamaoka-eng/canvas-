window.addEventListener('load',()=>{
  /** @type {HTMLCanvasElement} */
  const canvas = document.getElementById('canvas1')
  const btnRestart = document.querySelector('.restart')
  const ctx = canvas.getContext('2d')
  canvas.width = 1400
  canvas.height = 720
  let lastTime = 0
  let score = 0
  let gameOver = false

  let enemies = []

  btnRestart.addEventListener('click', ()=>{
    restart()
    btnRestart.style.display = 'none'
  })

  // 按键监听类
  class InputHandler {
    constructor(){
      this.keys = []
      this.touchY = 0
      this.touchTreshold = 30
      window.addEventListener('keydown', e=>{
        if ((e.key === 'ArrowUp' || e.key === 'ArrowDown' || e.key === 'ArrowLeft' || e.key === 'ArrowRight') &&
             this.keys.indexOf(e.key) === -1
        ) {
          this.keys.push(e.key)
        }
      })
      window.addEventListener('keyup', e=>{
        if (e.key === 'ArrowUp' || e.key === 'ArrowDown' || e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
          this.keys.splice(this.keys.indexOf(e.key), 1)
        }
      })
      canvas.addEventListener('touchstart', e=>{
        this.touchY = e.changedTouches[0].pageY
      })
      canvas.addEventListener('touchmove', e=>{
        e.preventDefault()
        const swipeDistance = e.changedTouches[0].pageY - this.touchY
        if (swipeDistance < -this.touchTreshold && this.keys.indexOf('swipe up') === -1) this.keys.push('swipe up')
        if (swipeDistance < this.touchTreshold && this.keys.indexOf('swipe down') === -1) this.keys.push('swipe down')

      })
      canvas.addEventListener('touchend', e=>{
        this.keys.splice(this.keys.indexOf('swipe up'), 1)
        this.keys.splice(this.keys.indexOf('swipe down'), 1)
      })
    }
  }

  // 绘制玩家类
  class Player {
    constructor(gameWidth, ganmeHeight) {
      this.gameWidth = gameWidth
      this.ganmeHeight = ganmeHeight
      this.spriteWidth = 573
      this.spriteHeight = 523
      this.width = this.spriteWidth * 0.3
      this.height = this.spriteHeight * 0.3
      this.x = 100
      this.y = this.ganmeHeight - this.height
      this.image = playerImage
      // 设置游戏帧数为60帧
      this.frame = 60
      this.frameX = 0
      this.maxFramex = 0
      this.frameY = 3
      this.vx = 0
      this.vy = 0
      this.jumpHeight = -26
      this.addSpeed = 1
      this.frameInterval = 50
      this.timer1 = 0
      this.timer2 = 0
    }
    draw(ctx){
      ctx.drawImage(this.image, this.frameX * this.spriteWidth, this.frameY * this.spriteHeight, this.spriteWidth, this.spriteHeight, this.x, this.y, this.width, this.height)
    }
    restart() {
      this.x = 100
      this.y = this.ganmeHeight - this.height
    }
    update(input, deltaTime){
      if (input.keys.indexOf('ArrowRight') > -1) {
        this.vx = 8
        this.frameInterval = 40
      } else if (input.keys.indexOf('ArrowLeft') > -1){
        this.vx = -5
        this.frameInterval = 60
      } else {
        this.vx = 0
      }
      if ((input.keys.indexOf('ArrowUp') > -1 || input.keys.indexOf('swipe up') > -1) && this.onGround()) {
        this.vy += this.jumpHeight
      }
      // 以60帧为标准来增加距离
      this.x += this.vx * (deltaTime/(1000/this.frame))
      this.y += this.vy * (deltaTime/(1000/this.frame))
      if (this.x < 0) this.x = 0
      if (this.x + this.width > this.gameWidth) this.x = this.gameWidth - this.width 
      if (!this.onGround()) {
        this.vy += this.addSpeed
        this.frameY = 1
        this.frameX = 5
        if (this.vy > 0) this.frameY = 2
      } else {
        this.vy = 0
        this.frameY = 3
        this.maxFramex = 7
      }
      if (this.y > this.ganmeHeight - this.height) this.y = this.ganmeHeight - this.height 
      if (this.timer1 >= this.frameInterval) {
        this.frameX >= this.maxFramex ? this.frameX = 0 : this.frameX++
        this.timer1 = 0
      } else {
        this.timer1 += deltaTime
      }
    }
    onGround(){
      return this.y >= this.ganmeHeight - this.height
    }
  }

  // 背景类
  class Background {
    constructor(ganmeWidth, ganmeHeight){
      this.gameWidth = ganmeWidth
      this.ganmeHeight = ganmeHeight
      this.image1 = backgroundImage
      this.image2 = backgroundImage
      this.width = 2400
      this.height = 720
      this.x = 0
      this.y = 0
      this.vx = 5
    }
    update(){
      this.x += this.vx
      if (this.x >= this.width) this.x = 0
    }
    draw(ctx){
      ctx.drawImage(this.image1, this.x, this.y, this.gameWidth, this.ganmeHeight, 0, 0, this.gameWidth, this.ganmeHeight)
      ctx.drawImage(this.image2, this.x - this.width + this.vx, this.y, this.gameWidth, this.ganmeHeight, 0, 0, this.gameWidth, this.ganmeHeight)
    }
  }

  // 敌人类
  class Enemy {
    constructor(gameWidth, ganmeHeight){
      this.image = enemyImage
      this.gameWidth = gameWidth
      this.ganmeHeight = ganmeHeight
      this.spriteWidth = 160
      this.spriteHeight = 119
      this.size = Math.random() * 0.6 + 0.25
      this.width = this.spriteWidth * this.size
      this.height = this.spriteHeight * this.size
      this.x = this.gameWidth
      this.y = this.ganmeHeight - this.height
      this.vx = Math.random() * 0.2 + 0.3
      this.timer = 0
      this.frame = 0
      this.markedForDeletion = false
    }
    update(deltaTime, player){
      this.timer++
      this.x -= this.vx * deltaTime
      if (this.x < 0 - this.width) {
        this.markedForDeletion = true
        score++
      }
      if (this.timer % Math.floor(1.5/this.vx) === 0) {
        this.frame > 4 ? this.frame = 0 : this.frame++
      }
      // 圆形碰撞检测
      const dx = this.x + this.width/2 - player.x - player.width/2
      const dy = this.y + this.height/2 - player.y - player.height/2
      const distance = Math.sqrt(dx * dx + dy * dy)
      // 缩小检测距离使碰撞更加符合实际
      if (distance < this.width/2.1 + player.width/3) {
        gameOver = true
      }
    }
    draw(ctx){
      ctx.drawImage(this.image, this.frame * this.spriteWidth, 0, this.spriteWidth, this.spriteHeight, this.x, this.y, this.width, this.height)
    }
  }

  let nextEnemyTime = 500
  let enemyInterval = 1500
  let randomInterval = Math.random() * 1000
  // 敌人处理函数
  function handleEnemies(deltaTime, player) {
    if (nextEnemyTime > enemyInterval + randomInterval) {
      enemies.push(new Enemy(canvas.width, canvas.height))
      nextEnemyTime = 0
    } else {
      nextEnemyTime += deltaTime
    }
    enemies.forEach(enemy => {
      enemy.draw(ctx)
      enemy.update(deltaTime, player)
    })
    enemies = enemies.filter(enemy => !enemy.markedForDeletion)
  }

  // 文字状态处理函数
  function displayStatusText(ctx) {
    ctx.font = '40px Helvetica'
    ctx.fillStyle = 'black'
    ctx.fillText(`Score: ${score}`, 20, 50)
    ctx.fillStyle = 'white'
    ctx.fillText(`Score: ${score}`, 22.5, 52.5)
    if (gameOver) {
      ctx.save()
      ctx.font = '50px Helvetica'
      ctx.textAlign = 'center'
      ctx.fillStyle = 'black'
      ctx.fillText('Game Over', canvas.width/2, canvas.height/2)
      ctx.fillStyle = 'white'
      ctx.fillText('Game Over', canvas.width/2 + 5, canvas.height/2 + 5)
      ctx.restore()
    }
  }

  // 重新开始
  function restart() {
    gameOver = false
    score = 0
    player.restart()
    enemies = []
    animate(0)
  }

  const input = new InputHandler()
  const player = new Player(canvas.width, canvas.height)
  const background = new Background(canvas.width, canvas.height)

  function animate(timeStamp){
    const deltaTime = timeStamp - lastTime
    lastTime = timeStamp
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    player.update(input, deltaTime)
    background.update()
    background.draw(ctx)
    player.draw(ctx)
    handleEnemies(deltaTime, player)
    if (!gameOver) {
      requestAnimationFrame(animate)
    } else {
      btnRestart.style.display = 'block'
    }
    displayStatusText(ctx)
  }
  animate(0)
})