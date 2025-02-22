from flask import Blueprint, request, jsonify
from models import db, User

income_api = Blueprint('income_api', __name__)


@income_api.route('/users/income', methods=['PUT'])
def update_income():
    data = request.get_json()
    try:
        user = User.query.first()  # Get the first user

        if user is None:
            # If no user exists, create one with income and balance set to input value
            user = User(monthly_income=data['monthly_income'], available_balance=data['monthly_income'])
            db.session.add(user)
        else:
            # ✅ Update the monthly income
            user.monthly_income = data['monthly_income']

            # ✅ Add new income to the existing available balance
            user.available_balance += data['monthly_income']

        db.session.commit()  # Save changes to DB

        return jsonify({
            'message': 'Income updated successfully',
            'available_balance': user.available_balance
        }), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500
