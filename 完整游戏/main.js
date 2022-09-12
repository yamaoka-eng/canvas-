// 导入玩家类
import Player from './js/player.js'
// 导入按键处理类
import Input from './js/input.js'
// 导入各种敌人类
import { FlyingEnemy, GroundEnemy, ClumbingEnemy } from './js/enemies.js'
// 导入背景类
import { Background } from './js/background.js'
import { UI } from './js/ui.js'

// 等待资源加载完毕后再运行
window.addEventListener('load', function(){
  /**@type {HTMLCanvasElement} */
  const canvas = document.getElementById('canvas1')
  const ctx = canvas.getContext('2d')

  // 设置canvas元素宽高
  canvas.width = 500
  canvas.height = 500
  // 用于计算上一个时间戳
  let lastTime = 0

  // 用于实例各种功能游戏类
  class Game {
    // 获取canvas元素的宽度与高度
    constructor(width, height){
      this.width = width
      this.height = height
      // 底部边距
      this.groundMargin = 80
      this.speed = 0
      this.maxSpeed = 6
      // 敌人数组
      this.enemies = []
      this.booms = []
      // 敌人出现累计时间
      this.enemytTimer = 0
      // 敌人时间间隔
      this.enemyInterval = 1000
      // 敌人出现随机间隔
      this.randomInterval = Math.random() * this.enemyInterval * 0.8
      // 粒子效果数组
      this.particles = []
      this.maxPnum = 80
      // 游戏调试
      this.debug = true
      this.floatingMessages = []
      this.score = 0
      this.lives = 5
      this.gameOver = false
      // 实例
      this.input = new Input(this)
      this.player = new Player(this, this.input)
      this.player.currentState = this.player.states[0]
      this.player.currentState.enter()
      this.Background = new Background(this)
      this.UI = new UI(this)
    }
    update(deltaTime){
      if (this.lives === 0) this.gameOver = true
      this.Background.update(deltaTime)
      this.player.update(this.input, deltaTime)
      // 达到时间间隔则运行增加敌人函数
      if (this.enemytTimer >= this.enemyInterval + this.randomInterval) {
        this.enemytTimer = 0
        this.randomInterval = Math.random() * this.enemyInterval * 0.8
        this.addEnemy()
      } else {
        this.enemytTimer += deltaTime
      }
      // 对敌人数组进行排序，Y轴越大越靠后，渲染优先级越高
      this.enemies.sort((a, b) => a.y - b.y)
      this.enemies.forEach(enemy => enemy.update(deltaTime))
      this.enemies = this.enemies.filter(enemy => !enemy.markedForDeletion)
      this.particles.forEach(particle => particle.update(deltaTime))
      if (this.particles.length > 50) {
        this.particles = this.particles.splice(0, this.maxPnum)
      }
      this.booms.forEach(boom => boom.update(deltaTime))
      this.floatingMessages.forEach(message => message.update())

      // 过滤掉数组中标记的对象
      this.floatingMessages = this.floatingMessages.filter(message => !message.markedForDeletion)
      this.booms = this.booms.filter(boom => !boom.markedForDeletion)
      this.particles = this.particles.filter(particle => !particle.markedForDeletion)
    }
    draw(ctx){
      this.Background.draw(ctx)
      this.player.draw(ctx)
      this.enemies.forEach(enemy => enemy.draw(ctx))
      this.UI.draw(ctx)
      this.particles.forEach(particle => particle.draw(ctx))
      this.booms.forEach(boom => boom.draw(ctx))
      this.floatingMessages.forEach(message => message.draw(ctx))
    }
    addEnemy(){
      // 随机增加各种敌人
      if (Math.random() > 0.5) if (this.speed > 0) this.enemies.push(new GroundEnemy(this))
      if (Math.random() > 0.5) if (this.speed > 0) this.enemies.push(new ClumbingEnemy(this))
      if (Math.random() > 0.2) this.enemies.push(new FlyingEnemy(this))
    }
  }
  // 实例游戏类
  let game = new Game(canvas.width, canvas.height)

  function animate(timeStamp){
    // 计算帧数的时间戳
    const deltaTime = timeStamp - lastTime
    lastTime = timeStamp
    // 清除画画效果
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    game.update(deltaTime)
    game.draw(ctx)
    if (!game.gameOver) requestAnimationFrame(animate)
  }
  animate(0)
})