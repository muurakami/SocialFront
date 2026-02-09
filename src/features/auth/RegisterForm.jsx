import React from "react";
import LiquidInput from "../../components/ui/LiquidInput";
import LiquidButton from "../../components/ui/LiquidButton";
import DatePicker from "../../components/ui/DatePicker";
import styles from "./RegisterPage.module.css";

class RegisterForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      birthDay: "",
    };
  }

  handleChange = (field) => (event) => {
    this.setState({ [field]: event.target.value });
  };

  handleSubmit = (event) => {
    event.preventDefault();
    const { firstName, lastName, email, password, birthDay } = this.state;
    console.log("📤 Отправляем:", {
      firstName,
      lastName,
      email,
      password,
      birthDay,
    });
    this.props.onSubmit({ firstName, lastName, email, password, birthDay });
  };

  render() {
    const { isLoading, onForgotPassword } = this.props;
    const { firstName, lastName, email, password, birthDay } = this.state;

    return (
      <form onSubmit={this.handleSubmit} className={styles.form}>
        <div className={styles.row}>
          <LiquidInput
            type="text"
            placeholder="FIRST NAME"
            value={firstName}
            onChange={this.handleChange("firstName")}
            required
          />
          <LiquidInput
            type="text"
            placeholder="LAST NAME"
            value={lastName}
            onChange={this.handleChange("lastName")}
            required
          />
        </div>

        <LiquidInput
          type="email"
          placeholder="E-MAIL"
          value={email}
          onChange={this.handleChange("email")}
          required
        />

        <LiquidInput
          type="password"
          placeholder="PASSWORD"
          value={password}
          onChange={this.handleChange("password")}
          required
        />

        <DatePicker
          placeholder="BIRTHDAY"
          value={birthDay}
          onChange={this.handleChange("birthDay")}
          required
        />

        <LiquidButton type="submit" disabled={isLoading}>
          {isLoading ? "PROCESSING..." : "REGISTRATION"}
        </LiquidButton>

        <button
          type="button"
          onClick={onForgotPassword}
          className={styles.linkButton}
        >
          [ FORGOT PASSWORD? ]
        </button>
      </form>
    );
  }
}

export default RegisterForm;
