# In routes/line_graph.py
from flask import Blueprint, jsonify
from models import db, User, Expense
import datetime

line_graph = Blueprint('line_graph', __name__)


@line_graph.route('/monthly_data', methods=['GET'])
def monthly_data():
    # Get the current user
    user = User.query.first()  # Assuming there's only one user for now
    if not user:
        return jsonify({'error': 'User not found'}), 404

    # Prepare monthly data (for simplicity, assume you have a method for getting expenses)
    months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

    # Get the income data (assuming monthly income is constant or fixed for the example)
    income_data = [user.monthly_income] * 12  # Placeholder for static income data
    expense_data = []

    # Get total expenses for each month
    for month in months:
        total_expenses_for_month = db.session.query(db.func.sum(Expense.amount)).filter(
            db.extract('month', Expense.date) == months.index(month) + 1).scalar() or 0
        expense_data.append(total_expenses_for_month)

    return jsonify({
        'months': months,
        'income_data': income_data,
        'expense_data': expense_data
    })
