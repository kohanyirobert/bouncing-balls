class Ball {
    static id = 0

    static randomBall() {
        return Ball.randomBallAt(
            random(0, canvas.width),
            random(0, canvas.height)
        )
    }

    static randomBallAt(x, y) {
        const size = random(10, 20)
        const ball = new Ball(
            x,
            y,
            random(-5, 5),
            random(-5, 5),
            `rgb(${random(0, 255)},${random(0, 255)},${random(0, 255)})`,
            size
        )
        ball.moveBackToCanvas()
        return ball
    }

    constructor(x, y, velX, velY, color, size) {
        this.id = ++Ball.id
        this.x = x
        this.y = y
        this.velX = velX
        this.velY = velY
        this.color = color
        this.size = size
    }

    draw() {
        ctx.beginPath()
        ctx.fillStyle = this.color
        ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI)
        ctx.fill()
    }

    update() {
        if ((this.x - this.size) <= 0 || (this.x + this.size) >= canvas.width) {
            this.velX = -this.velX
        }
        if ((this.y - this.size) <= 0 || (this.y + this.size) >= canvas.height) {
            this.velY = -this.velY
        }
        this.x += this.velX
        this.y += this.velY
        this.moveBackToCanvas()
    }

    moveBackToCanvas() {
        if (this.x - this.size < 0) {
            this.x = this.size
        } else if (this.x + this.size > canvas.width) {
            this.x = canvas.width - this.size
        }
        if (this.y - this.size < 0) {
            this.y = this.size
        } else if (this.y + this.size > canvas.height) {
            this.y = canvas.height - this.size
        }
    }

    distanceFrom(x, y) {
        return Math.sqrt(Math.pow(this.x - x, 2) + Math.pow(this.y - y, 2))
    }

    collisionDetect() {
        for (const ball of balls) {
            if (this === ball) {
                continue
            }
            const distance = this.distanceFrom(ball.x, ball.y)
            if (distance < this.size + ball.size) {
                this.color = ball.color
            }
        }
    }

    offCanvasLeftX() {
        return this.x - this.size < 0
    }

    offCanvasRightX() {
        return this.x + this.size > canvas.width
    }

    offCanvasX() {
        return this.offCanvasLeftX() || this.offCanvasRightX()
    }

    offCanvasTopY() {
        return this.y - this.size < 0
    }

    offCanvasBottomY() {
        return this.y + this.size > canvas.height
    }

    offCanvasY() {
        return this.offCanvasTopY() || this.offCanvasBottomY()
    }

    offCanvas() {
        return this.offCanvasX() || this.offCanvasY()
    }
    
    remove() {
        balls.splice(balls.indexOf(this), 1)
        console.info(`Removed off screen ball; the number of remaining balls are ${balls.length}`)
        console.dir(this)
    }

    offCanvasDetect() {
        if (this.offCanvas()) {
            this.remove()
            return true
        }
        return false
    }
}

function random(min, max) {
    min = Math.ceil(min)
    max = Math.floor(max)
    return Math.floor(Math.random() * (max - min + 1) + min)
}

function loop() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.25)'
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    for (const ball of balls) {
        if (ball.offCanvasDetect()) {
            continue
        }
        ball.draw()
        ball.collisionDetect()
        ball.update()
    }

    requestId = requestAnimationFrame(loop)
}

const canvas = document.getElementById('canvas')
canvas.width = window.innerWidth
canvas.height = window.innerHeight

const ctx = canvas.getContext('2d')

const balls = new Array(25).fill().map(_ => Ball.randomBall())

window.addEventListener('resize', function () {
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
}, true)

window.addEventListener('keypress', function (event) {
    if (event.code === 'Space') {
        if (requestId) {
            cancelAnimationFrame(requestId)
            requestId = null
        } else {
            requestId = requestAnimationFrame(loop)
        }
    }
})

window.addEventListener('click', function (event) {
    const { x, y } = event
    let existingBall
    for (const ball of balls.slice().reverse()) {
        if (ball.distanceFrom(x, y) < ball.size) {
            existingBall = ball
            break
        }
    }
    if (existingBall) {
        existingBall.remove()
    } else {
        const newBall = Ball.randomBallAt(x, y)
        balls.push(newBall)
        console.info(`Added new ball; the number of balls are ${balls.length}`)
        console.dir(newBall)
        newBall.draw()
    }
})

let requestId = requestAnimationFrame(loop)
