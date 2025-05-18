from flask import Flask
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from models import db
from routes.auth import auth_bp
from routes.tasks import tasks_bp
from routes.profile import profile_bp

from config import Config

app = Flask(__name__)
app.config.from_object(Config)

CORS(
    app,
    resources={r"/*": {"origins": app.config["FRONTEND_ORIGIN"]}},
    supports_credentials=True
)

db.init_app(app)

jwt = JWTManager(app)

app.register_blueprint(auth_bp)
app.register_blueprint(tasks_bp)
app.register_blueprint(profile_bp) 

print("ВСИЧКИ ROUTE-ОВЕ:")
for rule in app.url_map.iter_rules():
    print(rule)

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True)
