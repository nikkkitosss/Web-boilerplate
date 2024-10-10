import { apiTeachers, renderTeachers, displayedCount} from './script.js';

const addTeacherButton = document.querySelectorAll('.add-teacher-button');
const teacherpopup = document.getElementById('add-teacher-popup');
const closePopupButton = document.getElementById('close-popup-add-teacher');
const addButton = document.querySelector('.form-container-popup .button');

addTeacherButton.forEach(button => {
    button.addEventListener('click', () => {
        teacherpopup.style.display = 'block';
    });
});

closePopupButton.addEventListener('click', () => {
    document.querySelector('.form-container-popup form').reset();
    teacherpopup.style.display = 'none';
});

window.addEventListener('click', (event) => {
    if (event.target === teacherpopup) {
        document.querySelector('.form-container-popup form').reset();
        teacherpopup.style.display = 'none';
    }
});

addButton.addEventListener('click', (event) => {
    event.preventDefault();

    const name = document.getElementById('name').value;
    const course = document.getElementById('speciality').value;
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
        course,
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
        fetch('http://localhost:3001/teachers', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newTeacher)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Помилка при відправці даних');
            }
            return response.json();
        })
        .then(data => {
            apiTeachers.push(data); 
            renderTeachers(apiTeachers);
        })
        .catch(error => {
            console.error('Помилка:', error);
        });
    } else {
        alert("Помилка: перевірте введені дані.");
    }    
});


function validateObject(obj) {
    const isCapitalizedString = (value) => 
        _.isString(value) && /^[A-Z][a-zA-Z]*(?: [A-Z][a-zA-Z]*)*$/.test(value);    

    const isValidPhoneNumber = (phone) => 
        _.isString(phone) && /^\+?[0-9]{10,15}$/.test(phone);

    const isValidEmail = (email) => 
        _.isString(email) && _.includes(email, '@');

    return _.every([
        isCapitalizedString(obj.full_name),
        isCapitalizedString(obj.city),
        isValidPhoneNumber(obj.phone),
        isValidEmail(obj.email),
        !_.isEmpty(obj.dob)
    ]);
}
