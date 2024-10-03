// import { transformedData } from './FE4U-Lab2-update-mock.js';

// const searchInput = document.querySelector('.net-search');
// const searchButton = document.querySelector('.search-button');
// const teachersContainer = document.getElementById('teachers-container');


// searchButton.addEventListener('click', () => {
//     const searchValue = searchInput.value.toLowerCase(); 
//     const matchedTeachers = findMatchesByValue(transformedData, searchValue); 

//     teachersContainer.innerHTML = '';

//     matchedTeachers.slice(0, 10).forEach(teacher => {
//         const profileDiv = document.createElement("div");
//         profileDiv.classList.add("top-teachers-profile");

//         const img = document.createElement("img");
//         img.src = teacher.photo || "photos/teacherRoundPhoto1.jpg";
//         img.alt = teacher.full_name;
//         img.classList.add("circle-image");
//         profileDiv.appendChild(img);

//         const [firstName, lastName] = teacher.full_name.split(" ");

//         const firstNameElement = document.createElement("h3");
//         firstNameElement.textContent = firstName;
//         profileDiv.appendChild(firstNameElement);

//         const lastNameElement = document.createElement("h3");
//         lastNameElement.textContent = lastName;
//         profileDiv.appendChild(lastNameElement);

//         const course = document.createElement("span");
//         course.textContent = teacher.course;
//         profileDiv.appendChild(course);

//         const country = document.createElement("span");
//         country.textContent = teacher.country;
//         country.classList.add("country");
//         profileDiv.appendChild(country);

//         teachersContainer.appendChild(profileDiv);
//     });
// });

// function findMatchesByValue(array, searchValue) {
//     return array.filter((item) => {
//         for (let key in item) {
//             if (String(item[key]).toLowerCase().includes(searchValue)) {
//                 return true;
//             }
//         }
//         return false;
//     });
// }
