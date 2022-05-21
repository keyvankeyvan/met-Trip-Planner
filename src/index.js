const BASE_URL = 'https://collectionapi.metmuseum.org/public/collection/v1'
const CALLCOUNT = 20

const artCollection = []
let tableLen = 0

window.addEventListener('DOMContentLoaded', () => {
    getInitialIDs()
    clearMoreInfoInit()
    clearTableInit()
})

function getInitialIDs() {
    fetch(BASE_URL + '/search?isHighlight=true&isOnView=true|q=*')
        .then(function (resp) {
            return resp.json()
        })
        .then(data => {
            let idList = Object.values(data.objectIDs)
            makeCards(idList)
            const loadMore = document.getElementById('loadNewCards')
            loadMore.addEventListener('click', (e) => makeCards(idList))
        })
}

function makeCards(idList) {

    for (let i = 0; i < CALLCOUNT; i++) {
        let randIndex = Math.floor(Math.random() * (idList.length))
        fetch(BASE_URL + `/objects/${idList[randIndex]}`)
            .then(function (resp) {
                return resp.json()
            })
            .then(data => {
                if (data['primaryImageSmall'] != "" && data['GalleryNumber'] != "") {
                    cardHTMLer(data)
                }
            })
    }
}

function cardHTMLer(data) {
    artCollection.push(data)

    const artDiv = document.getElementById('artCollection')
    const newCard = document.createElement('div')
    newCard.className = ('card')
    newCard.id = (`${data['objectID']}card`)

    const newH2 = document.createElement('h2')
    if (data['title'].length > 20) {
        newH2.innerText = `${data['title'].slice(0, 18)}...`
    } else {
        newH2.innerText = `${data['title']}`
    }

    const newImg = document.createElement('img')
    newImg.src = `${data['primaryImageSmall']}`
    newImg.className = "artImgSmall"
    newImg.addEventListener('click', (e) => dispMoreInfo(data['objectID']))

    const newBtnDiv = document.createElement('div')
    newBtnDiv.className = "bttns"

    const newLikeBtn = document.createElement('button')
    newLikeBtn.className = "like-btn"
    newLikeBtn.id = `${data['objectID']}`
    newLikeBtn.innerText = '✔️'
    newLikeBtn.addEventListener('click', (e) => liker(e))

    const newDislikeBtn = document.createElement('button')
    newDislikeBtn.className = "dislike-btn"
    newDislikeBtn.id = `${data['title']}dislike`
    newDislikeBtn.innerText = '❌'
    newDislikeBtn.addEventListener('click', (e) => cardCloser(data['objectID']))

    newBtnDiv.append(newLikeBtn, newDislikeBtn)
    newCard.append(newH2, newImg, newBtnDiv)

    artDiv.appendChild(newCard)
}

function liker(event) {
    event.preventDefault()
    const cardGroup = document.getElementsByClassName('card')
    for (card of cardGroup) {
        card.style.background = "#e4e4e4"
    }
    const topText = document.getElementById('introTxt')
    topText.innerText = 'Below is a summary of the works that you have liked! You can also click on the images in the table to open objects page on the MET website.'
    const artid = event.target.id

    tabler(artid)
    cardCloser(artid)
}

function dispMoreInfo(artid) {
    const introText = document.getElementById('introTxt')
    introText.innerText = ''

    const cardGroup = document.getElementsByClassName('card')
    for (card of cardGroup) {
        card.style.background = "#e4e4e4"
    }

    const indivCard = document.getElementById(`${artid}card`)
    indivCard.style.background = "#bbbbbb"

    for (const art in artCollection) {
        if (artCollection[art]['objectID'] == artid) {
            introText.innerHTML = `
            Title:<br>${artCollection[art]['title']}<br><br>
            Department:<br>${artCollection[art]['department']}<br><br>
            Gallery #:<br>${artCollection[art]['GalleryNumber']}<br><br>
            Artist:<br>${artCollection[art]['artistDisplayName']}<br><br>
            Dimensions:<br>${artCollection[art]['dimensions']}<br><br>
            Object Date:<br>${artCollection[art]['objectDate']}<br><br>`
        }
    }
}

function cardCloser(artid) {
    const dislikedCard = document.getElementById(`${artid}card`)
    dislikedCard.remove()
}

function tabler(artid) {
    const tableDiv = document.getElementById('tableDiv')

    if (tableLen == 0) {
        tableDiv.innerHTML = (`<table id='table'><tr><th>Image</td><th>Info</td></tr></table>`)
        tableLen++
    }

    const artTable = document.getElementById('table')

    for (const art in artCollection) {
        if (artCollection[art]['objectID'] == artid) {
            const newRow = document.createElement('tr')
            if (artCollection[art]['department'] == "The Cloisters") {
                newRow.innerHTML = (`
            <td><a href="https://www.metmuseum.org/art/collection/search/${artid}" target="_blank"><img class="tableImage" src="${artCollection[art]['primaryImageSmall']}" alt="${artCollection[art]['title']}"></a></td><td>Title: ${artCollection[art]['title']}
            <br><br>
            Gallery: ${artCollection[art]['GalleryNumber']}<br>NOTE: This item is located the the MET Cloisters, a ~40 minute trip on public transit from the MET's Upper East Side Location.</td>`)
            } else {
                newRow.innerHTML = (`
            <td><a href="https://www.metmuseum.org/art/collection/search/${artid}" target="_blank"><img class="tableImage" src="${artCollection[art]['primaryImageSmall']}" alt="${artCollection[art]['title']}"></a></td><td>Title: ${artCollection[art]['title']}
            <br><br>
            Gallery: ${artCollection[art]['GalleryNumber']}</td>`)
            }
            artTable.appendChild(newRow)
        }
    }
}

function clearMoreInfoInit() {
    const moreInfo = document.getElementById('clearMoreInfo')
    const introTxt = document.getElementById('introTxt')
    moreInfo.addEventListener('click', (e) => introTxt.innerHTML = '')
}

function clearTableInit() {
    const clearTable = document.getElementById('clearTable')
    const tableDiv = document.getElementById('tableDiv')
    clearTable.addEventListener('click', (e) => {
        tableDiv.innerHTML = (`<table id='table'><tr><th>Image</td><th>Info</td></tr></table>`)
    })
}