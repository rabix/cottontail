from flask import Flask, jsonify

app = Flask("cottonback")


@app.route('/')
def index():
    return jsonify({"message": "Yo! World, bro!"})
