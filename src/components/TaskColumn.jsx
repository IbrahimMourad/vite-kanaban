import { useMemo } from "react";
import { Paper, Typography, Box, Button } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { PAGE_SIZE } from "../constants/columns";
import { TaskCard } from "./TaskCard";
import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";

export function TaskColumn({
  id,
  label,
  tasks,
  page,
  onEdit,
  onDelete,
  onAddTask,
}) {
  const { setNodeRef, isOver } = useDroppable({
    id,
    data: { type: "column", column: id },
  });
  const visibleTasks = useMemo(
    () => tasks?.slice(0, page * PAGE_SIZE),
    [tasks, page],
  );
  return (
    <Paper
      ref={setNodeRef}
      elevation={0}
      sx={{
        p: 2,
        minHeight: 420,
        border: "1px solid",
        borderColor: isOver ? "primary.main" : "divider",
        bgcolor: "background.paper",
      }}
    >
      <Typography variant="h6" mb={1.5}>
        {label} ({tasks?.length})
      </Typography>

      <SortableContext
        items={visibleTasks.map((task) => task.id)}
        strategy={verticalListSortingStrategy}
      >
        <Box minHeight={300} mb={1.5}>
          {visibleTasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </Box>
      </SortableContext>
      <Button
        fullWidth
        variant="outlined"
        startIcon={<AddIcon />}
        onClick={() => onAddTask(id)}
      >
        Add Task
      </Button>
    </Paper>
  );
}
