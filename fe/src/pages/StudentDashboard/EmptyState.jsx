import { Box, Typography, Button } from '@mui/material';

const EmptyState = ({ title, description, icon, action }) => {
  return (
    <Box sx={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
      p: 4,
      height: '300px',
      color: 'text.secondary'
    }}>
      <Typography variant="h4" sx={{ mb: 2 }}>
        {icon}
      </Typography>
      <Typography variant="h6" sx={{ mb: 1 }}>
        {title}
      </Typography>
      <Typography variant="body1" sx={{ mb: 3 }}>
        {description}
      </Typography>
      {action}
    </Box>
  );
};

export default EmptyState;