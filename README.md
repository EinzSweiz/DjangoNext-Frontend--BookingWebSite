Project Documentation
Overview

Djanobnb is a web application built using Next.js, designed to provide a seamless experience for users looking to manage and book accommodations. The application leverages modern web technologies and libraries to ensure a responsive and user-friendly interface. Users can browse available accommodations, manage reservations, and enjoy a dynamic and interactive booking experience.
Project Structure

    Frontend: Built with Next.js, React, and Tailwind CSS for styling.
    Backend: Utilizes Django for the API and data handling.
    Deployment:The Djanobnb application is deployed using a DigitalOcean droplet and hosted on Hostinger. The deployment process involves several steps to ensure the backend and frontend are properly configured, and SSL is enabled for secure         communication.

Key Features

    User Authentication: Secure login/signup with social authentication (Google, GitHub) and email/password login.
    Accommodation Search: Browse and filter available properties based on criteria like location, price, and amenities.
    Reservation Management: Users can book properties, view reservation details, and manage their bookings.
    Stripe Integration: Secure payment processing with Stripe, including payment invoices.
    Real-time Messaging: Users and admins can send and receive messages about bookings or inquiries in real-time.
    Responsive Design: Fully responsive and mobile-friendly interface built with Tailwind CSS.
    CRUD Operations: Full CRUD functionality for managing properties and customer inquiries within a small CRM system.

Project Directory

The project is organized into the following key directories:

    /app: Contains all the application routes and components like /aboutus, /contact, /myproperties, /myreservations, and others.
    /components: Houses reusable UI components like the Navbar, Footer, property-related components (PropertyList, ReservationSidebar), modals, and custom UI elements (DropdownMenu, Button, etc.).
    /services: Includes apiService.ts for API calls.
    /lib: Contains utility functions for the app, such as utils.ts.

Notable Paths

The project includes various important paths for managing different features:

    Authentication: The password reset API is located at /app/api/auth/password/reset/confirm/[uid]/[token]/page.tsx.
    Modals and Components: The modals used for adding properties, login, profile, etc., are stored under /app/components/modals/ such as AddPropertyModal.tsx and LoginModal.tsx.
    Property Management: For adding and viewing properties, you can find the related components under /app/components/addproperty/ and /app/components/properties/ like Categories.tsx, FavoriteButton.tsx, and PropertyList.tsx.
    Messaging System: The inbox and conversation details are located at /app/inbox/ with files like Conversation.tsx and ConversationDetail.tsx.
    Payment Success and Cancelation: These pages are available at /app/payment/success/page.tsx and /app/payment/cancel/page.tsx.

Installation

To set up the project locally, follow these steps:

    Clone the repository: git clone <repository-url>
    Navigate to the project directory: cd djanobnb
    Install the dependencies: npm install

Scripts

    Development: Start the development server with npm run dev.
    Build: Create an optimized production build using npm run build.
    Start: Launch the application in production mode with npm run start.
    Lint: Check for code quality using npm run lint.

Dependencies

The project relies on several key dependencies, including:

    @radix-ui/react-*: A collection of UI components for building accessible web applications.
    axios: For making HTTP requests.
    next-themes: For theme management.
    react-select: For customizable select components.
    tailwindcss: For utility-first CSS styling.

Development Dependencies

The project also includes development tools such as:

    @types/node, @types/react, @types/react-dom: TypeScript type definitions.
    postcss, tailwindcss: For CSS processing and styling.
    typescript: For static type checking.

Contributions are welcome! Please ensure that any new features or bug fixes are accompanied by appropriate tests and documentation updates.
License

This project is licensed under the MIT License.
