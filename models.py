from db import db
from datetime import datetime

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    monthly_income = db.Column(db.Numeric(10,2), default=0.00)  # Fix precision issue
    available_balance = db.Column(db.Numeric(10,2), default=0.00)  # Fix precision issue

    def __init__(self, monthly_income, available_balance):
        self.monthly_income = monthly_income
        self.available_balance = available_balance


class Expense(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    amount = db.Column(db.Numeric(10,2), nullable=False)  # Ensure proper decimal handling
    category = db.Column(db.String(100), nullable=False)
    date = db.Column(db.DateTime, default=datetime.utcnow)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)

    def __init__(self, amount, category, user_id):
        self.amount = amount
        self.category = category
        self.user_id = user_id
