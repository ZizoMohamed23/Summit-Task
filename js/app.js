document.addEventListener('DOMContentLoaded', () => {
    const customerFilter = document.getElementById('customerFilter');
    const amountFilter = document.getElementById('amountFilter');
    const customerTable = document.getElementById('customerTable').querySelector('tbody');
    const chartContext = document.getElementById('chart').getContext('2d');
    let customers = [
        { id: 1, name: 'Ahmed Ali' },
        { id: 2, name: 'Aya Elsayed' },
        { id: 3, name: 'Mina Adel' },
        { id: 4, name: 'Sarah Reda' },
        { id: 5, name: 'Mohamed Sayed' }
    ];
    let transactions = [
        { customer_id: 1, date: '2022-01-01', amount: 1000 },
        { customer_id: 1, date: '2022-01-02', amount: 2000 },
        { customer_id: 2, date: '2022-01-01', amount: 550 },
        { customer_id: 3, date: '2022-01-01', amount: 500 },
        { customer_id: 2, date: '2022-01-02', amount: 1300 },
        { customer_id: 4, date: '2022-01-01', amount: 750 },
        { customer_id: 3, date: '2022-01-02', amount: 1250 },
        { customer_id: 5, date: '2022-01-01', amount: 2500 },
        { customer_id: 5, date: '2022-01-02', amount: 875 }
    ];
    let chart = null;

    displayTable();

    customerFilter.addEventListener('input', displayTable);
    amountFilter.addEventListener('input', displayTable);

    function displayTable() {
        const customerName = customerFilter.value.toLowerCase();
        const amount = amountFilter.value;
        customerTable.innerHTML = '';

        const filteredTransactions = transactions.filter(transaction => {
            const customer = customers.find(c => c.id === transaction.customer_id);
            const matchesName = customer.name.toLowerCase().includes(customerName);
            const matchesAmount = amount ? transaction.amount >= amount : true;
            return matchesName && matchesAmount;
        });

        filteredTransactions.forEach(transaction => {
            const customer = customers.find(c => c.id === transaction.customer_id);
            const row = customerTable.insertRow();
            row.insertCell(0).textContent = customer.name;
            row.insertCell(1).textContent = transaction.date;
            row.insertCell(2).textContent = transaction.amount;
            row.addEventListener('click', () => displayChart(customer.id));
        });
    }

    function displayChart(customerId) {
        const customerTransactions = transactions.filter(transaction => transaction.customer_id === customerId);
        const amountsByDate = customerTransactions.reduce((acc, transaction) => {
            acc[transaction.date] = (acc[transaction.date] || 0) + transaction.amount;
            return acc;
        }, {});
        
        const dates = Object.keys(amountsByDate);
        const amounts = dates.map(date => amountsByDate[date]);

        if (chart) chart.destroy();

        chart = new Chart(chartContext, {
            type: 'line',
            data: {
                labels: dates,
                datasets: [{
                    label: 'Total Transaction Amount',
                    data: amounts,
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }
});
