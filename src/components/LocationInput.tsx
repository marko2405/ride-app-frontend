import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import { InputAdornment, TextField } from "@mui/material";
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
  const places = useMapsLibrary("places");

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
        fields: ["formatted_address", "geometry"],
      },
    );

    const listener = autocomplete.addListener("place_changed", () => {
      const place = autocomplete.getPlace();

      if (!place.geometry || !place.geometry.location) return;

      onPlaceSelect({
        address: place.formatted_address || "",
        lat: place.geometry.location.lat(),
        lng: place.geometry.location.lng(),
      });
    });

    return () => {
      if (listener && googleMaps?.maps?.event) {
        googleMaps.maps.event.removeListener(listener);
      }
    };
  }, [places, onPlaceSelect]);

  return (
    <TextField
      inputRef={inputRef}
      label={label}
      value={value}
      onChange={(event) => onChange(event.target.value)}
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
  );
}
