const buttonEl = document.getElementsByTagName('button')[0]
const listEl = document.getElementsByClassName('list')[0]

const readFileList = async() => {
    let response = await fetch('http://localhost:8080/')
    let data = await response.json()
    return data
}

buttonEl.addEventListener('click', async () => {
    let html = ''
    let files = Object.values(await readFileList())

    files.forEach(file => {
        html += `<div class="item"><a href="${file.webViewLink}" target="_blank">${file.name}</a></div>`
    })

    listEl.innerHTML = html
})