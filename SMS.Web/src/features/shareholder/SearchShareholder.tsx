import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { ShareholderBasicInfo } from "../../app/api";
import { ShareholderTypeaheadSearch } from "./ShareholderTypeaheadSearch";

export const SearchShareholder = () => {
  const navigate = useNavigate();

  const onSelect = useCallback(
    (selected: ShareholderBasicInfo) => {
      selected?.id && navigate(`/shareholder-detail/${selected.id}`);
    },
    [navigate]
  );

  return <ShareholderTypeaheadSearch onSelect={onSelect} />;
};
