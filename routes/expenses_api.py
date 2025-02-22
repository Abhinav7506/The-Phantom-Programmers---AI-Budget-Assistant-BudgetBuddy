from flask import Blueprint, request, jsonify
from models import db, Expense, User
from decimal import Decimal
expense_api = Blueprint('expense_api', __name__)

@expense_api.route('/users/expenses', methods=['POST'])
def add_expense():
    data = request.get_json()
    print(f"Received data: {data}")  # Debugging

    try:
        if 'amount' not in data or 'category' not in data:
            return jsonify({'error': 'Missing amount or category'}), 400

        amount = float(data['amount'])
        category = data['category']

        user = User.query.first()
        if not user:
            return jsonify({'error': 'User not found'}), 404

        if amount <= 0:
            return jsonify({'error': 'Amount must be greater than zero'}), 400

        # Create and store new expense
        expense = Expense(amount=amount, category=category, user_id=user.id)
        db.session.add(expense)

        # Deduct from available balance
        user.available_balance -= Decimal(str(amount))
        # Ensure transaction is committed
        db.session.commit()

        return jsonify({
            'message': 'Expense added successfully',
            'available_balance': float(user.available_balance)  # Convert to float for JSON response
        }), 200

    except Exception as e:
        print(f"Error: {e}")  # Debugging
        db.session.rollback()  # Prevent database corruption in case of failure
        return jsonify({'error': str(e)}), 500
