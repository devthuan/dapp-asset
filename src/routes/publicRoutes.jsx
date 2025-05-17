import Dashboard from "@/pages/Dashboard/Dashboard";
import { DefaultLayout } from "../layouts/DefaultLayout/DefaultLayout";
import { Home } from "../pages/Home/Home";
import AssetDetail from "@/pages/AssetDetail/AssetDetail";
import Login from "@/pages/Login/Login";

export const publicRoutes = [
    {
        path: "/",
        component: Home,
        layout: DefaultLayout
    },
    {
        path: "/dashboard",
        component: Dashboard,
        layout: DefaultLayout
    },
    {
        path: "/detail",
        component: AssetDetail,
        layout: DefaultLayout
    },
    {
        path: "/login",
        component: Login,
        layout: DefaultLayout
    },
]