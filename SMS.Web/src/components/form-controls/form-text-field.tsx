import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import { TextField, TextFieldProps } from "@mui/material";
import InputAdornment from "@mui/material/InputAdornment";
import { MobileDatePicker } from "@mui/x-date-pickers/MobileDatePicker";
import dayjs, { Dayjs } from "dayjs";
import { useField, useFormikContext } from "formik";
interface FormTextFieldProps {
  name: string;
  alwaysShowError?: boolean;
}

export const FormTextField = ({
  name,
  alwaysShowError,
  helperText,
  ...others
}: FormTextFieldProps & TextFieldProps & { defaultValue?: Dayjs }) => {
  const { setFieldValue } = useFormikContext();
  const [field, meta] = useField(name);

  const value =
    others.type !== "date"
      ? field.value !== null && field.value !== undefined
        ? field.value
        : ""
      : (field.value && dayjs(field.value)) || null;

  const props: TextFieldProps = {
    fullWidth: true,

    variant: "outlined",
    ...others,
    ...field,
    value,
    error: !!((meta.touched || alwaysShowError) && meta.error),
    helperText: ((meta.touched || alwaysShowError) && meta.error) || helperText,
  };
  return (
    <>
      {(others.type !== "date" && (
        <TextField
          {...props}
          InputLabelProps={{
            shrink: others.type === "date" ? true : undefined,
          }}
        />
      )) || (
        <MobileDatePicker
          {...(props as any)}
          closeOnSelect
          onChange={(val) => {
            setFieldValue(field.name, val);
          }}
          slotProps={{
            actionBar: {
              actions: ["cancel", "clear", "accept"],
            },
            textField: {
              InputProps: {
                endAdornment: (
                  <InputAdornment position="end">
                    <CalendarMonthIcon />
                  </InputAdornment>
                ),
              },
              helperText: props.helperText,
              error: !!((meta.touched || alwaysShowError) && meta.error),
              size: props.size,
            },
          }}
        />
      )}
    </>
  );
};
