from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models.match import Match
from models.like import Like
from models.task import Task
from models.user import User
from models import db

match_bp = Blueprint("match", __name__, url_prefix="/match")

# Потвърждаване на match (авторът на задачата избира user, който я е харесал)
@match_bp.route("/confirm", methods=["POST"])
@jwt_required()
def confirm_match():
    data = request.get_json()
    user_id = int(get_jwt_identity())  # това е авторът на задачата
    task_id = data.get("task_id")
    liked_user_id = data.get("user_id")  # този, който е харесал задачата

    task = Task.query.get_or_404(task_id)
    if task.created_by != user_id:
        return jsonify({"error": "Не си създател на тази задача!"}), 403
    if task.status != "open" or task.claimed_by is not None:
        return jsonify({"error": "Задачата вече е взета или не е open!"}), 400

    # Провери има ли like от този user към тази задача
    like = Like.query.filter_by(user_id=liked_user_id, task_id=task_id).first()
    if not like:
        return jsonify({"error": "Този потребител не е харесал задачата ти!"}), 400

    # Създай match и задай claimed_by
    match = Match(task_id=task_id, user_id=liked_user_id)
    db.session.add(match)
    task.claimed_by = liked_user_id
    task.status = "in_progress"
    db.session.commit()
    return jsonify({"message": "Match създаден! Задачата е възложена на избрания user."}), 200

# Всички задачи, които аз изпълнявам (т.е. съм matched)
@match_bp.route("/my", methods=["GET"])
@jwt_required()
def my_matches():
    user_id = int(get_jwt_identity())
    matches = Match.query.filter_by(user_id=user_id).all()
    result = []
    for m in matches:
        task = Task.query.get(m.task_id)
        if task:
            result.append({
                "task_id": task.id,
                "title": task.title,
                "status": task.status,
                "created_by": task.created_by,
                "is_completed": m.is_completed
            })
    return jsonify({"matches": result}), 200

# Кой е matched по моя задача
@match_bp.route("/task/<int:task_id>", methods=["GET"])
@jwt_required()
def matches_for_task(task_id):
    user_id = int(get_jwt_identity())
    task = Task.query.get_or_404(task_id)
    if task.created_by != user_id:
        return jsonify({"error": "Не си създател на тази задача!"}), 403
    matches = Match.query.filter_by(task_id=task_id).all()
    users = []
    for m in matches:
        user = User.query.get(m.user_id)
        users.append({
            "user_id": user.id,
            "username": user.username,
            "is_completed": m.is_completed
        })
    return jsonify({"matches": users}), 200

@match_bp.route("/complete", methods=["POST"])
@jwt_required()
def complete_task_and_pay():
    user_id = int(get_jwt_identity())
    data = request.get_json()
    task_id = data.get("task_id")
    task = Task.query.get_or_404(task_id)
    if task.created_by != user_id:
        return jsonify({"error": "Само създателят на задачата може да я завърши!"}), 403
    if task.status != "in_progress":
        return jsonify({"error": "Задачата не е в процес на изпълнение!"}), 400
    if not task.claimed_by:
        return jsonify({"error": "Няма изпълнител на задачата!"}), 400

    owner = User.query.get(task.created_by)
    worker = User.query.get(task.claimed_by)
    reward = task.reward

    if owner.wallet < reward:
        return jsonify({"error": "Нямаш достатъчно пари в портфейла!"}), 400

    # Трансфер на пари
    owner.wallet -= reward
    worker.wallet += reward
    task.status = "completed"

    # Маркирай match като completed
    match = Match.query.filter_by(task_id=task.id, user_id=worker.id).first()
    if match:
        match.is_completed = True

    db.session.commit()
    return jsonify({"message": f"Задачата е завършена, {reward} прехвърлени към {worker.username}!"}), 200


