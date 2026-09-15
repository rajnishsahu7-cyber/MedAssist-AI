import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabase/client";

export default function Notifications() {
  const navigate = useNavigate();

  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadNotifications();
  }, []);

  async function loadNotifications() {
    setLoading(true);

    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      navigate("/");
      return;
    }

    const { data, error } = await supabase
      .from("notifications")
      .select(`
        id,
        title,
        message,
        type,
        related_id,
        is_read,
        created_at
      `)
      .eq("user_id", session.user.id)
      .order("created_at", {
        ascending: false,
      });

    if (error) {
      console.error("Notification loading error:", error);
      alert(error.message);
      setLoading(false);
      return;
    }

    setNotifications(data || []);
    setLoading(false);
  }

  async function markAsRead(notificationId) {
    const { error } = await supabase
      .from("notifications")
      .update({
        is_read: true,
      })
      .eq("id", notificationId);

    if (error) {
      console.error("Mark as read error:", error);
      alert(error.message);
      return;
    }

    setNotifications((current) =>
      current.map((notification) =>
        notification.id === notificationId
          ? { ...notification, is_read: true }
          : notification
      )
    );
  }

  async function markAllAsRead() {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      navigate("/");
      return;
    }

    const { error } = await supabase
      .from("notifications")
      .update({
        is_read: true,
      })
      .eq("user_id", session.user.id)
      .eq("is_read", false);

    if (error) {
      console.error("Mark all as read error:", error);
      alert(error.message);
      return;
    }

    setNotifications((current) =>
      current.map((notification) => ({
        ...notification,
        is_read: true,
      }))
    );
  }

  function getNotificationIcon(type) {
    switch (type) {
      case "appointment":
        return "📅";

      case "appointment_accepted":
        return "✅";

      case "appointment_rejected":
        return "❌";

      case "appointment_cancelled":
        return "🚫";

      case "appointment_completed":
        return "🏁";

      case "prescription":
        return "💊";

      case "medical_record":
        return "📋";

      default:
        return "🔔";
    }
  }

  function formatDate(dateString) {
    return new Date(dateString).toLocaleString();
  }

  const unreadCount = notifications.filter(
    (notification) => !notification.is_read
  ).length;

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h2>🏥 MedAssist</h2>

        <button
          onClick={() => navigate(-1)}
          style={styles.backButton}
        >
          ← Back
        </button>
      </header>

      <div style={styles.titleRow}>
        <div>
          <h1>🔔 Notifications</h1>

          <p style={styles.subtitle}>
            Stay updated with your MedAssist activity.
          </p>
        </div>

        {unreadCount > 0 && (
          <button
            onClick={markAllAsRead}
            style={styles.readAllButton}
          >
            ✓ Mark All as Read
          </button>
        )}
      </div>

      <div style={styles.summary}>
        <strong>{unreadCount}</strong>{" "}
        unread notification
        {unreadCount !== 1 ? "s" : ""}
      </div>

      {loading ? (
        <div style={styles.emptyCard}>
          <p>Loading notifications...</p>
        </div>
      ) : notifications.length === 0 ? (
        <div style={styles.emptyCard}>
          <div style={styles.emptyIcon}>🔔</div>

          <h3>No notifications</h3>

          <p>
            You don't have any notifications yet.
          </p>
        </div>
      ) : (
        <div style={styles.notificationList}>
          {notifications.map((notification) => (
            <div
              key={notification.id}
              style={{
                ...styles.notificationCard,
                ...(notification.is_read
                  ? styles.readCard
                  : styles.unreadCard),
              }}
            >
              <div style={styles.icon}>
                {getNotificationIcon(notification.type)}
              </div>

              <div style={styles.content}>
                <div style={styles.notificationHeader}>
                  <h3>
                    {notification.title}
                  </h3>

                  {!notification.is_read && (
                    <span style={styles.unreadBadge}>
                      New
                    </span>
                  )}
                </div>

                <p style={styles.message}>
                  {notification.message}
                </p>

                <p style={styles.date}>
                  {formatDate(
                    notification.created_at
                  )}
                </p>

                {!notification.is_read && (
                  <button
                    onClick={() =>
                      markAsRead(notification.id)
                    }
                    style={styles.readButton}
                  >
                    ✓ Mark as Read
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    background: "#f5f7fb",
    padding: "30px",
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "30px",
  },

  backButton: {
    background: "#374151",
    color: "#fff",
    border: "none",
    padding: "10px 18px",
    borderRadius: "8px",
    cursor: "pointer",
  },

  titleRow: {
    maxWidth: "900px",
    margin: "0 auto 20px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "20px",
  },

  subtitle: {
    color: "#6b7280",
  },

  readAllButton: {
    background: "#2563eb",
    color: "#fff",
    border: "none",
    padding: "11px 18px",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "bold",
    whiteSpace: "nowrap",
  },

  summary: {
    maxWidth: "900px",
    margin: "0 auto 20px",
    padding: "12px 16px",
    background: "#fff",
    borderRadius: "8px",
    color: "#374151",
  },

  notificationList: {
    maxWidth: "900px",
    margin: "0 auto",
    display: "flex",
    flexDirection: "column",
    gap: "15px",
  },

  notificationCard: {
    display: "flex",
    gap: "18px",
    padding: "20px",
    borderRadius: "12px",
    border: "1px solid #e5e7eb",
    boxShadow: "0 3px 10px rgba(0, 0, 0, 0.05)",
  },

  readCard: {
    background: "#ffffff",
  },

  unreadCard: {
    background: "#eff6ff",
    borderLeft: "5px solid #2563eb",
  },

  icon: {
    fontSize: "30px",
    minWidth: "40px",
  },

  content: {
    flex: 1,
  },

  notificationHeader: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },

  notificationHeaderH3: {
    margin: 0,
  },

  unreadBadge: {
    background: "#2563eb",
    color: "#fff",
    padding: "4px 9px",
    borderRadius: "15px",
    fontSize: "11px",
    fontWeight: "bold",
  },

  message: {
    color: "#4b5563",
    margin: "8px 0",
  },

  date: {
    color: "#9ca3af",
    fontSize: "13px",
  },

  readButton: {
    background: "#e5e7eb",
    color: "#374151",
    border: "none",
    padding: "7px 12px",
    borderRadius: "6px",
    cursor: "pointer",
    marginTop: "5px",
  },

  emptyCard: {
    maxWidth: "900px",
    margin: "0 auto",
    background: "#fff",
    padding: "50px",
    textAlign: "center",
    borderRadius: "12px",
    boxShadow: "0 3px 10px rgba(0, 0, 0, 0.05)",
  },

  emptyIcon: {
    fontSize: "45px",
    marginBottom: "10px",
  },
};