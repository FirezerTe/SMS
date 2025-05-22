import { useMemo } from "react";
import { useGetRolesQuery } from "../../app/api";
import { SelectOption } from "../../types";

export const useRoles = () => {
  const { data: roles } = useGetRolesQuery();

  const rolesLookups = useMemo(
    () =>
      (roles || []).map<SelectOption>(({ name, description }) => ({
        label: description!,
        value: name!,
      })),
    [roles]
  );
  return {
    roles,
    rolesLookups,
  };
};
