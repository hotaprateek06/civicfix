import { useState, useEffect } from "react";
import { getNotifications } from "../api";

function Navbar({ user, logout }) {
  const [showDropdown, setShowDropdown] = useState(false);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    getNotifications(user.id).then(setNotifications);
  }, [user]);

  return (
    <div style={styles.nav}>
      <h2>CivicFix</h2>

      <div style={styles.right}>
        {/* 🔔 Bell Icon */}
        <div style={{ position: "relative" }}>
          <span
            style={styles.bell}
            onClick={() => setShowDropdown(!showDropdown)}
          >
            🔔
          </span>

          {/* 🔴 Badge */}
          {notifications.length > 0 && (
            <span style={styles.badge}>
              {notifications.length}
            </span>
          )}

          {/* 📩 Dropdown */}
          {showDropdown && (
            <div style={styles.dropdown}>
              <h4>Notifications</h4>

              {notifications.length === 0 ? (
                <p>No notifications</p>
              ) : (
                notifications.map((n) => (
                  <div key={n.id} style={styles.item}>
                    <p>{n.message}</p>
                    <small>
                      {new Date(n.created_at).toLocaleString()}
                    </small>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        <button onClick={logout}>Logout</button>
      </div>
    </div>
  );
}

export default Navbar;

const styles = {
  nav: {
    display: "flex",
    justifyContent: "space-between",
    padding: "10px 20px",
    background: "#222",
    color: "white",
  },
  right: {
    display: "flex",
    alignItems: "center",
    gap: "15px",
  },
  bell: {
    cursor: "pointer",
    fontSize: "20px",
  },
  badge: {
    position: "absolute",
    top: "-5px",
    right: "-10px",
    background: "red",
    color: "white",
    borderRadius: "50%",
    padding: "2px 6px",
    fontSize: "12px",
  },
  dropdown: {
    position: "absolute",
    top: "30px",
    right: "0",
    background: "white",
    color: "black",
    width: "250px",
    borderRadius: "10px",
    padding: "10px",
    boxShadow: "0 0 10px rgba(0,0,0,0.2)",
    zIndex: 100,
  },
  item: {
    borderBottom: "1px solid #eee",
    padding: "5px 0",
  },
};