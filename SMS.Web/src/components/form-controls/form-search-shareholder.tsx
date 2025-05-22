import { useField, useFormikContext } from "formik";
import { useCallback } from "react";
import { ShareholderBasicInfo } from "../../app/api";
import { ShareholderTypeaheadSearch } from "../../features";

export const FormSearchShareholder = ({
  name,
  label,
  value,
  size,
  disabled,
}: {
  name: string;
  label: string;
  value?: ShareholderBasicInfo;
  size?: "small" | "medium";
  disabled?: boolean;
}) => {
  const { setFieldValue } = useFormikContext<ShareholderBasicInfo>();
  const [field, meta] = useField(name);

  const onChange = useCallback(
    (selected: ShareholderBasicInfo) => {
      setFieldValue(field.name, selected);
    },
    [field.name, setFieldValue]
  );
  const onClear = useCallback(() => {
    setFieldValue(field.name, "");
  }, [field.name, setFieldValue]);

  return (
    <ShareholderTypeaheadSearch
      label={label}
      onSelect={onChange}
      value={value || ("" as any)}
      fullWidth
      size={size || "medium"}
      onClear={onClear}
      hasError={!!meta.error}
      helperText={meta.error}
      disabled={disabled}
    />
  );
};
