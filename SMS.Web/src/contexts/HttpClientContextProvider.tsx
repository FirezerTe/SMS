import { ReactNode, useEffect, useState } from "react";
import {
  AccountClient,
  AdminClient,
  AllocationClient,
  GroupClient,
  ParValueClient,
  PaymentsClient,
  ShareholdersClient,
  SubscriptionAllocationClient,
  SubscriptionsClient,
  TransfersClient,
  UsersClient,
} from "../api-client/api-client";
import { HttpClientContext, SMSApiHttpClient } from "./HttpClientContext";

interface Props {
  children?: ReactNode;
}

export const HttpClientContextProvider = ({ children }: Props) => {
  const [client, setClient] = useState<SMSApiHttpClient>();
  useEffect(() => {
    setClient({
      Shareholders: new ShareholdersClient(),
      Allocations: new AllocationClient(),
      Subscriptions: new SubscriptionsClient(),
      account: new AccountClient(),
      user: new UsersClient(),
      Parvalues: new ParValueClient(),
      SubscriptionGroup: new GroupClient(),
      admin: new AdminClient(),
      Payments: new PaymentsClient(),
      Transfers: new TransfersClient(),
      SubscriptionAllocation: new SubscriptionAllocationClient(),
    });
  }, []);

  return (
    <HttpClientContext.Provider value={client}>
      {children}
    </HttpClientContext.Provider>
  );
};
