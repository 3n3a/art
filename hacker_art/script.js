function randomNumber(max) {
    return Math.floor(Math.random() * max)
}
function randomChars(count, chars) {
    let out = []
    for (let i = 0; i < count; i++) {
        out.push(
            chars[randomNumber(chars.length)]
        )
    }
    return out.join("")
}
function randomString(strings) {
    return randomChars(randomNumber(300), strings)
}
customElements.define('random-string',
    class extends HTMLElement {
        constructor() {
            super();
            let strings = "!\"#$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~".split("")

            const shadowRoot = this.attachShadow({mode: 'open'});
            setInterval(() => {
                const pTag = document.createElement('p')
                pTag.textContent = randomString(strings)
                pTag.style.margin = 0
                pTag.style.padding = 0
                pTag.style.color = `rgba(${randomNumber(255)}, ${randomNumber(255)}, ${randomNumber(255)}, ${randomNumber(10)/10})`
                shadowRoot.replaceChildren(pTag)
            }, 1);
        }
    }
)
customElements.define('magic-show',
    class extends HTMLElement {
        constructor() {
            super();

            const shadowRoot = this.attachShadow({mode: 'open'});
            for (let i = 0; i < 100; i++) {
                const randomString = document.createElement('random-string')
                shadowRoot.appendChild(randomString)
            }
        }
    }
)
function funWithConsole() {
    const colors = [
        "background-color: blue; padding: 1em; font-size: 2rem",
        "background-color: red; color: black; padding: 1em; font-size: 2rem",
        "background-color: pink; color: black; padding: 1em; font-size: 2rem",
        "background-color: lightblue; color: black; padding: 1em; font-size: 2rem",
        "background-color: purple; padding: 1em; font-size: 2rem",
        "background-color: green; padding: 1em; font-size: 2rem",
        "background-color: yellow; color: black; padding: 1em; font-size: 2rem",
        "background-color: magenta; padding: 1em; font-size: 2rem",
    ]
    setInterval(() => {
        console.clear()
        console.log("%c\ %cArt %cis %cready %cto %cart %cyou%c\ ",
            colors[randomNumber(colors.length)],
            colors[randomNumber(colors.length)],
            colors[randomNumber(colors.length)],
            colors[randomNumber(colors.length)],
            colors[randomNumber(colors.length)],
            colors[randomNumber(colors.length)],
            colors[randomNumber(colors.length)],
            colors[randomNumber(colors.length)],
        )
    }, 1);
}
function createOverlay() {
    let p = document.createElement("p")
    p.textContent = "Hackk ARRRRRT"
    let div = document.createElement("div")
    div.style.backgroundColor = 'white'
    div.style.padding = '.5em 1.5em'
    div.style.borderRadius = '5px'
    div.appendChild(p)
    let overlay = document.createElement("div")
    overlay.appendChild(div)
    overlay.style.display = 'flex'
    overlay.style.justifyContent = 'center'
    overlay.style.position = 'fixed'
    overlay.style.fontSize = '2em'
    overlay.style.zIndex = '99'
    overlay.style.width = '100%'
    overlay.style.top = '1em'

    document.body.insertAdjacentElement("afterbegin", overlay)
}
document.addEventListener('DOMContentLoaded', () => {
    funWithConsole()
    createOverlay()
})