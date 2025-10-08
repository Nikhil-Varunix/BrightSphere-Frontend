import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

const DashboardSearch = () => {
  const routes = [
    { name: "Dashboard", path: "/" },
    { name: "Tasks Dashboard", path: "/tasks" },
    { name: "Create New Task", path: "/tasks/create" },
    { name: "Task Details", path: "/tasks/details" },
    { name: "Task Edit", path: "/tasks/edit" },
    { name: "Task List", path: "/tasks/list" },
    { name: "Live Map", path: "/location-insights/live-map" },
    { name: "Route View", path: "/location-insights/route-view" },
    { name: "Geo-Fencing", path: "/location-insights/geo-fencing" },
    { name: "Zone Performance", path: "/location-insights/zone-performance" },
    { name: "Attendance List", path: "/attendance" },
    { name: "Regularization", path: "/attendance/regularization" },
    { name: "Shift Planning", path: "/attendance/shift-planning" },
    { name: "Users", path: "/users" },
    { name: "Create User", path: "/users/create" },
    { name: "Invoices", path: "/accounts/invoices" },
    { name: "Expenses", path: "/accounts/expenses" },
    { name: "Payroll", path: "/accounts/payroll" },
    { name: "Tax & Compliance", path: "/accounts/tax-compliance" },
    { name: "Forms", path: "/forms" },
    { name: "Create Form", path: "/forms/create" },
    { name: "Form Templates", path: "/forms/templates" },
    { name: "Customers", path: "/customers" },
    { name: "Profile", path: "/organization/profile" },
    { name: "Branches", path: "/organization/branches" },
    { name: "Regions", path: "/organization/regions" },
    { name: "Policies", path: "/organization/policies" },
    { name: "Documents", path: "/organization/documents" },
  ];

  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const navigate = useNavigate();
  const inputRef = useRef(null);

  // Filter results on query change
  useEffect(() => {
    if (!query) {
      setResults([]);
      return;
    }

    const lowerQuery = query.toLowerCase();
    const matchedRoutes = routes.filter((r) =>
      r.name.toLowerCase().includes(lowerQuery)
    );

    setResults(matchedRoutes);
  }, [query]); // Removed routes from dependency

  // Ctrl+K shortcut to focus input
  useEffect(() => {
    const handler = (e) => {
      if (e.ctrlKey && e.key.toLowerCase() === "k") {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const handleResultClick = (path) => {
    navigate(path);
    setQuery("");
    setResults([]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (results[0]) handleResultClick(results[0].path);
  };

  return (
    <div className="dashboard-search position-relative">
      <form className="form-search" onSubmit={handleSubmit}>
        <i className="ph-duotone ph-magnifying-glass icon-search" />
        <input
          type="search"
          ref={inputRef}
          className="form-control"
          placeholder="Search..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button type="button" className="btn btn-search" style={{ padding: 0 }}>
          <kbd>ctrl+k</kbd>
        </button>
      </form>

      {results.length > 0 && (
        <div className="search-results position-absolute bg-white shadow rounded mt-1 w-100" style={{ zIndex: 999 }}>
          <ul className="list-group list-group-flush">
            {results.map((res, index) => (
              <li
                key={index}
                className="list-group-item cursor-pointer"
                onClick={() => handleResultClick(res.path)}
              >
                🔗 {res.name}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default DashboardSearch;
