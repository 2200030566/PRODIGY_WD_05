const weatherApi = {
    key: '4eb3703790b356562054106543b748b2',
    baseUrl: 'https://api.openweathermap.org/data/2.5/weather'
};

document.getElementById('search-btn').addEventListener('click', () => {
    const city = document.getElementById('input-box').value;
    getWeatherReport(city);
});

document.getElementById('input-box').addEventListener('keypress', (event) => {
    if (event.keyCode == 13) {
        const city = document.getElementById('input-box').value;
        getWeatherReport(city);
    }
});

function getWeatherReport(city) {
    fetch(`${weatherApi.baseUrl}?q=${city}&appid=${weatherApi.key}&units=metric`)
        .then(response => response.json())
        .then(data => {
            if (data.cod === '404' || data.cod === '400') {
                swal("Error", data.message, "error");
                return;
            }
            showWeatherReport(data);
        })
        .catch(() => {
            swal("Error", "Unable to fetch weather data", "error");
        });
}

function showWeatherReport(weather) {
    const weatherBody = document.getElementById('weather-body');
    weatherBody.style.display = 'block';

    const weatherDetails = `
        <div class="city">${weather.name}, ${weather.sys.country}</div>
        <div class="temp">${Math.round(weather.main.temp)}&deg;C</div>
        <div class="weather">${weather.weather[0].main} <i class="weather-icon ${getIconClass(weather.weather[0].main)}"></i></div>
        <div class="min-max">${Math.floor(weather.main.temp_min)}&deg;C (min) / ${Math.ceil(weather.main.temp_max)}&deg;C (max)</div>
        <div class="details">
            Feels like ${weather.main.feels_like}&deg;C | Humidity ${weather.main.humidity}%<br>
            Pressure ${weather.main.pressure} mb | Wind ${weather.wind.speed} KMPH
        </div>
        <div class="updated">Updated as of ${getTime(new Date())}</div>
    `;

    weatherBody.innerHTML = weatherDetails;
    changeBg(weather.weather[0].main);
    resetInput();
}

function getTime(date) {
    return `${addZero(date.getHours())}:${addZero(date.getMinutes())}`;
}

function addZero(num) {
    return num < 10 ? '0' + num : num;
}

function changeBg(status) {
    const body = document.body;
    body.className = ''; // Reset any existing classes

    const statusClassMap = {
        Clouds: 'clouds',
        Rain: 'rain',
        Clear: 'clear',
        Snow: 'snow',
        Sunny: 'sunny',
        Thunderstorm: 'thunderstorm',
        Drizzle: 'drizzle',
        Mist: 'mist',
        Haze: 'mist',
        Fog: 'mist',
    };

    body.classList.add(statusClassMap[status] || 'clear');
}

function getIconClass(weatherType) {
    const icons = {
        Rain: 'fas fa-cloud-showers-heavy',
        Clouds: 'fas fa-cloud',
        Clear: 'fas fa-sun',
        Snow: 'fas fa-snowflake',
        Sunny: 'fas fa-sun',
        Mist: 'fas fa-smog',
        Thunderstorm: 'fas fa-bolt',
        Drizzle: 'fas fa-cloud-rain',
    };
    return icons[weatherType] || 'fas fa-cloud-sun';
}

function resetInput() {
    document.getElementById('input-box').value = '';
}
