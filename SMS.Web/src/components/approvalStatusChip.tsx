import ClearIcon from "@mui/icons-material/Clear";
import DoneIcon from "@mui/icons-material/Done";
import DoubleArrowIcon from "@mui/icons-material/DoubleArrow";
import EditIcon from "@mui/icons-material/Edit";
import { ApprovalStatus } from "../app/api/enums";
import { ChipComponent, ChipComponentProps } from "./chipComponent";
const ApprovalStatusMap: {
  [key: number]: ChipComponentProps;
} = {
  [ApprovalStatus.Draft]: {
    label: "Draft",
    icon: <EditIcon />,
    color: "info",
    variant: "filled",
  },
  [ApprovalStatus.Submitted]: {
    label: "Submitted for Approval",
    icon: <DoubleArrowIcon />,
    color: "success",
    variant: "filled",
  },
  [ApprovalStatus.Approved]: {
    label: "Approved",
    icon: <DoneIcon />,
    color: "success",
    variant: "filled",
  },
  [ApprovalStatus.Rejected]: {
    label: "Rejected",
    icon: <ClearIcon />,
    color: "error",
    variant: "filled",
  },
};
export const ApprovalStatusChip = ({
  status,
  size = "small",
}: {
  status?: ApprovalStatus;
  size?: "small" | "medium";
}) => {
  const config = status && ApprovalStatusMap[status];

  return config ? (
    <ChipComponent
      size={size}
      variant={config.variant}
      icon={config.icon}
      label={config.label}
      color={config.color}
    />
  ) : null;
};
