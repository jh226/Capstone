import { lazy } from "react";
import { Route } from "react-router-dom";

/****기본 레이아웃*****/
const FullLayout = lazy(() => import("../layouts/FullLayout.js"));

/***** 안에 페이지들 ****/
const MainPage = lazy(() => import("../layouts/views/MainPage.js"));
const EntityPage = lazy(() => import("../layouts/views/EntityPage.js"));
const MapPage = lazy(() => import("../layouts/views/MapPage.js"));
const LoginPage = lazy(() => import("../layouts/views/LoginPage.js"));
const AccountgPage = lazy(() => import("../layouts/views/AccountPage.js"));
const SettingPage = lazy(() => import("../layouts/views/SettingPage.js"));
/**** 페이지 전환 ******/
const ThemeRoutes = [
  {
    layout: <FullLayout />,
    children: [
      <Route path="/" element={<MainPage />} />,
      <Route path="/entity" element={<EntityPage />} />,
      <Route path="/map" element={<MapPage />} />,
      <Route path="/login" element={<LoginPage />} />,
      <Route path="/account" element={<AccountgPage />} />,
      <Route path="/settings" element={<SettingPage />} />,
    ],
  },
];

export default ThemeRoutes;
