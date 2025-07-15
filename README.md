# IntelliJ_5 Internship Portal

A full-stack internship portal for students and admins, built with Node.js, Express, Sequelize (ORM), and a SQL database.  
Features include user registration, login, admin dashboard, internship posting, application management, and profile handling.

---

## Features

- **User Registration & Login** (with session management)
- **Admin Login & Dashboard**
- **Internship Listings** (students can view and apply)
- **Internship Posting** (admin only)
- **Profile Management** (update details, upload/remove profile picture)
- **Password Reset** (via popup modal)
- **File Uploads** (profile pictures, resumes)
- **Role-based Access Control** (admin vs. student)
- **Responsive Frontend** (HTML, CSS, JS)

---

## Tech Stack

- **Backend:** Node.js, Express.js
- **ORM:** Sequelize
- **Database:** SQLite/MySQL/PostgreSQL (configured via Sequelize)
- **Frontend:** HTML, CSS, JavaScript
- **Session Management:** express-session
- **File Uploads:** multer

---

## Getting Started

### 1. Clone the repository

```sh
git clone <repo-url>
cd internship
```

### 2. Install dependencies

```sh
npm install
```

### 3. Configure the database

- Edit `/src/models/db.js` to set up your database connection.
- Make sure your database is running.

### 4. Run database migrations (if using Sequelize CLI)

```sh
npx sequelize-cli db:migrate
```

Or let Sequelize sync tables automatically (see `server.js`).

### 5. Start the server

```sh
node src/server.js
```

Server runs at [http://localhost:3001](http://localhost:3001)

---

## Project Structure

```
src/
  controllers/      # Route handlers (business logic)
  models/           # Sequelize models (User, Internship, Application)
  routes/           # Express route files
  views/            # HTML, CSS, JS frontend files
  server.js         # Main Express server
db.sql              # Example SQL for DB setup
```

---

## Usage

- Visit `/` for the home page.
- Register as a student or log in as admin.
- Admin can post internships and manage applications.
- Students can view/apply for internships and manage their profile.

---

## Admin Access

- Make sure your admin user in the database has `isAdmin: true`.
- You can manually update this in your DB:

  ```sql
  UPDATE Users SET isAdmin = TRUE WHERE username = 'admin';
  ```

---

## Customization

- Edit frontend files in `src/views/`.
- Add more fields or features by updating models, controllers, and views.

---

## License

MIT

---