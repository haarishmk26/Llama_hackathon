# Artifact - Frontend Setup Guide

This document provides instructions for setting up and running the Artifact application locally.

## Prerequisites

Before you begin, ensure you have the following installed on your system:

- [Node.js](https://nodejs.org/) (v18.0.0 or later)
- [npm](https://www.npmjs.com/) (v8.0.0 or later) or [yarn](https://yarnpkg.com/) (v1.22.0 or later)
- [Git](https://git-scm.com/) for cloning the repository

## Installation

1. Clone the repository:

\`\`\`bash
git clone https://github.com/your-username/artifact.git
cd artifact
\`\`\`

2. Install dependencies:

\`\`\`bash
npm install

# or

yarn install
\`\`\`

## Key Dependencies

This project uses the following main dependencies:

- **Next.js**: React framework for server-rendered applications
- **React**: JavaScript library for building user interfaces
- **TypeScript**: Typed JavaScript
- **Tailwind CSS**: Utility-first CSS framework
- **shadcn/ui**: UI component library
- **Lucide React**: Icon library

## Running the Application

1. Start the development server:

\`\`\`bash
npm run dev

# or

yarn dev
\`\`\`

2. Open your browser and navigate to [http://localhost:3000]()

## Project Structure

\`\`\`
artifact/
├── app/ # Next.js App Router pages
│ ├── page.tsx # Home page
│ ├── projects/ # Project-related pages
│ └── api/ # API routes
├── components/ # React components
├── lib/ # Utility functions
├── public/ # Static assets
│ └── images/ # Image assets
└── types/ # TypeScript type definitions
\`\`\`

## Development Workflow

1. **Home Page**: The entry point of the application showing recent projects
2. **New Project**: Create a new project by providing an NPM package name and uploading a new UI design
3. **Project View**: View project details with tabs for Summary, UI Changes, and Feedback

## Building for Production

To build the application for production:

\`\`\`bash
npm run build

# or

yarn build
\`\`\`

To start the producthttp://localhost:3000ion server:

\`\`\`bash
npm start

# or

yarn start
\`\`\`

## Environment Variables

Create a `.env.local` file in the root directory with the following variables (if needed):

\`\`\`

# Example environment variables

NEXT_PUBLIC_API_URL=http://localhost:3000/api
\`\`\`

## Troubleshooting

- **Issue**: Dependencies not installing correctly

  - **Solution**: Try deleting `node_modules` and `package-lock.json`, then run `npm install` again

- **Issue**: Build errors related to TypeScript
  - **Solution**: Run `npm run lint` to identify and fix issues

## Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://reactjs.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [shadcn/ui Documentation](https://ui.shadcn.com)

## Support

If you encounter any issues or have questions, please open an issue on the GitHub repository or contact the development team.
