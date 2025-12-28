import { NavLink, useLocation } from "react-router-dom";

import NewCardIcon from "../assets/card-account-details.svg";
import StorageIcon from "../assets/archive.svg";

import "../styles/navigation.css";

function Navigation() {
  const location = useLocation();

  const isHomePage =
    location.pathname === "/" ||
    (location.pathname.match(/^\/[^/]+$/) && location.pathname !== "/storage");

  return (
    <div className="navbar">
      <NavLink to="/" className={isHomePage ? "page current" : "page"}>
        <img src={NewCardIcon} alt="New card icon" />
        <p>New Card</p>
      </NavLink>
      <NavLink to="/storage" className={({ isActive }) => (isActive ? "page current" : "page")}>
        <img src={StorageIcon} alt="Storage icon" />
        <p>Storage</p>
      </NavLink>
    </div>
  );
}

export default Navigation;
