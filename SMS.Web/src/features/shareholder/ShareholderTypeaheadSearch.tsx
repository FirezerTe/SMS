import SearchIcon from "@mui/icons-material/Search";
import {
  Autocomplete,
  Avatar,
  Box,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import { parseInt } from "lodash-es";
import { useCallback, useState } from "react";
import { ShareholderBasicInfo, useTypeaheadSearchQuery } from "../../app/api";
import { useDebounce } from "../../hooks";
export const ShareholderTypeaheadSearch = ({
  onSelect,
  label,
  fullWidth,
  multiSelect = false,
  onMultiSelect,
  size = "small",
  exclude = [],
  disabled = false,
  hasError,
  helperText,
  onClear,
  value,
}: {
  fullWidth?: boolean;
  multiSelect?: boolean;
  label?: string;
  onSelect?: (selected: ShareholderBasicInfo) => void;
  onMultiSelect?: (selected: ShareholderBasicInfo[]) => void;
  exclude?: number[];
  size?: "small" | "medium";
  value?: ShareholderBasicInfo;
  disabled?: boolean;
  hasError?: boolean;
  helperText?: string;
  onClear?: () => void;
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedValue = useDebounce(searchTerm, 300);
  const { data, isUninitialized } = useTypeaheadSearchQuery(
    {
      name: debouncedValue,
    },
    {
      skip: !(
        debouncedValue?.trim() &&
        (parseInt(debouncedValue.trim()) > 0 ||
          debouncedValue.trim().length >= 2)
      ),
    }
  );

  const onInputChange = useCallback(
    (_: any, searchTerm: string, reason?: string) => {
      if (onClear && reason === "input" && !searchTerm) {
        onClear();
      }
      setSearchTerm(searchTerm?.trim());
    },
    [onClear]
  );

  const handleChange = useCallback(
    (event: any, value: any) => {
      !multiSelect
        ? onSelect && onSelect(value)
        : onMultiSelect && onMultiSelect(value);
    },
    [multiSelect, onMultiSelect, onSelect]
  );

  return (
    <Box
      sx={{ display: "flex", flex: 1, maxWidth: fullWidth ? "unset" : "450px" }}
    >
      <Autocomplete
        disabled={disabled}
        fullWidth
        freeSolo
        multiple={multiSelect}
        popupIcon={<SearchIcon />}
        forcePopupIcon={true}
        disableClearable
        options={((!isUninitialized && data) || []).filter(
          ({ id }) => !exclude.some((_id) => _id === id)
        )}
        filterOptions={(options) => options}
        noOptionsText="No shareholder found"
        getOptionLabel={(option) =>
          typeof option === "string" ? option : option?.displayName || ""
        }
        onInputChange={onInputChange}
        isOptionEqualToValue={(option, value) =>
          !value || option?.id === value.id
        }
        value={value}
        onChange={handleChange}
        renderInput={(params) => (
          <TextField
            {...params}
            label={label || "Search shareholder by name"}
            size={size || "small"}
            fullWidth
            variant="outlined"
            error={hasError}
            helperText={helperText}
            InputProps={{
              ...params.InputProps,
              type: "search",
            }}
          />
        )}
        sx={{
          width: "100%",
          "& .MuiAutocomplete-popupIndicator": { transform: "none" },
        }}
        renderOption={(props, option) => {
          return (
            <li {...props}>
              <Grid container alignItems="center">
                <Grid
                  item
                  sx={{
                    display: "flex",
                    alightItems: "center",
                    justifyContent: "center",
                    width: 40,
                    mr: 1,
                  }}
                >
                  <Avatar
                    alt={option?.displayName || ""}
                    src={option?.photoUrl || undefined}
                  />
                </Grid>
                <Grid
                  item
                  sx={{ width: "calc(100% - 50px)", wordWrap: "break-word" }}
                >
                  <Grid container>
                    <Grid item xs={12} sx={{ display: "flex" }}>
                      <Typography variant="body1">
                        {option?.displayName}
                      </Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <Typography variant="body1" color="text.secondary">
                        {option?.amharicDisplayName}
                      </Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        gutterBottom
                      >
                        SH# - {option?.id}
                      </Typography>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </li>
          );
        }}
      />
    </Box>
  );
};
