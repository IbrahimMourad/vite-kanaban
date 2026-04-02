import { useEffect, useMemo, useState } from 'react'
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  TextField,
} from '@mui/material'
import { COLUMNS } from '../constants/columns'



const emptyPayload = {
  title: '',
  description: '',
  column: 'backlog',
  priority: 'medium',
}

function getFormDataFromTask(task) {
  if (!task) return emptyPayload
  return {
    title: task.title ?? '',
    description: task.description ?? '',
    column: task.column ?? 'backlog',
    priority: task.priority ?? 'medium',
  }
}

export function CreateTaskFormDialog({ task, onClose, onSubmit, isSubmitting }) {
  const [formData, setFormData] = useState(getFormDataFromTask(task))

  useEffect(() => {
    setFormData(getFormDataFromTask(task))
  }, [task])

  const isCreate = useMemo(() => !task || !task.id, [task])
  const isOpen = task !== null

  const isInvalid = !formData.title.trim() || !formData.description.trim()

  async function handleSubmit() {
    await onSubmit(formData, task?.id || undefined)
    onClose()
  }

  return (
    <Dialog open={isOpen} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{isCreate ? 'Create Task' : 'Update Task'}</DialogTitle>
      <DialogContent sx={{ display: 'grid', gap: 2, pt: 1 }}>
        <TextField
          label="Title"
          value={formData.title}
          onChange={(event) => setFormData((prev) => ({ ...prev, title: event.target.value }))}
          fullWidth
          autoFocus
        />
        <TextField
          label="Description"
          value={formData.description}
          onChange={(event) => setFormData((prev) => ({ ...prev, description: event.target.value }))}
          fullWidth
          minRows={3}
          multiline
        />
        <TextField
          select
          label="Column"
          value={formData.column}
          onChange={(event) =>
            setFormData((prev) => ({ ...prev, column: event.target.value }))
          }
          fullWidth
        >
          {COLUMNS.map((column) => (
            <MenuItem key={column.id} value={column.id}>
              {column.label}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          select
          label="Priority"
          value={formData.priority}
          onChange={(event) =>
            setFormData((prev) => ({ ...prev, priority: event.target.value }))
          }
          fullWidth
        >
          <MenuItem value="low">Low</MenuItem>
          <MenuItem value="medium">Medium</MenuItem>
          <MenuItem value="high">High</MenuItem>
        </TextField>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={handleSubmit} disabled={isInvalid || isSubmitting}>
          {isCreate ? 'Create' : 'Save'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
