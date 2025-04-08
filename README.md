# CollaboraTex
A free and easy way to collaborate with colleagues when making Latex files.

## Overview

CollaboraTex is a simplified, free alternative to Overleaf, focused on real-time collaborative editing of LaTeX documents. It aims to remove collaboration barriers for students, researchers, and small teams who need to work together on LaTeX documents without incurring costs.

## Problem & Solution

**Problem:** Existing platforms like Overleaf limit the number of collaborators in their free plans, creating barriers for students, researchers, and small teams.

**Solution:** A web application that allows multiple registered users to edit the same `.tex` document simultaneously, with a near real-time compiled PDF preview.

## Key Features

- Free collaborative LaTeX editing
- Simultaneous editing by multiple users
- Real-time PDF preview
- Easy portability (copy/paste) to other platforms
- User account system with document sharing
- Modern, scalable tech stack

## Technology Stack

- **Frontend:** Next.js with TypeScript and Tailwind CSS
- **Backend:** Supabase (authentication, database)
- **Editor:** Monaco Editor (the editor used in VS Code)
- **Real-time Collaboration:** Yjs (sync library for collaborative editing)
- **Compilation:** Dockerized LaTeX service with advanced security features

### Libraries & Dependencies

- **Core:**
  - [Next.js](https://nextjs.org/) - React framework with server-side rendering
  - [TypeScript](https://www.typescriptlang.org/) - Static typing for JavaScript
  - [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework

- **Authentication & Database:**
  - [Supabase JS Client](https://github.com/supabase/supabase-js) - JavaScript client for Supabase
  - [Supabase SSR](https://supabase.com/docs/guides/auth/server-side-rendering) - Server-side rendering utilities for Supabase

- **Editor & Collaboration:**
  - [Monaco Editor](https://microsoft.github.io/monaco-editor/) - Code editor that powers VS Code
  - [Yjs](https://docs.yjs.dev/) - CRDT framework for real-time collaboration
  - [y-monaco](https://github.com/yjs/y-monaco) - Monaco Editor binding for Yjs
  - [y-webrtc](https://github.com/yjs/y-webrtc) - WebRTC connector for Yjs
  - [y-websocket](https://github.com/yjs/y-websocket) - WebSocket connector for Yjs

- **State Management & Forms:**
  - [Zustand](https://github.com/pmndrs/zustand) - State management
  - [React Hook Form](https://react-hook-form.com/) - Form handling
  - [Zod](https://github.com/colinhacks/zod) - Schema validation
  - [@hookform/resolvers](https://github.com/react-hook-form/resolvers) - Validation resolvers for React Hook Form

- **UI Components:**
  - [Shadcn UI](https://ui.shadcn.com/) - Re-usable UI components built with Radix UI and Tailwind CSS
  - [Lucide React](https://lucide.dev/) - Icon library
  - [class-variance-authority](https://cva.style/docs) - Utility for building UI components
  - [clsx](https://github.com/lukeed/clsx) - Utility for constructing className strings
  - [tailwind-merge](https://github.com/dcastil/tailwind-merge) - Utility for merging Tailwind CSS classes

## Security Architecture

CollaboraTex prioritizes security, especially in the LaTeX compilation service which processes user-provided code. Our approach includes:

- **Isolated compilation environment**: Secure Docker containers with defense-in-depth principles
- **Resource constraints**: Strict CPU, memory, and time limits to prevent resource exhaustion attacks
- **No network access**: Compilation containers run without network access by default
- **Non-privileged execution**: LaTeX compilation runs as a non-root user with minimal capabilities
- **Ephemeral containers**: Each compilation request uses a fresh, disposable container
- **Input validation**: All LaTeX source code is validated before compilation
- **Output sanitization**: Compilation logs are sanitized before being returned to users

For complete details on our security implementation, see the [Docker Security Architecture](docs/docker_security.md) documentation.

## Roadmap

The development is planned in several phases:

1. **Foundations:** Authentication and document management
2. **Text Editing:** LaTeX editor with syntax highlighting
3. **Compilation:** LaTeX to PDF conversion
4. **Sharing:** Document collaboration between registered users
5. **Real-time Collaboration:** Simultaneous editing
6. **Complementary Features:** File uploads, anonymous access
7. **Non-Functional Requirements:** Security, UX improvements, optimizations

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or newer)
- [npm](https://www.npmjs.com/) (v8 or newer)
- Access to a [Supabase](https://supabase.com/) project (for authentication and database)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/CollaboraTex.git
   cd CollaboraTex
   ```

2. Install dependencies:
   ```bash
   cd collaboratex
   npm install
   ```

3. Set up environment variables:
   
   Create a `.env.local` file in the `collaboratex` directory with:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```
   
   You can find these values in your Supabase project settings.

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Database Setup

The Supabase database should have the following tables:
- `documents` - Stores LaTeX documents
- `document_collaborators` - Manages document sharing and permissions
- `project_files` - Stores metadata for uploaded files
- `anonymous_links` - Manages anonymous access links

See the [Database Schema](docs/database_schema.md) for detailed structure and setup instructions.

## Documentation

Detailed documentation is available in the `/docs` directory:

- [PRD (Product Requirements Document)](docs/prd.md)
- [Database Schema](docs/database_schema.md)
- [Docker Security Architecture](docs/docker_security.md)

## Project Structure

Below is the directory structure of the CollaboraTex project:

```
.
 |--- collaboratex                  # Main Next.js application
 |---  |--- public                  # Static assets
 |---  |--- src                     # Source code
 |---  |---  |--- app               # Next.js app router pages
 |---  |---  |---  |--- auth        # Authentication pages
 |---  |---  |---  |--- dashboard   # User dashboard
 |---  |---  |---  |--- editor      # LaTeX editor
 |---  |---  |---  |--- privacy     # Privacy policy
 |---  |---  |---  |--- profile     # User profile
 |---  |---  |---  |--- terms       # Terms of service
 |---  |---  |--- components        # React components
 |---  |---  |---  |--- auth        # Authentication components
 |---  |---  |---  |--- dashboard   # Dashboard components
 |---  |---  |---  |--- editor      # Editor components
 |---  |---  |---  |--- home        # Homepage components
 |---  |---  |---  |--- layout      # Layout components
 |---  |---  |---  |--- ui          # UI components
 |---  |---  |--- hooks             # Custom React hooks
 |---  |---  |--- lib               # Utility libraries
 |---  |---  |---  |--- i18n        # Internationalization
 |---  |---  |---  |--- schemas     # Validation schemas
 |---  |---  |---  |--- supabase    # Supabase client setup
 |---  |---  |--- types             # TypeScript type definitions
 |--- docker                        # Docker configuration
 |---  |--- latex-service           # LaTeX compilation service
 |--- docs                          # Documentation files
```

You can generate this structure using the following command from the project root:

```bash
find . -not -path "*/node_modules/*" -not -path "*/\.*" -type d | sort | sed -e "s/[^-][^\/]*\// |--- /g" -e "s/|\([^ ]\)/| \1/"
```

## Status

This project is currently in development. See the roadmap for current progress.

