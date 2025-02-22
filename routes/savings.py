from flask import Blueprint, jsonify
from models import Expense, User
from flask import request

savings_api = Blueprint('savings_api', __name__)


@savings_api.route('/api/expenses', methods=['GET'])
def get_expenses():
    # Get user_id from query parameter or request body
    user_id = request.args.get('user_id')  # You can use query parameters to pass the user_id

    if not user_id:
        return jsonify({"error": "User ID is required"}), 400

    # Fetch the user from the database
    user = User.query.get(user_id)

    if not user:
        return jsonify({"error": "User not found"}), 404

    # Fetch expenses for the specified user
    expenses = Expense.query.filter_by(user_id=user.id).all()

    # Convert the expenses to JSON format
    expense_list = [{"category": e.category, "amount": float(e.amount)} for e in expenses]

    return jsonify(expense_list)
