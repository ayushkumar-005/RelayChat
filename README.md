# RelayChat

A modern **real-time chat app** with **JWT auth (httpOnly cookies)**, **online presence**, **read receipts**, and **image sharing** — built with **React + Vite**, **Node/Express**, **MongoDB**, and **Socket.IO**.

-   **Live Demo:** https://relaychat-u26m.onrender.com/

## ✨ Features

-   ✅ **Authentication** (Sign up / Log in / Log out)
-   🔒 **Secure sessions** with **JWT stored in httpOnly cookies**
-   💬 **1:1 real-time messaging** using **Socket.IO**
-   🟢 **Online/Offline presence** indicators
-   ✅✅ **Read receipts** (single/double tick)
-   🖼️ **Image messages** (uploads to **Cloudinary**)
-   👤 **Profile picture update** (Cloudinary upload)
-   📩 **Welcome email** on signup (Resend)
-   🛡️ **Rate limiting + bot/attack protection** (Arcjet)
-   🎨 Clean UI with **Tailwind CSS + DaisyUI + Lucide icons**
-   ⚡ State management with **Zustand** + notifications via **react-hot-toast**

## 🧱 Tech Stack

**Frontend**

-   React (Vite)
-   Tailwind CSS + DaisyUI
-   Zustand
-   Axios
-   Socket.IO Client

**Backend**

-   Node.js + Express
-   MongoDB + Mongoose
-   Socket.IO
-   JWT + bcrypt
-   Cloudinary (media uploads)
-   Resend (emails)
-   Arcjet (security/rate limiting)

## 🔄 Realtime Events (Socket.IO)

Server emits:

getOnlineUsers — array of online userIds

newMessage — pushed to receiver in real-time

messagesRead — informs sender that messages were read

Sockets are protected with the same JWT cookie used for HTTP routes.

## 🛡️ Security Notes

Passwords are hashed with bcrypt

JWT stored in httpOnly cookie (helps prevent XSS token theft)

Cookies use sameSite: "strict" and secure in production

Arcjet adds shielding, bot detection, and rate limiting

## 🖼️ Screens (from the project)

<p align="center"> <img src="https://i.ibb.co/wNdC8sxj/chrome-JE3b-Ivo-Y3q.png" alt="Screen 1" width="640" /> <img src="https://i.ibb.co/sd8WswbN/chrome-FF8h-T9-UIKL.png" alt="Screen 2" width="640" /> </p>

## 🙌 Acknowledgements

Socket.IO for realtime communication

Cloudinary for media hosting

Resend for email delivery

Arcjet for app protection
