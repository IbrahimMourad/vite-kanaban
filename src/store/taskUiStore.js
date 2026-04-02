// This file is your UI state store using Zustand.
// It manages things that are purely frontend interaction state (not server data).

import { create } from "zustand";

import { COLUMNS } from "../constants/columns";

const initialPagination = COLUMNS.reduce((acc, column) => {
  acc[column.id] = 1;
  return acc;
}, {});

export const useTaskUiStore = create((set) => ({
  search: "",
  pageByColumn: initialPagination,
  editingTask: null,
  deletingTask: null,
  setSearch: (value) => set({ search: value, pageByColumn: initialPagination }),
  incrementPage: (column) =>
    set((state) => ({
      pageByColumn: {
        ...state.pageByColumn,
        [column]: state.pageByColumn[column] + 1,
      },
    })),
  resetPages: () => set({ pageByColumn: initialPagination }),
  openCreateDialog: (column = "backlog") =>
    set({
      editingTask: { id: "", title: "", description: "", column, priority: "medium" },
    }),
  openEditDialog: (task) => set({ editingTask: task }),
  closeTaskDialog: () => set({ editingTask: null }),
  openDeleteDialog: (task) => set({ deletingTask: task }),
  closeDeleteDialog: () => set({ deletingTask: null }),
}));
