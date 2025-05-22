import SearchIcon from "@mui/icons-material/Search";
import {
  Autocomplete,
  Avatar,
  Box,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import { useCallback, useState } from "react";
import { ShareholderBasicInfo, useTypeaheadSearchQuery } from "../../app/api";
import { useDebounce } from "../../hooks";
export const ShareholderTypeaheadSearchMultiSelect = ({
  onSelect,
  label,
  fullWidth,
  exclude = [],
  value,
  size = "small",
  disabled = false,
  hasError = false,
  helperText,
}: {
  fullWidth?: boolean;
  size?: "small" | "medium";
  label?: string;
  onSelect?: (selected: ShareholderBasicInfo[]) => void;
  exclude?: number[];
  value?: ShareholderBasicInfo[];
  disabled?: boolean;
  hasError?: boolean;
  helperText?: string;
}) => {
  const [val, setVal] = useState(value);
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

  const onInputChange = useCallback((_: any, searchTerm: string) => {
    setSearchTerm(searchTerm?.trim());
  }, []);

  const handleChange = useCallback(
    (event: any, value: any) => {
      onSelect && onSelect(value);
      setVal(value);
    },
    [onSelect]
  );

  const options = ((!isUninitialized && data) || []).filter(
    ({ id }) =>
      ![...exclude, ...(val || []).map(({ id }) => id)].some(
        (_id) => _id === id
      )
  );

  return (
    <Box
      sx={{ display: "flex", flex: 1, maxWidth: fullWidth ? "unset" : "450px" }}
    >
      <Autocomplete
        value={val}
        fullWidth
        disabled={disabled}
        freeSolo
        multiple={true}
        popupIcon={<SearchIcon />}
        forcePopupIcon={true}
        disableClearable
        // options={(!isUninitialized && data) || []}
        options={options}
        filterOptions={(options) => options}
        noOptionsText="No shareholder found"
        getOptionLabel={(option) =>
          typeof option === "string" ? option : option.displayName || ""
        }
        onInputChange={onInputChange}
        isOptionEqualToValue={(option, value) =>
          !value || option.id === value.id
        }
        onChange={handleChange}
        renderInput={(params) => (
          <TextField
            {...params}
            label={label || "Search shareholder by name"}
            size={size || "small"}
            error={hasError}
            helperText={helperText}
            fullWidth
            variant="outlined"
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
                    alt={option.displayName || ""}
                    src={option.photoUrl || undefined}
                  />
                </Grid>
                <Grid
                  item
                  sx={{ width: "calc(100% - 50px)", wordWrap: "break-word" }}
                >
                  <Grid container>
                    <Grid item xs={12} sx={{ display: "flex" }}>
                      <Typography variant="body1">
                        {option.displayName}
                      </Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <Typography variant="body1" color="text.secondary">
                        {option.amharicDisplayName}
                      </Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        gutterBottom
                      >
                        SH# - {option.id}
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
