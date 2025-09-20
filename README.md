# 🏥 MediQueue - Advanced API Development Final Project

This is the final project for the **Advanced API Development (ITS 1114)** module, part of the **Higher Diploma in Software Engineering (HDSE)** at the **Institute of Software Engineering (IJSE)**.

| **Student Name** | Sandaru Anuththara |
|------------------|---------------------|
| **Batch Number** | GDSE 71 |

---

## 📋 Table of Contents
- [Project Overview](#-project-overview)
- [Key Features](#-key-features)
- [Technology Stack](#-technology-stack)
- [Architecture](#-architecture)
- [Screenshots](#-screenshots)
- [Setup and Installation Guide](#-setup-and-installation-guide)
- [YouTube Project Demo](#-youtube-project-demo)
- [API Endpoints](#-api-endpoints-documentation)

---

## 📖 Project Overview
**MediQueue** is a smart healthcare queue and appointment management system that connects patients with doctors and clinics in Sri Lanka.  

- **Patients** can register, book appointments, track their queue positions, and receive notifications.  
- **Admins/Doctors** can manage appointments, patients, and statistics.  

This project is built using a **modern layered architecture** with a **Spring Boot backend** providing secure RESTful APIs, and a **React (Vite) frontend** for user interaction.  

---

## ✨ Key Features

### 👨‍⚕️ For Patients:
- Secure registration with **Google Authentication**  
- **JWT-based login** and role-based redirection  
- Dashboard to manage profile and medical history  
- Book appointments online with **real-time status updates**  
- Track **live queue position** and estimated waiting time  
- Receive **SMS notifications** via **Twilio API** (confirmations, reminders, queue updates)  
- View **nearby clinics/pharmacies** with **Google Maps integration**  

### 🩺 For Admins/Doctors:
- Secure login with **JWT-based authentication**  
- Dashboard to manage **doctor schedules, patients, and statistics**  
- Manage and monitor **appointment queues**  
- View and respond to **patient feedback**  
- Generate reports (appointments, patients, daily statistics)  

---

## 🛠 Technology Stack

### 🔹 Backend:
- **Framework:** Spring Boot 3.x  
- **Language:** Java 17  
- **Security:** Spring Security + JWT  
- **Database:** MySQL  
- **ORM:** Spring Data JPA / Hibernate  
- **API:** RESTful APIs  
- **Messaging:** Twilio API (SMS Notifications)  
- **Build Tool:** Maven  

### 🔹 Frontend:
- **Languages:** JavaScript, HTML, CSS  
- **Styling:** Tailwind CSS, shadcn/ui, SweetAlert2  
- **Mapping:** LocationIQ  
- **SMS Api :** Twillio 

### 🔹 Tools:
- **IDE:** IntelliJ IDEA (Backend), VS Code (Frontend)  
- **API Testing:** Postman  
- **Database Management:** MySQL Workbench  
- **Version Control:** Git & GitHub 
 

---

## 🏗 Architecture
The application follows a **Layered Architecture**:

1. **Presentation Layer (Controller):** Handles HTTP requests, validates DTOs, communicates with Service Layer.  
2. **Service Layer (Business Logic):** Application logic, transaction management, workflows.  
3. **Persistence Layer (Repository):** Data access using Spring Data JPA.  
4. **Domain Layer (Entity):** Represents database entities as Java objects.  

---

## 📸 Screenshots

1. **Home Page**  
![Home Page](https://github.com/Anuththara2003/MediQueue/blob/master/screenshot/Screenshot%202025-09-20%20084804.png)

2. **Login Page**  
![Login Page](https://github.com/Anuththara2003/MediQueue/blob/master/screenshot/Screenshot%202025-09-20%20085000.png)

3. **Sign Up Page**  
![Sign up Page](https://github.com/Anuththara2003/MediQueue/blob/master/screenshot/Screenshot%202025-09-20%20084846.png)

4. **Admin Dashboard**  
![Admin Dashboard](https://github.com/Anuththara2003/MediQueue/blob/master/screenshot/Screenshot%202025-09-20%20085029.png)

5. **Patient Dashboard**  
![Patinet Dashboard](https://github.com/Anuththara2003/MediQueue/blob/master/screenshot/Screenshot%202025-09-20%20085153.png) 

---

## 🚀 Setup and Installation Guide

### 🔹 Prerequisites
- Java 17+  
- Apache Maven 3.8+  
- MySQL Server  
- Node.js (for frontend)  
- IntelliJ IDEA / VS Code  

### 🔹 Backend Setup
```bash
# Clone the repository
git clone https://github.com/Anuththara2003/MediQueue.git

# Navigate to backend folder
cd BackEnd/

# Configure Database
# - Create MySQL database: mediqueue_db
# - Update username & password in: src/main/resources/application.properties

# Build the project
mvn clean install

# Run the application
java -jar target/mediqueue-0.0.1-SNAPSHOT.jar


🔹 Frontend Setup

# Navigate to frontend folder
cd FrontEnd/

# Install dependencies
npm install

# Start development server
npm run dev


API Keys

Replace Google Maps API key in frontend files.

Configure Twilio API credentials in application.properties or .env.


🎬 YouTube Project Demo

A complete video demonstration of MediQueue, including features and workflows, is available on YouTube with English voice narration.

▶️ [video demonstration of MediQueue](https://youtu.be/9mQpQmLNmHw) 



| Method | Endpoint                          | Description                                | Secured?  |
| ------ | --------------------------------- | ------------------------------------------ | --------- |
| POST   | `/auth/register`                  | Registers a new patient/admin              | ❌ No      |
| POST   | `/auth/login`                     | Authenticates a user & returns JWT         | ❌ No      |
| GET    | `/patients/{id}/appointments`     | Get all appointments of a patient          | ✅ Patient |
| POST   | `/appointments`                   | Create a new appointment                   | ✅ Patient |
| GET    | `/admin/appointments`             | Get all appointments for doctor/admin      | ✅ Admin   |
| PATCH  | `/admin/appointments/{id}/status` | Update appointment status (Confirm/Cancel) | ✅ Admin   |
| GET    | `/notifications/sms`              | Trigger SMS notification via Twilio API    | ✅ Yes     |
