# Contact Management Application

A MEAN Stack application for managing contacts with real-time updates and user authentication.

## Features

- User Authentication (2 predefined users)
- Contact Management (CRUD operations)
- Real-time contact locking during edits
- Server-side pagination
- Grid with column filters

## Prerequisites

- Node.js (v18+)
- MongoDB (v7.4+)
- Angular CLI (v16+)
- npm (v8+)

## Installation

1. Clone the repository
```bash
git clone https://github.com/ahmedashouryounes/Online-Contact-Numbers.git
cd contact-management-app
```

2. Install Backend Dependencies
```bash
cd online-contact-numbers-be
npm install
```

3. Install Frontend Dependencies
```bash
cd ../online-contact-numbers-fe
npm install
```

## Configuration

1. Backend Configuration (./online-contact-numbers-be/.env):
```
PORT=your_port
DATABASE_URL=your_database_url
JWT_SECRET=your_jwt_secret
```

2. Frontend Configuration (./online-contact-numbers-fe/src/environments/environment.ts):
```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000/api'
};
```

## Running the Application

1. Start MongoDB
```bash
mongod
```

2. Start Backend Server
```bash
cd online-contact-numbers-be
npm start
```

3. Start Frontend Application
```bash
cd online-contact-numbers-fe
ng serve
```

The application will be available at `http://localhost:4200`

## Default Users

1. User 1
   - Username: user1
   - Password: user1

2. User 2
   - Username: user2
   - Password: user2

## Project Structure

```
Online Contact Numbers/
├── .gitignore
├── README.md
├── online-contact-numbers-be/
│   ├── src/
│   │   ├── config/
│   │   │   ├── database.js
│   │   │   └── jwt.js
│   │   ├── middleware/
│   │   │   └── auth.middleware.js
│   │   ├── models/
│   │   │   └── contact.model.js
│   │   ├── routes/
│   │   │   ├── api/
│   │   │   │   ├── auth.routes.js
│   │   │   │   └── contact.routes.js
│   │   │   └── index.js
│   │   ├── app.js
│   │   ├── server.js
│   │   └── socket.js
│   └── package.json
└── online-contact-numbers-fe/
    ├── src/
    │   ├── app/
    │   │   ├── core/
    │   │   │   ├── components/
    │   │   │   │   └── login/
    │   │   │   ├── guards/
    │   │   │   │   └── auth.guard.ts
    │   │   │   ├── interceptors/
    │   │   │   │   └── auth.interceptor.ts
    │   │   │   └── services/
    │   │   │       └── auth.service.ts
    │   │   ├── features/
    │   │   │   └── contacts/
    │   │   │       ├── components/
    │   │   │       │   ├── contact-form/
    │   │   │       │   └── contact-list/
    │   │   │       ├── services/
    │   │   │       │   └── contact.service.ts
    │   │   │       ├── contact.interface.ts
    │   │   │       ├── contacts.component.css  
    │   │   │       ├── contacts.component.html
    │   │   │       ├── contacts.component.ts   
    │   │   │       └── contacts.routes.ts
    │   │   ├── shared/
    │   │   │   ├── components/
    │   │   │   │   └── confirm-dialog/
    │   │   │   └── services/
    │   │   ├── app.component.css
    │   │   ├── app.component.html
    │   │   ├── app.component.ts
    │   │   ├── app.config.ts
    │   │   └── app-routes.ts
    │   ├── environments/
    │   │   └── environment.ts
    │   └── styles.scss
    ├── angular.json
    └── package.json

```

## API Endpoints

- POST /api/auth/login - User authentication
- GET /api/contacts - Get paginated contacts
- POST /api/contacts - Create new contact
- PUT /api/contacts/:id - Update contact
- DELETE /api/contacts/:id - Delete contact
- PUT /api/contacts/:id/lock - Lock contact for editing
- PUT /api/contacts/:id/unlock - Unlock contact

## Features Implementation Details

1. **Contact Grid**
   - Server-side pagination (5 items per page)
   - Column filters for all fields
   - Real-time updates using WebSocket

2. **Contact Management**
   - Add/Edit/Delete operations
   - Contact locking mechanism
   - Form validation

3. **Authentication**
   - JWT-based authentication
   - Route protection
   - Hardcoded user credentials

## Technologies Used

- MongoDB - Database
- Express.js - Backend framework
- Angular - Frontend framework
- Node.js - Runtime environment
- Socket.io - Real-time updates
- JWT - Authentication

## Notes

- The Front End built with standalone structure