
// Function to fetch expenses and plot the pie chart
let savingsChart;
async function fetchAndPlotChart(userId) {
  try {
    const response = await fetch(`/api/expenses?user_id=${userId}`);
    const data = await response.json();

    if (data.error) {
      console.error(data.error);
      return;
    }

    // Process the data to calculate categories
    let investment = 0, savings = 0, other = 0;

    data.forEach(expense => {
      if (expense.category.toLowerCase() === 'investment') {
        investment += expense.amount;
      } else if (expense.category.toLowerCase() === 'savings') {
        savings += expense.amount;
      } else {
        other += expense.amount;
      }
    });

    // If the chart already exists, update the data, else create a new one
    if (savingsChart) {
      // Only update the chart if the data changes
      savingsChart.data.datasets[0].data = [investment, savings, other];
      savingsChart.update();  // Update the existing chart
    } else {
      // Create the pie chart if not already created
      const ctx = document.getElementById('savingsChart').getContext('2d');
      savingsChart = new Chart(ctx, {
        type: 'pie',
        data: {
          labels: ['Investment', 'Savings', 'Other'],
          datasets: [{
            data: [investment, savings, other],
            backgroundColor: ['#ff9999', '#66b3ff', '#99ff99'],
            hoverBackgroundColor: ['#ff6666', '#3399ff', '#66ff66']
          }]
        }
      });
    }
  } catch (error) {
    console.error('Error fetching data:', error);
  }
}

// Function to start updating the chart automatically every 5 seconds
function startAutoUpdateChart(userId) {
  // Call fetchAndPlotChart initially to load data
  fetchAndPlotChart(userId);

  // Set an interval to refresh data every 200 milli seconds
  setInterval(() => {
    fetchAndPlotChart(userId);
  }, 200); // Adjust the time (in ms) as needed
}

// Call the function with the user ID (e.g., 1)
startAutoUpdateChart(1);  // Replace '1' with actual user ID



// Function to fetch and plot the line chart
let incomeExpenseChart;
async function fetchAndPlotLineChart() {
  try {
    const response = await fetch('/monthly_data');
    const data = await response.json();
    const { months, income_data, expense_data } = data;

    if (incomeExpenseChart) {
      incomeExpenseChart.data.labels = months;  // Update months (X-axis labels)
      incomeExpenseChart.data.datasets[0].data = income_data;  // Update income data
      incomeExpenseChart.data.datasets[1].data = expense_data;  // Update expense data

      incomeExpenseChart.update();
    } else {
      const ctxIncomeExpense = document.getElementById('incomeExpenseChart').getContext('2d');
      incomeExpenseChart = new Chart(ctxIncomeExpense, {
        type: 'line',
        data: {
          labels: months,
          datasets: [
            {
              label: 'Income',
              data: income_data,
              borderColor: '#36a2eb',
              fill: false
            },
            {
              label: 'Expense',
              data: expense_data,
              borderColor: '#ff6384',
              fill: false
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: true,
          scales: {
            y: {
              beginAtZero: true,
            }
          },
          animation: {
            duration: 1000
          }
        }
      });
    }
  } catch (error) {
    console.error('Error fetching monthly data:', error);
  }
}

// Function to automatically update the chart every 5 seconds
function startAutoUpdateLineChart() {
  // Initial fetch and plot
  fetchAndPlotLineChart();

  // Set an interval to refresh the chart every 2 seconds (2000 milliseconds)
  setInterval(() => {
    fetchAndPlotLineChart();
  }, 2000); // Adjust the interval as needed
}

// Call the function to start automatic updates
startAutoUpdateLineChart();

// Dark Mode Toggle
const darkModeToggle = document.getElementById('darkModeToggle');

// Check if dark mode is already saved in localStorage to keep user preference
if (localStorage.getItem('darkMode') === 'enabled') {
  document.body.classList.add('dark-mode');
}

darkModeToggle.addEventListener('click', () => {
  document.body.classList.toggle('dark-mode');

  // Save the user's preference in localStorage
  if (document.body.classList.contains('dark-mode')) {
    localStorage.setItem('darkMode', 'enabled');
  } else {
    localStorage.removeItem('darkMode');
  }
});

// GSAP Entry Animations
gsap.from("#header-title", { duration: 1.5, y: -50, opacity: 0, ease: "bounce" });
gsap.from("nav a", { duration: 1, opacity: 0, y: -20, stagger: 0.2 });

// Page Load Animation
window.addEventListener("load", () => {
  gsap.from("body", { duration: 1, opacity: 0, ease: "power1.out" });
});

// Button Click Animation
document.querySelectorAll("button").forEach(button => {
  button.addEventListener("click", () => {
    gsap.to(button, { duration: 0.2, scale: 0.95, yoyo: true, repeat: 1, ease: "power1.inOut" });
  });
});

// Saving Income
const saveIncomeBtn = document.getElementById('saveIncomeBtn');
const availableBalance = document.getElementById('availableBalance');
const monthlyIncomeInput = document.getElementById('monthlyIncomeInput');

saveIncomeBtn.addEventListener('click', () => {
  const income = parseFloat(monthlyIncomeInput.value);
  if (isNaN(income) || income <= 0) {
    alert("Please enter a valid income.");
    return;
  }

  fetch('/users/income', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ 'monthly_income': income })
  })
    .then(response => response.json())
    .then(data => {
      if (data.message === 'Income updated successfully') {
        // Fetch the latest balance from backend after updating income
        fetchUpdatedBalance();
      } else {
        console.error('Error updating income:', data.error);
      }
    })
    .catch(error => {
      console.error('Error:', error);
    });
});

// Function to Fetch Updated Balance from Backend
function fetchUpdatedBalance() {
  fetch('/') // Fetching the dashboard again
    .then(response => response.text()) // Get HTML response
    .then(html => {
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');
      const newBalance = doc.getElementById('availableBalance').textContent;

      // Update the available balance dynamically
      document.getElementById('availableBalance').textContent = newBalance;
    })
    .catch(error => console.error('Error fetching updated balance:', error));
}

// Adding Expenses
const expenseForm = document.getElementById('expenseForm');
const expenseAmountInput = document.getElementById('expenseAmount');
const expenseCategorySelect = document.getElementById('expenseCategory');

expenseForm.addEventListener('submit', (event) => {
  event.preventDefault();

  const expenseAmount = parseFloat(expenseAmountInput.value);
  const expenseCategory = expenseCategorySelect.value;

  if (isNaN(expenseAmount) || expenseAmount <= 0 || expenseCategory === '') {
    alert("Please enter a valid expense amount and select a category.");
    return;
  }

  fetch('/users/expenses', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      'amount': expenseAmount,
      'category': expenseCategory
    })
  })
    .then(response => response.json())
    .then(data => {
      if (data.message === 'Expense added successfully') {
        // Update available balance on successful expense addition
        availableBalance.textContent = parseFloat(data.available_balance).toFixed(2);
        expenseAmountInput.value = ''; // Clear the input field
        expenseCategorySelect.selectedIndex = 0; // Properly reset dropdown
      } else {
        alert('Error: ' + data.error);
      }
    })
    .catch(error => {
      console.error('Error:', error.message);
      alert("Something went wrong. Please try again.");
    });
});


function clearText() {
  const textarea = document.getElementById('notepad');
  textarea.value = '';
}

function downloadText() {
  const textarea = document.getElementById('notepad');
  const blob = new Blob([textarea.value], { type: 'text/plain' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'code-notepad.txt';
  link.click();
}
