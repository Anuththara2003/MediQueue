MediQueue - Advanced API Development Final Project

This is the final project for the Advanced API Development (ITS 1114) module, part of the Higher Diploma in Software Engineering at the Institute of Software Engineering (IJSE).

| Student Name | [Sandaru Anuththara] |
| Batch Number | [GDSE71] |

📋 Table of Contents

Project Overview

Key Features

Technology Stack

Architecture

Screenshots

Setup and Installation Guide

YouTube Project Demo

API Endpoints

📖 Project Overview

MediQueue is a smart healthcare queue and appointment management system that connects patients with doctors and clinics in Sri Lanka.
The system features multiple user roles: Patients, who can register, book appointments, and track their queue positions, and Admins/Doctors, who can manage appointments, patients, and statistics.

This project is built using a modern layered architecture with a Spring Boot backend providing secure RESTful APIs, and a React (Vite) frontend for user interaction.

✨ Key Features
For Patients:

Secure registration with Google Authentication.

JWT-based login and role-based redirection.

Dashboard to manage personal profile and medical history.

Book appointments online with real-time status updates.

Track live queue position and estimated waiting time.

Receive SMS notifications (appointment confirmations, reminders, queue updates) via Twilio API.

View nearby clinics/pharmacies with Google Maps integration.

For Admins/Doctors:

Secure login with JWT-based authentication.

Dashboard to manage doctor schedules, patients, and statistics.

Manage and monitor appointment queues.

View and respond to patient feedback.

Generate reports (appointments, patients, daily statistics).

🛠 Technology Stack
Backend:

Framework: Spring Boot 3.x

Language: Java 17

Security: Spring Security + JWT Authentication & Authorization

Database: MySQL

Data Access: Spring Data JPA / Hibernate

API: RESTful APIs

Messaging: Twilio API (SMS Notifications)

Build Tool: Maven

Frontend:

Framework: React with Vite

Language: JavaScript, HTML, CSS

Styling: Tailwind CSS, shadcn/ui, SweetAlert2

Mapping: LocationIq 

SMS Api : Twillio 

Tools:

IDE: IntelliJ IDEA (Backend), VS Code (Frontend)

API Testing: Postman

Database Management: MySQL Workbench

Version Control: Git & GitHub

🏗 Architecture

The application follows a Layered Architecture:

Presentation Layer (Controller): Handles all HTTP requests, validates DTOs, and communicates with the service layer.

Service Layer (Business Logic): Contains application logic, transaction management, and workflows.

Persistence Layer (Repository): Manages data access using Spring Data JPA.

Domain Layer (Entity): Represents database entities as Java objects.

📸 Screenshots

(Replace with real screenshots from your project UI)

1 . Home Page
![Home Page](screenshot/Screenshot-2025-09-20-084804.png)


2. Login Page
![Login Page](screenshot/Screenshot-2025-09-20-085000.png)


4. Sign up Page
![Sign up Page](screenshot/Screenshot-2025-09-20-084846.png)


4.Admin Dashboard
![Admin Dashboard](screenshot/Screenshot-2025-09-20-085029.png)


5. Patinet Dashboard
![Patinet Dashboard](screenshot/Screenshot-2025-09-20-085153.png)


🚀 Setup and Installation Guide
Prerequisites:

Java 17 or higher

Apache Maven 3.8 or higher

MySQL Server

Node.js (for frontend)

An IDE like IntelliJ IDEA or VS Code

Backend Setup:

Clone the repository:

git clone (https://github.com/yourusername/mediqueue.git)


Navigate to the backend folder:

cd back-end/


Configure the database:

Create a new MySQL database named mediqueue_db.

Open src/main/resources/application.properties.

Update the spring.datasource.username and spring.datasource.password.

Build the project:

mvn clean install


Run the application:

java -jar target/mediqueue-0.0.1-SNAPSHOT.jar


Backend server will start on: http://localhost:8080

Frontend Setup:

Navigate to the frontend folder:

cd front-end/

Update API Keys:

Replace the Google Maps API key in your frontend files.

Configure Twilio API credentials in backend .env or application.properties.

🎬 YouTube Project Demo

A complete video demonstration of MediQueue, including features and workflows, is available on YouTube with English voice narration.
[video demonstration of MediQueue](https://youtu.be/9mQpQmLNmHw)))  



Watch the Project Demo on YouTube

Spring Boot Project - IJSE - GDSE - 71 - Sandaru Anuththara - Advanced API Development (ITS 1114) Module Semester Final Project

🔗 API Endpoints Documentation
Method	Endpoint	Description	Secured?
POST	/auth/register	Registers a new patient or admin.	No
POST	/auth/login	Authenticates a user and returns JWT.	No
GET	/patients/{id}/appointments	Get all appointments of a patient.	Yes (Patient)
POST	/appointments	Create a new appointment.	Yes (Patient)
GET	/admin/appointments	Get all appointments for the doctor/admin.	Yes (Admin)
PATCH	/admin/appointments/{id}/status	Update appointment status (Confirm/Cancel).	Yes (Admin)
GET	/notifications/sms	Trigger SMS notification via Twilio API.	Yes
