import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import React from "react";
import { ShareholderType } from "../../app/api";
import { ShareholderType as enumss } from "../../app/api/enums";
import { useShareholderTypes } from "../shareholder/useShareholderTypes";

interface ShareholderTypeEnumProps {
  onChange: (value: ShareholderType["displayName"]) => void;
}

const ShareholderTypeComponent: React.FC<ShareholderTypeEnumProps> = ({
  onChange,
}) => {
  const handleChange = (event: SelectChangeEvent) => {
    const selectedValue = event.target
      .value as unknown as ShareholderType["displayName"];
    onChange(selectedValue);
  };

  return (
    <FormControl style={{ width: "200px" }}>
      <InputLabel id="shareholder-type-label">Shareholder Type</InputLabel>
      <Select
        labelId="shareholder-type-label"
        id="shareholder-type-select"
        onChange={handleChange}
      >
        {Object.keys(enumss).map((key) => {
          const value = enumss[key as keyof typeof useShareholderTypes];
          if (typeof value === "string") {
            return (
              <MenuItem key={key} value={value as any}>
                {value}
              </MenuItem>
            );
          } else {
            return null; // Skip non-string values
          }
        })}
      </Select>
    </FormControl>
  );
};

export default ShareholderTypeComponent;
