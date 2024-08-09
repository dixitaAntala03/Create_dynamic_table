let jsonData = [];

fetch('task3.json')
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  })
  .then(data => {
    jsonData = data; 
    createTable(data);
    populateDropdowns(data);
  })
  .catch(error => {
    console.error('There has been a problem with your fetch operation:', error);
  });

function createTable(data) {
    let tableHead = document.getElementById('parentHead');
    let tableBody = document.getElementById('parentRecord');
    
    tableHead.innerHTML = '';
    tableBody.innerHTML = '';
    
    let headers = Object.keys(data[0]);
    headers.forEach(header => {
        let th = document.createElement('th');
        th.textContent = header;
        th.classList.add('table-header');
        tableHead.appendChild(th);
    });

    data.forEach(record => {
        let tr = document.createElement('tr');
        headers.forEach(header => {
            let td = document.createElement('td');
            td.textContent = record[header] || ''; 
            tr.appendChild(td);
        });
        tableBody.appendChild(tr);
    });
}

function populateDropdowns(data) {
    let container = document.getElementById('container');
    container.innerHTML = '';

    let keys = Object.keys(data[0]);
    keys.forEach(key => {
        let label = document.createElement('label');
        label.textContent = key;
        
        let select = document.createElement('select');
        select.dataset.key = key;
        
        let defaultOption = document.createElement('option');
        defaultOption.value = '';
        defaultOption.textContent = 'Select ' + key;
        select.appendChild(defaultOption);
        
        let uniqueValues = [...new Set(data.map(item => item[key]))];
        uniqueValues.forEach(value => {
            let option = document.createElement('option');
            option.value = value;
            option.textContent = value;
            select.appendChild(option);
        });

        container.appendChild(label);
        container.appendChild(select);
    });
}

document.getElementById('filterButton').addEventListener('click', () => {
    let selects = document.querySelectorAll('#container select');
    let filters = {};
    
    selects.forEach(select => {
        let key = select.dataset.key;
        let value = select.value;
        if (value) filters[key] = value;
    });
    
    let filteredData = jsonData.filter(item => {
        return Object.keys(filters).every(key => item[key] == filters[key]);
    });

    createTable(filteredData);
});

document.getElementById('clearButton').addEventListener('click', () => {
    let selects = document.querySelectorAll('#container select');
    selects.forEach(select => {
        select.selectedIndex = 0;
    });
    createTable(jsonData);
});
