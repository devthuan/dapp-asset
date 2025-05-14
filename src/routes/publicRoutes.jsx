import Dashboard from "@/pages/Dashboard/Dashboard";
import { DefaultLayout } from "../layouts/DefaultLayout/DefaultLayout";
import { Home } from "../pages/Home/Home";

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
        path: "/",
        component: Home,
        layout: DefaultLayout
    },
]