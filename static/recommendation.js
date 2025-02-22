document.addEventListener("DOMContentLoaded", function () {
  const recommendationSection = document.getElementById("recommendationSection");

  if (!recommendationSection) {
    console.error("Element with ID 'recommendationSection' not found.");
    return;
  }

  // Preloaded recommendations (30 total)
  const recommendations = [
    "Track your daily expenses to stay within your budget.",
    "Set aside at least 10% of your income for savings.",
    "Use cash instead of credit cards to avoid unnecessary debt.",
    "Review your subscriptions and cancel unused ones.",
    "Create an emergency fund for unexpected expenses.",
    "Plan your meals to avoid overspending on food.",
    "Set financial goals and track your progress regularly.",
    "Avoid impulse purchases by making a shopping list.",
    "Compare prices before making big purchases.",
    "Use budgeting apps to keep track of your finances.",
    "Limit dining out to save money on food expenses.",
    "Look for discounts and cashback offers on purchases.",
    "Pay off high-interest debt as soon as possible.",
    "Invest in assets that generate passive income.",
    "Review your financial statements monthly.",
    "Automate your savings to ensure consistency.",
    "Shop during sales or discount periods to save money.",
    "Negotiate bills to get better rates on utilities.",
    "Use a rewards credit card responsibly for benefits.",
    "Set spending limits for non-essential purchases.",
    "Sell items you no longer use to make extra cash.",
    "Find free or low-cost alternatives for entertainment.",
    "Start a side hustle to increase your income.",
    "Learn basic DIY skills to save on home repairs.",
    "Compare insurance policies to find better deals.",
    "Use public transport or carpool to reduce expenses.",
    "Buy in bulk to save money on essentials.",
    "Invest in skills that can boost your career growth.",
    "Avoid borrowing money unless absolutely necessary.",
    "Donate or volunteer instead of spending on experiences."
  ];

  function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  function loadRandomRecommendations() {
    const shuffled = shuffleArray([...recommendations]); // Shuffle recommendations
    const selected = shuffled.slice(0, 6); // Pick 6 random recommendations

    // Generate HTML
    const recommendationHTML = selected.map(rec => `
                    <div class="recommendation1">
                        <p>${rec}</p>
                    </div>
                `).join("");

    // Insert into the container
    recommendationSection.innerHTML = recommendationHTML;
  }

  loadRandomRecommendations();
});