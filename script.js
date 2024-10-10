const teachersContainer = document.getElementById("teachers-container");
const favoritesContainer = document.getElementById("teachers-container-favorite");
const filterForm = document.getElementById("filter-form");
const popup = document.getElementById("teacher-popup");
const closePopup = document.getElementById("close-popup");
const searchInput = document.querySelector('.net-search');
const searchButton = document.querySelector('.search-button');
const showMoreButton = document.getElementById("show-more");
const teachinderLogo = document.getElementById("TeachinderLogo");
const mapDiv = document.getElementById('mapDiv');
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

let map;
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
        return _.filter(array, item => item.age === Number(searchValue));
    } else {
        return _.filter(array, item => {
            return _.some(item, value => {
                return _.toLower(String(value)).includes(searchValue);
            });
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

    const filteredTeachers = _.filter(apiTeachers, (teacher) => {
        const countryMatch = _.isEmpty(country) || teacher.country === country;
    
        const ageMatch = _.isEmpty(ageRange) || (() => {
            const [minAge, maxAge] = ageRange.split('-').map(Number);
            return _.inRange(teacher.age, minAge, maxAge + 1);
        })();
    
        const genderMatch = _.isEmpty(gender) || teacher.gender === gender;
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

    const birthdayDays = calculateDaysUntilBirthday(teacher.dob);
    document.getElementById("popup-birthday-info").textContent = `Days until birthday: ${birthdayDays}`;

    const popupContent = document.getElementById("popup-content");
    
    let mapVisible = false;
    mapDiv.style.display = 'none';  

    const existingToggleMapButton = popupContent.querySelector('.toggle-map');
    if (existingToggleMapButton) {
        existingToggleMapButton.remove();
    }
    
    const toggleMapButton = document.createElement('a');
    toggleMapButton.href = '#';
    toggleMapButton.textContent = 'Toggle Map';
    toggleMapButton.className = 'toggle-map'; 
    
    toggleMapButton.addEventListener('click', (event) => {
        event.preventDefault(); 
    
        if (mapVisible) {
            mapDiv.style.display = 'none'; 
            mapVisible = false; 
        } else {
            if (teacher.coordinates && teacher.coordinates.latitude !== null && teacher.coordinates.longitude !== null) {
                if (!map) { 
                    map = L.map(mapDiv).setView([teacher.coordinates.latitude, teacher.coordinates.longitude], 13); 
    
                    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                        maxZoom: 19,
                        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    }).addTo(map);
                } else {
                    map.setView([teacher.coordinates.latitude, teacher.coordinates.longitude], 13); 
                }
    
                L.marker([teacher.coordinates.latitude, teacher.coordinates.longitude]).addTo(map)
                    .bindPopup(teacher.full_name)
                    .openPopup();
    
                mapDiv.style.display = 'flex'; 
                mapVisible = true; 
            } else {
                alert('Цей викладач не має координат для відображення на карті.');
            }
        }
    });
    
    popupContent.appendChild(toggleMapButton);

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
function calculateDaysUntilBirthday(birthday) {
    const today = dayjs(); 
    const birthDate = dayjs(birthday); 
    let nextBirthday = birthDate.year(today.year()); 

    if (nextBirthday.isBefore(today)) {
        nextBirthday = nextBirthday.add(1, 'year');
    }

    const daysUntilBirthday = nextBirthday.diff(today, 'day');
    return daysUntilBirthday;
}
teachinderLogo.addEventListener('click', () => {
    displayedCount = 10;
    renderTeachers(apiTeachers);
});
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
                    coordinates: {
                        latitude: user.coordinates?.latitude || null,  
                        longitude: user.coordinates?.longitude || null
                    },
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
        return fetch(apiUrl)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok ' + response.statusText);
                }
                return response.json();
            })
            .then(apiData => {
                const apiTeachersData = _.map(apiData.results, (user) => ({
                    full_name: `${_.get(user, 'name.first')} ${_.get(user, 'name.last')}`,
                    photo: _.get(user, 'picture.medium'),
                    course: getRandomCourse(),
                    country: _.get(user, 'location.country'),
                    age: _.get(user, 'dob.age'),
                    email: _.get(user, 'email'),
                    phone: _.get(user, 'phone'),
                    gender: _.get(user, 'gender'),
                    dob: _.get(user, 'dob.date'),
                    coordinates: {
                        latitude: _.get(user, 'location.coordinates.latitude', null),
                        longitude: _.get(user, 'location.coordinates.longitude', null)
                    },
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
