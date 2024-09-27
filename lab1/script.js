import { transformedData } from './FE4U-Lab2-update-mock.js';

const teachersContainer = document.getElementById("teachers-container");
const filterForm = document.getElementById("filter-form");
const popup = document.getElementById("teacher-popup");
const closePopup = document.getElementById("close-popup");

function renderTeachers(teachers) {
    teachersContainer.innerHTML = "";
    teachers.slice(0, 10).forEach(teacher => {
        const profileDiv = createTeacherProfile(teacher);
        teachersContainer.appendChild(profileDiv);
    });
}

function createTeacherProfile(teacher) {
    const profileDiv = document.createElement("div");
    profileDiv.classList.add("top-teachers-profile");

    const img = document.createElement("img");
    img.src = teacher.photo || "photos/teacherRoundPhoto1.jpg";
    img.alt = teacher.full_name;
    img.classList.add("circle-image");
    profileDiv.appendChild(img);
    
    const [firstName, lastName] = teacher.full_name.split(" ");
    const firstNameElement = document.createElement("h3");
    firstNameElement.textContent = firstName;
    profileDiv.appendChild(firstNameElement);

    const lastNameElement = document.createElement("h3");
    lastNameElement.textContent = lastName;
    profileDiv.appendChild(lastNameElement);

    const course = document.createElement("span");
    course.textContent = teacher.course;
    profileDiv.appendChild(course);
    
    const country = document.createElement("span");
    country.textContent = teacher.country;
    country.classList.add("country");
    profileDiv.appendChild(country);
    
    profileDiv.addEventListener('click', () => openPopup(teacher));

    return profileDiv;
}

filterForm.addEventListener("change", function() {
    const country = document.getElementById("country").value;
    const ageRange = document.getElementById("age").value;
    const gender = document.getElementById("gender").value;
    const favoritesOnly = document.getElementById("favorites-only").checked;

    const filteredTeachers = transformedData.filter(teacher => {
        const countryMatch = !country || teacher.country === country;

        let ageMatch = true;
        if (ageRange) {
            const [minAge, maxAge] = ageRange.split('-').map(Number);
            ageMatch = teacher.age >= minAge && teacher.age <= maxAge;
        }

        const genderMatch = !gender || teacher.gender === gender;
        const favoritesMatch = !favoritesOnly || teacher.favorite;

        return countryMatch && ageMatch && genderMatch && favoritesMatch;
    });

    renderTeachers(filteredTeachers);
});

function renderFavoriteTeachers() {
    const favoritesContainer = document.getElementById("teachers-container-favorite");
    const favoriteTeachers = transformedData.filter(teacher => teacher.favorite);
    favoritesContainer.innerHTML = "";

    favoriteTeachers.forEach(teacher => {
        const profileDiv = createTeacherProfile(teacher);
        favoritesContainer.appendChild(profileDiv);
    });
}


function openPopup(teacher) {
    document.getElementById("popup-img").src = teacher.photo || "photos/teacher1.jpg";
    document.getElementById("popup-name").textContent = teacher.full_name;
    document.getElementById("popup-subject").textContent = teacher.course;
    document.getElementById("popup-country").textContent = teacher.country;
    document.getElementById("popup-age").textContent = `Age: ${teacher.age}, Gender: ${teacher.gender}`;
    document.getElementById("popup-email").textContent = teacher.email; 
    document.getElementById("popup-phone").textContent = teacher.phone; 
    document.getElementById("popup-description").textContent = teacher.note;

    const stars = document.querySelectorAll(".star");
    stars.forEach((star, index) => {
        star.classList.toggle("full", teacher.favorite && index === 0);
        star.onclick = () => {
            star.classList.toggle("full");
            const teacherIndex = transformedData.findIndex(t => t.full_name === teacher.full_name);
            if (teacherIndex !== -1) {
                transformedData[teacherIndex].favorite = star.classList.contains("full");
                console.log("Updated teacher:", transformedData[teacherIndex]);
            } else {
                console.error("Teacher not found!");
            }
        };
    });

    popup.style.display = "flex"; 
}

closePopup.addEventListener("click", () => {
    popup.style.display = "none"; 
});

window.addEventListener('click', (event) => {
    if (event.target === popup) {
        popup.style.display = 'none';
    }
});

renderFavoriteTeachers();
renderTeachers(transformedData);
