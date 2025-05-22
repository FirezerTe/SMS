import { Box, Typography } from "@mui/material";
import { useField, useFormikContext } from "formik";
import { useCallback, useState } from "react";
import PhoneInput, {
  isValidPhoneNumber,
  parsePhoneNumber,
} from "react-phone-number-input";
import "react-phone-number-input/style.css";

interface Props {
  name: string;
}
export const FormPhoneNumber = ({ name }: Props) => {
  const { handleChange } = useFormikContext();
  const [field] = useField(name);
  const [countryCode, setCountryCode] = useState(
    (field.value && parsePhoneNumber(field.value)?.carrierCode) || "ET"
  );

  const onChange = useCallback(
    (value: string) => {
      handleChange(name)(value || "");
    },
    [handleChange, name]
  );

  return (
    <Box>
      <PhoneInput
        placeholder="Value"
        defaultCountry={countryCode}
        value={field.value}
        onCountryChange={setCountryCode}
        numberInputProps={{
          style: {
            fontFamily: `"Roboto", "Helvetica", "Arial", sans- serif`,
            fontWeight: 400,
            fontSize: "1rem",
            lineHeight: "1.4375em",
            letterSpacing: "0.00938em",
            padding: "0.8rem",
            borderRadius: "5px",
            borderColor: "rgba(0,0,0,0.87)",
            borderSize: 1,
          },
        }}
        style={{
          fontSize: "1.7rem",
        }}
        onChange={onChange}
      />
      {field.value && (
        <Typography sx={{ pl: "4rem" }} variant="caption">
          {field.value}{" "}
          <Typography
            sx={{ pl: "0.5rem" }}
            variant="caption"
            component="span"
            color={
              isValidPhoneNumber(field.value) ? "success.main" : "warning.main"
            }
          >{`(${
            isValidPhoneNumber(field.value) ? "Valid" : "Invalid"
          })`}</Typography>
        </Typography>
      )}
    </Box>
  );
};
