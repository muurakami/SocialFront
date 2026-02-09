import React from "react";
import { NavLink } from "react-router-dom";
import Avatar from "../ui/Avatar";
import SettingsMenu from "./SettingsMenu";
import styles from "./Navigation.module.css";

class Navigation extends React.Component {
  render() {
    const { user, onEditProfile } = this.props;

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
            <NavLink
              to="/messages"
              className={({ isActive }) =>
                `${styles.navItem} ${isActive ? styles.active : ""}`
              }
              aria-label="Messages"
            >
              <span className={styles.icon}>✉</span>
              <span className={styles.label}>Messages</span>
            </NavLink>

            <NavLink
              to="/groups"
              className={({ isActive }) =>
                `${styles.navItem} ${isActive ? styles.active : ""}`
              }
              aria-label="Groups"
            >
              <span className={styles.icon}>👥</span>
              <span className={styles.label}>Groups</span>
            </NavLink>
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

            <SettingsMenu onEditProfile={onEditProfile} />
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
      </nav>
    );
  }
}

export default Navigation;
