import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import { isAuthenticated } from "./utils/auth";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={<Navigate to="/signin" replace />}
        />

        <Route
          path="/signin"
          element={isAuthenticated() ? <Navigate to="/dashboard" replace /> : <SignIn />}
        />

        <Route
          path="/signup"
          element={isAuthenticated() ? <Navigate to="/dashboard" replace /> : <SignUp />}
        />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="*"
          element={<Navigate to="/signin" replace />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;