# 🎓 EduNest — Production-Ready Full-Stack EdTech Platform

![EduNest Home](./screenshots/home.png)

🔗 **Live:** https://edu-nest-edu.vercel.app  
💻 **Repository:** https://github.com/rk-ripon360/Edu-Nest

**EduNest** is a production-ready **Learning Management System (LMS)** where students can purchase and consume digital books and video courses, and educators can publish, manage, and monetize educational content through a role-based dashboard.

Built with **Next.js 14 App Router**, EduNest focuses on **real-world product architecture**, not just UI-level CRUD functionality.

---

## 🌟 Why EduNest?

EduNest is designed to simulate a **real EdTech business model**, addressing challenges that appear in production systems:

- Multi-role users (Student & Educator)
- Paid digital content with secure access
- Progress-based learning experience
- Dashboard-driven publishing workflow
- Server-side authorization & validation

This makes EduNest a **portfolio project with real product depth**.

---

## 🚀 Core Features

### 📚 Student Learning Experience

- Purchase **Books & Video Series** using **Stripe Checkout**
- Secure **PDF Reader** for purchased books only
- Video lessons with:
  - Resume playback
  - Per-user progress tracking
  - Completion indicators
- Centralized **My Learning** dashboard

---

### 🧑‍🏫 Educator Dashboard

![Educator Dashboard](./screenshots/dashboard.png)

Educators manage all learning content from a dedicated, role-protected dashboard:

- Create, edit, and delete:
  - 📘 Digital Books (PDF + cover image)
  - 🎥 Video Series → Chapters → Lessons
  - 📝 Blogs
- Drag & drop lesson reordering
- Publish / unpublish controls
- Secure, role-based route protection

---

### 🎥 Video Learning Experience

![Video Lesson](./screenshots/video-lesson.png)

- Purchase-verified video access
- Progress saved per user
- Resume watching from the last position

---

### 📝 Blogs & Community

- Public blog listing & single blog pages
- Like, comment, and share functionality
- Educator-only blog publishing
- **Intercepting Routes** for smooth navigation without context loss

---

## 🧱 System Architecture & Technical Decisions

### Authentication & Authorization

- **NextAuth v5** with JWT-based sessions
- Credentials & Google OAuth login
- Role-based route protection (Student / Educator)
- Server-side authorization checks via Server Actions

### Data Modeling

- MongoDB with **Mongoose ODM**
- Relational data structure:
  - Users
  - Books
  - Series → Chapters → Lessons
  - Enrollments
  - Reviews & Ratings

### Payments & Content Protection

- Stripe Checkout integration
- Server-side purchase verification before:
  - PDF access
  - Video playback
- No client-side trust for protected resources

### Application Architecture

- **Next.js App Router** for scalable routing
- Server Actions for mutations & security
- Modular, reusable UI components
- Centralized permission logic

---

## 📸 Screenshots

| Home                            | Educator Dashboard                        |
| ------------------------------- | ----------------------------------------- |
| ![Home](./screenshots/home.png) | ![Dashboard](./screenshots/dashboard.png) |

| Video Lesson                             | Series Details                              |
| ---------------------------------------- | ------------------------------------------- |
| ![Video](./screenshots/video-lesson.png) | ![Series](./screenshots/series-details.png) |

| Blog (Intercepting Route)                    | My Learning                                   |
| -------------------------------------------- | --------------------------------------------- |
| ![Blog](./screenshots/blog-intercepting.png) | ![My Learning](./screenshots/my-learning.png) |

---

## 🧱 Tech Stack

### Frontend

- Next.js 14 (App Router)
- React 18
- JavaScript
- Tailwind CSS + ShadCN UI
- Radix UI
- Framer Motion

### Backend

- Next.js Server Actions
- MongoDB + Mongoose
- NextAuth v5 (JWT sessions)

### Payments & Media

- Stripe
- Cloudinary
- React Player
- React PDF

---

## 📦 Key Libraries

| Category        | Library                                   |
| :-------------- | :---------------------------------------- |
| **Auth**        | `next-auth@beta`                          |
| **Database**    | `mongoose`                                |
| **Media**       | `cloudinary`, `react-player`, `react-pdf` |
| **Payments**    | `stripe`, `@stripe/stripe-js`             |
| **Forms**       | `react-hook-form`, `zod`                  |
| **UI**          | `@radix-ui/\*`, `shadcn/ui`               |
| **Animation**   | `framer-motion`, `tailwindcss-animate`    |
| **Drag & Drop** | `@hello-pangea/dnd`                       |

---

## 🧭 Route Overview

### 🌍 Public

- `/` – Landing page
- `/books` – Book marketplace
- `/books/[id]` – Single book details
- `/study-series` – Video series listing
- `/study-series/[id]` – Single video series details
- `/blogs` – Knowledge hub
- `/blogs/[slug]` – Single blog post
- `/educators` – Instructor profiles
- `/educators/[userName]` – Instructor profile

### 🔐 Student

- `/books/[id]/read` – Protected PDF reader
- `/study-series/[id]/play` – Protected video player
<!-- -->
- `/account` – Account settings
- `/account/profile` – Profile management
- `/account/enrolled-books` – Purchased books
- `/account/enrolled-study-series` – Enrolled video series
- `/account/beacome-educator` – Educator application
- `/account/password` – Password change
<!-- -->
- `/enroll-success` - Post-purchase success page

### ⚡ Educator Dashboard

- `/account/educator-profile` – Educator profile management
<!-- -->
- `/dashboard/books` - Book management listing
- `/dashboard/books/add` - Create new book
- `/dashboard/books/[bookId]/edit` - Edit existing book
- `/dashboard/books/[bookId]/info` - View book enrollments & reviews
<!-- -->
- `/dashboard/study-series` - Study series management listing
- `/dashboard/study-series/add` - Create new study series
- `/dashboard/study-series/[studySeriesId]/edit` - Edit existing study series
- `/dashboard/study-series/[studySeriesId]/info` - View study series enrollments & reviews
<!-- -->
- `/dashboard/blogs` blogs feed management listing
- `/dashboard/blogs/add` Create new blog post
- `/dashboard/blogs/[blogId]/edit` Edit existing blog post

## 🧠 Learning Outcomes

This project helped me gain hands-on experience with:

- Building production-ready full-stack applications
- Secure payment and content protection
- Role-based dashboards and authorization
- Complex MongoDB relationships
- UX-focused, scalable component architecture

---

## 🔮 Future Improvements

- Course completion certificates
- Admin moderation panel
- Real-time student–educator chat
- Mobile application version

---

## 👨‍💻 Author

**Rifat Kabir Ripon**  
Frontend Developer  
Focused on building **scalable, production-ready web applications**

🔗 GitHub: https://github.com/rk-ripon360
