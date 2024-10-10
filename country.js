import { transformedData } from './FE4U-Lab2-update-mock.js';

function getUniqueCountries(teachers) {
    const countries = teachers.map(teacher => teacher.country);
    const uniqueCountries = [...new Set(countries)];
    return uniqueCountries;
}

const uniqueCountries = getUniqueCountries(transformedData);
console.log(uniqueCountries);

