import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import React from "react";

enum ShareholderTypeEnum {
  New = 4,
  Exisitng = 5,
}

interface ShareholderTypeEnumProps {
  onChange: (value: ShareholderTypeEnum) => void;
}

const ShareholderTypeEnumComponent: React.FC<ShareholderTypeEnumProps> = ({
  onChange,
}) => {
  const handleChange = (event: SelectChangeEvent) => {
    const selectedValue = event.target.value as unknown as ShareholderTypeEnum;
    onChange(selectedValue);
  };

  return (
    <FormControl style={{ width: "200px" }}>
      <InputLabel id="shareholder-type-label">Shareholder Status</InputLabel>
      <Select
        labelId="shareholder-type-label"
        id="shareholder-type-select"
        onChange={handleChange}
      >
        {Object.keys(ShareholderTypeEnum)
          .filter((key) => isNaN(Number(key))) // Filter out numeric keys
          .map((key) => (
            <MenuItem
              key={key}
              value={
                ShareholderTypeEnum[key as keyof typeof ShareholderTypeEnum]
              }
            >
              {key}
            </MenuItem>
          ))}
      </Select>
    </FormControl>
  );
};

export default ShareholderTypeEnumComponent;
