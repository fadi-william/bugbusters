import { useAuth } from "@/contexts/use/auth";
import { NavLink } from "react-router-dom";
import { signOut } from "@/services/users";

const Header = () => {
  const { isLoggedIn, setLoggedIn } = useAuth();

  return (
    <header className="bg-white shadow-md p-4 flex justify-between items-center">
      <h1 className="text-xl font-bold">BugBusters</h1>
      <nav>
        <ul className="flex space-x-4">
          <li>
            <NavLink to="/" className={({ isActive }) => (isActive ? "font-bold" : "")}>Home</NavLink>
          </li>
          {!isLoggedIn && <li>
            <NavLink to="/login" className={({ isActive }) => (isActive || window.location.pathname === "/signup" ? "font-bold" : "")}>Login</NavLink>
          </li>}
          {isLoggedIn && <li>
            <button onClick={() => {
                signOut();
                setLoggedIn(false);
            }}>Sign out</button>
          </li>}
        </ul>
      </nav>
    </header>
  );
};

export default Header;
