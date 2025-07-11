document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('addCriminalForm');
    const criminalListTable = document.getElementById('criminalList').getElementsByTagName('tbody')[0];

    // Fetch and display all criminals on page load
    fetchCriminalRecords();

    // Handle form submission
    form.addEventListener('submit', function (e) {
        e.preventDefault();

        const name = document.getElementById('name').value.trim();
        const crime = document.getElementById('crime').value.trim();
        const crime_date = document.getElementById('crimeDate').value;

        if (!name || !crime || !crime_date) {
            alert('Please fill all required fields.');
            return;
        }

        const criminalData = { name, crime, crime_date };

        fetch('/criminals', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(criminalData)
        })
            .then(response => response.json())
            .then(data => {
                if (data.message === 'Criminal added successfully') {
                    alert('Criminal added successfully.');
                    form.reset();
                    fetchCriminalRecords();
                } else {
                    alert('Failed to add criminal.');
                }
            })
            .catch(error => {
                console.error('Error adding criminal:', error);
                alert('An error occurred while adding the criminal.');
            });
    });

    // Fetch all criminal records
    function fetchCriminalRecords() {
        fetch('/criminals')
            .then(response => response.json())
            .then(data => {
                criminalListTable.innerHTML = '';

                data.forEach(criminal => {
                    const row = criminalListTable.insertRow();

                    const idCell = row.insertCell(0);
                    const nameCell = row.insertCell(1);
                    const crimeCell = row.insertCell(2);
                    const crimeDateCell = row.insertCell(3);
                    const actionsCell = row.insertCell(4);

                    idCell.textContent = criminal.id;
                    nameCell.textContent = criminal.name;
                    crimeCell.textContent = criminal.crime;
                    crimeDateCell.textContent = criminal.crime_date;

                    const deleteButton = document.createElement('button');
                    deleteButton.textContent = 'Delete';
                    deleteButton.addEventListener('click', () => deleteCriminal(criminal.id));

                    actionsCell.appendChild(deleteButton);
                });
            })
            .catch(error => {
                console.error('Error fetching criminal records:', error);
                alert('Failed to load criminal records.');
            });
    }

    // Delete a criminal record by ID
    function deleteCriminal(id) {
        if (!confirm('Are you sure you want to delete this record?')) return;

        fetch(`/criminals/${id}`, {
            method: 'DELETE'
        })
            .then(response => response.json())
            .then(data => {
                if (data.message === 'Criminal deleted successfully') {
                    alert('Criminal deleted.');
                    fetchCriminalRecords();
                } else {
                    alert('Failed to delete criminal.');
                }
            })
            .catch(error => {
                console.error('Error deleting criminal:', error);
                alert('An error occurred while deleting the criminal.');
            });
    }
});
