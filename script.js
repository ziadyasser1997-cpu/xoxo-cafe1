// Script moved to external file. Handles transactions, UI updates, and persistence.
let transactions = JSON.parse(localStorage.getItem('transactions') || '[]');

const form = document.getElementById('transaction-form');
const historyBody = document.getElementById('history-body');
const totalIncomeEl = document.getElementById('total-income');
const totalExpenseEl = document.getElementById('total-expense');
const netBalanceEl = document.getElementById('net-balance');

function getFormattedDateTime() {
    const now = new Date();
    const date = now.toLocaleDateString('en-US', { year: 'numeric', month: 'numeric', day: 'numeric' });
    const time = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true });
    return `${date} | ${time}`;
}

form.addEventListener('submit', function(e) {
    e.preventDefault();

    const type = document.getElementById('type').value;
    const product = document.getElementById('product').value;
    const amount = parseFloat(document.getElementById('amount').value);
    const user = document.getElementById('user').value;
    const dateTime = getFormattedDateTime();

    const transaction = {
        id: Date.now(),
        type,
        product,
        amount,
        user,
        dateTime
    };

    transactions.push(transaction);
    updateUI();
    form.reset();
});

function deleteTransaction(id) {
    transactions = transactions.filter(t => t.id !== id);
    updateUI();
}

function updateUI() {
    historyBody.innerHTML = '';
    let totalIncome = 0;
    let totalExpense = 0;

    transactions.slice().reverse().forEach(t => {
        const row = document.createElement('tr');
        const typeText = t.type === 'income' ? 'Income (+)' : 'Expense (-)';
        const typeClass = t.type === 'income' ? 'text-income' : 'text-expense';

        if (t.type === 'income') totalIncome += t.amount;
        else totalExpense += t.amount;

        row.innerHTML = `
            <td class="date-time">${t.dateTime}</td>
            <td class="${typeClass}">${typeText}</td>
            <td>${t.product}</td>
            <td class="${typeClass}">${t.amount.toFixed(2)} EGP</td>
            <td>${t.user}</td>
            <td><button class="delete-btn" onclick="deleteTransaction(${t.id})">Delete</button></td>
        `;

        historyBody.appendChild(row);
    });

    totalIncomeEl.innerText = `${totalIncome.toFixed(2)} EGP`;
    totalExpenseEl.innerText = `${totalExpense.toFixed(2)} EGP`;
    const netBalance = totalIncome - totalExpense;
    netBalanceEl.innerText = `${netBalance.toFixed(2)} EGP`;

    if (netBalance >= 0) netBalanceEl.parentElement.style.backgroundColor = '#3498db';
    else netBalanceEl.parentElement.style.backgroundColor = '#e67e22';

    localStorage.setItem('transactions', JSON.stringify(transactions));
}

// Initial render
updateUI();
