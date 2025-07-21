import React from "react";
import {
  Modal,
  Box,
  Typography,
  Divider,
  Paper,
  Grid,
  Stack,
  Avatar,
} from "@mui/material";
import type { FlightItinerary } from "../../types";
import FlightTakeoffIcon from "@mui/icons-material/FlightTakeoff";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";

interface Props {
  itinerary: FlightItinerary;
  onClose: () => void;
}

const formatDuration = (minutes?: number) => {
  if (typeof minutes !== "number" || isNaN(minutes)) {
    return "N/A";
  }
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours}h ${mins}m`;
};

const formatDateTime = (dateString: string) => {
  return new Date(dateString).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};

export const FlightDetailsModal: React.FC<Props> = ({ itinerary, onClose }) => {
  const mainLeg = itinerary.legs[0];

  return (
    <Modal open={true} onClose={onClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "95%",
          maxWidth: 600,
          bgcolor: "background.paper",
          boxShadow: 24,
          p: { xs: 2, sm: 4 },
          borderRadius: 3,
          maxHeight: "90vh",
          overflowY: "auto",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
          <FlightTakeoffIcon color="primary" sx={{ fontSize: 32, mr: 1 }} />
          <Typography variant="h5" fontWeight={700} gutterBottom>
            Flight Details
          </Typography>
        </Box>
        <Typography
          variant="h6"
          color="primary"
          fontWeight={600}
          sx={{ mb: 1 }}
        >
          {mainLeg.origin.displayCode} →{" "}
          {itinerary.legs[itinerary.legs.length - 1].destination.displayCode}
        </Typography>
        <Divider sx={{ my: 2 }} />

        <Stack spacing={3}>
          {itinerary.legs.map((legItem, legIndex) => {
            const legCarrier = legItem.carriers?.marketing?.[0];
            return (
              <Paper
                key={legIndex}
                variant="outlined"
                sx={{ p: 2, borderRadius: 2, bgcolor: "grey.50", boxShadow: 1 }}
              >
                <Stack
                  direction="row"
                  spacing={1.5}
                  alignItems="center"
                  sx={{ mb: 2 }}
                >
                  <Avatar
                    src={legCarrier?.logoUrl}
                    sx={{
                      width: 32,
                      height: 32,
                      border: "1px solid #ddd",
                      bgcolor: "white",
                    }}
                  />
                  <Typography
                    variant="h6"
                    fontWeight={600}
                    color="text.secondary"
                  >
                    Leg {legIndex + 1}: {legItem.origin.displayCode} →{" "}
                    {legItem.destination.displayCode}
                  </Typography>
                </Stack>
                <Grid container spacing={2}>
                  <Grid size={{ xs: 6, sm: 4 }}>
                    <Typography variant="body2" color="text.secondary">
                      Total leg duration
                    </Typography>
                    <Typography variant="body1" fontWeight={500}>
                      {formatDuration(legItem.durationInMinutes)}
                    </Typography>
                  </Grid>
                  <Grid size={{ xs: 6, sm: 4 }}>
                    <Typography variant="body2" color="text.secondary">
                      Stops
                    </Typography>
                    <Typography variant="body1" fontWeight={500}>
                      {legItem.stopCount === 0 ? "Direct" : legItem.stopCount}
                    </Typography>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 4 }}>
                    <Typography variant="body2" color="text.secondary">
                      Airline
                    </Typography>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Avatar
                        src={legCarrier?.logoUrl}
                        sx={{
                          width: 24,
                          height: 24,
                          border: "1px solid #ddd",
                          bgcolor: "white",
                        }}
                      />
                      <Typography variant="body1" fontWeight={500}>
                        {legCarrier?.name || "N/A"}
                      </Typography>
                    </Stack>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Typography variant="body2" color="text.secondary">
                      Departs
                    </Typography>
                    <Typography variant="body1" fontWeight={500}>
                      {formatDateTime(legItem.departure)}
                    </Typography>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Typography variant="body2" color="text.secondary">
                      Arrives
                    </Typography>
                    <Typography variant="body1" fontWeight={500}>
                      {formatDateTime(legItem.arrival)}
                    </Typography>
                  </Grid>
                </Grid>
              </Paper>
            );
          })}
        </Stack>

        <Box
          sx={{
            mt: 4,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            bgcolor: "grey.100",
            p: 2,
            borderRadius: 2,
          }}
        >
          <Box>
            <Typography variant="body1" color="text.secondary">
              Total Price
            </Typography>
            <Typography variant="h4" color="primary" fontWeight="bold">
              {itinerary.price.formatted}
            </Typography>
          </Box>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 1,
            }}
          >
            <ShoppingCartIcon color="action" sx={{ fontSize: 32 }} />
            <Box
              component="button"
              sx={{
                bgcolor: "primary.main",
                color: "white",
                px: 3,
                py: 1.2,
                borderRadius: 2,
                fontWeight: 700,
                fontSize: "1rem",
                boxShadow: 2,
                border: "none",
                cursor: "pointer",
                transition: "background 0.2s",
                "&:hover": { bgcolor: "primary.dark" },
              }}
            >
              Go to Checkout
            </Box>
          </Box>
        </Box>
      </Box>
    </Modal>
  );
};
