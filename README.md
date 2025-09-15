# To-Do App -- Preliminary Assignment Submission

⚠️ Please complete **all sections marked with the ✍️ icon** --- these
are required for your submission.

👀 Please Check ASSIGNMENT.md file in this repository for assignment
requirements.

------------------------------------------------------------------------

## 🚀 Project Setup & Usage

**How to install and run your project:**

-   Clone the repository:

    ``` bash
    git clone <https://github.com/NAVER-Vietnam-AI-Hackathon/web-track-naver-vietnam-ai-hackathon-benf-le>
    cd <web-track-naver-vietnam-ai-hackathon-benf-le>
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
📌 **Not recorded yet** (will be uploaded to YouTube as **Unlisted**).

The demo video will include:
- CRUD (add/edit/delete/complete tasks)
- Calendar View (display tasks by date/month)
- Analytics View (to be added later, currently not implemented)

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

## 🧠 Reflection

### a. If you had more time, what would you expand?

-   Notification and deadline reminders.
-   Multi-user login with authentication.
-   AI study planner and scheduling assistant.
-   Analytics View to track performance.

### b. If you integrate AI APIs more for your app, what would you do?

-   Integrate OpenAI/Gemini to generate study plans based on habits and
    past tasks.
-   Suggest realistic estimated times for new tasks based on history
    (`estimatedTime` vs `actualTime`).

------------------------------------------------------------------------

## ✅ Checklist

-   [x] Code runs without errors
-   [x] Full CRUD implemented (add/edit/delete/complete tasks)
-   [x] List View + Calendar View implemented and functional
-   [x] Deployment link + setup instructions added in README
