import BlockIcon from "@mui/icons-material/Block";
import { Box, Button, Link, Typography } from "@mui/material";
import Dayjs from "dayjs";
import { Fragment, useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import {
  ShareholderRecordVersions,
  useGetShareholderInfoQuery,
  useGetShareholderRecordVersionsQuery,
} from "../../../app/api";
import { ApprovalStatus, ShareholderStatus } from "../../../app/api/enums";
import { ApprovalStatusChip, ChipComponent } from "../../../components";
import { usePrevious } from "../../../hooks";
import { getDetailPageUrl } from "../shareholdersGrids/useNavigateToDetailPage";
import { useCurrentVersion } from "../useCurrentVersion";
import {
  ApproveRequestButton,
  RejectRequestButton,
  SubmitForApprovalButton,
} from "../workflow";
import { BlockShareholderButton } from "./BlockShareholderButton";
import { ShareholderPhoto } from "./ShareholderPhoto";
import { useShareholderIdAndVersion } from "./useShareholderIdAndVersion";

export const ShareholderDetailHeader = () => {
  const { id, version } = useShareholderIdAndVersion();
  const [searchParams, setSearchParams] = useSearchParams();
  const { loadCurrentVersion } = useCurrentVersion();

  const { data: shareholder } = useGetShareholderInfoQuery(
    {
      id,
      version,
    },
    {
      skip: !id,
    }
  );

  const { data: versions } = useGetShareholderRecordVersionsQuery(
    {
      id,
    },
    {
      skip: !id,
    }
  );

  const prevVersions = usePrevious(versions);

  useEffect(() => {
    const shouldSwitchToDraft =
      prevVersions?.current && prevVersions.current !== versions?.current;

    shouldSwitchToDraft && loadCurrentVersion();
  }, [loadCurrentVersion, prevVersions, versions]);

  useEffect(() => {
    if (shareholder?.isCurrent && version) {
      searchParams.delete("version");
      setSearchParams(searchParams);
    }
  }, [searchParams, setSearchParams, shareholder?.isCurrent, version]);

  const otherVersions = useMemo(() => {
    if (
      !(
        versions?.approved ||
        versions?.current ||
        versions?.draft ||
        versions?.rejected ||
        versions?.submitted
      )
    )
      return [];

    const versionsKeys = Object.keys(versions) as Array<
      keyof ShareholderRecordVersions
    >;

    if (version && shareholder?.approvalStatus) {
      const latestVersion = versionsKeys
        .filter((key) => key !== "current")
        .find((key) => versions[key] && versions[key] === versions["current"]);

      const isStaleVersion = !versionsKeys.some(
        (key) => versions[key] === version
      );

      if (
        latestVersion ===
          ApprovalStatus[shareholder.approvalStatus]?.toLowerCase() ||
        isStaleVersion
      ) {
        searchParams.delete("version");
        setSearchParams(searchParams);
      }
    }

    if (versions) {
      const result: {
        version: keyof typeof versions;
        href?: string;
        color: "success" | "error" | "info";
        isLatest?: boolean;
      }[] = [];

      versionsKeys.forEach((key) => {
        const _version = versions[key] as string;

        if (
          _version &&
          !(_version === shareholder?.versionNumber || key === "current")
        ) {
          result.push({
            version: key,
            href: getDetailPageUrl({
              id,
              versionNumber: _version,
            }),
            isLatest: _version === versions?.current,
            color:
              (key === "draft" && "info") ||
              (key === "rejected" && "error") ||
              "success",
          });
        }
      });

      return result;
    }
  }, [id, searchParams, setSearchParams, shareholder, version, versions]);

  return (
    <>
      {shareholder && (
        <Box sx={{ pb: 2, display: "flex", position: "relative" }}>
          <Box sx={{ mr: 1 }}>
            <ShareholderPhoto shareholder={shareholder} />
          </Box>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              mr: 1,
              flex: 1,
            }}
          >
            <Box sx={{ display: "flex" }}>
              <Typography
                variant="h5"
                component="div"
                sx={{ mr: 1 }}
                color="primary.dark"
              >
                {shareholder?.displayName}
              </Typography>
              {!!shareholder?.isNew && (
                <ChipComponent color="success" label="New" variant="filled" />
              )}
            </Box>

            <Typography
              variant="subtitle1"
              color="primary.dark"
              component="div"
            >
              {shareholder?.amharicDisplayName}
            </Typography>
            <Typography
              variant="caption"
              color="text.secondary"
              component="div"
            >
              Registration Date:{" "}
              <Typography
                component="span"
                variant="caption"
                color="text.primary"
              >
                {!shareholder?.registrationDate
                  ? " - "
                  : Dayjs(shareholder?.registrationDate).format("MMMM D, YYYY")}
              </Typography>
            </Typography>
            <Typography
              variant="subtitle2"
              color="text.secondary"
              component="div"
            >
              Shareholder #:{" "}
              {!shareholder?.shareholderNumber
                ? " - "
                : shareholder?.shareholderNumber}
            </Typography>
            <Typography
              variant="subtitle2"
              color="text.secondary"
              component="div"
            >
              Account #:{" "}
              {!shareholder?.accountNumber ? " - " : shareholder?.accountNumber}
            </Typography>
          </Box>

          {shareholder?.id && (
            <Box sx={{ display: "flex" }}>
              {!!shareholder.shareholderStatus && (
                <Box>
                  <BlockShareholderButton
                    id={shareholder.id}
                    status={shareholder.shareholderStatus}
                  />
                </Box>
              )}
              {shareholder?.approvalStatus === ApprovalStatus.Submitted && (
                <Box>
                  <ApproveRequestButton id={shareholder?.id} />
                  <RejectRequestButton id={shareholder?.id} />
                </Box>
              )}
              {shareholder?.approvalStatus === ApprovalStatus.Draft && (
                <Box>
                  <SubmitForApprovalButton id={shareholder?.id} />
                </Box>
              )}
            </Box>
          )}
          <Box
            sx={{
              position: "absolute",
              transform: "translate(-50%, 0)",
              left: "50%",
              width: "fit-content",
              top: 25,
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                position: "relative",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 1,
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  <ApprovalStatusChip
                    status={shareholder?.approvalStatus}
                    size="medium"
                  />

                  {!!otherVersions?.length && (
                    <Box
                      sx={{
                        display: "flex",
                        gap: 0.5,
                        alignItems: "center",
                        mt: 1,
                      }}
                    >
                      <Typography variant="caption">View</Typography>
                      {otherVersions.map(
                        ({ version, color, href, isLatest }, index) => (
                          <Fragment key={href}>
                            <Button
                              href={href}
                              target="_blank"
                              component={Link}
                              sx={{ textTransform: "capitalize" }}
                              color={color}
                              variant="text"
                              size="small"
                            >
                              {`${version}${(isLatest && ` (latest)`) || ""}`}
                            </Button>
                            {index < otherVersions.length - 1 && "|"}
                          </Fragment>
                        )
                      )}
                    </Box>
                  )}
                </Box>
              </Box>
            </Box>
          </Box>

          <Box
            sx={{
              position: "absolute",
              transform: "translate(-50%, 30%)",
              left: "30%",
              width: "fit-content",
            }}
          >
            {shareholder?.shareholderStatus === ShareholderStatus.Blocked && (
              <Box
                sx={{
                  display: "flex",
                  gap: 0.5,
                  backgroundColor: "red",
                  py: 1,
                  px: 2,
                  borderRadius: 1,
                  border: "1px solid white",
                  alignItems: "center",
                  transform: "rotate(-10deg)",
                  mt: 1,
                }}
              >
                <BlockIcon sx={{ fontSize: 25, color: "white" }} />
                <Typography variant="h6" sx={{ color: "white" }}>
                  BLOCKED
                </Typography>
              </Box>
            )}
          </Box>
        </Box>
      )}
    </>
  );
};
