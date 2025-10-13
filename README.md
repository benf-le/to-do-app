To-Do App 
------------------------------------------------------------------------

## 🚀 Project Setup & Usage

**How to install and run your project:**

-   Clone the repository:

    ``` bash
    git clone <https://github.com/benf-le/to-do-app.git>
    cd <to-do-app>
    ```

-   Install dependencies:

    ``` bash
    npm install
    ```
-   Run frontend (React + Vite):

    ``` bash
    npm run dev
    ```
-   Run backend (NestJS):

    ``` bash
    npm run start
    ```



-   No need for manual Docker/Postgres setup because the project
    connects to a pre-configured database.

------------------------------------------------------------------------

## 🔗 Deployed Web URL or APK file

-   Deployed on **Google Cloud Platform**
-   URL: [todoapp.lecambang.id.vn](http://todoapp.lecambang.id.vn)

------------------------------------------------------------------------

## 🎥 Demo Video

**Demo video link (≤ 2 minutes):**
📌 https://youtu.be/h2i6JEEeoCY

The demo video will include:
- CRUD (add/edit/delete/complete tasks)
- Calendar View (display tasks by date/month)
- Today List View (display tasks by today)

------------------------------------------------------------------------

## 💻 Project Introduction

### a. Overview

The **To-Do App** helps students and general users manage their tasks
more effectively.
- List tasks to do
- See what needs to be done today
- Visualize tasks on a calendar to avoid missing deadlines

**Goal:** provide users with a clear and intuitive way to track and
manage tasks.
**Target users:** students, working professionals, or anyone who wants
to manage their tasks.

------------------------------------------------------------------------

### b. Key Features & Function Manual

-   **CRUD Task:** add, edit, delete, mark as complete.
-   **Calendar View:** display tasks by date/month.
-   **List View:** list of tasks, sortable by deadline and status.
-   **Today View:** display tasks by today, sortable by deadline and status.
-   **User interaction:**
    -   Add: click **+ Add Task**, fill in info, save.
    -   Edit: click **Edit** → change details → Save/Cancel.
    -   Delete: click **Delete** next to a task.

------------------------------------------------------------------------

### c. Unique Features

-   Sort tasks by deadline and status.
-   Visual deadline display on calendar.
-   Fields `estimatedTime` and `actualTime` reserved for future
    performance analysis.

------------------------------------------------------------------------

### d. Technology Stack and Implementation Methods

-   **Frontend:** ReactJS, Vite, React Query, TailwindCSS,
    react-big-calendar.
-   **Backend:** NestJS, Prisma ORM, Postgres.
-   **Backend organization:** module, service, controller, DTO.

------------------------------------------------------------------------

### e. Service Architecture & Database structure

**Architecture:**

    Frontend (React) <-> Backend API (NestJS) <-> Database (Postgres via Prisma)

**Database Models:**
- **User**: id, email, name, password, createdAt, updatedAt.
- **Project**: id, name, color, userId, createdAt, updatedAt.
- **Task**: id, title, description, status, dueDate, estimatedTime,
actualTime, completedAt, createdAt, updatedAt.

**Enum:**
- `Status`: TODO, IN_PROGRESS, DONE.

------------------------------------------------------------------------

