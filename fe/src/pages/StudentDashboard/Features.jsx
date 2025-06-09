import { Button, Card, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import { Box, useTheme } from '@mui/system';
import React from 'react';

const Features = ({ features }) => {
  const theme = useTheme();
  
  return (
    <Box sx={{
      width: '100%',
      border: `1px solid ${theme.palette.divider}`,

    }}>
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
              component={Link}
              to={feature.path}
              fullWidth
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 1,
                py: 2,
                color: 'text.secondary',
                '&:hover': {
                  color: 'primary.main',
                }
              }}
            >
              {feature.icon}
              <Typography variant="caption">{feature.name}</Typography>
            </Button>
          </Box>
        ))}
      </Box>
    </Box>
  );
}

export default Features;