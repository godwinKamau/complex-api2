const eBirdAPI = 'rql0ki1be3du'
const nuthachAPI = '246b0567-e4c7-4587-8322-3f44fbd7ed20'
const geoCodioAPI = '8689098626efb2b48be0470499fa2b84e48477f'

const eBirdRequest = new Headers()
eBirdRequest.append('X-eBirdApiToken',eBirdAPI)
let requestOptions = {
    method:'GET',
    headers:eBirdRequest,
    redirect:'follow'
}

fetch(`https://api.geocod.io/v1.9/geocode?q=los+angeles+california&country=USA&api_key=${geoCodioAPI}`)
    .then(res => res.json())
    .then(data => {
        const lat = data.results[0].location.lat
        const long = data.results[0].location.lng
        birdSightings(lat,long)
    })
    .catch(err => console.log(err))

function birdSightings(lat, long) {
    fetch(`https://api.ebird.org/v2/data/obs/geo/recent?lat=${lat}&lng=${long}&maxResults=100`, requestOptions)
        .then(res => res.json())
        .then(data => {
            console.log(data.forEach(bird => {
                const sciName = bird.sciName.split(' ').join('%20')
                getBirdPic(sciName)
                })
            )
        })
        .catch(err => console.log(err))
}

function getBirdPic(sciName) {
fetch(`https://nuthatch.lastelm.software/v2/birds?sciName=${sciName}&hasImg=true`,{
    headers: {'api-key': nuthachAPI}
})
    .then(res => res.json())
    .then(data => {
        let birdListContainer = document.querySelector(".birdListContainer")
        if (data.entities[0].images.length === 0) {
            return
        }
        console.log(data.entities[0])
        const imgSrc =data.entities[0].images[0]
        
        let image = document.createElement("img");
        image.setAttribute("src", imgSrc);
        image.setAttribute("width", "500")
        birdListContainer.appendChild(image)
    })
    .catch(err => console.log(err))
}