const container = document.querySelector('.container');
const result = document.querySelector('#resultado');
const form = document.querySelector('#formulario');

const city = document.querySelector('#ciudad');
const country = document.querySelector('#pais');

const search = {
    ciudad: city.value,
    pais: country.value
}

class UI {
    constructor() {};
    displayAlert(message) {
        const alert = document.querySelector('.bg-red-100');
        if (!alert) {
            const alert = document.createElement('div');
            alert.classList.add(
                'bg-red-100', 
                'border-red-400', 
                'text-red-700',
                'px-4',
                'py-3',
                'rounded',
                'relative',
                'max-w-md',
                'mx-auto',
                'mt-6',
                'text-center',
                'alert-transition'
            );
            alert.innerHTML = `
                <strong class="font-bold">Error!</strong>
                <span class="block sm:inline">${message.toUpperCase()}</span>
            `;

            container.appendChild(alert);

            setTimeout(() => {
                alert.remove();
            }, 2500);
        }
    }
    displayTemperature(data) {
        const {main: {temp, temp_max, temp_min}} = data;

        const cityAndCountry_p = document.createElement('p');
        cityAndCountry_p.innerHTML = `${search.ciudad}, ${search.pais}`;
        cityAndCountry_p.classList.add('font-bold', 'text-4xl');

        const CENTIGRADES_SYMB = '&#8451';

        const currentTemp_p = document.createElement('p');
        currentTemp_p.innerHTML = `${temp} ${CENTIGRADES_SYMB}`;
        currentTemp_p.classList.add('font-bold', 'text-6xl');

        const maxTemp_p = document.createElement('p');
        maxTemp_p.innerHTML = `Máx. ${temp_max} ${CENTIGRADES_SYMB}`;
        maxTemp_p.classList.add('text-xl');

        const minTemp_p = document.createElement('p');
        minTemp_p.innerHTML = `Mín. ${temp_min} ${CENTIGRADES_SYMB}`;
        minTemp_p.classList.add('text-xl');

        const resultDiv = document.createElement('div');
        resultDiv.classList.add('text-center', 'text-white', 'light-fade');

        resultDiv.appendChild(cityAndCountry_p);
        resultDiv.appendChild(currentTemp_p);
        resultDiv.appendChild(maxTemp_p);
        resultDiv.appendChild(minTemp_p);

        result.appendChild(resultDiv);
    }
    displaySpinner() {
        // this.clearResultHTML();

        const spinner_div = document.createElement('div');
        spinner_div.classList.add('sk-fading-circle');
        spinner_div.innerHTML = `
            <div class="sk-circle1 sk-circle"></div>
            <div class="sk-circle2 sk-circle"></div>
            <div class="sk-circle3 sk-circle"></div>
            <div class="sk-circle4 sk-circle"></div>
            <div class="sk-circle5 sk-circle"></div>
            <div class="sk-circle6 sk-circle"></div>
            <div class="sk-circle7 sk-circle"></div>
            <div class="sk-circle8 sk-circle"></div>
            <div class="sk-circle9 sk-circle"></div>
            <div class="sk-circle10 sk-circle"></div>
            <div class="sk-circle11 sk-circle"></div>
            <div class="sk-circle12 sk-circle"></div>
        `;

        result.appendChild(spinner_div);
    }
    clearResultHTML() {
        result.innerHTML = null;
    }
}

const userInterface = new UI();
window.addEventListener('load', () => {
    form.addEventListener('submit', searchWeather);
    loadEventListeners();
});

function loadEventListeners() {
    city.addEventListener('input', fillDataObject);
    country.addEventListener('input', fillDataObject);
}

function fillDataObject(ev) {
    search[ev.target.name] = ev.target.value;
    console.log(search);
}

function searchWeather(ev) {
    ev.preventDefault();

    const {ciudad, pais} = search;

    if (validateObj()) {
        consultAPI(ciudad, pais);
    }
}

function validateObj() {
    const {ciudad, pais} = search;

    if (!ciudad || !pais) {
        userInterface.displayAlert('Ambos campos son obligatorios');
        return false;
    }

    return true;
}

function consultAPI(city, country) {
    const API_KEY = '0683d06b1e75db6b83411f567e4f3384';
    const URL = `https://api.openweathermap.org/data/2.5/weather?q=${city},${country}&units=metric&appid=${API_KEY}`;

    userInterface.displaySpinner();

    fetch(URL).then(response => response.json()).then(data => {
        userInterface.clearResultHTML();
        if (data.cod === "404") {
            userInterface.displayAlert((data.cod, data.message));
            return;
        }
        userInterface.displayTemperature(data);
        clearForm();
    });
}

function convertKelvinToCentigrades(kelvinTemp) {
    return kelvinTemp - 273.15;
}

function clearForm() {
    form.reset();
    
    search.pais = '';
    search.ciudad = '';
}