import { Box, TextField } from '@mui/material'

export function BoardToolbar({ search, onSearchChange }) {
  return (
    <Box display="flex" gap={2} flexWrap="wrap" mb={3}>
      <TextField
        label="Search tasks"
        placeholder="Search by title or description"
        value={search}
        onChange={(event) => onSearchChange(event.target.value)}
        sx={{ minWidth: 260, flex: 1 }}
      />
    </Box>
  )
}
