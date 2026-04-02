# vite-kanaban

A Kanban-style task board built with **React** and **Vite**. Tasks are stored in a JSON file and served through **json-server**, so you get a simple REST API without a full database.

## Features

- Columns: Backlog, In Progress, Review, Done
- Create, edit, and delete tasks
- Drag-and-drop to reorder tasks and move them between columns
- Search by title or description
- Priority tags (low, medium, high)
- **Material UI** for layout and components
- **TanStack Query** for server state, **Zustand** for UI state, **dnd-kit** for drag and drop

## Prerequisites

- [Node.js](https://nodejs.org/) (LTS recommended)
- npm (comes with Node)

## Install dependencies

```bash
npm install
```

## How to run the app

The UI and the API run as **two separate processes**. Start both in two terminals.

### 1. Start the API (json-server)

Serves `db.json` at **http://localhost:4000** (tasks live at `http://localhost:4000/tasks`).

```bash
npm run server
```

Leave this terminal running.

### 2. Start the Vite dev server

```bash
npm run dev
```

Open the URL Vite prints (usually **http://localhost:5173**). The frontend is configured to talk to the API at `http://localhost:4000`.

### Summary

| Command           | Purpose                                      |
| ----------------- | -------------------------------------------- |
| `npm run server`  | REST API from `db.json` (port **4000**)      |
| `npm run dev`     | React app with hot reload (default **5173**) |
| `npm run build`   | Production build → `dist/`                   |
| `npm run preview` | Serve the production build locally           |
| `npm run lint`    | Run ESLint                                   |

## Tech stack

- React 19, Vite 8
- MUI (Material UI), Emotion
- TanStack Query, Axios
- Zustand
- @dnd-kit (core, sortable)
- json-server

## Repository

[github.com/IbrahimMourad/vite-kanaban](https://github.com/IbrahimMourad/vite-kanaban)
