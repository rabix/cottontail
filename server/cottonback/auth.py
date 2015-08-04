from flask_login import LoginManager

from cottonback import app
from cottonback.db.user import User

login_manager = LoginManager()
login_manager.init_app(app)

@login_manager.user_loader
def load_user(userid):
    return User.get(userid)
