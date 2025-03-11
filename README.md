# NZX Energy Platform

This project is split into two main services:

## Frontend (nzx-frontend)

React application for the user interface.

### Setup

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

## Backend (nzx-backend)

FastAPI backend service.

### Setup

```bash
# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Start development server
uvicorn main:app --reload
```

## Environment Variables

1. Copy `.env.example` to `.env` in the frontend directory
2. Copy `nzx-backend/.env.example` to `nzx-backend/.env`
3. Fill in the required environment variables

## Database

The project uses Supabase for the database. Database migrations are managed in a separate infrastructure repository.