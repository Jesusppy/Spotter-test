import React from 'react';
import { AppBar, Toolbar, Typography } from '@mui/material';
import FlightIcon from '@mui/icons-material/Flight';

export const Navbar: React.FC = () => (
  <AppBar position="fixed" color="primary" elevation={2}>
    <Toolbar>
      <FlightIcon sx={{ mr: 2 }} />
      <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
        Spotter Flights
      </Typography>
    </Toolbar>
  </AppBar>
);