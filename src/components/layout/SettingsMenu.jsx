import React from "react";
import ThemeToggle from "../ui/ThemeToggle";
import AuthService from "../../services/AuthService";
import styles from "./SettingsMenu.module.css";

class SettingsMenu extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: false,
    };
    this.menuRef = React.createRef();
  }

  componentDidMount() {
    document.addEventListener("mousedown", this.handleClickOutside);
  }

  componentWillUnmount() {
    document.removeEventListener("mousedown", this.handleClickOutside);
  }

  handleClickOutside = (event) => {
    if (this.menuRef.current && !this.menuRef.current.contains(event.target)) {
      this.setState({ isOpen: false });
    }
  };

  handleToggleMenu = () => {
    this.setState((prev) => ({ isOpen: !prev.isOpen }));
  };

  handleEditProfile = () => {
    const { onEditProfile } = this.props;
    this.setState({ isOpen: false });
    if (onEditProfile) {
      onEditProfile();
    }
  };

  handleLogout = () => {
    if (confirm("Are you sure you want to logout?")) {
      AuthService.logout();
    }
  };

  handleKeyDown = (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      this.handleToggleMenu();
    }
  };

  handleMenuItemKeyDown = (event, action) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      action();
    }
  };
  render() {
    const { isOpen } = this.state;

    return (
      <div className={styles.settingsContainer} ref={this.menuRef}>
        <button
          className={styles.settingsButton}
          onClick={this.handleToggleMenu}
          onKeyDown={this.handleKeyDown}
          aria-label="Settings"
          aria-expanded={isOpen}
          aria-haspopup="true"
        >
          <span className={styles.settingsIcon}>⚙</span>
        </button>

        {isOpen && (
          <div className={styles.dropdown} role="menu">
            <div
              className={styles.menuItem}
              onClick={this.handleEditProfile}
              onKeyDown={(e) =>
                this.handleMenuItemKeyDown(e, this.handleEditProfile)
              }
              role="menuitem"
              tabIndex={0}
              aria-label="Edit Profile"
            >
              <span className={styles.menuIcon}>✎</span>
              <span className={styles.menuLabel}>Edit Profile</span>
            </div>

            {/* ✅ ВОТ ЭТОТ БЛОК ИСПРАВЛЕН */}
            <div className={styles.menuItem} role="menuitem">
              <span className={styles.menuIcon}>◐</span>
              <span className={styles.menuLabel}>Theme</span>
              <div className={styles.themeToggleWrapper}>
                {/* Передаем variant="inline", чтобы он не улетал */}
                <ThemeToggle variant="inline" />
              </div>
            </div>

            <div className={styles.divider} role="separator"></div>

            <div
              className={`${styles.menuItem} ${styles.menuItemDanger}`}
              onClick={this.handleLogout}
              onKeyDown={(e) =>
                this.handleMenuItemKeyDown(e, this.handleLogout)
              }
              role="menuitem"
              tabIndex={0}
              aria-label="Logout"
            >
              <span className={styles.menuIcon}>↪</span>
              <span className={styles.menuLabel}>Logout</span>
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default SettingsMenu;
