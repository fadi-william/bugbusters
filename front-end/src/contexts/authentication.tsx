import { createContext, useEffect, useState } from "react";

export interface AuthContextType {
  isLoggedIn: boolean;
  setLoggedIn: (isLogged: boolean) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: React.PropsWithChildren) => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token); // Set logged in state based on token presence
  }, []);

  const setLoggedIn = (isLogged: boolean) => {
    setIsLoggedIn(isLogged);
  };

  const AuthProvider = AuthContext.Provider;

  return (
    <AuthProvider value={{ isLoggedIn, setLoggedIn }}>{children}</AuthProvider>
  );
};

export default AuthContext;
