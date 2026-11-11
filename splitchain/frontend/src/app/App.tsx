import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { WalletProvider } from "../features/wallet/WalletContext";
import { Layout } from "../components/Layout";
import { Dashboard, CreateGroup } from "../features/groups/Groups";
import { GroupDetails } from "../features/groups/GroupDetails";
import { NewExpense } from "../features/expenses/NewExpense";
import { Landing } from "./Landing";
export function App() {
  return (
    <WalletProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Landing />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/groups/new" element={<CreateGroup />} />
            <Route path="/groups/:groupId" element={<GroupDetails />} />
            <Route
              path="/groups/:groupId/expenses/new"
              element={<NewExpense />}
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </WalletProvider>
  );
}
