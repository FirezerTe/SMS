import { Box, Tab, Tabs } from "@mui/material";
import { useMemo } from "react";
import {
  Link,
  useLocation,
  useParams,
  useSearchParams,
} from "react-router-dom";

interface TabProps {
  label: string;
  href: string;
}

const getTabs = (shareholderId?: string): TabProps[] =>
  !shareholderId
    ? []
    : [
        {
          label: "Summary",
          href: `/shareholder-detail/${shareholderId}/summary`,
        },
        {
          label: "Subscriptions & Payments",
          href: `/shareholder-detail/${shareholderId}/subscriptions`,
        },

        {
          label: "Dividend",
          href: `/shareholder-detail/${shareholderId}/dividends`,
        },
        {
          label: "Transfer",
          href: `/shareholder-detail/${shareholderId}/transfers`,
        },
        {
          label: "Documents",
          href: `/shareholder-detail/${shareholderId}/documents`,
        },
        {
          label: "Certificates",
          href: `/shareholder-detail/${shareholderId}/certificates`,
        },
      ];

export const ShareholderDetailTabs = () => {
  const params = useParams();
  const [searchParams] = useSearchParams();
  const location = useLocation();

  const tabs = useMemo(() => getTabs(params.id), [params.id]);
  const currentTabIndex = useMemo(() => {
    const tabIndex = tabs.findIndex((t) => t.href === location.pathname);
    return tabIndex >= 0 ? tabIndex : 0;
  }, [location.pathname, tabs]);

  const version = searchParams.get("version");

  return (
    <Box>
      <Tabs value={currentTabIndex}>
        {tabs.map(({ href, label }) => (
          <Tab
            key={label}
            component={Link}
            color="inherit"
            to={{
              pathname: href,
              search: version ? `?version=${version}` : undefined,
            }}
            label={label}
            relative="path"
          ></Tab>
        ))}
      </Tabs>
    </Box>
  );
};
