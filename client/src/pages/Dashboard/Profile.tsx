import React from "react";
import "./SharedStyles.css";

interface ProfileProps {
  username: string;
  email: string;
  onLogout: () => void;
  onEdit?: () => void;
}

const Profile: React.FC<ProfileProps> = ({ username, email, onLogout, onEdit }) => {
  return (
    <div className="page-container">
      <h2>Профил</h2>

      <div style={{ width: "100%", textAlign: "left", color: "#f3e9ff" }}>
        <p><strong>Потребителско име:</strong> {username}</p>
        <p><strong>Email:</strong> {email}</p>
      </div>

      <div className="task-form-actions" style={{ marginTop: "24px" }}>
        {onEdit && (
          <button className="main-btn" onClick={onEdit}>
            Редактирай
          </button>
        )}
        <button className="cancel-btn" onClick={onLogout}>
          Изход
        </button>
      </div>
    </div>
  );
};

export default Profile;
