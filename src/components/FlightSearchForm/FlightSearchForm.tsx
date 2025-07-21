import React, { useState, useEffect } from "react";
import {
  Button,
  Grid,
  TextField,
  Autocomplete,
  CircularProgress,
  Paper,
  ToggleButton,
  ToggleButtonGroup,
  Box,
  Typography,
} from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider, PickersDay } from "@mui/x-date-pickers";
import type { PickersDayProps } from "@mui/x-date-pickers/PickersDay";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs, { Dayjs } from "dayjs";
import type { SearchParams, AirportOption, CalendarDay } from "../../types";
import { searchAirport, getPriceCalendar } from "../../api/skyScrapper";
import { useDebounce } from "../../hooks/useDebounce";

interface Props {
  onSearch: (params: SearchParams) => void;
  isLoading: boolean;
}

interface DayRendererProps extends PickersDayProps {
  price?: string;
}

const DayRenderer = React.forwardRef<HTMLButtonElement, DayRendererProps>(
  (props, ref) => {
    const { price, day, sx, ...other } = props;
    return (
      <PickersDay
        {...other}
        ref={ref}
        day={day}
        sx={{
          flexDirection: "column",
          height: 50,
          width: 40,
          lineHeight: 1.1,
          padding: "2px",
          fontSize: "0.875rem",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          ...sx,
        }}
      >
        <Box sx={{ fontSize: "0.875rem" }}>{day.date()}</Box>
        {price && (
          <Typography
            sx={{
              fontSize: "0.6rem",
              color: props.selected ? "inherit" : "primary.main",
              fontWeight: 600,
              lineHeight: 1,
              marginTop: "1px",
            }}
          >
            {price}
          </Typography>
        )}
      </PickersDay>
    );
  }
);

