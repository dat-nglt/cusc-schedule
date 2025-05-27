import { Button, Card, Typography } from '@mui/material';
import { Box } from '@mui/system';
import React from 'react';

function Features({ features }) {
  return (
    <Card sx={{ width: '100%' }}>
      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 2,
          justifyContent: 'space-between',
        }}
      >
        {features.map((feature, index) => (
          <Box
            key={index}
            sx={{
              flex: '1 1 calc(16.66% - 16px)', // Adjust width for 6 items per row
              minWidth: '120px',
              maxWidth: '200px',
            }}
          >
            <Button
              fullWidth
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 1,
                py: 2,
                color: 'text.secondary',
              }}
            >
              {feature.icon}
              <Typography variant="caption">{feature.name}</Typography>
            </Button>
          </Box>
        ))}
      </Box>
    </Card>
  );
}

export default Features;