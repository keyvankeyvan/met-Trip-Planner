const BASE_URL = 'https://collectionapi.metmuseum.org/public/collection/v1'

const artcollection = []

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
            //idShuffler(idList)
            makeSixCards(idList)
        }).catch(function(error) {
            console.log(error);
        })
}

function makeSixCards(idList){
    for (let i = 0; i < 20; i++){
        //console.log(idList[i])
        let randIndex = Math.floor(Math.random() * (idList.length))
        fetch(BASE_URL + `/objects/${idList[randIndex]}`)
        .then(function (resp){
            return resp.json()
        })
        .then (data => {
            if(data['primaryImageSmall'] != ""){
                cardMaker(data)
            }
        })
    }
}


function cardMaker(data) {
    const artDiv = document.getElementById('artcollection')
    const newCard = document.createElement('div')
    newCard.className = ('card')

    const newH2 = document.createElement('h2')
    if(data['title'].length > 20){
        newH2.innerText = `${data['title'].slice(0,20)}...`
    } else {
        newH2.innerText = `${data['title']}`
    }
    
    const newImg = document.createElement('img')
    newImg.src = `${data['primaryImageSmall']}`
    newImg.className = "artImgSmall"

    // const newP = document.createElement('p')
    // newP.id = `${data['title']}likes`
    // newP.innerText = '0 Likes'

    const newLikeBtn = document.createElement('button')
    newLikeBtn.className = "like-btn"
    newLikeBtn.id = `${data['title']}`
    newLikeBtn.innerText = '✔️'
    newLikeBtn.addEventListener('click', (e) => liker(e))
    
    const newDislikeBtn = document.createElement('button')
    newDislikeBtn.className = "dislike-btn"
    newDislikeBtn.id = `${data['title']}dislike`
    newDislikeBtn.innerText = '❌'
    newDislikeBtn.addEventListener('click', (e) => liker(e))

    newCard.append(newH2, newImg, newLikeBtn, newDislikeBtn)
    

    artDiv.appendChild(newCard)
}

function liker(event){
    event.preventDefault()
    const likeText = document.getElementById(`${event.target.id}likes`)
    const splitInner = likeText.innerText.split(" ")
    let totalLikes = parseInt(splitInner[0])
    splitInner[0] = (totalLikes += 1)
    likeText.innerText = splitInner.join(" ")
  }