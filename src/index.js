import './css/styles.css';
import { fetchCountries } from './fetchCountries';
import { debounce } from 'lodash';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const DEBOUNCE_DELAY = 300;

const countryNameInput = document.querySelector('#search-box');
const countryListOutput = document.querySelector('.country-list');
const countryInfoOutput = document.querySelector('.country-info');

const handleSearchCountry = (event) => {
    const searchName = event.target.value.trim();

    fetchCountries(searchName).then(data => {
        if (data.length > 10) {
            Notify.info("Too many matches found. Please enter a more specific name.");
        } else if (data.length > 2 && data.length < 10) {
            countryListOutput.classList.add("list");

            data.forEach((country) => {
                const markup = `<li><img src=${country.flags.svg} alt="flag" width="30 px" height="20 px"> <span class="country-name">${country.name.official.toUpperCase()}</span></li>`
            
                countryListOutput.insertAdjacentHTML("beforeend", markup);
            })
        }
        else {
            countryListOutput.innerHTML = '';

            const markup = `<ul class="list"><li><img src=${data[0].flags.svg} alt="flag" width="30 px" height="20 px"> <span class="country-name">${data[0].name.official.toUpperCase()}</span></li><li><span class="list-item">Capital:</span> ${data[0].capital}</li><li><span class="list-item">Population:</span> ${data[0].population}</li><li><span class="list-item">Languages:</span> ${Object.values(data[0].languages)}</li></ul>`
            
            countryInfoOutput.innerHTML = markup;
        }
    }
    ).catch(error => {
        Notify.failure("Oops, there is no country with that name");
        countryInfoOutput.innerHTML = '';
        countryListOutput.innerHTML = '';
    });
}

countryNameInput.addEventListener('input', debounce(handleSearchCountry, DEBOUNCE_DELAY));