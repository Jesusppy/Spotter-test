import React from "react";
import { Card, CardContent, Typography, Box, Grid, Avatar } from "@mui/material";
import FlightTakeoffIcon from '@mui/icons-material/FlightTakeoff';
import type { FlightItinerary } from "../../types";
import { formatDuration, formatTime } from "../../utils/formatters";

interface Props {
  itinerary: FlightItinerary;
  onSelect: () => void;
}

export const FlightCard: React.FC<Props> = ({ itinerary, onSelect }) => {
  const leg = itinerary.legs[0];
  const price = itinerary.price;

  const carrier = leg.carriers?.marketing?.[0];

  if (!leg || !carrier) return null;

  const stopsText = leg.stopCount === 0 ? "Direct" : `${leg.stopCount} ${leg.stopCount === 1 ? 'stop' : 'stops'}`;

  return (
    <Card variant="outlined" onClick={onSelect} sx={{ cursor: "pointer", mb: 2, '&:hover': { borderColor: 'primary.main', boxShadow: 2 } }}>
      <CardContent>
        <Grid container spacing={2} alignItems="center">
          <Grid size={{ xs: 12, md: 3 }} sx={{ textAlign: { xs: "center", md: "left" } }}>
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: { xs: "center", md: "flex-start" } }}>
              <FlightTakeoffIcon sx={{ mr: 1, color: 'text.secondary' }} />
              <Avatar src={carrier.logoUrl || '/broken-image.jpg'} sx={{ mr: 1.5 }} />
              <Typography variant="body1" fontWeight="medium">{carrier.name}</Typography>
            </Box>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", my: { xs: 2, md: 0 } }}>
              <Box>
                <Typography variant="h5">{formatTime(leg.departure)}</Typography>
                <Typography variant="body2">{leg.origin.displayCode}</Typography>
              </Box>
              <Box sx={{ textAlign: "center", minWidth: 100 }}>
                <Typography variant="body2" color="text.secondary">{formatDuration(leg.durationInMinutes)}</Typography>
                <Box sx={{ borderTop: "1px solid #ccc", my: 0.5 }} />
                <Typography variant="caption" color="text.secondary">
                  {stopsText}
                </Typography>
              </Box>
              <Box sx={{ textAlign: "right" }}>
                <Typography variant="h5">{formatTime(leg.arrival)}</Typography>
                <Typography variant="body2">{leg.destination.displayCode}</Typography>
              </Box>
            </Box>
          </Grid>
          <Grid size={{ xs: 12, md: 3 }} sx={{ textAlign: { xs: 'center', md: 'right' } }}>
            <Typography variant="h5" color="primary" sx={{ fontWeight: "bold" }}>
              {price.formatted}
            </Typography>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};