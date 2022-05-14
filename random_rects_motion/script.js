function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

function getRandomIntInRange(min, max) {
    min = Math.ceil(min);
    return Math.floor(Math.random() * (Math.floor(max) - min + 1)) + min;
}

class Canvas {
    constructor(width=window.innerWidth, height=window.innerHeight) {
        this.UPPER_BLOCK_LIMIT = width * height * 10
        this.UPPER_BLOCK_SIZE_LIMIT_DIVISION = 5

        this.width = width
        this.height = height
        this.canvas = null
        this.rects = []
        this.nextBidirectionalRange = 10
        this.iterationDelay = 180

        this.createCanvas()
        this.createGenesisRects()
        this.drawRects()

        setInterval(() => {
            this.createNextRects()
            this.canvas.clearRect(0, 0, canvas.width, canvas.height);
            this.drawRects()
        }, this.iterationDelay);
    }

    createCanvas() {
        let canvas = document.createElement("canvas")
        canvas.id = "canvas"
        canvas.width = this.width
        canvas.height = this.height
        this.canvas = canvas.getContext("2d")
        document.body.appendChild(canvas)
    }

    createGenesisRects() {
        for (let i = 0; i < getRandomInt(this.UPPER_BLOCK_LIMIT); i++) {
            this.rects[i] = {
                color: `rgb(${getRandomInt(255)}, ${getRandomInt(255)}, ${getRandomInt(255)})`,
                x: getRandomInt(this.width),
                y: getRandomInt(this.height),
                width: getRandomInt(this.width) / this.UPPER_BLOCK_SIZE_LIMIT_DIVISION,
                height: getRandomInt(this.height) / this.UPPER_BLOCK_SIZE_LIMIT_DIVISION
            }
        }
    }

    createNextRects() {
        for (let i = 0; i < this.rects.length; i++) {
            this.rects[i] = {
                color: this.rects[i].color,
                x: getRandomIntInRange(this.rects[i].x - this.nextBidirectionalRange, this.rects[i].x + this.nextBidirectionalRange),
                y: getRandomIntInRange(this.rects[i].y - this.nextBidirectionalRange, this.rects[i].y + this.nextBidirectionalRange),
                width: this.rects[i].width,
                height: this.rects[i].height

                // dynamic size variant:
                // width: getRandomIntInRange(this.rects[i].width - 8, this.rects[i].width + 8),
                // height: getRandomIntInRange(this.rects[i].height - 8, this.rects[i].height + 8)
            }
        }
    }

    drawRects() {
        for (let i = 0; i < this.rects.length; i++) {
            this.canvas.fillStyle = this.rects[i].color
            this.canvas.fillRect(this.rects[i].x, this.rects[i].y, this.rects[i].width, this.rects[i].height)
        }
    }
}

let c = new Canvas()
