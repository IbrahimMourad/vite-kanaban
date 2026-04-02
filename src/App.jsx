import { useCallback, useMemo } from "react";
import {
  Container,
  Grid,
  Typography,
  Box,
  CircularProgress,
  Alert,
} from "@mui/material";
import { BoardToolbar } from "./components/BoardToolbar";
import { CreateTaskFormDialog } from "./components/CreateTaskFormDialog";
import { DeleteConfirmDialog } from "./components/DeleteConfirmDialog";
import { useTaskUiStore } from "./store/taskUiStore";
import { useTasks } from "./hooks/useTasks";
import { TaskColumn as TaskColumnComponent } from "./components/TaskColumn";
import { COLUMNS } from "./constants/columns";
import {
  DndContext,
  useSensors,
  closestCorners,
  useSensor,
} from "@dnd-kit/core";
import { PointerSensor } from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";

export default function App() {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
  );
  const {
    search,
    pageByColumn,
    editingTask,
    setSearch,
    incrementPage,
    openCreateDialog,
    openEditDialog,
    closeTaskDialog,
    deletingTask,
    closeDeleteDialog,
    openDeleteDialog,
  } = useTaskUiStore();

  const {
    tasks,
    createTask,
    updateTask,
    deleteTask,
    isPending,
    isLoading,
    isError,
  } = useTasks(search);

  const groupedTasks = useMemo(
    () =>
      COLUMNS.reduce((acc, column) => {
        acc[column.id] = (tasks ?? [])
          .filter((task) => task.column === column.id)
          .sort((a, b) => (a.order ?? Number.MAX_SAFE_INTEGER) - (b.order ?? Number.MAX_SAFE_INTEGER));
        return acc;
      }, {}),
    [tasks],
  );
  function resolveDestinationColumn(overId) {
    const isColumnId = COLUMNS.some((column) => column.id === overId);
    if (isColumnId) return overId;

    const destinationTask = tasks.find((task) => task.id === overId);
    return destinationTask ? destinationTask.column : null;
  }

  async function handleDragEnd(event) {
    const activeId = String(event.active.id);
    const overId = event.over?.id ? String(event.over.id) : null;
    if (!overId || activeId === overId) return;

    const activeTask = tasks.find((task) => task.id === activeId);
    if (!activeTask) return;

    const sourceColumn = activeTask.column;
    const destinationColumn = resolveDestinationColumn(overId);
    if (!destinationColumn) return;

    const sourceTasks = [...(groupedTasks[sourceColumn] ?? [])];
    const destinationTasks =
      sourceColumn === destinationColumn
        ? sourceTasks
        : [...(groupedTasks[destinationColumn] ?? [])];

    const activeIndex = sourceTasks.findIndex((task) => task.id === activeId);
    if (activeIndex < 0) return;

    if (sourceColumn === destinationColumn) {
      let overIndex = destinationTasks.findIndex((task) => task.id === overId);
      if (overIndex < 0) {
        overIndex = destinationTasks.length - 1;
      }
      if (overIndex < 0 || overIndex === activeIndex) return;

      const reordered = arrayMove(destinationTasks, activeIndex, overIndex);
      await Promise.all(
        reordered.map((task, index) =>
          updateTask(task.id, { ...task, order: index }),
        ),
      );
      return;
    }

    const [movedTask] = sourceTasks.splice(activeIndex, 1);
    if (!movedTask) return;

    let insertIndex = destinationTasks.findIndex((task) => task.id === overId);
    if (insertIndex < 0) {
      insertIndex = destinationTasks.length;
    }

    destinationTasks.splice(insertIndex, 0, {
      ...movedTask,
      column: destinationColumn,
    });

    const sourceUpdates = sourceTasks.map((task, index) =>
      updateTask(task.id, { ...task, order: index }),
    );
    const destinationUpdates = destinationTasks.map((task, index) =>
      updateTask(task.id, { ...task, column: destinationColumn, order: index }),
    );

    await Promise.all([...sourceUpdates, ...destinationUpdates]);
  }
  const handleUpsert = useCallback(
    async (task, id) => {
      if (id) {
        await updateTask(id, task);
      } else {
        await createTask(task);
      }
    },
    [updateTask, createTask],
  );

  const handleDelete = useCallback(
    async (id) => {
      await deleteTask(id);
      closeDeleteDialog();
    },
    [deleteTask, closeDeleteDialog],
  );

  if (isLoading) {
    return (
      <Box minHeight="70vh" display="grid" sx={{ placeItems: "center" }}>
        <CircularProgress />
      </Box>
    );
  }

  if (isError) {
    return (
      <Alert severity="error">
        Could not load tasks. Start json-server on port 4000.
      </Alert>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Typography variant="h4" mb={3} fontWeight={700}>
        Kanban ToDo Dashboard
      </Typography>

      <BoardToolbar
        search={search}
        onSearchChange={setSearch}
      />

      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragEnd={handleDragEnd}
      >
        <Grid container spacing={2}>
          {COLUMNS.map((column) => (
            <Grid key={column.id} size={{ xs: 12, md: 6, lg: 3 }}>
              <TaskColumnComponent
                id={column.id}
                label={column.label}
                tasks={groupedTasks[column.id]}
                page={pageByColumn[column.id]}
                onLoadMore={incrementPage}
                onEdit={openEditDialog}
                onDelete={openDeleteDialog}
                onAddTask={openCreateDialog}
              />
            </Grid>
          ))}
        </Grid>
      </DndContext>
      <CreateTaskFormDialog
        key={editingTask?.id || "create"}
        task={editingTask}
        onClose={closeTaskDialog}
        onSubmit={handleUpsert}
        isSubmitting={isPending}
      />
      <DeleteConfirmDialog
        task={deletingTask}
        onCancel={closeDeleteDialog}
        onConfirm={handleDelete}
        isDeleting={isPending}
      />
    </Container>
  );
}
