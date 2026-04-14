import React from 'react';
import { AppBar, Toolbar, Typography, Box } from '@mui/material';
import PsychologyIcon from '@mui/icons-material/Psychology';

const Header = () => {
  return (
    <AppBar position="static" elevation={2}>
      <Toolbar>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <PsychologyIcon sx={{ fontSize: 36 }} />
          <Typography variant="h5" component="h1" sx={{ fontWeight: 600 }}>
            Alzheimer's Detection System
          </Typography>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
