
# Learning Path Creator - Project Guide

## Table of Contents
1. [Project Overview](#project-overview)
2. [Key Features](#key-features)
3. [Tech Stack](#tech-stack)
4. [Project Structure](#project-structure)
5. [Core Components](#core-components)
6. [Data Flow](#data-flow)
7. [Database Schema](#database-schema)
8. [Authentication](#authentication)
9. [AI Integration](#ai-integration)
10. [Extending the Project](#extending-the-project)
11. [Troubleshooting](#troubleshooting)

## Project Overview

The Learning Path Creator is a web application designed to help users create personalized learning paths based on their specific goals, skill levels, and time availability. The application leverages AI to generate customized learning modules and allows users to track their progress through each module.

## Key Features

- **AI-Generated Learning Paths**: Create tailored learning paths with detailed modules and resources
- **Progress Tracking**: Mark modules as "Not Started," "In Progress," or "Completed"
- **User Authentication**: Secure login/signup functionality
- **Path Management**: Save, view, and delete learning paths
- **Responsive Design**: Works across desktop and mobile devices

## Tech Stack

- **Frontend**: React with TypeScript
- **Styling**: Tailwind CSS with shadcn/ui components
- **Routing**: React Router v6
- **State Management**: React Context API and React Query
- **Backend & Authentication**: Supabase
- **AI Integration**: Google Gemini API

## Project Structure

```
src/
├── components/          # UI components
│   ├── ui/              # shadcn/ui components
│   ├── LearningPath.tsx # Learning path display component
│   ├── MyPaths.tsx      # Saved paths grid component
│   ├── LearningGoalForm.tsx # Goal input form
│   └── ...
├── contexts/            # React contexts
│   └── AuthContext.tsx  # Authentication context
├── hooks/               # Custom React hooks
├── lib/                 # Utility functions and services
│   ├── gemini.ts        # AI service integration
│   ├── learningPathService.ts # Supabase database operations
│   ├── supabase.ts      # Supabase client configuration
│   └── utils.ts         # Helper utilities
├── pages/               # Route pages
│   ├── Index.tsx        # Main page and dashboard
│   ├── Auth.tsx         # Authentication page
│   ├── MyPathsPage.tsx  # Saved paths page
│   └── NotFound.tsx     # 404 page
└── App.tsx              # Main application component with routing
```

## Core Components

### Pages

#### `Index.tsx`
The main landing page and dashboard showing:
- Hero section for non-authenticated users
- Learning path creation form
- Current learning path with module progress
- Options to save the current path

#### `MyPathsPage.tsx`
Displays all saved learning paths with options to:
- View saved paths as cards
- Select a path to view details
- Delete paths with confirmation

#### `Auth.tsx`
Handles user authentication with forms for:
- Sign in
- Sign up
- Password reset functionality

### Components

#### `LearningPath.tsx`
Renders a complete learning path with:
- Path title and description
- List of modules with their resources
- Progress tracking buttons
- Status indicators for each module

#### `MyPaths.tsx`
Grid display of saved learning paths with:
- Card view for each path
- Open and delete options
- Empty state for users with no paths

#### `LearningGoalForm.tsx`
Form for creating a new learning path:
- Goal description input
- Skill level selection
- Time availability selection

## Data Flow

1. **Path Creation**:
   - User enters learning goals in `LearningGoalForm`
   - Form data is sent to the Gemini API via `generateLearningPathWithAI()`
   - AI generates structured learning path data
   - Path is displayed using the `LearningPath` component

2. **Path Saving**:
   - User clicks "Save Path"
   - Path data is sent to Supabase via `saveLearningPath()`
   - Confirmation toast is shown to user

3. **Progress Tracking**:
   - User updates module status using buttons
   - Status changes are processed by `handleModuleStatusChange()`
   - Updates are sent to Supabase via `updateModuleStatus()`
   - UI reflects the new status

4. **Path Management**:
   - My Paths page loads user's paths via `getUserLearningPaths()`
   - User can open paths (loads path into main view)
   - User can delete paths (removes from database after confirmation)

## Database Schema

The application uses a Supabase `learning_paths` table with the following structure:

| Column       | Type        | Description                                |
|--------------|-------------|--------------------------------------------|
| id           | UUID        | Primary key                                |
| user_id      | UUID        | Foreign key to auth.users                  |
| title        | Text        | Learning path title                        |
| description  | Text        | Learning path description                  |
| modules      | JSONB       | Array of modules with status information   |
| created_at   | Timestamp   | Creation timestamp                         |

## Authentication

Authentication is managed through Supabase and the `AuthContext`:

- **Sign Up**: Email/password registration
- **Sign In**: Email/password authentication
- **Session Management**: Persistent sessions using Supabase
- **Protected Routes**: Routes requiring authentication redirect to login

## AI Integration

The application integrates with Google's Gemini API to generate learning paths:

- **API Integration**: `gemini.ts` handles API requests
- **Prompt Engineering**: Structured prompts to generate consistent learning paths
- **Error Handling**: Fallback function for API failures
- **Response Parsing**: Transforms AI responses into structured learning path data

## Extending the Project

### Adding New Features

1. **New UI Components**: 
   - Create files in `src/components/`
   - Import and use shadcn/ui components for consistent styling

2. **Additional Pages**:
   - Create a new file in `src/pages/`
   - Add a new route in `App.tsx`

3. **Database Schema Changes**:
   - Update table creation in `learningPathService.ts`
   - Modify query functions to reflect schema changes

4. **New API Integrations**:
   - Create a new service file in `src/lib/`
   - Use React Query for data fetching and caching

### Styling Guide

- Use Tailwind CSS classes for styling
- Follow shadcn/ui patterns for consistent UI
- Use responsive design patterns (e.g., `md:`, `lg:` prefixes)

## Troubleshooting

### Common Issues

1. **Module Progress Not Saving**:
   - Check console logs for errors in `updateModuleStatus`
   - Verify user is authenticated
   - Ensure path ID is correctly passed to components

2. **AI Generation Failures**:
   - Check Gemini API key validity
   - Look for response format issues in console
   - Fallback learning path should be generated automatically

3. **Authentication Problems**:
   - Verify Supabase URL and key in environment variables
   - Check console for authentication errors
   - Try clearing local storage and signing in again

### Debugging Tips

- Extensive console logging is implemented in critical functions
- Check the browser console for detailed error messages
- Use React DevTools to inspect component state
- Supabase dashboard provides logs for database operations
