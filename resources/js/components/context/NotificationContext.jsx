// components/context/NotificationContext.js
import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";
import { useAuth } from "./AuthContext";

const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api';

// Import Echo untuk real-time
let Echo = null;
if (typeof window !== 'undefined' && window.Echo) {
  Echo = window.Echo;
}

const NotificationContext = createContext();

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error("useNotification must be used within a NotificationProvider");
  }
  return context;
};

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const { isAuthenticated, user } = useAuth();
  const channelRef = useRef(null);

  const getToken = () => localStorage.getItem('token');

  // Fetch notifications from API
  const fetchNotifications = useCallback(async () => {
    const token = getToken();
    if (!token) return;

    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/notifications`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      });
      const result = await response.json();

      if (result.success) {
        setNotifications(result.data.data);
        // Calculate unread count
        const unread = result.data.data.filter(n => !n.is_read).length;
        setUnreadCount(unread);
      }
    } catch (error) {
      console.error("Gagal mengambil notifikasi:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch unread count only
  const fetchUnreadCount = useCallback(async () => {
    const token = getToken();
    if (!token) return;

    try {
      const response = await fetch(`${API_URL}/notifications/unread-count`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      });
      const result = await response.json();

      if (result.success) {
        setUnreadCount(result.data.unread_count);
      }
    } catch (error) {
      console.error("Gagal mengambil jumlah notifikasi:", error);
    }
  }, []);

  // Mark specific notification as read
  const markAsRead = useCallback(async (notificationId) => {
    const token = getToken();
    if (!token) return;

    try {
      const response = await fetch(`${API_URL}/notifications/${notificationId}/read`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      });
      const result = await response.json();

      if (result.success) {
        // Update local state
        setNotifications(prev =>
          prev.map(n =>
            n.id === notificationId ? { ...n, is_read: true } : n
          )
        );
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
    } catch (error) {
      console.error("Gagal menandai notifikasi sebagai dibaca:", error);
    }
  }, []);

  // Mark all notifications as read
  const markAllAsRead = useCallback(async () => {
    const token = getToken();
    if (!token) return;

    try {
      const response = await fetch(`${API_URL}/notifications/mark-all-read`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      });
      const result = await response.json();

      if (result.success) {
        // Update local state
        setNotifications(prev =>
          prev.map(n => ({ ...n, is_read: true }))
        );
        setUnreadCount(0);
      }
    } catch (error) {
      console.error("Gagal menandai semua notifikasi sebagai dibaca:", error);
    }
  }, []);

  // Load notifications on auth change
  useEffect(() => {
    if (isAuthenticated) {
      fetchNotifications();
    } else {
      setNotifications([]);
      setUnreadCount(0);
    }
  }, [isAuthenticated, fetchNotifications]);

  // Subscribe to real-time notifications
  const subscribeToNotifications = useCallback(() => {
    if (!Echo || !user?.id) {
      return;
    }

    // Unsubscribe from previous channel if exists
    if (channelRef.current) {
      Echo.leave(`notifications.${channelRef.current}`);
      channelRef.current = null;
    }

    console.log(`🔔 Subscribing to notifications for user ${user.id}`);

    const channel = Echo.private(`notifications.${user.id}`);
    channelRef.current = user.id;

    // Listen for new notifications
    channel.listen('.notification.sent', (event) => {
      console.log('📨 New notification received:', event);

      const newNotification = {
        id: event.notification.id,
        user_id: event.notification.user_id,
        type: event.notification.type,
        title: event.notification.title,
        message: event.notification.message,
        link: event.notification.link,
        is_read: false,
        created_at: event.notification.created_at,
        updated_at: event.notification.updated_at
      };

      // Add to notifications list
      setNotifications(prev => [newNotification, ...prev]);
      setUnreadCount(prev => prev + 1);
    });

    return () => {
      if (Echo && channelRef.current) {
        Echo.leave(`notifications.${channelRef.current}`);
      }
    };
  }, [user?.id]);

  // Unsubscribe from notifications
  const unsubscribeFromNotifications = useCallback(() => {
    if (Echo && channelRef.current) {
      console.log(`🔕 Unsubscribing from notifications.${channelRef.current}`);
      Echo.leave(`notifications.${channelRef.current}`);
      channelRef.current = null;
    }
  }, []);

  // Subscribe when user changes
  useEffect(() => {
    if (isAuthenticated && user?.id) {
      subscribeToNotifications();
    } else {
      unsubscribeFromNotifications();
    }

    return () => {
      unsubscribeFromNotifications();
    };
  }, [isAuthenticated, user?.id, subscribeToNotifications, unsubscribeFromNotifications]);

  return (
    <NotificationContext.Provider value={{
      notifications,
      unreadCount,
      loading,
      fetchNotifications,
      fetchUnreadCount,
      markAsRead,
      markAllAsRead
    }}>
      {children}
    </NotificationContext.Provider>
  );
};
