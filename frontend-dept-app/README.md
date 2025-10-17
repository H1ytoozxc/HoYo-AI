# Modern Frontend Department Application

A professional web application for frontend departments with a modern dark design, built with React, Vite, and Tailwind CSS.

## 🌟 Features

- **Modern Dark Theme**: Sleek and professional dark interface
- **Sidebar Navigation**: Easy access to Chats, Projects, and Artifacts
- **Responsive Design**: Works seamlessly across all devices
- **Real-time Interactions**: Smooth animations and transitions
- **Component-based Architecture**: Reusable and maintainable code

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone [your-repo-url]
cd frontend-dept-app
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

## 🛠️ Tech Stack

- **React 19** - UI Framework
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **React Router DOM** - Client-side routing
- **Lucide React** - Modern icon library
- **Framer Motion** - Animation library

## 📁 Project Structure

```
frontend-dept-app/
├── src/
│   ├── components/       # Reusable components
│   │   ├── Sidebar.jsx
│   │   └── MainContent.jsx
│   ├── pages/            # Application pages
│   │   ├── ChatsPage.jsx
│   │   ├── ProjectsPage.jsx
│   │   └── ArtifactsPage.jsx
│   ├── utils/            # Utility functions
│   │   └── cn.js
│   ├── App.jsx           # Main app component
│   ├── main.jsx          # Entry point
│   └── index.css         # Global styles
├── public/               # Static assets
├── tailwind.config.js    # Tailwind configuration
└── package.json          # Dependencies
```

## 🎨 Design System

### Color Palette

- **Primary Colors**: Black (#1a1a1a) to Light Gray (#4a4a4a)
- **Accent Colors**: Blue (#4a90e2) and Coral (#e07856)
- **Text Colors**: White (#ffffff) to Muted (#6a6a6a)

### Typography

- **Primary Font**: Inter
- **Monospace Font**: Fira Code
- **Font Sizes**: 12px to 40px

## 📝 Available Scripts

```bash
# Development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).
## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
