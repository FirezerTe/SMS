import React from "react";
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

export interface SMSApiHttpClient {
  Shareholders?: ShareholdersClient;
  Allocations?: AllocationClient;
  Subscriptions?: SubscriptionsClient;
  account?: AccountClient;
  admin?: AdminClient;
  user?: UsersClient;
  SubscriptionGroup?: GroupClient;
  Payments?: PaymentsClient;
  Parvalues?: ParValueClient;
  Transfers?: TransfersClient;
  SubscriptionAllocation?: SubscriptionAllocationClient;
}

export const HttpClientContext = React.createContext<
  SMSApiHttpClient | undefined
>(undefined);
