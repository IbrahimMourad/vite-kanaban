import {
  Card,
  CardActions,
  CardContent,
  Chip,
  IconButton,
  Typography,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { CSS } from "@dnd-kit/utilities";
import { useSortable } from "@dnd-kit/sortable";

export function TaskCard({ task, onEdit, onDelete }) {
  const priority = (task.priority ?? "medium").toLowerCase();
  const priorityColor =
    {
      low: "default",
      medium: "warning",
      high: "error",
    }[priority] ?? "default";

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.id,
    data: { type: "task", task },
  });

  return (
    <Card
      ref={setNodeRef}
      sx={{
        mb: 1.25,
        opacity: isDragging ? 0.5 : 1,
        transform: CSS.Transform.toString(transform),
        transition,
      }}
      {...attributes}
      {...listeners}
    >
      <CardContent sx={{ pb: 1, textAlign: "left" }}>
        <Typography variant="subtitle1" fontWeight={600} textAlign="left">
          {task.title}
        </Typography>
        <Typography variant="body2" color="text.secondary" textAlign="left">
          {task.description}
        </Typography>
        <Chip
          size="small"
          label={priority.charAt(0).toUpperCase() + priority.slice(1)}
          color={priorityColor}
          sx={{
            mt: 0.75,
            mb: 1,
            ...(priority === "low" && {
              bgcolor: "grey.300",
              color: "text.primary",
            }),
          }}
        />
      </CardContent>
      <CardActions sx={{ justifyContent: "flex-end", pt: 0 }}>
        <IconButton size="small" onClick={() => onEdit(task)}>
          <EditIcon fontSize="small" />
        </IconButton>
        <IconButton size="small" color="error" onClick={() => onDelete(task)}>
          <DeleteIcon fontSize="small" />
        </IconButton>
      </CardActions>
    </Card>
  );
}
