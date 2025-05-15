from flask import Blueprint, jsonify

tasks_bp = Blueprint('tasks', __name__, url_prefix='/tasks')

@tasks_bp.route('/', methods=['GET'])
def get_tasks():
    return jsonify({"message": "Tasks endpoint работи!"}), 200
