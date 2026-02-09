import React from "react";
import styles from "./RolesManager.module.css";

class RolesManager extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      roles: props.roles || [],
      draggedRole: null,
      isCreatingRole: false,
      newRoleName: "",
      newRoleColor: "#00ffff",
      selectedPermissions: [],
    };
  }

  handleDragStart = (e, role) => {
    this.setState({ draggedRole: role });
    e.dataTransfer.effectAllowed = "move";
  };

  handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  handleDrop = (e, targetRole) => {
    e.preventDefault();
    const { draggedRole, roles } = this.state;
    
    if (!draggedRole || draggedRole.id === targetRole.id) return;

    const newRoles = [...roles];
    const draggedIndex = newRoles.findIndex(r => r.id === draggedRole.id);
    const targetIndex = newRoles.findIndex(r => r.id === targetRole.id);

    newRoles.splice(draggedIndex, 1);
    newRoles.splice(targetIndex, 0, draggedRole);

    const reorderedRoles = newRoles.map((role, index) => ({
      ...role,
      priority: index + 1,
    }));

    this.setState({ roles: reorderedRoles, draggedRole: null });

    const { onRolesUpdate } = this.props;
    if (onRolesUpdate) {
      onRolesUpdate(reorderedRoles);
    }
  };

  handleDragEnd = () => {
    this.setState({ draggedRole: null });
  };

  handlePermissionToggle = (permission) => {
    this.setState((prev) => ({
      selectedPermissions: prev.selectedPermissions.includes(permission)
        ? prev.selectedPermissions.filter(p => p !== permission)
        : [...prev.selectedPermissions, permission],
    }));
  };

  handleCreateRole = () => {
    const { newRoleName, newRoleColor, selectedPermissions, roles } = this.state;
    
    if (!newRoleName.trim()) {
      alert("Please enter a role name");
      return;
    }

    const newRole = {
      id: Date.now(),
      name: newRoleName.trim(),
      color: newRoleColor,
      priority: roles.length + 1,
      permissions: selectedPermissions.length > 0 ? selectedPermissions : ["post"],
    };

    const updatedRoles = [...roles, newRole];
    this.setState({
      roles: updatedRoles,
      isCreatingRole: false,
      newRoleName: "",
      newRoleColor: "#00ffff",
      selectedPermissions: [],
    });

    const { onRolesUpdate } = this.props;
    if (onRolesUpdate) {
      onRolesUpdate(updatedRoles);
    }
  };

  handleDeleteRole = (roleId) => {
    if (!confirm("Are you sure you want to delete this role?")) return;

    const updatedRoles = this.state.roles
      .filter(r => r.id !== roleId)
      .map((role, index) => ({ ...role, priority: index + 1 }));

    this.setState({ roles: updatedRoles });

    const { onRolesUpdate } = this.props;
    if (onRolesUpdate) {
      onRolesUpdate(updatedRoles);
    }
  };

  render() {
    const { roles, draggedRole, isCreatingRole, newRoleName, newRoleColor, selectedPermissions } = this.state;
    const { isOwnerOrAdmin } = this.props;

    const availablePermissions = [
      { id: "post", label: "Post", icon: "📝" },
      { id: "moderate", label: "Moderate", icon: "🛡" },
      { id: "manage_members", label: "Manage Members", icon: "👥" },
      { id: "configure_group", label: "Configure Group", icon: "⚙" },
    ];

    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <h3 className={styles.title}>Roles & Permissions</h3>
          {isOwnerOrAdmin && (
            <button
              className={styles.createButton}
              onClick={() => this.setState({ isCreatingRole: !isCreatingRole })}
            >
              {isCreatingRole ? "Cancel" : "+ New Role"}
            </button>
          )}
        </div>

        {isCreatingRole && (
          <div className={styles.createForm}>
            <div className={styles.formRow}>
              <input
                type="text"
                className={styles.roleInput}
                placeholder="Role name..."
                value={newRoleName}
                onChange={(e) => this.setState({ newRoleName: e.target.value })}
                maxLength={30}
              />
              <input
                type="color"
                className={styles.colorPicker}
                value={newRoleColor}
                onChange={(e) => this.setState({ newRoleColor: e.target.value })}
              />
            </div>

            <div className={styles.permissionsGrid}>
              {availablePermissions.map((perm) => (
                <label
                  key={perm.id}
                  className={`${styles.permissionItem} ${selectedPermissions.includes(perm.id) ? styles.permissionSelected : ""}`}
                >
                  <input
                    type="checkbox"
                    checked={selectedPermissions.includes(perm.id)}
                    onChange={() => this.handlePermissionToggle(perm.id)}
                    className={styles.permissionCheckbox}
                  />
                  <span className={styles.permissionIcon}>{perm.icon}</span>
                  <span className={styles.permissionLabel}>{perm.label}</span>
                </label>
              ))}
            </div>

            <button
              className={styles.submitButton}
              onClick={this.handleCreateRole}
              disabled={!newRoleName.trim()}
            >
              Create Role
            </button>
          </div>
        )}

        <div className={styles.rolesList}>
          <p className={styles.hint}>
            💡 Drag and drop roles to change priority order
          </p>

          {roles.map((role) => (
            <div
              key={role.id}
              className={`${styles.roleCard} ${draggedRole?.id === role.id ? styles.dragging : ""}`}
              draggable={isOwnerOrAdmin}
              onDragStart={(e) => this.handleDragStart(e, role)}
              onDragOver={this.handleDragOver}
              onDrop={(e) => this.handleDrop(e, role)}
              onDragEnd={this.handleDragEnd}
            >
              <div className={styles.roleHeader}>
                <div className={styles.roleInfo}>
                  {isOwnerOrAdmin && <span className={styles.dragHandle}>⋮⋮</span>}
                  <div
                    className={styles.roleColor}
                    style={{ backgroundColor: role.color }}
                  />
                  <span className={styles.roleName}>{role.name}</span>
                  <span className={styles.rolePriority}>#{role.priority}</span>
                </div>

                {isOwnerOrAdmin && role.name !== "Owner" && role.name !== "Member" && (
                  <button
                    className={styles.deleteButton}
                    onClick={() => this.handleDeleteRole(role.id)}
                    aria-label="Delete role"
                  >
                    🗑
                  </button>
                )}
              </div>

              <div className={styles.rolePermissions}>
                {role.permissions.includes("all") ? (
                  <span className={styles.permissionBadge}>
                    👑 All Permissions
                  </span>
                ) : (
                  role.permissions.map((perm) => {
                    const permInfo = availablePermissions.find(p => p.id === perm);
                    return permInfo ? (
                      <span key={perm} className={styles.permissionBadge}>
                        {permInfo.icon} {permInfo.label}
                      </span>
                    ) : null;
                  })
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }
}

export default RolesManager;
