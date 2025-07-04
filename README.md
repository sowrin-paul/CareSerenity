# CareSerenity

![CareSerenity Logo](frontend/src/assets/Logo.png)

## Overview

CareSerenity is a comprehensive web platform designed to connect orphanages with potential adoptive parents and donors. The platform facilitates orphan adoption processes, donation management, volunteer coordination, and community engagement through seminars and blogs.

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Running the Application](#running-the-application)
- [API Documentation](#api-documentation)
- [User Roles](#user-roles)
- [Core Workflows](#core-workflows)
- [Contributing](#contributing)

## Features

### User Management
- User registration and authentication
- Role-based access control (Regular Users, Organizations, Admins)
- User profiles with personal information

### Orphan Management
- Orphan profiles with details (name, age, medical history, education)
- Orphan listing and filtering
- Adoption request workflow

### Donation System
- Direct donations to organizations
- Orphan-specific donations
- Donation tracking and history
- Payment processing

### Volunteer System
- Volunteer applications for seminars
- Organization volunteer management
- Volunteer tracking

### Seminars & Events
- Seminar creation and registration
- Seminar listing and details
- Volunteer coordination for seminars

### Blog & Community
- Blog post creation and management
- Like/dislike functionality
- Community engagement

## Tech Stack

### Backend
![Django](https://img.shields.io/badge/Django-092E20?style=for-the-badge&logo=django&logoColor=white)
![Django REST Framework](https://img.shields.io/badge/Django%20REST-ff1709?style=for-the-badge&logo=django&logoColor=white)
![SQLite](https://img.shields.io/badge/SQLite-07405E?style=for-the-badge&logo=sqlite&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=JSON%20web%20tokens&logoColor=white)

- **Framework**: Django Rest Framework
- **Database**: SQLite (Development) / PostgreSQL (Production)
- **Authentication**: JWT (JSON Web Tokens)
- **File Storage**: Django Media Files

### Frontend
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Material-UI](https://img.shields.io/badge/Material--UI-0081CB?style=for-the-badge&logo=material-ui&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)

- **Framework**: React.js with Vite
- **UI Components**: Material-UI (MUI)
- **State Management**: React Hooks (useState, useEffect)
- **Routing**: React Router

## Project Structure

```
CareSerenity/
├── backend/               # Django backend
│   ├── api/               # API app
│   │   ├── models/        # Database models
│   │   ├── migrations/    # Database migrations
│   │   ├── views.py       # API views/endpoints
│   │   ├── urls.py        # API routes
│   │   └── serializers.py # Data serializers
│   ├── media/             # User uploaded files
│   └── manage.py          # Django management script
├── frontend/              # React frontend
│   ├── public/            # Static assets
│   ├── src/               # Source code
│   │   ├── components/    # React components
│   │   ├── css/           # CSS modules
│   │   └── assets/        # Frontend assets
│   ├── index.html         # Entry HTML file
│   └── package.json       # NPM package config
└── README.md              # Project documentation
```

## Installation

### Prerequisites
- Python 3.8+
- Node.js 14+
- npm or yarn

### Backend Setup

```bash
# Clone the repository
git clone https://github.com/yourusername/CareSerenity.git
cd CareSerenity

# Create a virtual environment
python -m venv env
source env/bin/activate  # On Windows: env\Scripts\activate

# Install dependencies
cd backend
pip install -r requirements.txt

# Run migrations
python manage.py migrate

# Create a superuser
python manage.py createsuperuser
```

### Frontend Setup

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install
# or
yarn install

# Create .env file with API URL
echo "VITE_API_URL=http://localhost:8000" > .env
```

## Running the Application

### Backend

```bash
cd backend
python manage.py runserver
```

The backend API will be available at `http://localhost:8000`.

### Frontend

```bash
cd frontend
npm run dev
# or
yarn dev
```

The frontend application will be available at `http://localhost:5173`.

## API Documentation

### Authentication Endpoints

- `POST /login/`: User login
- `POST /register/`: User registration
- `POST /token/refresh/`: Refresh JWT token

### User Endpoints

- `GET /user/profile/`: Get current user profile
- `PATCH /user/profile/`: Update user profile

### Orphan Endpoints

- `GET /orphans/list/`: List all available orphans
- `POST /organization/orphans/`: Create orphan (organizations only)
- `GET /organization/orphans/count/`: Get orphan count (organizations only)

### Adoption Endpoints

- `POST /adoption/request/`: Submit adoption request
- `POST /adoption/cancel/<orphan_id>/`: Cancel adoption request
- `GET /adoption/user-requests/`: Get user's adoption requests
- `GET /adoption/organization-requests/`: Get organization's adoption requests
- `POST /adoption/approve/<adoption_id>/`: Approve adoption request
- `POST /adoption/reject/<adoption_id>/`: Reject adoption request

### Donation Endpoints

- `POST /donations/orphan/`: Donate to an orphan
- `POST /donations/organization/`: Donate to an organization
- `GET /donations/user/`: Get user's donations
- `GET /donations/organization/`: Get organization donations

### Seminar Endpoints

- `GET /seminars/`: List all seminars
- `POST /seminars/`: Create seminar (organizations only)
- `GET /seminars/<seminar_id>/`: Get seminar details
- `POST /seminars/<seminar_id>/register/`: Register for seminar
- `POST /seminars/<seminar_id>/deregister/`: Deregister from seminar
- `GET /seminars/<seminar_id>/is-registered/`: Check registration status

### Blog Endpoints

- `GET /blogs/`: List all blogs
- `POST /blogs/`: Create blog
- `POST /blogs/<blog_id>/react/`: Like/dislike blog
- `GET /blogs/user-reactions/`: Get user's blog reactions

## User Roles

### Regular User
- Browse orphan profiles
- Request orphan adoption
- Make donations
- Register for seminars
- Apply as volunteer
- Like/dislike blogs

### Organization
- Create and manage orphan profiles
- Approve/reject adoption requests
- Organize seminars
- Manage volunteers
- Create blog posts
- View donation records

### Admin
- Approve organizations
- Manage all users
- Oversee adoption processes
- Approve donations
- Moderate content

## Core Workflows

### Orphan Adoption Process
1. User browses available orphans
2. User requests adoption for a specific orphan
3. Organization reviews adoption request
4. Organization approves/rejects the request
5. If approved, orphan is marked as adopted

### Donation Process
1. User selects donation target (orphan or organization)
2. User enters donation amount
3. User completes payment process
4. Admin approves the donation
5. Donation appears in records

### Volunteer Application
1. Organization creates seminar with volunteer opportunities
2. User applies as volunteer for a specific seminar
3. Organization reviews volunteer applications
4. Organization approves/rejects volunteer applications
5. Approved volunteers are assigned to seminars

## Contributing

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add some amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

---

© 2025 CareSerenity. All rights reserved.
