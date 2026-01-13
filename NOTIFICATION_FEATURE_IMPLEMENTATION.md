# Notification Feature Implementation Guide

This guide provides step-by-step prompts to implement a fully functional notification system for the Arta Marketplace website. The system will include backend API, frontend integration, and real-time updates.

## Current State Analysis

- **Database**: Notifications table exists with fields: user_id, type, title, message, link, is_read
- **Frontend**: NotificationPage.jsx exists but uses static dummy data
- **Backend**: No Notification model, controller, or API endpoints exist
- **Missing**: Notification creation logic, API integration, real-time updates

## Step-by-Step Implementation Prompts

### Step 1: Create Notification Model
**Prompt:** Create a Notification model in `app/Models/Notification.php` with proper relationships and fillable fields based on the existing notifications table migration.

### Step 2: Create UserNotificationController
**Prompt:** Create `app/Http/Controllers/Api/User/UserNotificationController.php` with the following methods:
- `index()` - Get paginated notifications for authenticated user
- `markAsRead($id)` - Mark specific notification as read
- `markAllAsRead()` - Mark all notifications as read for user
- `unreadCount()` - Get count of unread notifications

### Step 3: Add API Routes
**Prompt:** Add notification routes to `routes/api.php` under the user middleware group:
- `GET /api/user/notifications` -> UserNotificationController@index
- `PUT /api/user/notifications/{id}/read` -> UserNotificationController@markAsRead
- `PUT /api/user/notifications/mark-all-read` -> UserNotificationController@markAllAsRead
- `GET /api/user/notifications/unread-count` -> UserNotificationController@unreadCount

### Step 4: Create NotificationContext
**Prompt:** Create `resources/js/components/context/NotificationContext.jsx` to manage notification state globally with:
- State for notifications list and unread count
- Functions to fetch notifications, mark as read, mark all as read
- Real-time updates using WebSocket/Socket.io

### Step 5: Update NotificationPage.jsx
**Prompt:** Update `resources/js/components/NotificationPage.jsx` to:
- Use NotificationContext instead of static data
- Fetch notifications on component mount
- Implement mark as read functionality
- Add loading states and error handling
- Remove dummy data

### Step 6: Update NavbarAfter.jsx
**Prompt:** Update `resources/js/components/NavbarAfter.jsx` to:
- Display notification bell icon with unread count badge
- Show dropdown with recent notifications on click
- Link to full notification page

### Step 7: Implement Notification Creation Logic
**Prompt:** Add notification creation in relevant controllers/events:
- In MessageSent event: Create notification for chat messages
- In UserFavoriteController: Create notification when product is liked/favorited
- In Transaction/Payment controllers: Create notifications for purchases/sales
- In AdminReportController: Create notifications for report resolutions

### Step 8: Add Real-time Notifications
**Prompt:** Implement real-time notifications using Laravel Broadcasting:
- Configure broadcasting in `config/broadcasting.php`
- Create NotificationSent event with broadcasting
- Update NotificationContext to listen for real-time updates
- Ensure WebSocket connection is working (check existing chat implementation)

### Step 9: Add Notification Types and Templates
**Prompt:** Create a notification service/helper to standardize notification creation:
- Define notification types: 'chat', 'like', 'offer', 'transaction', 'system'
- Create message templates for each type
- Add helper methods for creating notifications consistently

### Step 10: Testing and Polish
**Prompt:** Test the complete notification flow:
- Create notifications through various actions (chat, like, etc.)
- Verify API endpoints work correctly
- Test real-time updates
- Ensure proper cleanup (mark as read, pagination)
- Add proper error handling and loading states

## Additional Considerations

- **Performance**: Implement pagination for notifications list
- **Cleanup**: Add job to clean old read notifications
- **Security**: Ensure users can only access their own notifications
- **UI/UX**: Add sound notifications, browser notifications API
- **Mobile**: Ensure responsive design for notifications

## Dependencies

- Laravel Broadcasting (already configured for chat)
- Socket.io client (already in use for chat)
- Proper authentication middleware

Follow these steps in order to implement a complete notification system.
