import { useEffect, useMemo } from "react";
import {
  matchRoutes,
  Navigate,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { DividendSetup, Login, MFA, ShareholderDetail } from "../features";
import { Admin } from "../features/ShareAdmin";

import { Allocations } from "../features/Allocation";
import { BankAllocation } from "../features/BankAllocation";
import { ParValues } from "../features/ParValue";
import { ReportsDashboard } from "../features/Reports/ReportsDashboard";
import {
  ApprovalRequests,
  ApprovedShareholders,
  CertificateTab,
  DividendTab,
  DocumentsTab,
  DraftShareholders,
  PaymentTab,
  RejectedApprovalRequests,
  Shareholders,
  SubscriptionTab,
  SummaryTab,
  TransferTab,
} from "../features/shareholder";
import { SubscriptionGroup } from "../features/SubscriptionGroup";
import {
  RegisterNewUser,
  SysAdminDashboard,
  UserDetail,
  Users,
} from "../features/SysAdmin";

import { EndOfDaysForm } from "../features/EndOfDay/EndOfDaysForm";
import { useAuth, usePermission } from "../hooks";
import { ForgotPassword } from "../main/account";
import { AuthenticatedRoutes } from "./authenticated-routes";

const AppRoutes = () => {
  const navigate = useNavigate();
  const { loggedIn } = useAuth();

  const location = useLocation();
  const matches = matchRoutes([{ path: "/login" }], location);

  useEffect(() => {
    if (loggedIn && matches && matches[0].pathname === "/login") {
      navigate("/");
    }
  }, [loggedIn, navigate, matches]);

  const permissions = usePermission();

  const isSysAdmin = useMemo(() => {
    return permissions.canCreateOrUpdateUser;
  }, [permissions.canCreateOrUpdateUser]);

  const isShareHead = useMemo(() => {
    return permissions.canProcessEndOfDay;
  }, [permissions.canProcessEndOfDay]);

  return (
    <Routes>
      <Route path="login" element={<Login />} />
      <Route path="verify" element={<MFA />} />
      <Route path="forgot-password" element={<ForgotPassword />} />
      <Route element={<AuthenticatedRoutes />}>
        <Route path="/" element={<Navigate to="/shareholders" replace />} />
        <Route path="/shareholders" element={<Shareholders />}>
          <Route index element={<ApprovedShareholders />} />
          <Route path="approval-requests" element={<ApprovalRequests />} />
          <Route
            path="rejected-approval-requests"
            element={<RejectedApprovalRequests />}
          />
          <Route path="draft" element={<DraftShareholders />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
        <Route path="/shareholder-detail/:id" element={<ShareholderDetail />}>
          <Route index element={<SummaryTab />} />
          <Route path="summary" element={<SummaryTab />} />
          <Route path="subscriptions" element={<SubscriptionTab />} />
          <Route path="payments" element={<PaymentTab />} />
          <Route path="transfers" element={<TransferTab />} />
          <Route path="dividends" element={<DividendTab />} />
          <Route path="documents" element={<DocumentsTab />} />
          <Route path="certificates" element={<CertificateTab />} />
        </Route>
        <Route path="/admin/:tab?" element={<Admin />}>
          <Route index element={<BankAllocation />} />
          <Route path="par-values" element={<ParValues />} />
          <Route path="bank-allocation" element={<BankAllocation />} />
          <Route path="allocations" element={<Allocations />} />
          <Route path="subscription-groups" element={<SubscriptionGroup />} />
          <Route path="dividend-setup" element={<DividendSetup />} />
        </Route>
        {isSysAdmin && (
          <Route path="/sys-admin" element={<SysAdminDashboard />}>
            <Route index element={<Users />} />
            <Route path="users" element={<Users />}></Route>
            <Route path="users/:id/:tab?" element={<UserDetail />}></Route>
            <Route path="new-user" element={<RegisterNewUser />}></Route>
          </Route>
        )}
        <Route path="/reports" element={<ReportsDashboard />}></Route>
        {isShareHead && <Route path="/endofday" element={<EndOfDaysForm />} />}
      </Route>
    </Routes>
  );
};

export default AppRoutes;
