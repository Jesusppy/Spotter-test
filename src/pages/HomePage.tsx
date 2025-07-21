import React from "react";
import { Typography, Box, CircularProgress, Alert } from "@mui/material";
import { Navbar } from "../components/Navbar/Navbar";
import { FlightSearchForm } from "../components/FlightSearchForm/FlightSearchForm";
import { useFlightSearch } from "../hooks/useFlightSearch";
import { FlightList } from "../components/FlightList/FlightList";

export const HomePage: React.FC = () => {
  const { itineraries, isLoading, error, search } = useFlightSearch();

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Navbar />
      <Box sx={{ height: 64 }} />
      <Box
        component="main"
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: 0,
          py: 4,
          px: 2,
        }}
      >
        <Box sx={{ maxWidth: "800px", width: "100%" }}>
          <Typography
            variant="h4"
            component="h1"
            gutterBottom
            sx={{ fontWeight: 700, textAlign: "center" }}
          >
            Compare flights from hundreds of websites
          </Typography>
          <Typography
            variant="h6"
            color="text.secondary"
            sx={{ mb: 4, textAlign: "center" }}
          >
            The most powerful search on the web to find the best deals.
          </Typography>

          <FlightSearchForm onSearch={search} isLoading={isLoading} />
        </Box>
        <Box sx={{ mt: 5, width: "100%", maxWidth: "800px" }}>
          {isLoading && (
            <Box sx={{ display: "flex", justifyContent: "center" }}>
              <CircularProgress />
            </Box>
          )}
          {error && (
            <Alert severity="warning" sx={{ mt: 2 }}>
              {error}
            </Alert>
          )}

          {itineraries.length > 0 && !isLoading && (
            <FlightList itineraries={itineraries} />
          )}
        </Box>
      </Box>
    </Box>
  );
};
