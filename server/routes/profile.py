from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models.user import User
from models.task import Task

profile_bp = Blueprint("profile", __name__, url_prefix="/profile")

@profile_bp.route("/", methods=["GET"])
@jwt_required()
def get_profile():
    user_id = get_jwt_identity()
    user = User.query.get_or_404(user_id)

    tasks = Task.query.filter_by(created_by=user_id).all()
    claimed = Task.query.filter_by(claimed_by=user_id).all()

    return jsonify({
        "id": user.id,
        "username": user.username,
        "email": user.email,
        "reputation": user.reputation,
        "role": user.role,
        "created_at": user.created_at.isoformat(),
        "created_tasks_count": len(tasks),
        "claimed_tasks_count": len(claimed),
        "created_tasks": [
            {
                "id": t.id,
                "title": t.title,
                "status": t.status
            } for t in tasks
        ],
        "claimed_tasks": [
            {
                "id": t.id,
                "title": t.title,
                "status": t.status
            } for t in claimed
        ]
    }), 200
