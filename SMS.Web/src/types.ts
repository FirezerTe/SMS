export enum HttpRequestStatus {
  Loading,
  Succeeded,
  Failed,
}

export type SelectOption = {
  label: string;
  value?: string | number | boolean | undefined;
  isInactive?: boolean;
};
