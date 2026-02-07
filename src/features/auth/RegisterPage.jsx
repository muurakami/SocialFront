import React from "react";
import AuthLayout from "./AuthLayout";
import AuthService from "../../services/AuthService";
import RegisterForm from "./RegisterForm";
import VerifyForm from "./VerifyForm";
import ForgotPasswordForm from "./ForgotPasswordForm";
import ResetPasswordForm from "./ResetPasswordForm";
import styles from "./RegisterPage.module.css";

class RegisterPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      step: "REGISTER",
      email: "",
      isLoading: false,
    };
  }

  handleRegister = async (userData) => {
    console.log("🚀 Начинаем регистрацию:", userData);
    this.setState({ isLoading: true });

    try {
      await AuthService.register(userData);
      console.log("✅ Регистрация успешна! Переходим к верификации...");

      this.setState(
        {
          isLoading: false,
          step: "VERIFY",
          email: userData.email,
        },
        () => {
          console.log("🔄 STATE ОБНОВЛЕН:", this.state);
        },
      );
    } catch (error) {
      console.error("❌ Ошибка регистрации:", error);
      alert(error.message || "Ошибка регистрации");
      this.setState({ isLoading: false });
    }
  };

  handleVerify = async (code) => {
    console.log("🚀 Отправляем код верификации:", code);
    this.setState({ isLoading: true });

    try {
      await AuthService.verify(code);
      alert("✅ Аккаунт подтвержден! Войдите в систему.");
      window.location.href = "/login";
    } catch (error) {
      console.error("❌ Ошибка верификации:", error);
      alert(error.message || "Неверный код");
      this.setState({ isLoading: false });
    }
  };

  handleForgotPassword = async (email) => {
    if (!email) {
      alert("Введите E-mail");
      return;
    }
    this.setState({ isLoading: true, email });

    try {
      await AuthService.sendPasswordResetCode(email);
      console.log("✅ Код сброса отправлен");
      this.setState({
        isLoading: false,
        step: "RESET_PASSWORD",
      });
    } catch (error) {
      alert(error.message);
      this.setState({ isLoading: false });
    }
  };

  handleResetPasswordFinal = async (code, newPassword) => {
    this.setState({ isLoading: true });
    try {
      await AuthService.resetPassword(this.state.email, code, newPassword);
      alert("🔑 Пароль изменен! Войдите с новым паролем.");
      window.location.href = "/login";
    } catch (error) {
      alert(error.message);
      this.setState({ isLoading: false });
    }
  };

  handleResend = async () => {
    try {
      await AuthService.resendCode(this.state.email);
      alert("Код отправлен повторно!");
    } catch (error) {
      alert(error.message);
    }
  };

  switchToForgotPassword = () => this.setState({ step: "FORGOTPASS" });
  switchToRegister = () => this.setState({ step: "REGISTER" });

  getHeaderText = () => {
    const { step } = this.state;
    switch (step) {
      case "REGISTER":
        return "JOIN NETWORK";
      case "VERIFY":
        return "VERIFY IDENTITY";
      case "FORGOTPASS":
        return "RECOVER ACCESS";
      case "RESET_PASSWORD":
        return "NEW CREDENTIALS";
      default:
        return "AUTH";
    }
  };

  getSubtitleText = () => {
    const { step, email } = this.state;
    switch (step) {
      case "REGISTER":
        return "Create new anonymous entity";
      case "VERIFY":
        return `Enter code sent to ${email}`;
      case "FORGOTPASS":
        return "Initiate recovery protocol";
      case "RESET_PASSWORD":
        return "Secure your access";
      default:
        return "";
    }
  };

  renderForm = () => {
    const { step, isLoading } = this.state;
    console.log("🖼️ Рендерим форму для шага:", step); // ОТЛАДКА

    switch (step) {
      case "REGISTER":
        return (
          <RegisterForm
            onSubmit={this.handleRegister}
            onForgotPassword={this.switchToForgotPassword}
            isLoading={isLoading}
          />
        );
      case "VERIFY":
        return (
          <VerifyForm
            onSubmit={this.handleVerify}
            onResend={this.handleResend}
            isLoading={isLoading}
          />
        );
      case "FORGOTPASS":
        return (
          <ForgotPasswordForm
            onSubmit={this.handleForgotPassword}
            onBack={this.switchToRegister}
            isLoading={isLoading}
          />
        );
      case "RESET_PASSWORD":
        return (
          <ResetPasswordForm
            onSubmit={this.handleResetPasswordFinal}
            isLoading={isLoading}
          />
        );
      default:
        return <div style={{ color: "red" }}>Error: Unknown step {step}</div>;
    }
  };

  render() {
    return (
      <AuthLayout>
        <div className="liquid-card">
          <h2 className={styles.title}>{this.getHeaderText()}</h2>
          <p className={styles.subtitle}>{this.getSubtitleText()}</p>
          {this.renderForm()}
        </div>
      </AuthLayout>
    );
  }
}

export default RegisterPage;
