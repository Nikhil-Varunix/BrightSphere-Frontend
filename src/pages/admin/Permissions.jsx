import BreadCrumb from "../../components/BreadCrumb";
import toast from "react-hot-toast";
import { useState, useMemo } from "react";

// Default modules and permissions
const defaultModules = [
  "Root",
  "Journals",
  "Articles",
  "Admin",
];

const defaultPermissions = ["Add", "Edit", "Delete", "View"];

const presetRoles = {
  Admin: { access: "all" },
  Manager: { access: ["Add", "View"] },
  Editor: { access: ["Edit", "View"] },
  Viewer: { access: ["View"] },
};

const RolesPermissions = () => {
  const [roles, setRoles] = useState(
    defaultModules.map((module, i) => ({
      id: i + 1,
      name: module,
      permissions: defaultPermissions.map((p) => ({ name: p, active: false })),
    }))
  );

  const [selectedRole, setSelectedRole] = useState("");
  const [newRoleName, setNewRoleName] = useState("");
  const [selectAll, setSelectAll] = useState(false);
  const [sortConfig, setSortConfig] = useState({ key: "", direction: "" });

  // 🔹 Add new role
  const handleAddRole = () => {
    if (!newRoleName.trim()) {
      toast.error("Please enter role name");
      return;
    }

    const newRole = {
      id: Date.now(),
      name: newRoleName.trim(),
      permissions: defaultPermissions.map((p) => ({ name: p, active: false })),
      createdAt: new Date().toISOString().slice(0, 10),
      updatedAt: new Date().toISOString().slice(0, 10),
    };

    setRoles((prev) => [...prev, newRole]);
    setNewRoleName("");
    toast.success("Role added successfully");
  };

  // 🔹 Toggle permission with dependency logic
  const handleTogglePermission = (roleId, permName) => {
    const updatedRoles = roles.map((role) => {
      if (role.id !== roleId) return role;

      let updatedPerms = role.permissions.map((perm) =>
        perm.name === permName ? { ...perm, active: !perm.active } : perm
      );

      // Dependency logic
      const viewPerm = updatedPerms.find((p) => p.name === "View");
      const addPerm = updatedPerms.find((p) => p.name === "Add");
      const editPerm = updatedPerms.find((p) => p.name === "Edit");
      const deletePerm = updatedPerms.find((p) => p.name === "Delete");

      if (permName !== "View") {
        // ✅ If Add/Edit/Delete is turned ON → View must also be ON
        if (
          (permName === "Add" && updatedPerms.find((p) => p.name === "Add").active) ||
          (permName === "Edit" && updatedPerms.find((p) => p.name === "Edit").active) ||
          (permName === "Delete" && updatedPerms.find((p) => p.name === "Delete").active)
        ) {
          updatedPerms = updatedPerms.map((p) =>
            p.name === "View" ? { ...p, active: true } : p
          );
        }
      } else {
        // ✅ If View is turned OFF → force Add/Edit/Delete OFF
        if (!viewPerm.active) {
          updatedPerms = updatedPerms.map((p) =>
            ["Add", "Edit", "Delete"].includes(p.name)
              ? { ...p, active: false }
              : p
          );
        }
      }

      return {
        ...role,
        permissions: updatedPerms,
        updatedAt: new Date().toISOString().slice(0, 10),
      };
    });

    setRoles(updatedRoles);

    // Update global Select All checkbox
    const allChecked = updatedRoles.every((role) =>
      role.permissions.every((perm) => perm.active)
    );
    setSelectAll(allChecked);
  };

  // 🔹 Toggle global Select All
  const handleSelectAll = () => {
    const newState = !selectAll;
    setSelectAll(newState);

    const updatedRoles = roles.map((role) => ({
      ...role,
      permissions: role.permissions.map((perm) => ({
        ...perm,
        active: newState,
      })),
      updatedAt: new Date().toISOString().slice(0, 10),
    }));

    setRoles(updatedRoles);
  };

  // 🔹 Select all permissions for a specific role
  const handleSelectRole = (roleId) => {
    const updatedRoles = roles.map((role) =>
      role.id === roleId
        ? {
            ...role,
            permissions: role.permissions.map((perm) => ({
              ...perm,
              active: true,
            })),
            updatedAt: new Date().toISOString().slice(0, 10),
          }
        : role
    );

    setRoles(updatedRoles);
    const allChecked = updatedRoles.every((role) =>
      role.permissions.every((perm) => perm.active)
    );
    setSelectAll(allChecked);
  };

  // 🔹 Deselect all permissions for a specific role
  const handleDeselectRole = (roleId) => {
    const updatedRoles = roles.map((role) =>
      role.id === roleId
        ? {
            ...role,
            permissions: role.permissions.map((perm) => ({
              ...perm,
              active: false,
            })),
            updatedAt: new Date().toISOString().slice(0, 10),
          }
        : role
    );

    setRoles(updatedRoles);
    setSelectAll(false);
  };

  // 🔹 Apply preset role permissions
  const applyRolePermissions = (roleName) => {
    if (!roleName) return;

    const updatedRoles = roles.map((role) => ({
      ...role,
      permissions: role.permissions.map((perm) => {
        const preset = presetRoles[roleName];
        if (!preset) return perm;
        if (preset.access === "all") return { ...perm, active: true };
        return { ...perm, active: preset.access.includes(perm.name) };
      }),
      updatedAt: new Date().toISOString().slice(0, 10),
    }));

    setRoles(updatedRoles);

    const allChecked = updatedRoles.every((role) =>
      role.permissions.every((perm) => perm.active)
    );
    setSelectAll(allChecked);

    toast.success(`${roleName} permissions applied`);
  };

  // 🔹 Sort icons renderer
  const renderSortIcons = (key) => (
    <span
      style={{
        display: "inline-flex",
        flexDirection: "column",
        marginLeft: "5px",
        verticalAlign: "middle",
      }}
    >
      <span
        style={{
          cursor: "pointer",
          fontSize: "10px",
          lineHeight: "12px",
          color:
            sortConfig.key === key && sortConfig.direction === "asc"
              ? "#000"
              : "#ccc",
        }}
        onClick={() => setSortConfig({ key, direction: "asc" })}
      >
        ▲
      </span>
      <span
        style={{
          cursor: "pointer",
          fontSize: "10px",
          lineHeight: "10px",
          color:
            sortConfig.key === key && sortConfig.direction === "desc"
              ? "#000"
              : "#ccc",
        }}
        onClick={() => setSortConfig({ key, direction: "desc" })}
      >
        ▼
      </span>
    </span>
  );

  // 🔹 Sort roles
  const sortedRoles = useMemo(() => {
    if (!sortConfig.key) return roles;

    const sorted = [...roles];
    sorted.sort((a, b) => {
      if (sortConfig.key === "sno") {
        return sortConfig.direction === "asc" ? a.id - b.id : b.id - a.id;
      } else if (sortConfig.key === "module") {
        return sortConfig.direction === "asc"
          ? a.name.localeCompare(b.name)
          : b.name.localeCompare(a.name);
      }
      return 0;
    });

    return sorted;
  }, [roles, sortConfig]);

  return (
    <>
      <div className="d-flex justify-content-between align-items-center">
        <BreadCrumb
          subLabel="Admin"
          pageTitle="Permissions"
        />
      </div>

      <div className="row">
        <div className="col-12">
          <div className="card table-card">
            <div className="card-body pt-3">
              {/* Add Role + Select All */}
              <div className="d-flex justify-content-between align-items-center mb-3 px-3">
                <div className="d-flex align-items-center gap-2">
                  <select
                    className="form-select py-2"
                    style={{ width: "200px", fontSize: "14px" }}
                    value={selectedRole}
                    onChange={(e) => {
                      const roleName = e.target.value;
                      setSelectedRole(roleName);
                      applyRolePermissions(roleName);
                    }}
                  >
                    <option value="">-- Select Role --</option>
                    {Object.keys(presetRoles).map((role) => (
                      <option key={role} value={role}>
                        {role}
                      </option>
                    ))}
                  </select>

                  <input
                    type="text"
                    className="form-control py-2"
                    style={{ width: "200px", fontSize: "14px" }}
                    placeholder="Role Name"
                    value={newRoleName}
                    onChange={(e) => setNewRoleName(e.target.value)}
                  />
                  <button
                    className="btn btn-primary py-2 px-3"
                    onClick={handleAddRole}
                  >
                    <i className="ti ti-plus me-1"></i> Add Role
                  </button>
                </div>

                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="selectAllCheckbox"
                    checked={selectAll}
                    onChange={handleSelectAll}
                  />
                  <label
                    className="form-check-label fw-bold"
                    htmlFor="selectAllCheckbox"
                  >
                    Select All
                  </label>
                </div>
              </div>

              {/* Roles Table */}
              <div className="table-responsive">
                <table className="table table-hover">
                  <thead>
                    <tr>
                      <th>S.No {renderSortIcons("sno")}</th>
                      <th>Module {renderSortIcons("module")}</th>
                      {defaultPermissions.map((perm) => (
                        <th key={perm}>{perm}</th>
                      ))}
                      {/* <th>Actions</th> */}
                    </tr>
                  </thead>

                  <tbody>
                    {sortedRoles.length === 0 && (
                      <tr>
                        <td
                          colSpan={defaultPermissions.length + 2}
                          className="text-center text-muted"
                        >
                          No roles added yet
                        </td>
                      </tr>
                    )}
                    {sortedRoles.map((role, index) => (
                      <tr key={role.id}>
                        <td>{index + 1}</td>
                        <td>{role.name}</td>
                        {role.permissions.map((perm) => (
                          <td key={perm.name}>
                            <div className="form-check form-switch">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                checked={perm.active}
                                onChange={() =>
                                  handleTogglePermission(role.id, perm.name)
                                }
                              />
                            </div>
                          </td>
                        ))}
                        {/* <td>
                          <button
                            className="btn btn-sm btn-light-success me-2"
                            title="Select all permissions"
                            onClick={() => handleSelectRole(role.id)}
                          >
                            ✓
                          </button>

                          <button
                            className="btn btn-sm btn-light-danger"
                            title="Clear all permissions"
                            onClick={() => handleDeselectRole(role.id)}
                          >
                            ✕
                          </button>
                        </td> */}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="datatable-bottom">
                <div className="datatable-info">Showing 1 to 5 of 6 entries</div>
                <nav className="datatable-pagination">
                  <ul className="datatable-pagination-list">
                    <li className="datatable-pagination-list-item datatable-hidden datatable-disabled">
                      <button
                        data-page={1}
                        className="datatable-pagination-list-item-link"
                        aria-label="Page 1"
                      >
                        ‹
                      </button>
                    </li>
                    <li className="datatable-pagination-list-item datatable-active">
                      <button
                        data-page={1}
                        className="datatable-pagination-list-item-link"
                        aria-label="Page 1"
                      >
                        1
                      </button>
                    </li>
                    <li className="datatable-pagination-list-item">
                      <button
                        data-page={2}
                        className="datatable-pagination-list-item-link"
                        aria-label="Page 2"
                      >
                        2
                      </button>
                    </li>
                    <li className="datatable-pagination-list-item">
                      <button
                        data-page={2}
                        className="datatable-pagination-list-item-link"
                        aria-label="Page 2"
                      >
                        ›
                      </button>
                    </li>
                  </ul>
                </nav>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default RolesPermissions;
