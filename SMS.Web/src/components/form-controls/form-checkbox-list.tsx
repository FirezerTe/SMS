import {
  Box,
  Checkbox,
  CheckboxProps,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormHelperText,
} from "@mui/material";
import { useField, useFormikContext } from "formik";
import { SelectOption } from "../../types";

interface Props extends CheckboxProps {
  name: string;
  options: SelectOption[];
  orientation?: "horizontal" | "vertical";
}
export const FormCheckboxList = ({
  name,
  orientation = "vertical",
  options,
  ...others
}: Props) => {
  const { submitCount } = useFormikContext();

  const [field, meta, { setValue }] = useField<Array<string | number>>(name);

  const props: CheckboxProps = {
    ...others,
  };

  const handleChange =
    (option: any) => (event: React.ChangeEvent<HTMLInputElement>) => {
      event.target.checked
        ? setValue([...field.value, option.value])
        : setValue([...field.value].filter((x) => x !== option.value));
    };

  return (
    <Box sx={{ display: "flex", alignItems: "center" }}>
      <FormControl
        sx={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          flexWrap: "wrap",
        }}
        error={!!((meta.touched || submitCount > 0) && meta.error)}
      >
        <FormGroup
          sx={{
            ...(orientation === "horizontal"
              ? { display: "flex", flexDirection: "row", gap: 2 }
              : {}),
          }}
        >
          {(options || []).map((opt, index) => (
            <FormControlLabel
              key={index}
              control={
                <Checkbox
                  {...props}
                  onChange={handleChange(opt)}
                  checked={field.value?.some((x) => x === opt.value)}
                  name={name}
                />
              }
              label={opt.label}
            />
          ))}
        </FormGroup>

        <FormHelperText>
          {(meta.touched || submitCount > 0) && meta.error}
        </FormHelperText>
      </FormControl>
    </Box>
  );
};
