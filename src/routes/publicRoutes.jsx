import Dashboard from "@/pages/Dashboard/Dashboard";
import { Home } from "../pages/Home/Home";
import AssetDetail from "@/pages/AssetDetail/AssetDetail";
import Login from "@/pages/Login/Login";
import { Assets } from "@/pages/Assets/Assets";
import DefaultLayout from "@/layouts/DefaultLayout/DefaultLayout";

export const publicRoutes = [
  {
    path: "/",
    component: Home,
    layout: DefaultLayout,
  },
  {
    path: "/dashboard",
    component: Dashboard,
    layout: DefaultLayout,
  },
  {
    path: "/detail",
    component: AssetDetail,
    layout: DefaultLayout,
  },
  {
    path: "/assets",
    component: Assets,
    layout: DefaultLayout,
  },
  {
    path: "/login",
    component: Login,
    layout: null,
  },
];
