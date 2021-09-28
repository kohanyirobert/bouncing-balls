import { random } from './util.mjs'

class Ball {
    static id = 0

    static randomBall(ctx) {
        return Ball.randomBallAt(
            ctx,
            random(0, ctx.canvas.width),
            random(0, ctx.canvas.height)
        )
    }

    static randomBallAt(ctx, x, y) {
        const size = random(10, 20)
        const ball = new Ball(
            ctx,
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

    static existingBallAt(balls, x, y) {
        for (let i = balls.length - 1; i >= 0; i--) {
            const ball = balls[i]
            if (ball.distanceFrom(x, y) < ball.size) {
                return ball
            }
        }
    }

    constructor(ctx, x, y, velX, velY, color, size) {
        this.id = ++Ball.id
        this.ctx = ctx
        this.x = x
        this.y = y
        this.velX = velX
        this.velY = velY
        this.velMul = 1
        this.color = color
        this.size = size
    }

    draw() {
        this.ctx.beginPath()
        this.ctx.fillStyle = this.color
        this.ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI)
        this.ctx.fill()
    }

    update() {
        if ((this.x - this.size) <= 0 || (this.x + this.size) >= this.ctx.canvas.width) {
            this.velX = -this.velX
        }
        if ((this.y - this.size) <= 0 || (this.y + this.size) >= this.ctx.canvas.height) {
            this.velY = -this.velY
        }
        this.x += this.velX * this.velMul
        this.y += this.velY * this.velMul
        this.moveBackToCanvas()
    }

    moveBackToCanvas() {
        if (this.x - this.size < 0) {
            this.x = this.size
        } else if (this.x + this.size > this.ctx.canvas.width) {
            this.x = this.ctx.canvas.width - this.size
        }
        if (this.y - this.size < 0) {
            this.y = this.size
        } else if (this.y + this.size > this.ctx.canvas.height) {
            this.y = this.ctx.canvas.height - this.size
        }
    }

    distanceFrom(x, y) {
        return Math.sqrt(Math.pow(this.x - x, 2) + Math.pow(this.y - y, 2))
    }

    collisionDetect(balls) {
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

    removeFrom(balls) {
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

    changeVel(delta) {
        this.velMul += delta
        if (this.velMul < 0) {
            this.velMul = 0
        } else if (this.velMul > 10) {
            this.velMul = 10
        }
    }
}

export { Ball }
