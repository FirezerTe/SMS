import { useField, useFormikContext } from "formik";
import { useCallback } from "react";
import { ShareholderBasicInfo } from "../../app/api";
import { ShareholderTypeaheadSearchMultiSelect } from "../../features";

export const FormSearchShareholderMultiSelect = ({
  name,
  label,
  value,
}: {
  name: string;
  label: string;
  value?: ShareholderBasicInfo[];
}) => {
  const { setFieldValue } = useFormikContext<ShareholderBasicInfo[]>();
  const [field, meta] = useField(name);

  const onChange = useCallback(
    (selected: ShareholderBasicInfo[]) => {
      setFieldValue(field.name, selected);
    },
    [field.name, setFieldValue]
  );

  return (
    <ShareholderTypeaheadSearchMultiSelect
      label={label}
      onSelect={onChange}
      value={value || ([] as any)}
      fullWidth
      size="medium"
      hasError={!!meta.error}
      helperText={meta.error}
    />
  );
};
