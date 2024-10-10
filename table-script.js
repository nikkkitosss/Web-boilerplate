import { apiTeachers } from './script.js';

document.addEventListener('DOMContentLoaded', () => {
    waitForData();
    const tableBody = document.getElementById('stats-body-1');
    const paginationContainer = document.getElementById('pagination-container'); 

    const itemsPerPage = 10;
    let currentPage = 1;

    function renderTableData(data) {
        tableBody.innerHTML = ''; 

        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const currentData = data.slice(startIndex, endIndex);

        currentData.forEach((teacher) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${teacher.full_name}</td>
                <td>${teacher.course}</td>
                <td>${teacher.age}</td>
                <td>${teacher.gender}</td>
                <td>${teacher.country}</td>
            `;
            tableBody.appendChild(row);
        });

        renderPagination(data.length);
    }

    function renderPagination(totalItems) {
        const totalPages = Math.ceil(totalItems / itemsPerPage);
        paginationContainer.innerHTML = '';

        const firstPages = 4;
        const lastPage = totalPages;

        for (let i = 1; i <= firstPages && i <= totalPages; i++) {
            const pageButton = createPageButton(i);
            paginationContainer.appendChild(pageButton);
        }

        if (totalPages > firstPages + 1) {
            const ellipsis = document.createElement('span');
            ellipsis.textContent = '...';
            paginationContainer.appendChild(ellipsis);
        }

        if (totalPages > firstPages) {
            const lastPageButton = createPageButton(lastPage, 'Last');
            paginationContainer.appendChild(lastPageButton);
        }
    }

    function createPageButton(pageNumber, label = null) {
        const button = document.createElement('button');
        button.textContent = label ? label : pageNumber;
        button.classList.add('page-button');
        if (pageNumber === currentPage) {
            button.classList.add('active');
        }
        button.addEventListener('click', () => {
            currentPage = pageNumber;
            renderTableData(apiTeachers); 
        });
        return button;
    }

    function sortTable(column, type = 'string', direction = 'asc') {
        const sortedData = _.orderBy(apiTeachers, [teacher => getColumnValue(teacher, column)], [direction]);
    
        currentPage = 1;
        renderTableData(sortedData);
    }
    

    function getColumnValue(teacher, column) {
        switch (column) {
            case 0:
                return teacher.full_name;
            case 1:
                return teacher.course; 
            case 2:
                return teacher.age;
            case 3:  
                return teacher.country;
            default:
                return '';
        }
    }

    const sortDirections = {
        name: 'asc',
        course: 'asc',
        age: 'asc',
        country: 'asc'
    };

    document.getElementById('sort-name').addEventListener('click', () => sortTable(0, 'string', toggleDirection('name')));
    document.getElementById('sort-course').addEventListener('click', () => sortTable(1, 'string', toggleDirection('course')));
    document.getElementById('sort-age').addEventListener('click', () => sortTable(2, 'number', toggleDirection('age')));
    document.getElementById('sort-country').addEventListener('click', () => sortTable(3, 'string', toggleDirection('country')));

    function toggleDirection(column) {
        sortDirections[column] = sortDirections[column] === 'asc' ? 'desc' : 'asc';
        return sortDirections[column];
    }

    function waitForData() {
        if (apiTeachers.length > 0) {
            renderTableData(apiTeachers);
        } else {
            setTimeout(waitForData, 100);
        }
    }
    const checkDataReady = setInterval(() => {
        if (apiTeachers && apiTeachers.length > 0) {
            clearInterval(checkDataReady);
            initializeCharts(); 
        }
    }, 10);
    const getDataForChart = (dataKey) => {
        const labels = [];
        const dataValues = [];
        const countMap = {}; 
    
        apiTeachers.forEach(teacher => {
            let value;
            switch (dataKey) {
                case 'age':
                    value = teacher.age;
                    break;
                case 'gender':
                    value = teacher.gender;
                    break;
                case 'course':
                    value = teacher.course;
                    break;
                case 'country':
                    value = teacher.country;
                    break;
            }
    
            if (dataKey !== 'age') { 
                countMap[value] = (countMap[value] || 0) + 1;
            } else {
                countMap[value] = (countMap[value] || 0) + 1; 
            }
        });
    
        for (const [key, count] of Object.entries(countMap)) {
            labels.push(key);
            dataValues.push(count);
        }
    
        return { labels, dataValues };
    };
    
    
    const createPieChart = (ctx, labels, dataValues, label) => {
        const data = {
            labels: labels,
            datasets: [{
                label: label,
                data: dataValues,
                backgroundColor: [
                    'rgba(255, 99, 132, 0.6)',
                    'rgba(54, 162, 235, 0.6)',
                    'rgba(255, 206, 86, 0.6)',
                    'rgba(75, 192, 192, 0.6)'
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)'
                ],
                borderWidth: 1
            }]
        };
    
        const config = {
            type: 'pie',
            data: data,
            maintainAspectRatio: false,
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        display: false,
                        position: 'top',
                    }
                }
            }
        };
    
        return new Chart(ctx, config);
    };
    
    const initializeCharts = () => {
        const ageData = getDataForChart('age');
        const genderData = getDataForChart('gender');
        const courseData = getDataForChart('course');
        const countryData = getDataForChart('country');
    
        const ageCtx = document.getElementById('ageChart').getContext('2d');
        createPieChart(ageCtx, ageData.labels, ageData.dataValues, 'Age');
    
        const genderCtx = document.getElementById('genderChart').getContext('2d');
        createPieChart(genderCtx, genderData.labels, genderData.dataValues, 'Gender');
    
        const courseCtx = document.getElementById('courseChart').getContext('2d');
        createPieChart(courseCtx, courseData.labels, courseData.dataValues, 'Course');
    
        const countryCtx = document.getElementById('countryChart').getContext('2d');
        createPieChart(countryCtx, countryData.labels, countryData.dataValues, 'Country');
    };
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Tab') { 
            event.preventDefault();
    
            const tableContainer = document.getElementById('stats-body');
            const chartContainer = document.getElementById('pie-container');
            const paginationContainer = document.getElementById('pagination-container');
    
            const tableDisplay = window.getComputedStyle(tableContainer).display;
    
            if (tableDisplay === 'table' || tableDisplay === '') { 
                showChart(); 
                paginationContainer.style.display = 'none';
            } else {
                showTable();
                paginationContainer.style.display = 'flex';
            }
        }
    }); 
    
    function showChart() {
        const tableContainer = document.getElementById('stats-body');
        const chartContainer = document.getElementById('pie-container');
        
        tableContainer.style.display = 'none';
        chartContainer.style.display = 'flex';
    }
    
    function showTable() {
        const tableContainer = document.getElementById('stats-body');
        const chartContainer = document.getElementById('pie-container');
        
        tableContainer.style.display = 'table'; 
        chartContainer.style.display = 'none';
    }    
});
