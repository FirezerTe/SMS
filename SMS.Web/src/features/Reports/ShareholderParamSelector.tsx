import {
  Box,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
} from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import { ShareholderBasicInfo } from "../../app/api";
import {
  ShareholderTypeaheadSearch,
  useCurrentShareholderInfo,
} from "../shareholder";

export const ShareholderParamSelector = ({
  onChange,
}: {
  onChange: (selected?: ShareholderBasicInfo) => void;
}) => {
  const currentShareholder = useCurrentShareholderInfo();
  const [shareholdersList, setShareholdersList] = useState<
    ShareholderBasicInfo[]
  >([]);
  const [selectedShareholder, setSelectedShareholder] =
    useState<ShareholderBasicInfo>();

  useEffect(() => {
    onChange(selectedShareholder);
  }, [onChange, selectedShareholder]);

  useEffect(() => {
    if (
      currentShareholder &&
      !shareholdersList.some((x) => x.id === currentShareholder?.id)
    ) {
      setShareholdersList([
        currentShareholder,
        ...shareholdersList.filter((x) => x.id !== currentShareholder?.id),
      ]);
      setSelectedShareholder(currentShareholder);
    }
  }, [currentShareholder, shareholdersList]);

  const onShareholderSelect = useCallback(
    (selected: ShareholderBasicInfo) => {
      if (!selected?.id) {
        return;
      }
      if (!shareholdersList?.some((x) => x.id === selected.id)) {
        setShareholdersList([...shareholdersList, selected]);
        setSelectedShareholder(selected);
      }
    },
    [shareholdersList]
  );

  return (
    <Box>
      <Box sx={{ mb: 2 }}>
        <ShareholderTypeaheadSearch onSelect={onShareholderSelect} />
      </Box>
      {!!shareholdersList?.length && (
        <FormControl
          sx={{
            my: 1,
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <FormLabel sx={{ mr: 2 }} id="demo-radio-buttons-group-label">
            Shareholder
          </FormLabel>
          <RadioGroup
            aria-labelledby="demo-radio-buttons-group-label"
            defaultValue={shareholdersList[0].id}
            value={selectedShareholder?.id}
            name="radio-buttons-group"
            onChange={(event) => {
              setSelectedShareholder(
                shareholdersList.find((x) => x.id === +event.target.value)
              );
            }}
          >
            {shareholdersList.map((sh) => (
              <FormControlLabel
                key={sh.id}
                value={sh.id}
                control={<Radio />}
                label={`${sh.displayName}${
                  (currentShareholder?.id === sh.id && " (Current)") || ""
                }`}
              />
            ))}
          </RadioGroup>
        </FormControl>
      )}
    </Box>
  );
};
