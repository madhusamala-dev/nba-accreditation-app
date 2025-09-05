# CompliEdu Technologies - Development Plan

## Overview
Building a web application with Admin and Institute modules for managing college onboarding and applications.

## MVP Features to Implement

### 1. Authentication System
- Login page with role-based routing
- Default admin account (admin@compliedu.xyz / CompliEdu@123)
- Institute login with email/password
- Basic forgot password functionality

### 2. Admin Module
- Admin dashboard with college statistics
- Institution onboarding form
- College list views with filtering
- Basic CRUD operations for institutions

### 3. Institute Module  
- Institute dashboard
- Application creation form
- Program selection based on category
- Basic SAR generation

## Files to Create/Modify

1. **src/pages/Login.tsx** - Login page with role detection
2. **src/pages/admin/AdminDashboard.tsx** - Admin dashboard with statistics
3. **src/pages/admin/OnboardInstitution.tsx** - Institution onboarding form
4. **src/pages/admin/CollegeList.tsx** - List of colleges with details
5. **src/pages/institute/InstituteDashboard.tsx** - Institute dashboard
6. **src/pages/institute/NewApplication.tsx** - Application creation form
7. **src/components/Layout.tsx** - Common layout with navigation
8. **src/lib/auth.ts** - Authentication utilities
9. **src/lib/data.ts** - Mock data and data management
10. **src/App.tsx** - Update routing structure

## Data Structure (localStorage based)
- Users (admin + institutes)
- Institutions
- Applications
- Programs by category

## Simplified Implementation
- Use localStorage for data persistence
- Mock authentication without real backend
- Basic form validation
- Responsive design with Tailwind CSS