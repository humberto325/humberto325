const container = document.querySelector('.container');
const search = document.querySelector('.search-box button');
const searchInput = document.querySelector('.search-box input');
const weatherBox = document.querySelector('.weather-box');
const weatherDetails = document.querySelector('.weather-details');
const error404 = document.querySelector('.not-found');

searchInput.addEventListener('keyup', (event) => {
    if (event.key === 'Enter') {
        search.click();
    }
});

search.addEventListener('click', () => {

    const APIKey = '02ca8f78ae805a09ff11344a45d2ecc7';
    const city = document.querySelector('.search-box input').value;
    const country = document.querySelector('#country-select').value;

    if (city === '')
        return;

    let query = city;
    if (country) {
        query = `${city},${country}`;
    }

    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${query}&units=metric&appid=${APIKey}`)
        .then(response => response.json())
        .then(json => {

            if (json.cod === '404') {
                container.style.height = '400px';
                weatherBox.style.display = 'none';
                weatherDetails.style.display = 'none';
                error404.style.display = 'block';
                error404.classList.add('fadeIn');
                return;
            }

            error404.style.display = 'none';
            error404.classList.remove('fadeIn');

            const image = document.querySelector('.weather-box img');
            const temperature = document.querySelector('.weather-box .temperature');
            const description = document.querySelector('.weather-box .description');
            const humidity = document.querySelector('.weather-details .humidity span');
            const wind = document.querySelector('.weather-details .wind span');

            switch (json.weather[0].main) {
                case 'Clear':
                    image.src = 'https://cdn-icons-png.flaticon.com/512/6974/6974833.png';
                    break;

                case 'Rain':
                    image.src = 'https://cdn-icons-png.flaticon.com/512/3351/3351979.png';
                    break;

                case 'Snow':
                    image.src = 'https://cdn-icons-png.flaticon.com/512/642/642102.png';
                    break;

                case 'Clouds':
                    image.src = 'https://cdn-icons-png.flaticon.com/512/414/414825.png';
                    break;

                case 'Haze':
                    image.src = 'https://cdn-icons-png.flaticon.com/512/1197/1197102.png';
                    break;
                
                case 'Mist':
                    image.src = 'https://cdn-icons-png.flaticon.com/512/4005/4005901.png';
                    break;

                default:
                    image.src = '';
            }

            temperature.innerHTML = `${parseInt(json.main.temp)}<span>°C</span>`;
            description.innerHTML = `${json.weather[0].description}`;
            humidity.innerHTML = `${json.main.humidity}%`;
            wind.innerHTML = `${parseInt(json.wind.speed)}Km/h`;

            weatherBox.style.display = 'block';
            weatherDetails.style.display = 'flex';
            weatherBox.classList.add('fadeIn');
            weatherDetails.classList.add('fadeIn');
            container.style.height = '590px';


        });

});
