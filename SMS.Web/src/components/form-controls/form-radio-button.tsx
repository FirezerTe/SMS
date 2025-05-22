import {
  Box,
  FormControl,
  FormControlLabel,
  FormHelperText,
  FormLabel,
  Radio,
  RadioGroup,
  RadioGroupProps,
} from "@mui/material";
import { useField, useFormikContext } from "formik";
import { SelectOption } from "./form-select";

import { useCallback } from "react";

interface Props extends RadioGroupProps {
  label: string;
  name: string;
  type?: "string" | "number" | "boolean";
  options: SelectOption[];
  size?: "small" | "medium";
  disabled?: boolean;
}
export const FormRadioButtonGroup = ({
  label,
  name,
  options,
  type,
  ...others
}: Props) => {
  const { submitCount } = useFormikContext();

  const [field, meta] = useField<boolean>(name);

  const props: RadioGroupProps = {
    ...others,
    ...field,
  };

  const handleChange = useCallback(
    (event: any) => {
      const value = event.target.value || "";
      const fieldValue = !value
        ? value
        : type === "boolean"
        ? event.target.value === "true"
        : type === "number"
        ? +value
        : value;
      field.onChange({
        target: {
          name: name,
          value: fieldValue,
        },
      });
    },
    [field, name, type]
  );

  return (
    <Box sx={{ display: "flex", alignItems: "center", height: "100%" }}>
      <FormControl
        sx={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          flexWrap: "wrap",
        }}
        disabled={others.disabled}
        error={!!((meta.touched || submitCount > 0) && meta.error)}
      >
        <FormLabel sx={{ pr: 2 }}>{label}</FormLabel>
        <RadioGroup row {...props} onChange={handleChange}>
          {(options || []).map((opt, index) => (
            <FormControlLabel
              key={index}
              value={opt.value}
              control={<Radio />}
              label={opt.label}
            />
          ))}
        </RadioGroup>
        <FormHelperText>
          {(meta.touched || submitCount > 0) && meta.error}
        </FormHelperText>
      </FormControl>
    </Box>
  );
};
