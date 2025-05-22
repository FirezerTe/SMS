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

interface Props extends CheckboxProps {
  name: string;
  label: React.ReactNode;
  orientation?: "horizontal" | "vertical";
}

export const FormCheckbox = ({ name, label, ...others }: Props) => {
  const { submitCount } = useFormikContext();

  const [field, meta, { setValue }] = useField<boolean | undefined>(name);

  const props: CheckboxProps = {
    ...others,
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.checked);
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
        <FormGroup>
          <FormControlLabel
            control={
              <Checkbox
                {...props}
                onChange={handleChange}
                checked={!!field.value}
                name={name}
              />
            }
            label={label}
          />
        </FormGroup>

        <FormHelperText>
          {(meta.touched || submitCount > 0) && meta.error}
        </FormHelperText>
      </FormControl>
    </Box>
  );
};
