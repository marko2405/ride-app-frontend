import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import { GlobalStyles, InputAdornment, TextField } from "@mui/material";
import { useEffect, useRef } from "react";
import { useMapsLibrary } from "@vis.gl/react-google-maps";

type PlaceSelection = {
  address: string;
  lat: number;
  lng: number;
};

type Props = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  onPlaceSelect: (data: PlaceSelection) => void;
  helperText?: string;
  error?: boolean;
  disabled?: boolean;
  placeholder?: string;
};

export type { PlaceSelection };

export default function LocationInput({
  label,
  value,
  onChange,
  onPlaceSelect,
  helperText,
  error = false,
  disabled = false,
  placeholder,
}: Props) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const ignoreNextInputChangeRef = useRef(false);
  const onChangeRef = useRef(onChange);
  const onPlaceSelectRef = useRef(onPlaceSelect);
  const places = useMapsLibrary("places");

  useEffect(() => {
    onChangeRef.current = onChange;
    onPlaceSelectRef.current = onPlaceSelect;
  }, [onChange, onPlaceSelect]);

  useEffect(() => {
    const googleMaps = (
      globalThis as typeof globalThis & {
        google?: {
          maps?: {
            places?: {
              Autocomplete: new (
                input: HTMLInputElement,
              options: { fields: string[] },
              ) => {
                addListener: (
                  eventName: string,
                  handler: () => void,
                ) => unknown;
                getPlace: () => {
                  formatted_address?: string;
                  name?: string;
                  geometry?: {
                    location?: {
                      lat: () => number;
                      lng: () => number;
                    };
                  };
                };
              };
            };
            event?: {
              removeListener: (listener: unknown) => void;
            };
          };
        };
      }
    ).google;

    if (!places || !inputRef.current || !googleMaps?.maps?.places) return;

    const autocomplete = new googleMaps.maps.places.Autocomplete(
      inputRef.current,
      {
        fields: ["formatted_address", "geometry", "name"],
      },
    );

    const listener = autocomplete.addListener("place_changed", () => {
      const place = autocomplete.getPlace();

      if (!place.geometry || !place.geometry.location) return;

      const address = place.formatted_address || place.name || "";
      ignoreNextInputChangeRef.current = true;
      onChangeRef.current(address);
      onPlaceSelectRef.current({
        address,
        lat: place.geometry.location.lat(),
        lng: place.geometry.location.lng(),
      });

      window.setTimeout(() => {
        ignoreNextInputChangeRef.current = false;
      }, 0);
    });

    return () => {
      if (listener && googleMaps?.maps?.event) {
        googleMaps.maps.event.removeListener(listener);
      }
    };
  }, [places]);

  return (
    <>
      <GlobalStyles
        styles={{
          ".pac-container": {
            zIndex: "1400 !important",
            marginTop: 8,
            border: "1px solid rgba(148, 163, 184, 0.2)",
            borderRadius: 14,
            boxShadow: "0 18px 44px rgba(15, 23, 42, 0.18)",
            overflow: "hidden",
            fontFamily:
              '"Segoe UI", "Inter", "Roboto", "Helvetica Neue", Arial, sans-serif',
          },
          ".pac-container::after": {
            display: "none",
          },
          ".pac-item": {
            padding: "12px 14px",
            borderTop: "1px solid rgba(148, 163, 184, 0.16)",
            cursor: "pointer",
            color: "#3a2a06",
            fontSize: 14,
          },
          ".pac-item:first-of-type": {
            borderTop: 0,
          },
          ".pac-item:hover, .pac-item-selected": {
            backgroundColor: "rgba(227, 181, 5, 0.12)",
          },
          ".pac-icon": {
            marginTop: 2,
            marginRight: 10,
          },
          ".pac-item-query": {
            color: "#111827",
            fontSize: 14,
            fontWeight: 700,
          },
          ".pac-matched": {
            color: "#b8860b",
            fontWeight: 800,
          },
        }}
      />
      <TextField
        inputRef={inputRef}
        label={label}
        value={value}
        onChange={(event) => {
          if (ignoreNextInputChangeRef.current) {
            return;
          }

          onChange(event.target.value);
        }}
        placeholder={placeholder}
        error={error}
        helperText={helperText}
        disabled={disabled}
        fullWidth
        autoComplete="off"
        variant="outlined"
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchRoundedIcon sx={{ color: "primary.main", fontSize: 20 }} />
            </InputAdornment>
          ),
        }}
        sx={{
          "& .MuiOutlinedInput-root": {
            borderRadius: 1,
            background:
              "linear-gradient(180deg, rgba(255,255,255,0.98) 0%, rgba(248,250,252,0.98) 100%)",
            boxShadow: "0 10px 24px rgba(15, 23, 42, 0.06)",
            transition: "box-shadow 0.2s ease, border-color 0.2s ease",
            "& fieldset": {
              borderColor: "rgba(15, 23, 42, 0.12)",
            },
            "&:hover": {
              boxShadow: "0 14px 28px rgba(15, 23, 42, 0.08)",
            },
            "&.Mui-focused": {
              boxShadow: "0 18px 34px rgba(37, 99, 235, 0.16)",
            },
            "&.Mui-focused fieldset": {
              borderWidth: 1,
            },
          },
          "& .MuiInputLabel-root": {
            fontWeight: 600,
          },
          "& .MuiFormHelperText-root": {
            marginLeft: 0.5,
          },
        }}
      />
    </>
  );
}
