const eBirdAPI = 'rql0ki1be3du'
const nuthachAPI = '246b0567-e4c7-4587-8322-3f44fbd7ed20'
const geoCodioAPI = '8689098626efb2b48be0470499fa2b84e48477f'
document.querySelector('button').addEventListener('click',birdWhere)
const eBirdRequest = new Headers()
eBirdRequest.append('X-eBirdApiToken',eBirdAPI)
let requestOptions = {
    method:'GET',
    headers:eBirdRequest,
    redirect:'follow'
}

const images = document.querySelectorAll('img')
const imageArray = []
let imageCounter = 0

function birdWhere() {
    if (document.querySelector('.row')) {
        let deleteRows = document.querySelectorAll('.row')
        deleteRows.forEach(row => {row.remove()})
    }
    const location = document.querySelector('#city').value
    const forURL = location.split(' ').join('+')
    const state = document.querySelector('#state').value
    const stateURL = state.split(' ').join('+')
    fetch(`https://api.geocod.io/v1.9/geocode?q=${forURL}+${stateURL}&country=USA&api_key=${geoCodioAPI}`)
        .then(res => res.json())
        .then(data => {
            const lat = data.results[0].location.lat
            const long = data.results[0].location.lng
            birdSightings(lat,long)
        })
        .catch(err => console.log(err))

}

function birdSightings(lat, long) {
    fetch(`https://api.ebird.org/v2/data/obs/geo/recent?lat=${lat}&lng=${long}&maxResults=10`, requestOptions)
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
            
            if (data.entities[0].images.length === 0) {
                return
            }
            console.log(data.entities[0])
            const imgSrc =data.entities[0].images[0]
            
            imageArray.push(imgSrc)

            //taken directly from Nuthatch API site: https://nuthatch.lastelm.software/
            let birdGallery = document.getElementById("birdList");
            for(let i=0; i<5; i++) {
                let bird = data["entities"][i];
                //Row
                let birdRow = document.createElement("div");
                birdRow.className = "row";
                let birdDiv = document.createElement("div");
                birdDiv.className = "words";
                birdDiv.innerHTML = `<h2>${bird["name"]}</h2><ul>
                                    <li>Scientific name: <i>${bird["sciName"]}</i></li>
                                    <li>Conservation Status: ${bird["status"]}</li>
                                    <li>Max Wingspan: ${bird["wingspanMax"]} cm</li> 
                                    </ul>`;
                //Image
                let imgDiv = document.createElement("div");
                imgDiv.className = "birdImg";
                let image = document.createElement("img");
                image.setAttribute("src", bird["images"].length ? bird["images"][0] : "noBird.png");
                // image.setAttribute("width", "500");
                imgDiv.appendChild(image);
                birdRow.appendChild(birdDiv);
                birdRow.appendChild(imgDiv);
                birdGallery.appendChild(birdRow);
            }
            // let image = document.createElement("img");
            // image.setAttribute("src", imgSrc);
            // image.setAttribute("width", "500")
            // birdListContainer.appendChild(image)
        })
        .catch(err => console.log(err))
}

if(imageArray.length === 5) {
    images.forEach((image,idx) => {
        image.src = imageArray[idx]
    })
}