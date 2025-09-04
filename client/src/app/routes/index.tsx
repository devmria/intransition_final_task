import { Layout } from "components/templates/Layout";
import { LoginPage } from "components/pages/LoginPage";
import { RegisterPage } from "components/pages/RegisterPage";
import { MainPage } from "components/pages/MainPage";
import { UserProfilePage } from "components/pages/UserProfilePage";
import { Route, Routes } from "react-router-dom";
import { PrivateRoute } from "./PrivateRoute";
import { InventoriesListPage } from "components/pages/InventoriesListPage";
import { InventoryDetailsPage } from "components/pages/InventoryDetailsPage/InventoryDetailsPage";
import { AdminPage } from "~components/pages/AdminPage/AdminPage";
import { useAuth } from "~context/AuthContext";

export const AuthRoute = () => {
  const { loading } = useAuth();

  return (
    <Routes>
      <Route path="/auth/login" element={<LoginPage />} />
      <Route path="/auth/register" element={<RegisterPage />} />

      <Route element={<Layout loading={loading} />}>
        <Route element={<PrivateRoute />}>
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/user/:userId" element={<UserProfilePage />} />
        </Route>

        <Route path="/" element={<MainPage />} />
        <Route path="/inventories" element={<InventoriesListPage />} />
        <Route path="/inventory/:inventoryId" element={<InventoryDetailsPage />} />
      </Route>
    </Routes>
  );
};