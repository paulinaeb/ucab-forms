import {
  addDoc,
  arrayUnion,
  arrayRemove,
  collection,
  deleteDoc,
  doc,
  orderBy,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "./firebaseConfig";

export const sendNotification = async ({ userId, message, goto }) => {
  try {
    const notificationsRef = collection(db, "users", userId, "notifications");

    const notificationRef = await addDoc(notificationsRef, {
      message,
      goto,
      createdAt: new Date(),
      read: false,
    });
    return { notification: notificationRef };
  } catch (error) {
    return { error: "Error al enviar la notificación" };
  }
};

export const getNotifications = (userId, callback) => {
  const notificationsRef = collection(db, "users", userId, "notifications");

  const q = query(notificationsRef, orderBy("createdAt", "desc"));

  return onSnapshot(q, (snapshot) => {
    const notifications = snapshot.docs.map((doc) => {
      const notification = doc.data();
      notification.id = doc.id;
      return notification;
    });

    callback(notifications);
  });
};

export const readNotifications = async (userId, notifications) => {
  try {
    const notificationsRef = collection(db, "users", userId, "notifications");

    await Promise.all(
      notifications.map((notification) => {
        if (!notification.read) {
          const notificationRef = doc(notificationsRef, notification.id);
          return updateDoc(notificationRef, { read: true });
        }

        return null;
      })
    );

    return { notifications };
  } catch (error) {
    return { error: "Error al leer las notificaciones" };
  }
};
