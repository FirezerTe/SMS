import { useEffect, useState } from "react";
import { useCurrentUserInfoQuery, UserDto } from "../app/api";

export const useAuth = () => {
  const [state, setState] = useState<{
    loggedIn?: boolean;
    user?: UserDto;
    isLoading?: boolean;
  }>({ loggedIn: false, isLoading: true });
  const { data, isLoading, isError, isFetching } = useCurrentUserInfoQuery();

  useEffect(() => {
    if (!(isLoading || isFetching) && !isError) {
      setState({
        loggedIn: true,
        user: data,
        isLoading: false,
      });
    }
    if (isError) {
      setState({ loggedIn: false, user: undefined, isLoading: false });
    }
  }, [data, isError, isFetching, isLoading]);

  return state;
};
