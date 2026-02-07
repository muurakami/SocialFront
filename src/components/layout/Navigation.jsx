import React from "react";
import { NavLink } from "react-router-dom";
import Avatar from "../ui/Avatar";
import AuthService from "../../services/AuthService";
import styles from "./Navigation.module.css";

class Navigation extends React.Component {
  handleLogout = () => {
    if (confirm("Are you sure you want to logout?")) {
      AuthService.logout();
    }
  };

  render() {
    const { user } = this.props;

    return (
      <nav
        className={styles.nav}
        role="navigation"
        aria-label="Main navigation"
      >
        <NavLink
          to="/"
          className={({ isActive }) =>
            `${styles.navItem} ${isActive ? styles.active : ""}`
          }
          aria-label="Feed"
          end
        >
          <span className={styles.icon}>▦</span>
          <span className={styles.label}>Feed</span>
        </NavLink>

        {user ? (
          <>
            <button
              onClick={this.handleLogout}
              className={styles.navItem}
              aria-label="Logout"
            >
              <span className={styles.icon}>↪</span>
              <span className={styles.label}>Logout</span>
            </button>

            {/* Аватарка - переход на профиль */}
            <NavLink
              to="/profile"
              className={({ isActive }) =>
                `${styles.navItem} ${styles.avatarItem} ${isActive ? styles.active : ""}`
              }
              aria-label="Profile"
            >
              <Avatar
                src={user.avatar}
                alt={`${user.firstName} ${user.lastName}`}
                size={32}
              />
            </NavLink>
          </>
        ) : (
          <NavLink
            to="/register"
            className={({ isActive }) =>
              `${styles.navItem} ${styles.navItemPrimary} ${isActive ? styles.active : ""}`
            }
          >
            <span className={styles.label}>Join</span>
          </NavLink>
        )}

        <NavLink
          to="/links"
          className={({ isActive }) =>
            `${styles.navItem} ${isActive ? styles.active : ""}`
          }
          aria-label="Links"
        >
          <span className={styles.icon}>⚡</span>
          <span className={styles.label}>Links</span>
        </NavLink>
      </nav>
    );
  }
}

export default Navigation;
