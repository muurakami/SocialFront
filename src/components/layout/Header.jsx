import React from "react";
import Navigation from "./Navigation";
import styles from "./Header.module.css";

class Header extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isSearchOpen: false,
      placeholder: "",
      fullPlaceholder: "Search_users_posts...",
    };
    this.typingInterval = null;
  }

  componentDidMount() {
    this.startTyping();
  }

  componentWillUnmount() {
    if (this.typingInterval) {
      clearInterval(this.typingInterval);
    }
  }

  startTyping = () => {
    let index = 0;
    const { fullPlaceholder } = this.state;

    this.typingInterval = setInterval(() => {
      if (index <= fullPlaceholder.length) {
        this.setState({
          placeholder:
            fullPlaceholder.substring(0, index) +
            (index < fullPlaceholder.length ? "▌" : ""),
        });
        index++;
      } else {
        setTimeout(() => {
          index = 0;
        }, 2000);
      }
    }, 150);
  };

  handleSearchFocus = () => {
    this.setState({ isSearchOpen: true });
    if (this.typingInterval) {
      clearInterval(this.typingInterval);
    }
    this.setState({ placeholder: "Search..." });
  };

  handleSearchBlur = () => {
    this.setState({ isSearchOpen: false });
    this.startTyping();
  };

  render() {
    const { user, onEditProfile } = this.props;
    const { placeholder, isSearchOpen } = this.state;

    return (
      <header className={styles.header} role="banner">
        <div className={styles.container}>
          <div className={styles.logo}>
            <span className={styles.logoIcon}>◉</span>
            <span className={styles.logoText}>NETWORK</span>
          </div>

          <div className={styles.searchWrapper}>
            <input
              type="search"
              className={`${styles.search} ${isSearchOpen ? styles.searchOpen : ""}`}
              placeholder={placeholder}
              aria-label="Search"
              onFocus={this.handleSearchFocus}
              onBlur={this.handleSearchBlur}
            />
            <span className={styles.searchIcon} aria-hidden="true">
              ⌕
            </span>
          </div>

          <Navigation user={user} onEditProfile={onEditProfile} />
        </div>
      </header>
    );
  }
}

export default Header;
