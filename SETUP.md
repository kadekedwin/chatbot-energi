# EnerNova Project Setup Guide

This guide describes how to set up and run the EnerNova application, which consists of an Express.js backend and a Next.js frontend.

## Prerequisites

- **Node.js** (v18+ recommended)
- **PostgreSQL** (running locally or accessible via URL)
- **Python 3** (optional, for journal metadata extraction script)

## 1. Project Structure

- `backend/`: REST API (Express, Prisma, PostgreSQL)
- `frontend/`: Web Application (Next.js, React, Tailwind)

## 2. Backend Setup

1.  **Navigate to backend directory:**
    ```bash
    cd backend
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Configure Environment Variables:**
    The project comes with a standard `.env` file. You may need to update secrets.
    Open `backend/.env` and ensure the `DATABASE_URL` matches your local PostgreSQL setup.
    ```properties
    DATABASE_URL="postgresql://postgres:password@localhost:5432/enernova?schema=public"
    ```
    *Note: Update `postgres:password` with your actual database username and password if different.*

4.  **Database Setup:**
    Create the database and apply the schema using Prisma.
    ```bash
    # Create the database if it doesn't exist (if configured to do so) or manually create it:
    # createdb enernova

    # Run migrations
    npx prisma migrate dev --name init
    
    # (Optional) Seed the database with initial data
    npm run prisma:seed
    ```

5.  **Start the Backend Server:**
    ```bash
    npm run dev
    ```
    The server will start on `http://localhost:5000` (as configured in `.env`).

## 3. Frontend Setup

1.  **Navigate to frontend directory:**
    ```bash
    cd frontend
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Configure Environment Variables:**
    The project comes with a standard `.env` file.
    Open `frontend/.env` and add your Groq API Key:
    ```properties
    GROQ_API_KEY=your_actual_api_key_here
    NEXT_PUBLIC_API_URL=http://localhost:5000
    ```

4.  **Start the Frontend Development Server:**
    ```bash
    npm run dev
    ```
    The application will be available at `http://localhost:3000`.

## 4. Journal Processing (Optional)

There is a Python script in `frontend/parse_jurnal.py` for extracting metadata from PDF journals.

**Requirements:**
- Python 3
- PyPDF2 (`pip install PyPDF2`)

**Usage:**
```bash
cd frontend
# Ensure you have PDF files in the data_jurnal directory
python3 parse_jurnal.py
```

## Summary of Commands

**Terminal 1 (Backend):**
```bash
cd backend
npm install
npm run dev
```

**Terminal 2 (Frontend):**
```bash
cd frontend
npm install
npm run dev
```
