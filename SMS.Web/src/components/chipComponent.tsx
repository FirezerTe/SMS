import { Chip, SxProps } from "@mui/material";

export interface ChipComponentProps {
  size?: "small" | "medium";
  sx?: SxProps;
  icon?:
    | React.ReactElement<any, string | React.JSXElementConstructor<any>>
    | undefined;
  variant?: "filled" | "outlined";
  label?: string;
  color:
    | "default"
    | "primary"
    | "secondary"
    | "error"
    | "info"
    | "success"
    | "warning";
}
export const ChipComponent = ({
  size = "small",
  variant = "outlined",
  icon,
  label,
  color = "info",
  sx,
}: ChipComponentProps) => {
  return (
    <Chip
      sx={{ px: 1, mx: 0.5, ...sx }}
      size={size}
      variant={variant}
      icon={icon}
      label={label}
      color={color}
    />
  );
};
