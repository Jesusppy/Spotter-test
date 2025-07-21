import { useState, useMemo, useEffect } from "react";
import type { FlightItinerary } from "../../types";
import { FlightCard } from "../FlightCard/FlightCard";
import { FlightDetailsModal } from "../FlightDetailModal/FlightDetailModal";

import {
  Box,
  Button,
  Popover,
  Typography,
  Grid,
  Pagination,
  Slider,
  RadioGroup,
  FormControlLabel,
  Radio,
  IconButton,
  Autocomplete,
  TextField,
  Stack,
  Card,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import FilterListIcon from "@mui/icons-material/FilterList";

interface Props {
  itineraries: FlightItinerary[];
}

const formatMinutesToHours = (totalMinutes: number) => {
  if (isNaN(totalMinutes)) return "...";
  const hours = Math.round(totalMinutes / 60);
  return `Less than ${hours} h`;
};

export const FlightList: React.FC<Props> = ({ itineraries }) => {
  const flightsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedItinerary, setSelectedItinerary] =
    useState<FlightItinerary | null>(null);

  const { minPrice, maxPrice, minDuration, maxDuration, uniqueAirlines } =
    useMemo(() => {
      const defaultValues = {
        minPrice: 0,
        maxPrice: 5000,
        minDuration: 0,
        maxDuration: 3000,
        uniqueAirlines: [],
      };

      if (!itineraries || itineraries.length === 0) {
        return defaultValues;
      }

      const validItineraries = itineraries.filter(
        (it) =>
          it &&
          it.price &&
          typeof it.price.raw === "number" &&
          it.legs &&
          it.legs[0] &&
          typeof it.legs[0].durationInMinutes === "number" &&
          it.legs[0].carriers &&
          it.legs[0].carriers.marketing &&
          it.legs[0].carriers.marketing[0]
      );

      if (validItineraries.length === 0) {
        return defaultValues;
      }

      const prices = validItineraries.map((it) => it.price.raw);
      const durations = validItineraries.map(
        (it) => it.legs[0].durationInMinutes
      );
      const airlines = new Set(
        validItineraries.map((it) => it.legs[0].carriers.marketing[0].name)
      );

      return {
        minPrice: Math.floor(Math.min(...prices)),
        maxPrice: Math.ceil(Math.max(...prices)),
        minDuration: Math.min(...durations),
        maxDuration: Math.max(...durations),
        uniqueAirlines: Array.from(airlines),
      };
    }, [itineraries]);

  const [anchorEl, setAnchorEl] = useState<Record<string, HTMLElement | null>>(
    {}
  );
  const [filters, setFilters] = useState({
    priceMax: maxPrice,
    maxStops: -1,
    durationMax: maxDuration,
    airlines: [] as string[],
  });

  useEffect(() => {
    setFilters({
      priceMax: maxPrice,
      maxStops: -1,
      durationMax: maxDuration,
      airlines: [],
    });
    setCurrentPage(1);
  }, [itineraries, maxPrice, maxDuration]);

  const filteredItineraries = useMemo(() => {
    return itineraries.filter((it) => {
      const { priceMax, maxStops, durationMax, airlines } = filters;
      const stopCount = it.legs[0]?.stopCount;
      const carrierName = it.legs[0]?.carriers?.marketing?.[0]?.name;

      if (typeof priceMax === "number" && it.price.raw > priceMax) return false;
      if (
        typeof durationMax === "number" &&
        it.legs[0].durationInMinutes > durationMax
      )
        return false;

      // Stops filter logic
      if (maxStops === 0 && stopCount !== 0) return false; // Direct only
      if (maxStops === 1 && stopCount !== 1) return false; // Exactly 1 stop
      if (maxStops === 2 && stopCount !== 2) return false; // Exactly 2 stops
      // If -1, allow any number of stops

      if (airlines.length > 0 && carrierName && !airlines.includes(carrierName))
        return false;
      return true;
    });
  }, [itineraries, filters]);

  const totalPages = Math.ceil(filteredItineraries.length / flightsPerPage);
  const currentFlights = filteredItineraries.slice(
    (currentPage - 1) * flightsPerPage,
    currentPage * flightsPerPage
  );

  const handlePageChange = (
    _event: React.ChangeEvent<unknown>,
    page: number
  ) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  const handleOpenPopover = (
    filterName: string,
    event: React.MouseEvent<HTMLElement>
  ) => {
    setAnchorEl((prev) => ({ ...prev, [filterName]: event.currentTarget }));
  };

  const handleClosePopover = (filterName: string) => {
    setAnchorEl((prev) => ({ ...prev, [filterName]: null }));
  };

  const handleClearFilter = (filterName: keyof typeof filters) => {
    const defaultFilters = {
      priceMax: maxPrice,
      maxStops: -1,
      durationMax: maxDuration,
      airlines: [] as string[],
    };
    setFilters((prev) => ({
      ...prev,
      [filterName]: defaultFilters[filterName],
    }));
  };

  const renderPopover = (
    filterName: string,
    title: string,
    onClear: () => void,
    children: React.ReactNode
  ) => (
    <Popover
      open={Boolean(anchorEl[filterName])}
      anchorEl={anchorEl[filterName]}
      onClose={() => handleClosePopover(filterName)}
      anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
      PaperProps={{ sx: { width: 320, mt: 1, borderRadius: 2 } }}
    >
      <Box sx={{ p: 2 }}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          sx={{ mb: 2 }}
        >
          <Typography variant="h6" component="h3">
            {title}
          </Typography>
          <IconButton
            size="small"
            onClick={() => handleClosePopover(filterName)}
          >
            <CloseIcon />
          </IconButton>
        </Stack>
        {children}
        <Box sx={{ mt: 2, textAlign: "right" }}>
          <Button onClick={onClear} size="small">
            Clear
          </Button>
        </Box>
      </Box>
    </Popover>
  );

  return (
    <>
      <Card
        sx={{
          mb: 3,
          p: 2,
          borderRadius: 2,
          boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
        }}
      >
        <Grid container spacing={1} alignItems="center">
          <Grid
            size={{ xs: 12, sm: "auto" }}
            sx={{
              display: "flex",
              alignItems: "center",
              mb: { xs: 2, sm: 0 },
              pr: 2,
            }}
          >
            <FilterListIcon sx={{ mr: 1 }} />
            <Typography variant="body1" fontWeight="bold">
              Filters:
            </Typography>
          </Grid>
          <Grid size={{ xs: 6, sm: "auto" }}>
            <Button
              fullWidth
              variant="outlined"
              onClick={(e) => handleOpenPopover("price", e)}
            >
              Price
            </Button>
          </Grid>
          <Grid size={{ xs: 6, sm: "auto" }}>
            <Button
              fullWidth
              variant="outlined"
              onClick={(e) => handleOpenPopover("stops", e)}
            >
              Stops
            </Button>
          </Grid>
          <Grid size={{ xs: 6, sm: "auto" }}>
            <Button
              fullWidth
              variant="outlined"
              onClick={(e) => handleOpenPopover("duration", e)}
            >
              Duration
            </Button>
          </Grid>
          <Grid size={{ xs: 6, sm: "auto" }}>
            <Button
              fullWidth
              variant="outlined"
              onClick={(e) => handleOpenPopover("airlines", e)}
            >
              Airlines
            </Button>
          </Grid>
        </Grid>

        {renderPopover(
          "price",
          "Price",
          () => handleClearFilter("priceMax"),
          <>
            <Typography id="price-slider-label" gutterBottom>
              Max price ·{" "}
              {!isNaN(filters.priceMax) ? `$${filters.priceMax}` : "..."}
            </Typography>
            <Slider
              value={
                typeof filters.priceMax === "number"
                  ? filters.priceMax
                  : maxPrice
              }
              onChange={(_, newValue) =>
                setFilters((prev) => ({
                  ...prev,
                  priceMax: newValue as number,
                }))
              }
              valueLabelDisplay="auto"
              min={minPrice}
              max={maxPrice}
              step={10}
              valueLabelFormat={(value) => `$${value}`}
              aria-labelledby="price-slider-label"
            />
          </>
        )}

        {renderPopover(
          "stops",
          "Stops",
          () => handleClearFilter("maxStops"),
          <RadioGroup
            value={filters.maxStops}
            onChange={(_, value) =>
              setFilters((prev) => ({ ...prev, maxStops: Number(value) }))
            }
          >
            <FormControlLabel
              value={-1}
              control={<Radio />}
              label="Any number of stops"
            />
            <FormControlLabel
              value={0}
              control={<Radio />}
              label="Direct flights only"
            />
            <FormControlLabel
              value={1}
              control={<Radio />}
              label="1 stop or less"
            />
            <FormControlLabel
              value={2}
              control={<Radio />}
              label="2 stops or less"
            />
          </RadioGroup>
        )}

        {renderPopover(
          "duration",
          "Duration",
          () => handleClearFilter("durationMax"),
          <>
            <Typography id="duration-slider-label" gutterBottom>
              Flight duration · {formatMinutesToHours(filters.durationMax)}
            </Typography>
            <Slider
              value={
                typeof filters.durationMax === "number"
                  ? filters.durationMax
                  : maxDuration
              }
              onChange={(_, newValue) =>
                setFilters((prev) => ({
                  ...prev,
                  durationMax: newValue as number,
                }))
              }
              valueLabelDisplay="auto"
              min={minDuration}
              max={maxDuration}
              step={15}
              valueLabelFormat={(val) =>
                `${Math.floor(val / 60)}h ${val % 60}m`
              }
              aria-labelledby="duration-slider-label"
            />
          </>
        )}

        {renderPopover(
          "airlines",
          "Airlines",
          () => handleClearFilter("airlines"),
          <Autocomplete
            multiple
            options={uniqueAirlines}
            value={filters.airlines}
            onChange={(_, newValue) =>
              setFilters((prev) => ({ ...prev, airlines: newValue }))
            }
            renderInput={(params) => (
              <TextField
                {...params}
                variant="standard"
                label="Search airline"
              />
            )}
            disableCloseOnSelect
            sx={{ width: "100%" }}
          />
        )}
      </Card>

      {itineraries.length > 0 && currentFlights.length === 0 ? (
        <Box sx={{ textAlign: "center", py: 4 }}>
          <Typography>No flights found with the selected filters.</Typography>
        </Box>
      ) : (
        <Stack spacing={2}>
          {currentFlights.map((itinerary) => (
            <FlightCard
              key={itinerary.id}
              itinerary={itinerary}
              onSelect={() => setSelectedItinerary(itinerary)}
            />
          ))}
        </Stack>
      )}

      {totalPages > 1 && (
        <Pagination
          count={totalPages}
          page={currentPage}
          onChange={handlePageChange}
          sx={{ mt: 3, display: "flex", justifyContent: "center" }}
        />
      )}

      {selectedItinerary && (
        <FlightDetailsModal
          itinerary={selectedItinerary}
          onClose={() => setSelectedItinerary(null)}
        />
      )}
    </>
  );
};
