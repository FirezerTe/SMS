import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import PersonIcon from "@mui/icons-material/Person";
import { ReactElement, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  ApplicationRole,
  useAddUserRoleMutation,
  useGetRolesQuery,
  useGetUserDetailQuery,
  useRemoveUserRoleMutation,
} from "../../../app/api";
import { UserProfile } from "./UserProfile";

type TabKey = "profile" | "permissions";

const tabs: { key: TabKey; label: string; icon?: ReactElement<any> }[] = [
  {
    key: "profile",
    label: "Profile",
    icon: <PersonIcon fontSize="small" />,
  },
  {
    key: "permissions",
    label: "Roles & Permissions",
    icon: <ManageAccountsIcon fontSize="small" />,
  },
];

export const UserDetail = () => {
  const navigate = useNavigate();
  const params = useParams();
  const { data: userDetail } = useGetUserDetailQuery(
    {
      id: params.id,
    },
    { skip: !params.id }
  );

  const { data: applicationRoles } = useGetRolesQuery();

  const [selectedTabIndex, setSelectedTabIndex] = useState(0);
  const [addUserRole] = useAddUserRoleMutation();
  const [removeUserRole] = useRemoveUserRoleMutation();

  useEffect(() => {
    const index = tabs.findIndex((x) => x.key === params.tab);

    if (index >= 0) {
      if (selectedTabIndex !== index) {
        navigate(`/sys-admin/users/${params.id}/${tabs[index].key}`);
        setSelectedTabIndex(index);
      }
    } else {
      navigate(`/sys-admin/users/${params.id}/${tabs[0].key}`);
      setSelectedTabIndex(0);
    }
  }, [navigate, params.id, params.tab, selectedTabIndex]);

  const handleRoleChange = async (role: ApplicationRole, selected: boolean) => {
    if (!role!.name) return;

    const payload = {
      id: params.id,
      role: role.name,
    };
    (selected ? addUserRole(payload) : removeUserRole(payload))
      .unwrap()
      .then()
      .catch(() => {});
  };

  return (
    <>
      {userDetail && (
        <UserProfile
          userDetail={userDetail}
          applicationRoles={applicationRoles}
          onRoleChange={handleRoleChange}
        />
      )}
    </>
  );
};
