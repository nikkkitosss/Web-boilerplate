const teachersContainer = document.getElementById("teachers-container");
const favoritesContainer = document.getElementById("teachers-container-favorite");
const filterForm = document.getElementById("filter-form");
const popup = document.getElementById("teacher-popup");
const closePopup = document.getElementById("close-popup");
const searchInput = document.querySelector('.net-search');
const searchButton = document.querySelector('.search-button');
const showMoreButton = document.getElementById("show-more");
const apiUrl = 'https://randomuser.me/api/?results=50';
const apiUrlTen = 'https://randomuser.me/api/?results=10';
const courses = [
    "Math", 
    "Science", 
    "History", 
    "Literature", 
    "Art", 
    "Computer Science", 
    "Physical Education", 
    "Music", 
    "Biology", 
    "Chemistry"
];

export let apiTeachers = [];
export let displayedCount = 10;

export function renderTeachers(teachers) {
    teachersContainer.innerHTML = "";
    teachers.slice(0, displayedCount).forEach(teacher => {
        const profileDiv = createTeacherProfile(teacher);
        teachersContainer.appendChild(profileDiv);
    });
    renderFavorites();
}

function renderFavorites() {
    favoritesContainer.innerHTML = "";
    const favoriteTeachers = apiTeachers.filter(teacher => teacher.favorite);
    favoriteTeachers.forEach(teacher => {
        const profileDiv = createTeacherProfile(teacher);
        favoritesContainer.appendChild(profileDiv);
    });
}

export function createTeacherProfile(teacher) {
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

function findMatchesByValue(array, searchValue) {
    if (!isNaN(searchValue)) {
        return array.filter(item => item.age === Number(searchValue));
    } else {
        return array.filter((item) => {
            for (let key in item) {
                if (String(item[key]).toLowerCase().includes(searchValue)) {
                    return true;
                }
            }
            return false;
        });
    }
}

searchButton.addEventListener('click', () => {
    const searchValue = searchInput.value.toLowerCase(); 
    const matchedTeachers = findMatchesByValue(apiTeachers, searchValue);

    renderTeachers(matchedTeachers);
});

filterForm.addEventListener("change", function() {
    const country = document.getElementById("country").value;
    const ageRange = document.getElementById("age").value;
    const gender = document.getElementById("gender").value;
    const favoritesOnly = document.getElementById("favorites-only").checked;

    const filteredTeachers = apiTeachers.filter(teacher => {
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
            const teacherIndex = apiTeachers.findIndex(t => t.full_name === teacher.full_name);
            if (teacherIndex !== -1) {
                apiTeachers[teacherIndex].favorite = star.classList.contains("full");
                console.log("Updated teacher:", apiTeachers[teacherIndex]);
                renderFavorites();
            } else {
                console.error("Teacher not found!");
            }
        };
    });

    popup.style.display = "flex"; 
}

function getRandomCourse() {
    const randomIndex = Math.floor(Math.random() * courses.length);
    return courses[randomIndex];
}

showMoreButton.addEventListener('click', () => {
    if (displayedCount >= 50) {
        fetch(apiUrlTen)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok ' + response.statusText);
                }
                return response.json();
            })
            .then(data => {
                const newTeachers = data.results.map(user => ({
                    full_name: `${user.name.first} ${user.name.last}`,
                    photo: user.picture.medium,
                    course: getRandomCourse(),
                    country: user.location.country,
                    age: user.dob.age, 
                    email: user.email,
                    phone: user.phone,
                    gender: user.gender,
                    favorite: false 
                }));
                apiTeachers = [...apiTeachers, ...newTeachers];
                displayedCount += 10; 
                renderTeachers(apiTeachers);
            })
            .catch(error => console.error('Error fetching additional users:', error));
    } else {
        displayedCount += 10; 
        renderTeachers(apiTeachers);    
    }
});

closePopup.addEventListener("click", () => {
    popup.style.display = "none"; 
});

window.addEventListener('click', (event) => {
    if (event.target === popup) {
        popup.style.display = 'none';
    }
});
fetch('http://localhost:3001/teachers')
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }
        return response.json();
    })
    .then(localData => {
        return fetch('https://randomuser.me/api/?results=50')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok ' + response.statusText);
                }
                return response.json();
            })
            .then(apiData => {
                const apiTeachersData = apiData.results.map(user => ({
                    full_name: `${user.name.first} ${user.name.last}`,
                    photo: user.picture.medium,
                    course: getRandomCourse(),  
                    country: user.location.country,
                    age: user.dob.age, 
                    email: user.email,
                    phone: user.phone,
                    gender: user.gender,
                    favorite: false 
                }));
                const randomImages = apiData.results.map(user => user.picture.medium);
                const localTeachers = localData.map((teacher, index) => ({
                    ...teacher,
                    photo: randomImages[index+21] || 'default.jpg',
                    favorite: false
                }));

                apiTeachers = [...localTeachers, ...apiTeachersData];
                
                renderTeachers(apiTeachers);
            });
    })
    .catch(error => console.error('Error fetching users:', error));


