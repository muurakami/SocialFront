import React from "react";
import styles from "./LinksSearch.module.css";

class LinksSearch extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      inputValue: props.searchQuery || "",
    };
    this.inputRef = React.createRef();
  }

  handleChange = (e) => {
    const value = e.target.value;
    this.setState({ inputValue: value });
    this.props.onSearch(value);
  };

  handleClear = () => {
    this.setState({ inputValue: "" });
    this.props.onSearch("");
    this.inputRef.current?.focus();
  };

  render() {
    const { inputValue } = this.state;

    return (
      <div className={styles.searchContainer}>
        <div className={styles.searchBox}>
          <span className={styles.searchIcon}>⌕</span>
          <input
            ref={this.inputRef}
            type="text"
            className={styles.searchInput}
            placeholder="SEARCH_LINKS..."
            value={inputValue}
            onChange={this.handleChange}
          />
          {inputValue && (
            <button
              className={styles.clearBtn}
              onClick={this.handleClear}
              aria-label="Clear search"
            >
              ✕
            </button>
          )}
        </div>
      </div>
    );
  }
}

export default LinksSearch;
