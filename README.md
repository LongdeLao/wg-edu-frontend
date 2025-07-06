# WG Education Frontend

The frontend application for the WG Education platform, built with Next.js, React, and TypeScript.

## Features

- User authentication with role-based access
- Admin dashboard for system management
- Student management interface
- Responsive UI with shadcn/ui components

## Architecture

The application follows a Next.js 13+ architecture with the following structure:

- `src/app`: Main application code using Next.js App Router
  - `admin/`: Admin dashboard pages
  - `dashboard/`: General dashboard pages
  - `student/`: Student-specific pages
  - `teacher/`: Teacher-specific pages
  - `services/`: API service integration
  - `components/`: Shared components
- `src/components`: Reusable UI components library
- `public`: Static assets

## API Integration

The frontend communicates with the backend through a REST API defined in `src/app/services/api.ts`.

## Component Structure

### Admin Dashboard

- Main admin dashboard (`/admin/page.tsx`)
- Student management interface (`/admin/students/page.tsx`)

## Setup and Installation

### Prerequisites

- Node.js 18+ and npm/yarn/pnpm

### Installation

1. Clone the repository:

```bash
git clone https://github.com/username/wg-edu.git
cd wg-edu-frontend
```

2. Install dependencies:

```bash
npm install
# or
yarn install
# or
pnpm install
```

3. Configure API URL:

Create a `.env.local` file with:

```
NEXT_PUBLIC_API_URL=http://localhost:8080
```

4. Start the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

5. Open [http://localhost:3000](http://localhost:3000) to see the application.

## Development Guide

### Adding New Pages

1. Create a new page in the appropriate directory under `src/app/`
2. Use existing components from `src/components/ui` for consistent design
3. Add API service functions if needed in `src/app/services/api.ts`

### Authentication

The application uses JWT tokens stored in browser localStorage for authentication. All authenticated requests need to include the token in the Authorization header.

### User Roles

The application supports three user roles:
- Admin: Full access to system including user management
- Teacher: Access to teaching-related features
- Student: Limited access to learning features

## Deployment

Build the production version:

```bash
npm run build
# or
yarn build
# or
pnpm build
```

The application can be deployed to any platform that supports Next.js applications, such as Vercel, Netlify, or custom servers.

## Testing

Run tests with:

```bash
npm test
# or
yarn test
# or
pnpm test
```

## Technologies Used

- [Next.js](https://nextjs.org/) - React framework
- [TypeScript](https://www.typescriptlang.org/) - Type-safe JavaScript
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [Axios](https://axios-http.com/) - HTTP client

## Project Structure

```
wg-edu-frontend/
├── src/
│   ├── app/
│   │   ├── components/
│   │   │   └── ApiHealthStatus.tsx
│   │   ├── services/
│   │   │   └── api.ts
│   │   ├── error.tsx
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   ├── loading.tsx
│   │   └── page.tsx
│   └── ...
├── public/
├── package.json
└── ...
```

## License

This project is licensed under the MIT License - see the LICENSE file for details.
