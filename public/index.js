
const findCityWeather = (event) => {
    event.preventDefault();
    const city = document.getElementById('cityInput').value;
    fetch(`/weather?city=${city}`)
        .then(res => res.json())
        .then(data => {
            console.log(data);
            displayWeatherData(data);
            document.getElementById('weatherCard').hidden = false;
            fetchUnsplashImages(city);
            fetchAirQuality(city); // Fetch Unsplash images after getting weather data
        })
        .catch(err => alert(err));
}

const displayWeatherData = (data) => {
    const iconUrl = `http://openweathermap.org/img/w/${data.weather[0].icon}.png`;
    document.getElementById('weatherIcon').src = iconUrl;

    document.getElementById('cityName').textContent = data.name;
    document.getElementById('temperature').textContent = data.main.temp;
    document.getElementById('weatherDescription').textContent = data.weather[0].description;
    document.getElementById('humidity').textContent = data.main.humidity;
    document.getElementById('windSpeed').textContent = data.wind.speed;
    document.getElementById('max_temperature').textContent = data.main.temp_max;
    document.getElementById('min_temperature').textContent = data.main.temp_min;
    document.getElementById('feels_like_temperature').textContent = data.main.feels_like;
    document.getElementById('country_code').textContent = data.cod;
    document.getElementById('coordinates').textContent = `lon:${data.coord.lon}, lat:${data.coord.lat}`;

    initMap(data.coord.lon, data.coord.lat);
    fetchAirQuality(data.name);
}

function initMap(longitude, latitude) {
    var map = new google.maps.Map(document.getElementById('map'), {
        center: { lng: longitude, lat: latitude },
        zoom: 12 
    });

    var marker = new google.maps.Marker({
        position: { lng: longitude, lat: latitude },
        map: map,
        title: 'City Location'
    });
}

const fetchUnsplashImages = (cityName) => {
    const accessKey = 'rbsq0FTqCUYbgJYMUkBy5O74gSl2r8GWcweMNjg6MRE';
    const apiUrl = `https://api.unsplash.com/search/photos?query=${cityName}&client_id=${accessKey}`;

    fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            console.log('Unsplash API Response:', data);
            displayImages(data.results);
        })
        .catch(error => {
            console.error('Error fetching Unsplash images:', error);
        });
}

function displayImages(images) {
    const imageContainer = document.getElementById('image-create'); 
    imageContainer.innerHTML = ''; 

   
    for (let i = 0; i < Math.min(images.length, 5); i++) {
        const image = images[i];

        const imgElement = document.createElement('img');
        imgElement.src = image.urls.regular;
        imgElement.alt = image.description;

        
        imageContainer.appendChild(imgElement);
    }
}

const fetchAirQuality = (city) => {
    const apiKey = 'iQ7pPfaXcIpNTNAasd/+TQ==6NCW1SVoqnDbbaMM'; 
    const apiUrl = `https://api.api-ninjas.com/v1/airquality?city=${city}`;
    
    fetch(apiUrl, {
        headers: {
            'X-Api-Key': apiKey
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        console.log('Air Quality API Response:', data);
        
        displayAirQuality(data);
    })
    .catch(error => {
        console.error('Error fetching air quality data:', error);
    });
}


const displayAirQuality = (data) => {
    const aqiBox = document.getElementById('airQuality');
    let aqiLevel = 'good';

    
    if (data.overall_aqi <= 50) {
        aqiLevel = 'good';
    } else if (data.overall_aqi <= 100) {
        aqiLevel = 'moderate';
    } else if (data.overall_aqi <= 150) {
        aqiLevel = 'unhealthy';
    } else if (data.overall_aqi <= 200) {
        aqiLevel = 'very-unhealthy';
    } else {
        aqiLevel = 'hazardous';
    }

    
    aqiBox.classList.add(`aqi-${aqiLevel}`);

   
    document.getElementById('co').textContent = data.CO ? `concentration- ${data.CO.concentration}, AQI- ${data.CO.aqi}` : 'N/A';
    document.getElementById('no2').textContent = data.NO2 ? `concentration- ${data.NO2.concentration}, AQI- ${data.NO2.aqi}` : 'N/A';
    document.getElementById('o3').textContent = data.O3 ? `concentration- ${data.O3.concentration}, AQI- ${data.O3.aqi}` : 'N/A';
    
}