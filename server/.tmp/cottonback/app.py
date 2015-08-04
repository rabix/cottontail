from flask import Flask, jsonify, send_file
import os

app = Flask("cottonback", static_url_path="", static_folder=os.path.abspath("client/.tmp"))

print os.path.abspath("client/src")

@app.route('/')
def index():
    return jsonify({"message": "Hello tail!"})
