import { transformedData } from './FE4U-Lab2-update-mock.js';

const addTeacherButton = document.querySelectorAll('.add-teacher-button');
const popup = document.getElementById('add-teacher-popup');
const closePopupButton = document.getElementById('close-popup-add-teacher');
const addButton = document.querySelector('.form-container-popup .button');

addTeacherButton.forEach(button => {
    button.addEventListener('click', () => {
        popup.style.display = 'block';
    });
});

closePopupButton.addEventListener('click', () => {
    document.querySelector('.form-container-popup form').reset();
    popup.style.display = 'none';
});

window.addEventListener('click', (event) => {
    if (event.target === popup) {
        document.querySelector('.form-container-popup form').reset();
        popup.style.display = 'none';
    }
});

addButton.addEventListener('click', (event) => {
    event.preventDefault();

    const name = document.getElementById('name').value;
    const speciality = document.getElementById('speciality').value;
    const country = document.getElementById('country-add-teacher').value;
    const city = document.getElementById('city').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    const dob = document.getElementById('dob').value;
    const sex = document.querySelector('input[name="sex"]:checked')?.value; 
    const bgcolor = document.getElementById('bgcolor').value;
    const notes = document.getElementById('notes').value;

    const newTeacher = {
        full_name: name,
        speciality,
        country,
        city,
        email,
        phone,
        dob,
        gender: sex,
        bgcolor,
        note: notes
    };

    if (validateObject(newTeacher)) {
        transformedData.push(newTeacher);
        console.log(newTeacher);
    } else {
        alert("Помилка: перевірте введені дані.");
    }
});

function validateObject(obj) {
    function isCapitalizedString(value) {
        return typeof value === 'string' && /^[A-Z][a-zA-Z]*$/.test(value);
    }

    function isValidPhoneNumber(phone) {
        return typeof phone === 'string' && phone.match(/^\+?[0-9]{10,15}$/);
    }

    function isValidEmail(email) {
        return typeof email === 'string' && email.includes('@');
    }
    return (
        isCapitalizedString(obj.full_name) &&
        isCapitalizedString(obj.city) &&
        isValidPhoneNumber(obj.phone) &&
        isValidEmail(obj.email) &&
        obj.dob !== ""
    );
}
