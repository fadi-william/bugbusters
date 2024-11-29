import { ReactNode } from "react";
import Header from "./Header";

interface LayoutProps {
  children: ReactNode; // Accept children as props
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <>
      <Header />
      <main className="min-h-[calc(100vh-64px)]">{children}</main> {/* Render children here */}
    </>
  );
};

export default Layout;
