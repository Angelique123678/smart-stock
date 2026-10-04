# Smart Stock

Smart Stock is a web application for managing an organization's materials and inventory. Administrators can maintain stock records and teacher accounts, organize materials by trade, review material requests, and monitor inventory activity. Teachers can browse available materials and submit requests.

The project is organized as a React frontend and a Node.js/Express API backed by MySQL through Sequelize.

## Features

- Inventory management for consumable, non-consumable, and equipment items
- Teacher account administration and role-based access for administrators and teachers
- Material request workflows with pending, approved, and rejected statuses
- Trade categorization for materials
- Notifications, usage views, and administrative dashboards
- Cookie-based authentication and image upload/static-file support

## Project structure

```text
smart_stock/
├── backend/    # Express API, Sequelize models, and route handlers
└── frontend/   # React application built with Vite
```

## Requirements

- Node.js and npm
- MySQL

## Getting started

### 1. Configure the backend

Create `backend/.env` with the following settings. Replace the example values with your local database details and secrets; do not commit this file.

```dotenv
PORT=3000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173

DB_NAME=smart_stock
DB_USERNAME=your_mysql_username
DB_PASSWORD=your_mysql_password
DB_HOST=localhost
DB_PORT=3306
DB_DIALECT=mysql

USER_ACCESS_TOKEN=replace_with_a_long_random_secret
USER_REFRESH_TOKEN=replace_with_another_long_random_secret

EMAIL_USER=your_email_address
EMAIL_PASS=your_email_app_password
```

The email settings are used for email functionality. Keep database credentials, token secrets, and email credentials private.

Install dependencies and start the API:

```powershell
cd backend
npm ci
npm run dev
```

The API listens on port `3000` by default. The root endpoint (`http://localhost:3000/`) returns a simple response to confirm the server is running.

### 2. Configure the frontend

Create `frontend/.env` and set the API base URL:

```dotenv
VITE_API_URL=http://localhost:3000
```

Install dependencies and start the development server in a separate terminal:

```powershell
cd frontend
npm ci
npm run dev
```

Open the local URL printed by Vite (by default, `http://localhost:5173`). The frontend API client sends requests with credentials, so `FRONTEND_URL` in the backend configuration must match the frontend origin.

## Available scripts

Run these commands from the corresponding project directory:

| Directory | Command | Description |
| --- | --- | --- |
| `backend` | `npm run dev` | Start the API with nodemon |
| `backend` | `npm start` | Start the API with Node.js |
| `frontend` | `npm run dev` | Start the Vite development server |
| `frontend` | `npm run build` | Build the frontend for production |
| `frontend` | `npm run preview` | Preview a production build locally |
| `frontend` | `npm run lint` | Run ESLint |

## API route groups

The backend mounts its route groups at:

- `/auth` — authentication
- `/material` — materials and inventory
- `/request` — material requests
- `/teacher` — teacher administration
- `/trade` — trades

## Security and configuration

- Keep `.env` files and production credentials out of version control.
- Use strong, unique values for both token secrets.
- Configure the production frontend origin in `FRONTEND_URL` and the deployed API URL in `VITE_API_URL`.
- Use HTTPS and production-grade database and email credentials when deploying.
