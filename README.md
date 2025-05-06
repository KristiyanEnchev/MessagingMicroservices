# 🧰 MessagingMicroservices (.NET 8 + React 18)

A scalable microservices-based communication platform built with **Clean Architecture** and **Domain-Driven Design**, integrating SMS, Email, OTP, Notifications, and Authentication, all orchestrated via an API Gateway with a powerful React-based admin dashboard.

---

<p align="center" style="display: flex; justify-content: space-between; align-items: center;">
    <img src="IdentityClient/src/assets/Screenshot 2025-04-16 014545.png" alt="MessagingMicroservices" style="width: 99%; margin: 0;">
</p>

---

## 🏗️ Architecture Overview

- **Backend**: .NET 8 Microservices with Clean Architecture
- **API Gateway**: Ocelot
- **Message Broker**: RabbitMQ
- **Background Processing**: Hangfire
- **Real-Time Updates**: SignalR
- **Authentication**: Modular Identity Service
- **Data Stores**: MS SQL, Redis
- **Frontend**: React 18 + TypeScript + TailwindCSS

## 🔥 Live Services (Local URLs)

| Service             | URL                              |
|---------------------|----------------------------------|
| API Gateway         | http://localhost:5008            |
| Identity API        | http://localhost:8080/swagger    |
| Email API           | http://localhost:5070/swagger    |
| SMS API             | http://localhost:5073/swagger    |
| OTP API             | http://localhost:5072/swagger    |
| Notification API    | http://localhost:5071/swagger    |
| RabbitMQ Dashboard  | http://localhost:15672 (john123 / 123456) |
| Hangfire - Email    | http://localhost:5070/hangfire   |
| Hangfire - SMS      | http://localhost:5073/hangfire   |
| Hangfire - Notification | http://localhost:5071/hangfire |
| Redis Commander     | http://localhost:8081 (masterauth / password) |
| SQLPad (MSSQL)      | http://localhost:3001 (admin / admin123) |
| React Admin Panel   | http://localhost:3000            |

## 🔐 Default Admin Credentials

| Role    | Email            | Password |
|---------|------------------|----------|
| Admin   | admin@admin.com  | 123456   |

## 🧪 Try It Out

### 🚀 Prerequisites

- [.NET 8.0 SDK](https://dotnet.microsoft.com/en-us/download)
- [Docker Desktop](https://docs.docker.com/desktop/)

### 🧱 Quick Start

To run the project locally:

```bash
git clone https://github.com/KristiyanEnchev/MessagingMicroservices.git
```

```bash
cd MessagingMicroservices/
```

```bash
docker-compose up -d
```

## ⚙️ Configuration Notes

Update these sections in `appsettings.json` or via environment variables for production use:

- **SMTP Settings** (Email)
- **Twilio Settings** (SMS)
- **Redis & RabbitMQ** credentials
- **Connection Strings** for each service
- **JWT & Auth Secrets** in the Authentication service

## 🧰 Built With

### 🖥 Backend

- [.NET 8.0](https://github.com/dotnet/core)
- [ASP.NET Core WebAPI](https://github.com/dotnet/aspnetcore)
- [Entity Framework Core 8.0](https://github.com/dotnet/efcore)
- [FluentValidation](https://github.com/FluentValidation/FluentValidation)
- [AutoMapper](https://github.com/AutoMapper/AutoMapper)
- [MediatR](https://github.com/jbogard/MediatR)
- [Hangfire](https://github.com/HangfireIO/Hangfire)
- [RabbitMQ](https://github.com/rabbitmq)
- [Redis](https://github.com/redis/redis)
- [SignalR](https://github.com/dotnet/aspnetcore/tree/main/src/SignalR)
- [Ocelot](https://github.com/ThreeMammals/Ocelot)

### 🧪 Testing

- [NUnit](https://github.com/nunit/nunit)
- [Moq](https://github.com/moq/moq)
- [Shouldly](https://github.com/shouldly/shouldly)

### 🖼 Frontend (Admin Dashboard)

- [React 18](https://reactjs.org/)
- [Vite](https://vitejs.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Redux Toolkit](https://redux-toolkit.js.org/)
- [TailwindCSS](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/)
- [React Hook Form](https://react-hook-form.com/)
- [Zod](https://github.com/colinhacks/zod)
- [Framer Motion](https://www.framer.com/motion/)

## 🧱 System Design

### ✅ Microservices

- **EmailService** - SMTP-based mail sending
- **SMSService** - Twilio-based SMS sending
- **OTPService** - Secure OTP generation and validation
- **NotificationService** - Internal user notifications
- **AuthenticationService** - Login, JWT, Role/Claims

### 🧠 Supporting Infrastructure

- **RabbitMQ** - Event-driven communication
- **Redis** - Caching, deduplication, session memory
- **Hangfire** - Background job processing
- **SQL Server** - Primary DB
- **React Client** - Admin monitoring and management UI

## 📸 Flow Diagram
<img src="MessagingMicroservices.PNG" width="500" height="300" alt="Architectural Diagram">

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙋 Support & Feedback

If you find this project useful, give it a ⭐ on GitHub and feel free to reach out:

[![Facebook](https://img.shields.io/badge/kristiyan.enchev-%231877F2.svg?style=for-the-badge&logo=Facebook&logoColor=white)](https://www.facebook.com/kristiqn.enchev.5/) [![Instagram](https://img.shields.io/badge/kristiyan-%23E4405F.svg?style=for-the-badge&logo=Instagram&logoColor=white)](https://www.instagram.com/kristiyan_e/)
[![Gmail](https://img.shields.io/badge/Gmail-D14836?style=for-the-badge&logo=gmail&logoColor=white)](mailto:kristiqnenchevv@gmail.com)