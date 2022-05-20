const BASE_URL = 'https://collectionapi.metmuseum.org/public/collection/v1'

const artCollection = []

window.addEventListener('DOMContentLoaded', () => {
    getInitialIDs()

    // cardBuilder()
        // Builds card with basic info
            // Small Img + Name + other?
            // Include like + dislike button w unique IDs
        // has event listeners for
        // artInfo():
            // Click on small Img to pull up window with more information from API
            // Name + Author + Yr + Department + Addl imgs
        // artLiker():
            // takes card information and sends to
            // likeCollector():
                // displays currently liked art somewhere on page (just Small Imgs)
                // also has button to dislike art
                // when has 6 + 
        // artDisliker():
            // closes current card (parent LI gets deleted)
            // builds new card (and replace or add to end?? [probs append to ul])
})

function getInitialIDs(){
    fetch(BASE_URL + '/search?isHighlight=true&isOnView=true|q=a')
        .then(function (resp){
            return resp.json()
        })
        .then (data => {
            const idList = Object.values(data.objectIDs)
            makeCards(idList)
        }).catch(function(error) {
            console.log(error);
        })
}

function makeCards(idList){
    for (let i = 0; i < 5; i++){
        //console.log(idList[i])
        let randIndex = Math.floor(Math.random() * (idList.length))
        fetch(BASE_URL + `/objects/${idList[randIndex]}`)
        .then(function (resp){
            return resp.json()
        })
        .then (data => {
            if(data['primaryImageSmall'] != "" && data['GalleryNumber'] != ""){
                cardMaker(data)
            }
        })
    }

    // const artDiv = document.getElementById('artCollection')
    // const refreshButton = document.createElement('button')
    // refreshButton.className = ('refreshButton')
    // refreshButton.innerText = ('CLICK ME')
    // artDiv.appendChild(refreshButton)
}


function cardMaker(data) {
    artCollection.push(data)

    const artDiv = document.getElementById('artCollection')
    const newCard = document.createElement('div')
    newCard.className = ('card')
    newCard.id = (`${data['objectID']}card`)

    const newH2 = document.createElement('h2')
    if(data['title'].length > 20){
        newH2.innerText = `${data['title'].slice(0,18)}...`
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

function liker(event){
    event.preventDefault()

    const artid = event.target.id

    for (const art in artCollection) {
        if (artCollection[art]['objectID'] == artid) {
            console.log(artCollection[art]['title'])
            console.log(artCollection[art]['department'])
            console.log(artCollection[art]['GalleryNumber'])
            console.log(artCollection[art]['primaryImage'])
            console.log(artCollection[art]['artistDisplayName'])
            console.log(artCollection[art]['dimensions'])
            console.log(artCollection[art]['objectDate'])
        }
    }
}

function dispMoreInfo(artid){
    for (const art in artCollection) {
        if (artCollection[art]['objectID'] == artid) {
            console.log(artCollection[art]['title'])
            console.log(artCollection[art]['department'])
            console.log(artCollection[art]['GalleryNumber'])
            console.log(artCollection[art]['primaryImage'])
            console.log(artCollection[art]['artistDisplayName'])
            console.log(artCollection[art]['dimensions'])
            console.log(artCollection[art]['objectDate'])
        }
    }
}

function cardCloser(artid){
    const dislikedCard = document.getElementById(`${artid}card`)

    dislikedCard.remove()
}

//newCard.id = (`${data['objectID']}card`)