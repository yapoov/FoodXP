// import logo from "./logo.svg";
import "./App.css";
import "./output.css";
import { SetupNotification } from "./notification";
import Login from "./pages/login";
import Signup from "./pages/signup";
import {
  BrowserRouter,
  createBrowserRouter,
  Routes,
  Route,
} from "react-router-dom";
import Home from "./pages/home";

import { Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./hooks/useAuth";
import Navbar from "./components/navbar";
import ManualItemEntry from "./pages/manualEntry";
import Profile from "./pages/profile";
import Notifications from "./pages/Notifications";

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  if (!user) {
    return <Navigate to="/login" />;
  }
  return children;
};

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Signup />} />

          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Home />
                <Navbar />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
                <Navbar />
              </ProtectedRoute>
            }
          />
          <Route
            path="/manual-entry"
            element={
              <ProtectedRoute>
                <ManualItemEntry />
                <Navbar />
              </ProtectedRoute>
            }
          />
          <Route
            path="/notifications"
            element={
              <ProtectedRoute>
                <Notifications />
                <Navbar />
              </ProtectedRoute>
            }
          />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
