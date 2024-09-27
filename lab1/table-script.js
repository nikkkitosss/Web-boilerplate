document.addEventListener('DOMContentLoaded', () => {
    const tableBody = document.getElementById('stats-body-1');

    function sortTable(column, type = 'string', direction = 'asc') {
        const rows = Array.from(tableBody.querySelectorAll('tr'));
        rows.sort((a, b) => {
            let aText = a.children[column].textContent.trim();
            let bText = b.children[column].textContent.trim();

            if (type === 'number') {
                aText = parseInt(aText);
                bText = parseInt(bText);
            }

            if (direction === 'asc') {
                return aText > bText ? 1 : -1;
            } else {
                return aText < bText ? 1 : -1;
            }
        });

        tableBody.innerHTML = '';
        rows.forEach(row => tableBody.appendChild(row));
    }

    document.getElementById('sort-name').addEventListener('click', () => sortTable(0, 'string', toggleDirection('name')));
    document.getElementById('sort-course').addEventListener('click', () => sortTable(1, 'string', toggleDirection('course')));
    document.getElementById('sort-age').addEventListener('click', () => sortTable(2, 'number', toggleDirection('age')));
    document.getElementById('sort-country').addEventListener('click', () => sortTable(4, 'string', toggleDirection('country')));

    const sortDirections = {
        name: 'asc',
        course: 'asc',
        age: 'asc',
        country: 'asc'
    };

    function toggleDirection(column) {
        sortDirections[column] = sortDirections[column] === 'asc' ? 'desc' : 'asc';
        return sortDirections[column];
    }
});
