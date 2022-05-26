const BASE_URL = 'https://collectionapi.metmuseum.org/public/collection/v1'
const CALLCOUNT = 20

const artCollection = []
let tableEmpty = false

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
                    artCollection.push(data)
                    cardHTMLer(data)
                }
            })
    }
}

function cardHTMLer(data) {
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
    newImg.addEventListener('click', () => dispMoreInfo(data['objectID']))

    const newBtnDiv = document.createElement('div')
    newBtnDiv.className = "bttns"

    const newLikeBtn = document.createElement('button')
    newLikeBtn.className = "like-btn"
    newLikeBtn.id = `${data['objectID']}`
    newLikeBtn.innerText = '✔️'
    newLikeBtn.addEventListener('click', (e) => liker(e))
    newLikeBtn.addEventListener('mouseover', (e) => {
        e.target.style.background = 'whitesmoke'
    })
    newLikeBtn.addEventListener('mouseout', (e) => {
        e.target.style.background = '#cbf2c3'
    })

    const newDislikeBtn = document.createElement('button')
    newDislikeBtn.className = "dislike-btn"
    newDislikeBtn.id = `${data['title']}dislike`
    newDislikeBtn.innerText = '❌'
    newDislikeBtn.addEventListener('click', () => cardCloser(data['objectID']))
    newDislikeBtn.addEventListener('mouseover', (e) => {
        e.target.style.background = 'whitesmoke'
    })
    newDislikeBtn.addEventListener('mouseout', (e) => {
        e.target.style.background = '#f2c3c5'
    })

    newBtnDiv.append(newLikeBtn, newDislikeBtn)
    newCard.append(newH2, newImg, newBtnDiv)

    artDiv.appendChild(newCard)
}

function liker(event) {
    cardColorReset()

    const topText = document.getElementById('introTxt')
    topText.innerText = 'Below is a summary of the works that you have liked! You can also click on the images in the table to open objects page on the MET website.'

    const artid = event.target.id
    tabler(artid)
    cardCloser(artid)
}

function dispMoreInfo(artid) {
    const introText = document.getElementById('introTxt')
    introText.innerText = ''
    cardColorReset()

    const indivCard = document.getElementById(`${artid}card`)
    indivCard.style.background = "#bbbbbb"
    const selectedArt = artCollection.find(art => art['objectID'] == artid)

    introText.innerHTML = `
    Title:<br>${selectedArt.title}<br><br>
    Department:<br>${selectedArt.department}<br><br>
    Gallery #:<br>${selectedArt.GalleryNumber}<br><br>
    Artist:<br>${selectedArt.artistDisplayName}<br><br>
    Dimensions:<br>${selectedArt.dimensions}<br><br>
    Object Date:<br>${selectedArt.objectDate}<br><br>`
}

function cardCloser(artid) {
    const dislikedCard = document.getElementById(`${artid}card`)
    dislikedCard.remove()
}

function tabler(artid) {
    const tableDiv = document.getElementById('tableDiv')

    if (tableEmpty == false) {
        tableDiv.innerHTML = (`<table id='table'><tr><th>Image</td><th>Info</td></tr></table>`)
        tableEmpty = true
    }

    const artTable = document.getElementById('table')

    const artForRow = artCollection.find(art => art['objectID'] == artid)
    const newRow = document.createElement('tr')
    const metImgUrl = `https://www.metmuseum.org/art/collection/search/${artid}`
    
    if (artForRow.department == "The Cloisters"){
        newRow.innerHTML =(`
        <td><a href=${metImgUrl} target="_blank"><img class="tableImage" src="${artForRow.primaryImageSmall}" alt="${artForRow.title}"></a></td><td>Title: ${artForRow.title}
        <br><br>
        Gallery: ${artForRow.GalleryNumber}<br>NOTE: This item is located the the MET Cloisters, a ~40 minute trip on public transit from the MET's Upper East Side Location.</td>`)
    } else {
        newRow.innerHTML = (`
        <td><a href=${metImgUrl} target="_blank"><img class="tableImage" src="${artForRow.primaryImageSmall}" alt="${artForRow.title}"></a></td><td>Title: ${artForRow.title}
        <br><br>
        Gallery: ${artForRow.GalleryNumber}</td>`)
    }
    artTable.appendChild(newRow)
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
        tableDiv.innerHTML = (``)
        tableEmpty = false
    })
}

function cardColorReset() {
    const cardGroup = document.querySelectorAll('.card')
    cardGroup.forEach(element => {
        element.style.background = "#e4e4e4"
    });
}