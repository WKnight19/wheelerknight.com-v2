# Set Admin Password Script
from flask import Flask
from models import db
from models.models import AdminUser
import bcrypt

# Create Flask app context
app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://wheelerknight:wheelerknight123@mysql:3306/wheelerknight_portfolio'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db.init_app(app)

def set_admin_password():
    """Set password for admin user"""
    with app.app_context():
        admin = AdminUser.query.filter_by(username='wheeler').first()
        if admin:
            # Set password to 'admin123' using bcrypt
            salt = bcrypt.gensalt()
            admin.password_hash = bcrypt.hashpw('admin123'.encode('utf-8'), salt).decode('utf-8')
            db.session.commit()
            print(f"✅ Password set for admin user: {admin.username}")
        else:
            print("❌ Admin user not found")

if __name__ == '__main__':
    set_admin_password()
