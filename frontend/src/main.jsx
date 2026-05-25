import React from "react";
import ReactDOM from "react-dom/client";
import { Navigate, RouterProvider, createBrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import { ThemeProvider } from "./context/ThemeContext.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Analytics from "./pages/Analytics.jsx";
import DailyReports from "./pages/DailyReports.jsx";
import FloorManagement from "./pages/FloorManagement.jsx";
import Login from "./pages/Login.jsx";
import Notifications from "./pages/Notifications.jsx";
import RoomStatus from "./pages/RoomStatus.jsx";
import SectionManagement from "./pages/SectionManagement.jsx";
import SectionDetail from "./pages/SectionDetail.jsx";
import WorkerManagement from "./pages/WorkerManagement.jsx";
import "./index.css";

const router = createBrowserRouter([
  { path: "/login", element: <Login /> },
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <Navigate to="/dashboard" replace /> },
      { path: "dashboard", element: <Dashboard /> },
      { path: "floors", element: <FloorManagement /> },
      { path: "sections", element: <SectionManagement /> },
      { path: "sections/:sectionCode", element: <SectionDetail /> },
      { path: "rooms", element: <RoomStatus /> },
      { path: "workers", element: <WorkerManagement /> },
      { path: "reports", element: <DailyReports /> },
      { path: "analytics", element: <Analytics /> },
      { path: "notifications", element: <Notifications /> }
    ]
  }
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ThemeProvider>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </ThemeProvider>
  </React.StrictMode>
);
