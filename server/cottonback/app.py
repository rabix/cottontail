import os
from flask import Flask, jsonify, send_file
from flask_mongokit import MongoKit
from social.apps.flask_app.routes import social_auth

from cottonback.db import *

app = Flask("cottonback", static_url_path="", static_folder=os.path.abspath("client/.tmp"))
app.register_blueprint(social_auth)
SOCIAL_AUTH_USER_MODEL = 'cottonback.db.User'

db = MongoKit(app)
db.register([User])


@app.route('/')
def index():
    return jsonify({"message": "Hello tail!"})
