console.log('Hi there!')

const BASE_URL = 'https://collectionapi.metmuseum.org/public/collection/v1'

window.addEventListener('DOMContentLoaded', () => {
    getInitialIDs()

    // Get 80(?) random id's from:
        // 80 requests per second limit
        //  /v1/objects
    // Calls:
        //  v1/objects/189381
        // for each id to see if obj has a gallery, if yes then temp stores data in an arr
        // waits until 6 in arr and returns arr

    //console.log(onViews)

    
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
    fetch(BASE_URL + '/search?isHighlight=true&isOnView=true|q=*')
        .then(function (resp){
            return resp.json()
        })
        .then (data => {
            const idList = Object.values(data.objectIDs)
            idShuffler(idList)
            makeSixCards(idList)
        })
}

function idShuffler(idList) {
    for (let i = idList.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [idList[i], idList[j]] = [idList[j], idList[i]];
    }
}

function makeSixCards(idList){
    for (let i = 0; i < 6; i++){
        //console.log(idList[i])
        fetch(BASE_URL + `/objects/${idList[i]}`)
        .then(function (resp){
            return resp.json()
        })
        .then (data => {
            console.log(data)
        })
    }
}