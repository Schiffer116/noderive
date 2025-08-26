# 📂 Noderive
*A minimal Google Drive clone built with React, TRPC, and TailwindCSS.*

## 🌐 Live Demo
👉 [Try Nodedrive here](https://noderive.onrender.com)

## ✨ Features
- 📂 Browse directories & open files
- ➕ Create, rename, delete directories
- 📝 Rename, delete, download, and batch-upload files
- 🔄 Recursive directory deletion
- ⚡ File upload & copy link support
- 🔐 Authentication & ownership
- 🎨 Responsive UI with right-click menus, breadcrumbs, and search
- 🔔 Toast notifications for file actions
- 🚀 Powered by TRPC + React Query for type-safe fetching and caching

## 🛠️ Tech Stack
- **React 19** + **React Router**
- **tRPC** for API calls
- **TanStack Query (React Query)** for caching & invalidation
- **TailwindCSS** for styling
- **Uploadthing** for file uploads
- **Neon** serverless database

## 🚦 Running locally

```bash

# Clone the repo
git clone https://github.com/Schiffer116/noderive.git
cd noderive

# Install dependencies
npm install && npm --prefix client install

# Build
npm run build

# Start the server
npm start
