import { Box, styled } from "@mui/material";
import { useNavigate } from "react-router-dom";
import logo from "../images/logo.png";

export const Logo = ({ height }: { height?: number }) => {
  const navigate = useNavigate();

  return (
    <LogoContainer
      component="img"
      height={height !== undefined ? height : "unset"}
      src={logo}
      alt="Berhan Bank logo."
      onClick={() => {
        navigate("/");
      }}
    />
  );
};

const LogoContainer = styled(Box<"img">)({
  maxWidth: "90%",
  cursor: "pointer",
});
