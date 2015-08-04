__author__ = 'filip'

from cottonback import app
from flask import jsonify

@app.route('/api/')
def index():
    return jsonify({"message": "Yo! World, bro!"})
