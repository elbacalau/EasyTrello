"use client";

import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store/store";
import { removeNotification } from "@/store/slices/notificationSlice";
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast";
import { useAppDispatch, useAppSelector } from "@/types/hooks";

const getVariantFromType = (type: string): "default" | "destructive" => {
  switch (type) {
    case "error":
      return "destructive";
    default:
      return "default";
  }
};

export default function Notifications() {
  const { notifications } = useAppSelector((state: RootState) => state.notification);
  const dispatch = useAppDispatch();

  useEffect(() => {
    notifications.forEach((notification) => {
      const duration = notification.duration || 5000;
      const timer = setTimeout(() => {
        dispatch(removeNotification(notification.id));
      }, duration);

      return () => clearTimeout(timer);
    });
  }, [notifications, dispatch]);

  return (
    <ToastProvider>
      {notifications.map((notification) => (
        <Toast 
          key={notification.id} 
          variant={getVariantFromType(notification.type)}
        >
          {notification.title && <ToastTitle>{notification.title}</ToastTitle>}
          <ToastDescription>{notification.message}</ToastDescription>
          <ToastClose onClick={() => dispatch(removeNotification(notification.id))} />
        </Toast>
      ))}
      <ToastViewport />
    </ToastProvider>
  );
} 