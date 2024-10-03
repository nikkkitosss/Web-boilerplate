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
        const sortedData = [...apiTeachers].sort((a, b) => {
            let aText = getColumnValue(a, column);
            let bText = getColumnValue(b, column);

            if (type === 'number') {
                aText = parseInt(aText);
                bText = parseInt(bText);
            }

            return direction === 'asc' ? (aText > bText ? 1 : -1) : (aText < bText ? 1 : -1);
        });

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
            setTimeout(waitForData, 1000);
        }
    }
});
