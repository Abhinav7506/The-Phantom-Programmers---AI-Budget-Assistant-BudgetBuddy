from flask import Flask, render_template
from db import db
from routes.line_graph import line_graph  # Import the new route
from routes.savings import savings_api  # Import savings blueprint

app = Flask(__name__)

# Set up the database URI and other configurations
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///budgetbuddy.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Initialize db with the app
db.init_app(app)

# Register the blueprint

app.register_blueprint(savings_api)  # Register savings blueprint here

app.register_blueprint(line_graph)

# Import routes after initializing db to avoid circular imports
from routes.income_api import income_api
app.register_blueprint(income_api)

from routes.expenses_api import expense_api
app.register_blueprint(expense_api)

# Create the database tables if they don't exist
with app.app_context():
    db.create_all()

@app.route('/')
def dashboard():
    from models import User  # Import User inside route to avoid circular imports
    user = User.query.first()  # Query the first user
    if user:
        available_balance = user.available_balance
    else:
        available_balance = 0.0  # Default to 0.0 if no user
    return render_template('text.html', available_balance=f"{available_balance:.2f}")

if __name__ == '__main__':
    app.run(debug=True)
