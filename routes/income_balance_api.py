from flask import Flask, request, jsonify, render_template
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///budgetbuddy.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False  # Disable tracking modifications
db = SQLAlchemy(app)

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    monthly_income = db.Column(db.Float, default=0.0)
    available_balance = db.Column(db.Float, default=0.0)

    def __repr__(self):
        return '<User %r>' % self.id

class Expense(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    amount = db.Column(db.Float, nullable=False)
    category = db.Column(db.String(50))
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    user = db.relationship('User', backref=db.backref('expenses', lazy=True))

    def __repr__(self):
        return f'<Expense: amount={self.amount}, category={self.category}>'

@app.route('/users/income', methods=['PUT'])
def update_monthly_income():
    data = request.get_json()
    monthly_income = data.get('monthly_income')
    if monthly_income:
        user = User.query.first()  # Assuming only one user for simplicity
        if user:
            user.monthly_income = monthly_income
            user.available_balance += float(monthly_income)
            db.session.commit()
            return jsonify({'message': 'Monthly income updated successfully', 'available_balance': user.available_balance}), 200
        else:
            new_user = User(monthly_income=float(monthly_income), available_balance=float(monthly_income))
            db.session.add(new_user)
            db.session.commit()
            return jsonify({'message': 'User created with monthly income', 'available_balance': new_user.available_balance}), 201
    else:
        return jsonify({'error': 'Missing monthly income in request'}), 400

@app.route('/users/expenses', methods=['POST'])
def add_expense():
    data = request.get_json()
    amount = data.get('amount')
    category = data.get('category')
    user = User.query.first()  # Assuming only one user

    if user and amount and category:
        try:
            amount = float(amount)
            if user.available_balance >= amount:
                new_expense = Expense(amount=amount, category=category, user=user)
                db.session.add(new_expense)
                user.available_balance -= amount
                db.session.commit()
                return jsonify({'message': 'Expense added successfully', 'available_balance': user.available_balance}), 201
            else:
                return jsonify({'error': 'Insufficient funds'}), 400
        except ValueError:
            return jsonify({'error': 'Invalid amount. Please enter a valid number.'}), 400
    else:
        return jsonify({'error': 'Invalid request or missing data'}), 400

@app.route('/')
def dashboard():
    user = User.query.first()
    if user:
        available_balance = user.available_balance
    else:
        available_balance = 0.0
    return render_template('text.html', available_balance=f"{available_balance:.2f}")

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True)