export const FlightSearchForm: React.FC<Props> = ({ onSearch, isLoading }) => {
  const [originInput, setOriginInput] = useState("");
  const [destinationInput, setDestinationInput] = useState("");
  const debouncedOrigin = useDebounce(originInput, 500);
  const debouncedDestination = useDebounce(destinationInput, 500);
  const [originOptions, setOriginOptions] = useState<readonly AirportOption[]>(
    []
  );
  const [destinationOptions, setDestinationOptions] = useState<
    readonly AirportOption[]
  >([]);
  const [selectedOrigin, setSelectedOrigin] = useState<AirportOption | null>(
    null
  );
  const [selectedDestination, setSelectedDestination] =
    useState<AirportOption | null>(null);
  const [loadingOrigin, setLoadingOrigin] = useState(false);
  const [loadingDestination, setLoadingDestination] = useState(false);
  const [date, setDate] = useState<Dayjs | null>(null);
  const [tripType, setTripType] = useState<"one-way" | "round-trip">("one-way");
  const [returnDate, setReturnDate] = useState<Dayjs | null>(null);
  const [adults, setAdults] = useState(1);
  const [calendarPrices, setCalendarPrices] = useState<
    Record<string, CalendarDay>
  >({});

  const [loadingCalendar, setLoadingCalendar] = useState(false);

  useEffect(() => {
    if (selectedOrigin && selectedDestination) {
      setLoadingCalendar(true);
      const fromDate = dayjs().format("YYYY-MM-DD");
      getPriceCalendar(
        selectedOrigin.navigation.relevantFlightParams.skyId,
        selectedDestination.navigation.relevantFlightParams.skyId,
        fromDate,
        "USD"
      )
        .then((data) => {
          if (data?.days) {
            const priceMap = data.days.reduce((acc, dayInfo) => {
              acc[dayInfo.day] = dayInfo;
              return acc;
            }, {} as Record<string, CalendarDay>);
            setCalendarPrices(priceMap);
          }
        })
        .finally(() => setLoadingCalendar(false));
    }
  }, [selectedOrigin, selectedDestination]);

  useEffect(() => {
    if (debouncedOrigin.length < 2) {
      setOriginOptions([]);
      return;
    }
    setLoadingOrigin(true);
    searchAirport(debouncedOrigin).then((results) => {
      setOriginOptions(results);
      setLoadingOrigin(false);
    });
  }, [debouncedOrigin]);

  useEffect(() => {
    if (debouncedDestination.length < 2) {
      setDestinationOptions([]);
      return;
    }
    setLoadingDestination(true);
    searchAirport(debouncedDestination).then((results) => {
      setDestinationOptions(results);
      setLoadingDestination(false);
    });
  }, [debouncedDestination]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (selectedOrigin && selectedDestination && date) {
      const searchParams: SearchParams = {
        originSkyId: selectedOrigin.navigation.relevantFlightParams.skyId,
        originEntityId: selectedOrigin.navigation.entityId,
        destinationSkyId:
          selectedDestination.navigation.relevantFlightParams.skyId,
        destinationEntityId: selectedDestination.navigation.entityId,
        date: date.format("YYYY-MM-DD"),
        adults: adults,
      };
      if (tripType === "round-trip" && returnDate) {
        searchParams.returnDate = returnDate.format("YYYY-MM-DD");
      }
      onSearch(searchParams);
    }
  };


  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Paper elevation={3} sx={{ p: 3, borderRadius: 2, width: "100%" }}>
        <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
          <ToggleButtonGroup
            value={tripType}
            exclusive
            onChange={(_, newTripType) =>
              newTripType && setTripType(newTripType)
            }
            color="primary"
          >
            <ToggleButton value="one-way">One-way</ToggleButton>
            <ToggleButton value="round-trip">Round-trip</ToggleButton>
          </ToggleButtonGroup>
        </Box>

        <form onSubmit={handleSubmit}>
          <Grid
            container
            spacing={3}
            justifyContent="center"
            alignItems="center"
          >
            <Grid size={{ xs: 12, sm: 6, md: 6 }}>
              <Autocomplete
                options={originOptions}
                getOptionLabel={(option) => option.presentation.suggestionTitle}
                value={selectedOrigin}
                onChange={(_, newValue) => setSelectedOrigin(newValue)}
                inputValue={originInput}
                onInputChange={(_, newInputValue) =>
                  setOriginInput(newInputValue)
                }
                loading={loadingOrigin}
                isOptionEqualToValue={(option, value) =>
                  option.entityId === value?.entityId
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Origin"
                    required
                    InputProps={{
                      ...params.InputProps,
                      endAdornment: (
                        <>
                          {loadingOrigin ? (
                            <CircularProgress color="inherit" size={20} />
                          ) : null}
                          {params.InputProps.endAdornment}
                        </>
                      ),
                    }}
                  />
                )}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6, md: 6 }}>
              <Autocomplete
                options={destinationOptions}
                getOptionLabel={(option) => option.presentation.suggestionTitle}
                value={selectedDestination}
                onChange={(_, newValue) => setSelectedDestination(newValue)}
                inputValue={destinationInput}
                onInputChange={(_, newInputValue) =>
                  setDestinationInput(newInputValue)
                }
                loading={loadingDestination}
                isOptionEqualToValue={(option, value) =>
                  option.entityId === value?.entityId
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Destination"
                    required
                    InputProps={{
                      ...params.InputProps,
                      endAdornment: (
                        <>
                          {loadingDestination ? (
                            <CircularProgress color="inherit" size={20} />
                          ) : null}
                          {params.InputProps.endAdornment}
                        </>
                      ),
                    }}
                  />
                )}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6, md: 6 }}>
              <DatePicker
                label="Departure date"
                value={date}
                onChange={(newDate) => setDate(newDate)}
                sx={{ width: "100%", minWidth: 360 }}
                loading={loadingCalendar}
                slots={{ day: DayRenderer }}
                slotProps={{
                  day: (ownerState) => {
                    const key = ownerState.day.format("YYYY-MM-DD");
                    const dayPrice = calendarPrices[key];
                    return {
                      ...ownerState,
                      price: dayPrice?.price
                        ? `$${Math.round(dayPrice.price)}`
                        : undefined,
                    };
                  },
                }}
              />
            </Grid>

            {tripType === "round-trip" && (
              <Grid size={{ xs: 12, sm: 6, md: 6 }}>
                <DatePicker
                  label="Return date"
                  value={returnDate}
                  onChange={(newDate) => setReturnDate(newDate)}
                  sx={{ width: "100%" }}
                  minDate={date ? date : undefined}
                  slots={{ day: DayRenderer }}
                  slotProps={{
                    day: (ownerState) => {
                      const key = ownerState.day.format("YYYY-MM-DD");
                      const dayPrice = calendarPrices[key];
                      return {
                        ...ownerState,
                        price: dayPrice?.price
                          ? `$${Math.round(dayPrice.price)}`
                          : undefined,
                      };
                    },
                  }}
                />
              </Grid>
            )}

            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <TextField
                label="Number of adults"
                type="number"
                value={adults}
                onChange={(e) => setAdults(Number(e.target.value))}
                slotProps={{
                  input: {
                    inputProps: { min: 1, max: 6 },
                  },
                }}
                fullWidth
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 12, md: 3 }}>
              <Button
                type="submit"
                variant="contained"
                fullWidth
                disabled={isLoading}
                sx={{ height: "56px" }}
              >
                {isLoading ? "Searching..." : "Search"}
              </Button>
            </Grid>
          </Grid>
        </form>

      </Paper>
    </LocalizationProvider>
  );
};
