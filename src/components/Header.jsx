import { Link, useLocation } from "react-router-dom";
import { useRef, useEffect, useState } from "react";
import DashboardSearch from "./forms/DashboardSearch";
import { useAuth } from "../context/authContext";
import Preloader from "../components/Preloader";

const Header = () => {
  const [loading, setLoading] = useState(false);
  const menuRefs = useRef([]);
  const lastActiveIndex = useRef(null);
  const location = useLocation();
  const { logout, user } = useAuth();

  const [activeSubmenuPath, setActiveSubmenuPath] = useState("");
  const [IsSideBarActive, setIsSideBarActive] = useState(true);
  const [IsMobileSideBarActive, setIsMobileSideBarActive] = useState(false);


  useEffect(() => {
    
    const savedIndex = localStorage.getItem("activeMenuIndex");
    const savedSubmenu = localStorage.getItem("activeSubmenuPath");

    if (savedIndex !== null) {
      const index = parseInt(savedIndex, 10);
      menuRefs.current.forEach((el) => el?.classList.remove("active"));
      menuRefs.current[index]?.classList.add("active");
      lastActiveIndex.current = index;
    }

    if (savedSubmenu) {
      setActiveSubmenuPath(savedSubmenu);
    }

     const timer = setTimeout(() => setLoading(false), 5000); // show 5 sec
    return () => clearTimeout(timer);
  }, []);

  // Update submenu active state when location changes
  useEffect(() => {
    setActiveSubmenuPath(location.pathname);
    localStorage.setItem("activeSubmenuPath", location.pathname);
  }, [location.pathname]);

  const handleMenuClick = (index) => {
    if (lastActiveIndex.current === index) {
      menuRefs.current.forEach((el) => el?.classList.remove("active"));
      lastActiveIndex.current = null;
      localStorage.removeItem("activeMenuIndex");
    } else {
      menuRefs.current.forEach((el) => el?.classList.remove("active"));
      menuRefs.current[index]?.classList.add("active");
      lastActiveIndex.current = index;
      localStorage.setItem("activeMenuIndex", index);
    }
  };

  const isSubmenuActive = (path) => activeSubmenuPath === path;

  const HandleSideBar = () => {
    setIsSideBarActive(!IsSideBarActive)
  }
  const HandleMobileSideBar = () => {
    setIsMobileSideBarActive(!IsMobileSideBarActive)
  }
  useEffect(() => {
    // This runs every time the route/path changes
    setIsMobileSideBarActive(false)
  }, [location.pathname]);


  

  return (
    <>

    {loading && <Preloader />} {/* 👈 show loader when loading */}
     <div style={{ display: loading ? "none" : "block" }}>
      <nav className={`pc-sidebar ${!IsSideBarActive && "pc-sidebar-hide"} ${IsMobileSideBarActive && "mob-sidebar-active"}`}>
        <div className="navbar-wrapper">
          <div className="m-header">
            <Link to="/" className="b-brand text-primary">
              <img
                src="/assets/images/logo.png"
                alt="logo image"
                className="logo-lg w-75"
              />
            </Link>
          </div>
          <div className="navbar-content">
            <ul className="pc-navbar overflow-y-auto h-100">
              {/* Dashboard */}
              <li
                className="pc-item pc-hasmenu"
                ref={(el) => (menuRefs.current[0] = el)}
                onClick={() => handleMenuClick(0)}
              >
                <Link to="/" className={`pc-link ${isSubmenuActive("/") ? "active" : ""}`}>
                  <span className="pc-micon"><i className="ph-duotone ph-gauge" /></span>
                  <span className="pc-mtext" data-i18n="Dashboard">Dashboard</span>
                </Link>
              </li>

              {/* Users */}
              <li
                className="pc-item pc-hasmenu"
                ref={(el) => (menuRefs.current[3] = el)}
                onClick={() => handleMenuClick(3)}
              >
                <Link to="/users" className={`pc-link ${isSubmenuActive("/users") ? "active" : ""}`}>
                  <span className="pc-micon"><i className="ph-duotone ph-users" /></span>
                  <span className="pc-mtext">Users</span>
                </Link>
                {/* <ul className="pc-submenu" onClick={(e) => e.stopPropagation()}>
                  {[
                    { path: "/users", label: "Users" },
                    // { path: "/users/create", label: "Create User" },
                    // { path: "/users/approval-workflow", label: "Approval Workflow" }
                  ].map((item) => (
                    <li key={item.path} className={`pc-item ${isSubmenuActive(item.path) ? "active" : ""}`}>
                      <Link className="pc-link" to={item.path}>{item.label}</Link>
                    </li>
                  ))}
                </ul> */}
              </li>
                {/* Journals */}
              <li
                className="pc-item pc-hasmenu"
                ref={(el) => (menuRefs.current[5] = el)}
                onClick={() => handleMenuClick(5)}
              >
                <Link to="/journals" className={`pc-link ${isSubmenuActive("/journals") ? "active" : ""}`}>
                   <span className="pc-micon"><i className="ph-duotone ph-book" /></span>
                  <span className="pc-mtext">Journals</span>
                </Link>
                
              </li>


              {/* Articles */}
              <li
                className="pc-item pc-hasmenu"
                ref={(el) => (menuRefs.current[4] = el)}
                onClick={() => handleMenuClick(4)}
              >
                <Link to="/articles" className={`pc-link ${isSubmenuActive("/articles") ? "active" : ""}`}>
                   <span className="pc-micon"><i className="ph-duotone ph-file-text" /></span>
                  <span className="pc-mtext" data-i18n="Articles">Articles</span>
                </Link>
              </li>

              <li
                className="pc-item pc-hasmenu"
                ref={(el) => (menuRefs.current[1] = el)}
                onClick={() => handleMenuClick(1)}
              >
                <a href="#!" className="pc-link">
                  <span className="pc-micon"><i className="ph-duotone ph-shield-check" /></span>
                  <span className="pc-mtext">Admin</span>
                  <span className="pc-arrow"><i className="ti ti-chevron-right" /></span>
                </a>
                <ul className="pc-submenu" onClick={(e) => e.stopPropagation()}>
                  {[
                    { path: "/admin/editors", label: "Editors" },
                    { path: "/admin/volume", label: "Volumes" },
                    { path: "/admin/issues", label: "Issues" },
                    // { path: "/admin/designations", label: "Designation" },
                    // { path: "/admin/permissions", label: "Permissions" },
                    
                  ].map((item) => (
                    <li key={item.path} className={`pc-item ${isSubmenuActive(item.path) ? "active" : ""}`}>
                      <Link className="pc-link" to={item.path}>{item.label}</Link>
                    </li>
                  ))}
                </ul>
              </li>

            </ul>
          </div>
          <div className="card pc-user-card">
            <div className="card-body">
              <div className="d-flex align-items-center">
                <div className="flex-shrink-0">
                  <img
                    src="../assets/images/user/avatar-1.jpg"
                    alt="user-image"
                    className="user-avtar wid-45 rounded-circle"
                  />
                </div>
                <div className="flex-grow-1 ms-3">
                  <div className="dropdown">
                    <a
                      href="#"
                      className="arrow-none dropdown-toggle"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                      data-bs-offset="0,20"
                    >
                      <div className="d-flex align-items-center">
                        <div className="flex-grow-1 me-2">
                          <h6 className="mb-0">{user?.firstName || "Guest"}</h6>
                          <small>{user?.role || "No role assigned"}</small>
                        </div>
                        <div className="flex-shrink-0">
                          <div className="btn btn-icon btn-link-secondary avtar">
                            <i className="ph-duotone ph-windows-logo" />
                          </div>
                        </div>
                      </div>
                    </a>
                    <div className="dropdown-menu">
                      <ul>
                        <li>
                          <a href="#" onClick={logout} className="pc-user-links">
                            <i className="ph-duotone ph-power" />
                            <span>Logout</span>
                          </a>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {IsMobileSideBarActive && <div onClick={HandleMobileSideBar} className="pc-menu-overlay"></div>}
      </nav>
      <header className="pc-header">
        <div className="header-wrapper">
          {" "}
          {/* [Mobile Media Block] start */}
          <div className="me-auto pc-mob-drp">
            <ul className="list-unstyled">
              {/* ======= Menu collapse Icon ===== */}
              <li className="pc-h-item pc-sidebar-collapse">
                <a href="#" onClick={HandleSideBar} className="pc-head-link ms-0" id="sidebar-hide">
                  <i className="ti ti-menu-2" />
                </a>
              </li>
              <li className="pc-h-item pc-sidebar-popup" onClick={HandleMobileSideBar}>
                <a href="#" className="pc-head-link ms-0" id="mobile-collapse">
                  <i className="ti ti-menu-2" />
                </a>
              </li>

              <li className="pc-h-item d-none d-md-inline-flex">
                <DashboardSearch />
              </li>
            </ul>
          </div>
          {/* [Mobile Media Block end] */}
          <div className="ms-auto">
            <ul className="list-unstyled">
              
              <li className="dropdown pc-h-item d-none d-md-inline-flex">
                <a
                  className="pc-head-link dropdown-toggle arrow-none me-0"
                  data-bs-toggle="dropdown"
                  href="#"
                  role="button"
                  aria-haspopup="false"
                  aria-expanded="false"
                >
                  <i className="ph-duotone ph-sun-dim" />
                </a>
                <div className="dropdown-menu dropdown-menu-end pc-h-dropdown">
                  <a
                    href="#!"
                    className="dropdown-item"
                    onClick={() => layout_change('dark')}
                  >
                    <i className="ph-duotone ph-moon" />
                    <span>Dark</span>
                  </a>
                  <a
                    href="#!"
                    className="dropdown-item"
                    onClick={() => layout_change('light')}
                  >
                    <i className="ph-duotone ph-sun-dim" />
                    <span>Light</span>
                  </a>

                </div>
              </li>
              

              <li className="dropdown pc-h-item header-user-profile">
                <a
                  className="pc-head-link dropdown-toggle arrow-none me-0"
                  data-bs-toggle="dropdown"
                  href="#"
                  role="button"
                  aria-haspopup="false"
                  data-bs-auto-close="outside"
                  aria-expanded="false"
                >
                  <img
                    src="/assets/images/user/avatar-1.jpg"
                    alt="user-image"
                    className="user-avtar"
                  />
                </a>
                <div className="dropdown-menu dropdown-menu-end pc-h-dropdown">
                  <a href="#!" className="dropdown-item" onClick={logout}>
                    <i className="ph-duotone ph-power" />
                    <span>Logout</span>
                  </a>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </header>
      </div>
    </>
  );
};

export default Header;