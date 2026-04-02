import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material";

export function DeleteConfirmDialog({ task, onCancel, onConfirm, isDeleting }) {
  return (
    <Dialog open={Boolean(task)} onClose={onCancel} fullWidth maxWidth="xs">
      <DialogTitle>Delete Task</DialogTitle>
      <DialogContent>
        <Typography variant="body2">
          Are you sure you want to delete <strong>{task?.title}</strong>?
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel}>Cancel</Button>
        <Button
          color="error"
          variant="contained"
          disabled={!task || isDeleting}
          onClick={() => task && onConfirm(task.id)}
        >
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
}
