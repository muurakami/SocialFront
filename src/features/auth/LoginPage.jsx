import React from "react";
import AuthLayout from "./AuthLayout";
import AuthService from "../../services/AuthService";
import LiquidInput from "../../components/ui/LiquidInput";
import LiquidButton from "../../components/ui/LiquidButton";
import styles from "./RegisterPage.module.css";

class LoginPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      isLoading: false,
      error: null,
    };
  }

  handleChange = (field) => (event) => {
    this.setState({ [field]: event.target.value, error: null });
  };

  handleSubmit = async (event) => {
    event.preventDefault();

    console.log("1. Login attempt:", this.state.email);
    this.setState({ isLoading: true, error: null });

    try {
      console.log("2. Отправляю запрос логина...");

      const { user } = await AuthService.login({
        email: this.state.email,
        password: this.state.password,
      });

      console.log("3. Логин успешен:", user);

      // Редирект на главную
      window.location.href = "/feed";
    } catch (error) {
      console.error("4. Ошибка логина:", error);
      this.setState({
        error: error.message,
        isLoading: false,
      });
    }
  };

  render() {
    const { email, password, isLoading, error } = this.state;

    return (
      <AuthLayout>
        <div className="liquid-card">
          <h2 className={styles.title}>ACCESS_NETWORK</h2>
          <p className={styles.subtitle}>// Authenticate identity</p>

          {error && <div className={styles.error}>{error}</div>}

          <form onSubmit={this.handleSubmit} className={styles.form}>
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

            <LiquidButton type="submit" disabled={isLoading}>
              {isLoading ? "AUTHENTICATING..." : "SIGN_IN"}
            </LiquidButton>

            <button
              type="button"
              onClick={() => (window.location.href = "/register")}
              className={styles.linkButton}
            >
              [ CREATE_NEW_IDENTITY ]
            </button>
          </form>
        </div>
      </AuthLayout>
    );
  }
}

export default LoginPage;
