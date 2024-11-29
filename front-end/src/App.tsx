import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import Events from "./pages/Events";
import { AuthProvider } from "@/contexts/authentication";
import { useAuth } from "@/contexts/use/auth";
import { PropsWithChildren } from "react";

function ProtectedRoute({ children }: PropsWithChildren) {
  const { isLoggedIn } = useAuth(); // Assuming useAuth provides isLoggedIn
  return isLoggedIn ? <Navigate to="/" /> : children;
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Events />} />
          <Route
            path="/login"
            element={
              <ProtectedRoute>
                <Login />
              </ProtectedRoute>
            }
          />
          <Route
            path="/signup"
            element={
              <ProtectedRoute>
                <SignUp />
              </ProtectedRoute>
            }
          />
          {/* Add more routes here as needed */}
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
