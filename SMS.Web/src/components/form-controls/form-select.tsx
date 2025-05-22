import { MenuItem, TextField, TextFieldProps } from "@mui/material";
import { useField, useFormikContext } from "formik";
import { SelectOption } from "../../types";

export type { SelectOption };

interface FormSelectFieldProps {
  name: string;
  options: SelectOption[];
}

export const FormSelectField = ({
  name,
  options,
  ...others
}: FormSelectFieldProps & TextFieldProps) => {
  const { handleChange } = useFormikContext();

  const [field, meta] = useField(name);

  const props: TextFieldProps = {
    fullWidth: true,
    variant: "outlined",
    ...others,
    ...field,
    value: field.value || "",
    select: true,
    onChange: handleChange(name),
    error: !!(meta.touched && meta.error),
    helperText: meta.touched && meta.error,
  };
  return (
    <>
      {(
        <TextField {...props}>
          {(options || []).map((item, index) => (
            <MenuItem
              key={index}
              value={item.value as any}
              disabled={item.isInactive}
            >
              {item.label}
            </MenuItem>
          ))}
        </TextField>
      ) || null}
    </>
  );
};
