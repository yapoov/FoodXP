import "./App.css";
import "./output.css";
import Login from "./pages/login";
import Signup from "./pages/signup";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/home";

import { Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./hooks/useAuth";
import Navbar from "./components/navbar";
import ManualItemEntry from "./pages/manualEntry";
import Profile from "./pages/profile";
import Notifications from "./pages/Notifications";
import Camera from "./pages/camera";
import { ToastContainer } from "react-toastify";

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  if (!user) {
    return <Navigate to="/login" />;
  }
  return children;
};

const MobileWidth = ({ children }) => {
  return (
    <div className="  lg:justify-center lg:flex ">
      <div className="sm:w-full xl:max-w-xl">{children}</div>
    </div>
  );
};

function App() {
  return (
    <BrowserRouter>
      <ToastContainer
        position="bottom-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Signup />} />

          <Route
            path="/"
            element={
              <ProtectedRoute>
                <MobileWidth>
                  <Home />
                  <Navbar />
                </MobileWidth>
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <MobileWidth>
                  <Profile />
                  <Navbar />
                </MobileWidth>
              </ProtectedRoute>
            }
          />
          <Route
            path="/manual-entry"
            element={
              <ProtectedRoute>
                <MobileWidth>
                  <ManualItemEntry />
                  <Navbar />
                </MobileWidth>
              </ProtectedRoute>
            }
          />
          <Route
            path="/notifications"
            element={
              <ProtectedRoute>
                <MobileWidth>
                  <Notifications />
                  <Navbar />
                </MobileWidth>
              </ProtectedRoute>
            }
          />
          <Route
            path="/camera-capture"
            element={
              <MobileWidth>
                <Camera />
              </MobileWidth>
            }
          />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
