import React, { useState, useEffect } from 'react';
import Pusher from 'pusher-js';

const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY, {
  cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER,
});

export default function Notifications(){
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const channel = pusher.subscribe('my-chanel');

    channel.bind('task-completed', data => {
      setNotifications([...notifications, data]);
    });

    return () => {
      pusher.unsubscribe('my-chanel');
    };
  }, [notifications]);

  return (
    <div>
      <h2>Notifications</h2>
      <ul>
        {notifications.map(notification => (
          <li key={notification.id}>{notification.message}</li>
        ))}
      </ul>
    </div>
  );
};