import { useField, useFormikContext } from "formik";
import { useCallback } from "react";
import { usePrevious } from "../../hooks";
import { ShareholderTypeaheadSearchMultiSelect } from "../shareholder";
import { Shareholder } from "./TransferDialog";

export const ToShareholdersFormField = ({
  name,
  value,
  size,
  exclude,
  disabled,
}: {
  name: string;
  value?: Shareholder[];
  size?: "small" | "medium";
  exclude?: number[];
  disabled?: boolean;
}) => {
  const { setFieldValue } = useFormikContext<Shareholder[]>();
  const [field, meta] = useField<Shareholder[]>(name);
  const prevValue = usePrevious(field.value);

  const onChange = useCallback(
    (selected?: Shareholder[]) => {
      const newValue = selected?.map((v) => {
        const transferredAmount =
          (prevValue || [])?.find((p) => p.id === v.id)?.transferredAmount || 0;
        return { ...v, transferredAmount };
      });
      setFieldValue(field.name, newValue);
    },
    [field.name, prevValue, setFieldValue]
  );

  return (
    <ShareholderTypeaheadSearchMultiSelect
      label={"To Shareholders"}
      onSelect={onChange}
      hasError={!disabled && !!meta.error}
      helperText={(!disabled && meta.error) || ""}
      value={value || ([] as any)}
      fullWidth
      size={size || "medium"}
      exclude={exclude}
      disabled={disabled}
    />
  );
};
