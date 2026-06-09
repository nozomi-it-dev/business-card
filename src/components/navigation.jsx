import { NavLink, useLocation } from "react-router-dom";
import { Contact, Archive } from "lucide-react";


function Navigation() {
  const location = useLocation();

  const isHomePage =
    location.pathname === "/" ||
    (location.pathname.match(/^\/[^/]+$/) && location.pathname !== "/storage");

  return (
    <div className="navbar">
      <NavLink to="/" className={isHomePage ? "page current" : "page"}>
        <Contact size={20} />
        <p>New Card</p>
      </NavLink>
      <NavLink to="/storage" className={({ isActive }) => (isActive ? "page current" : "page")}>
        <Archive size={20} />
        <p>Storage</p>
      </NavLink>
    </div>
  );
}

export default Navigation;
