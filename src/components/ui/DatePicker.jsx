import React from "react";
import styles from "./DatePicker.module.css";

class DatePicker extends React.Component {
  constructor(props) {
    super(props);
    
    const today = new Date();
    const currentYear = today.getFullYear();
    
    this.state = {
      isOpen: false,
      day: "",
      month: "",
      year: "",
      currentYear: currentYear,
    };
    
    this.containerRef = React.createRef();
  }

  componentDidMount() {
    document.addEventListener("mousedown", this.handleClickOutside);
    
    const { value } = this.props;
    if (value) {
      this.parseDate(value);
    }
  }

  componentWillUnmount() {
    document.removeEventListener("mousedown", this.handleClickOutside);
  }

  parseDate = (dateString) => {
    if (!dateString) return;
    
    const date = new Date(dateString);
    if (!isNaN(date)) {
      this.setState({
        day: String(date.getDate()).padStart(2, "0"),
        month: String(date.getMonth() + 1).padStart(2, "0"),
        year: String(date.getFullYear()),
      });
    }
  };

  handleClickOutside = (event) => {
    if (this.containerRef.current && !this.containerRef.current.contains(event.target)) {
      this.setState({ isOpen: false });
    }
  };

  handleToggle = () => {
    this.setState((prev) => ({ isOpen: !prev.isOpen }));
  };

  handleDayChange = (e) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 2);
    const numValue = parseInt(value, 10);
    
    if (value === "" || (numValue >= 1 && numValue <= 31)) {
      this.setState({ day: value }, this.updateValue);
    }
  };

  handleMonthChange = (e) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 2);
    const numValue = parseInt(value, 10);
    
    if (value === "" || (numValue >= 1 && numValue <= 12)) {
      this.setState({ month: value }, this.updateValue);
    }
  };

  handleYearChange = (e) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 4);
    this.setState({ year: value }, this.updateValue);
  };

  updateValue = () => {
    const { day, month, year } = this.state;
    const { onChange } = this.props;
    
    if (day && month && year && year.length === 4) {
      const dateString = `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
      const date = new Date(dateString);
      
      if (!isNaN(date)) {
        onChange({ target: { value: dateString } });
      }
    }
  };

  getDisplayValue = () => {
    const { day, month, year } = this.state;
    
    if (day && month && year) {
      return `${day}/${month}/${year}`;
    }
    
    return "";
  };

  render() {
    const { placeholder = "SELECT DATE", required } = this.props;
    const { isOpen, day, month, year, currentYear } = this.state;
    const displayValue = this.getDisplayValue();

    return (
      <div className={styles.container} ref={this.containerRef}>
        <div
          className={styles.input}
          onClick={this.handleToggle}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              this.handleToggle();
            }
          }}
          role="button"
          tabIndex={0}
          aria-label={placeholder}
          aria-expanded={isOpen}
        >
          <span className={displayValue ? styles.value : styles.placeholder}>
            {displayValue || placeholder}
          </span>
          <span className={styles.icon}>📅</span>
        </div>

        {isOpen && (
          <div className={styles.dropdown}>
            <div className={styles.header}>
              <span className={styles.title}>SELECT DATE</span>
            </div>

            <div className={styles.inputs}>
              <div className={styles.inputGroup}>
                <label className={styles.label}>Day</label>
                <input
                  type="text"
                  className={styles.field}
                  value={day}
                  onChange={this.handleDayChange}
                  placeholder="DD"
                  maxLength={2}
                  aria-label="Day"
                />
              </div>

              <div className={styles.separator}>/</div>

              <div className={styles.inputGroup}>
                <label className={styles.label}>Month</label>
                <input
                  type="text"
                  className={styles.field}
                  value={month}
                  onChange={this.handleMonthChange}
                  placeholder="MM"
                  maxLength={2}
                  aria-label="Month"
                />
              </div>

              <div className={styles.separator}>/</div>

              <div className={styles.inputGroup}>
                <label className={styles.label}>Year</label>
                <input
                  type="text"
                  className={styles.field}
                  value={year}
                  onChange={this.handleYearChange}
                  placeholder="YYYY"
                  maxLength={4}
                  aria-label="Year"
                />
              </div>
            </div>

            <div className={styles.footer}>
              <button
                type="button"
                className={styles.button}
                onClick={() => {
                  this.setState({
                    day: "",
                    month: "",
                    year: "",
                  }, () => {
                    this.updateValue();
                    this.setState({ isOpen: false });
                  });
                }}
              >
                Clear
              </button>
              <button
                type="button"
                className={`${styles.button} ${styles.buttonPrimary}`}
                onClick={() => this.setState({ isOpen: false })}
              >
                Done
              </button>
            </div>
          </div>
        )}

        {required && <input type="hidden" value={displayValue} required />}
      </div>
    );
  }
}

export default DatePicker;
