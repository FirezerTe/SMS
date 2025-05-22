import DeleteIcon from "@mui/icons-material/Delete";
import {
  Box,
  Button,
  FormGroup,
  FormLabel,
  Grid,
  IconButton,
  InputAdornment,
  Typography,
} from "@mui/material";
import { useField, useFormikContext } from "formik";
import { debounce } from "lodash-es";
import { useCallback, useEffect, useMemo } from "react";
import { SubscriptionPremiumDto } from "../../app/api";
import { FormTextField } from "../../components";

export const SubscriptionGroupPremiumFormField = ({
  name,
  disabled,
}: {
  name: string;
  value?: SubscriptionPremiumDto;
  disabled?: boolean;
}) => {
  const { setFieldValue } = useFormikContext<SubscriptionPremiumDto>();
  const [field] = useField<SubscriptionPremiumDto>(name);

  const debouncedSort = useMemo(
    () =>
      debounce(() => {
        const ranges = field.value?.ranges
          ?.filter(
            (x) => !(x.upperBound === undefined || x.upperBound === null)
          )
          .sort((a, b) => (a.upperBound || 0) - (b.upperBound || 0));

        ranges?.push({
          upperBound: undefined,
          percentage: 0,
        });
        setFieldValue(field.name, {
          ...field.value,
          ranges,
        });
      }, 1000),
    [field.name, field.value, setFieldValue]
  );

  useEffect(() => {
    return () => {
      debouncedSort.cancel();
    };
  }, [debouncedSort]);

  const onAddRange = useCallback(() => {
    setFieldValue(field.name, {
      ...field.value,
      ranges: [
        ...(field.value?.ranges || []),
        {
          upperBound: 0,
          percentage: 0,
        },
      ],
    });
  }, [field.name, field.value, setFieldValue]);

  useEffect(() => {
    const currentOrder = field?.value?.ranges?.map((x) => x.upperBound);
    if (currentOrder?.length) {
      const isSorted = currentOrder.every((value, index, array) =>
        index === array.length - 1
          ? value === undefined || value === null
          : (value || 0) >= (array[index - 1] || 0)
      );

      if (!isSorted) {
        debouncedSort();
      }
    }
  }, [debouncedSort, field.name, field.value, setFieldValue]);

  const removeRange = useCallback(
    (index: number) => {
      setFieldValue(field.name, {
        ...field.value,
        ranges: field.value.ranges?.filter((_, i) => i != index),
      });
    },
    [field.name, field.value, setFieldValue]
  );

  return (
    <FormGroup>
      <FormLabel>
        <Typography variant="body2">
          Premium (Percent of subscription amount)
        </Typography>{" "}
      </FormLabel>
      <Box
        sx={{
          border: 1,
          borderColor: "grey.300",
          p: 2,
          mb: 2,
          mt: 1,
        }}
        id="my-input"
      >
        <Box sx={{ display: "flex", justifyContent: "end", mb: 1 }}>
          <Button onClick={onAddRange} disabled={disabled}>
            Add Range
          </Button>
        </Box>
        {!!field.value?.ranges?.length && (
          <Grid container spacing={2}>
            {field.value.ranges.map((range, index) => (
              <Grid item key={`${index}`} xs={12}>
                <Grid container spacing={2} alignItems={"center"}>
                  <Grid item xs={4}>
                    {index == 0 ? (
                      <Typography align="right"></Typography>
                    ) : (
                      <FormTextField
                        name={`${name}.ranges[${index - 1}]upperBound`}
                        type="number"
                        size="small"
                        label="Greater Than"
                        disabled
                      />
                    )}
                  </Grid>
                  <Grid item xs={4}>
                    <FormTextField
                      name={`${name}.ranges[${index}]upperBound`}
                      type="number"
                      size="small"
                      disabled={disabled}
                      label={
                        index > 0 &&
                        index === (field.value.ranges?.length || 0) - 1
                          ? "No Max"
                          : "Less Than or Equal To"
                      }
                    />
                  </Grid>
                  <Grid item xs={3}>
                    <FormTextField
                      name={`${name}.ranges[${index}]percentage`}
                      type="number"
                      size="small"
                      disabled={disabled}
                      label="Premium"
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">%</InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                  <Grid item xs={1}>
                    {index !== (field.value.ranges?.length || 0) - 1 && (
                      <IconButton
                        disabled={disabled}
                        color="warning"
                        edge="end"
                        aria-label="delete"
                        onClick={() => removeRange(index)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    )}
                  </Grid>
                </Grid>
              </Grid>
            ))}
          </Grid>
        )}
      </Box>
    </FormGroup>
  );
};
