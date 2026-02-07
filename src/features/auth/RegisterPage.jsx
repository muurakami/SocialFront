import React from "react";
import AuthLayout from "./AuthLayout";
import AuthService from "../../services/AuthService";
import RegisterForm from "./RegisterForm";
import VerifyForm from "./VerifyForm";
import ForgotPasswordForm from "./ForgotPasswordForm";
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

  handleRegister = async ({ firstName, lastName, email, password }) => {
    console.log("1. handleRegister вызван:", { firstName, lastName, email });
    this.setState({ isLoading: true });

    try {
      console.log("2. Отправляю запрос регистрации...");
      const response = await AuthService.register({
        firstName,
        lastName,
        email,
        password,
      });
      console.log("3. Ответ регистрации:", response);

      this.setState({ step: "VERIFY", email, isLoading: false });
      console.log("4. Переключились на VERIFY");
    } catch (error) {
      console.error("5. Ошибка регистрации:", error);
      alert("Ошибка регистрации: " + error.message);
      this.setState({ isLoading: false });
    }
  };

  handleVerify = async (code) => {
    console.log("1. handleVerify вызван с кодом:", code);
    console.log("2. Длина кода:", code.length);
    console.log("3. Тип кода:", typeof code);

    this.setState({ isLoading: true });

    try {
      console.log("4. Отправляю запрос верификации...");

      // ИСПРАВЛЕНО: было verifyCode, стало verify
      const response = await AuthService.verify(code);

      console.log("5. Ответ верификации:", response);
      console.log("6. Верификация успешна!");

      alert("Регистрация завершена!");
      window.location.href = "/";
    } catch (error) {
      console.error("7. Ошибка верификации:", error);
      console.error("8. Текст ошибки:", error.message);
      alert("Неверный код: " + error.message);
      this.setState({ isLoading: false });
    }
  };

  handleResend = async () => {
    console.log("1. handleResend вызван для email:", this.state.email);

    try {
      console.log("2. Отправляю запрос повторной отправки...");
      const response = await AuthService.resendCode(this.state.email);
      console.log("3. Ответ:", response);

      alert("Код отправлен повторно");
    } catch (error) {
      console.error("4. Ошибка отправки:", error);
      alert("Ошибка отправки: " + error.message);
    }
  };

  handleForgotPassword = async (email) => {
    console.log("1. handleForgotPassword для:", email);

    if (!email) {
      alert("Введите E-mail");
      return;
    }

    this.setState({ isLoading: true, email });

    try {
      console.log("2. Отправляю запрос сброса пароля...");

      // ИСПРАВЛЕНО: было forgotPassword, стало sendPasswordResetCode
      const response = await AuthService.sendPasswordResetCode(email);

      console.log("3. Ответ:", response);
      alert("Инструкция отправлена на почту " + email);
      this.setState({ step: "VERIFY", isLoading: false });
    } catch (error) {
      console.error("4. Ошибка:", error);
      alert("Ошибка: " + error.message);
      this.setState({ isLoading: false });
    }
  };

  switchToForgotPassword = () => {
    console.log("Переключаемся на FORGOT_PASS");
    this.setState({ step: "FORGOT_PASS" });
  };

  switchToRegister = () => {
    console.log("Переключаемся на REGISTER");
    this.setState({ step: "REGISTER" });
  };

  getHeaderText() {
    const { step } = this.state;
    if (step === "REGISTER") return "JOIN_NETWORK";
    if (step === "VERIFY") return "VERIFY_IDENTITY";
    if (step === "FORGOT_PASS") return "RECOVER_ACCESS";
    return "AUTH";
  }

  getSubtitleText() {
    const { step, email } = this.state;
    if (step === "REGISTER") return "// Create new anonymous entity";
    if (step === "VERIFY") return `// Enter code sent to ${email}`;
    if (step === "FORGOT_PASS") return "// Initiate recovery protocol";
    return "";
  }

  renderForm() {
    const { step, isLoading } = this.state;

    if (step === "REGISTER") {
      return (
        <RegisterForm
          onSubmit={this.handleRegister}
          onForgotPassword={this.switchToForgotPassword}
          isLoading={isLoading}
        />
      );
    }

    if (step === "VERIFY") {
      return (
        <VerifyForm
          onSubmit={this.handleVerify}
          onResend={this.handleResend}
          isLoading={isLoading}
        />
      );
    }

    if (step === "FORGOT_PASS") {
      return (
        <ForgotPasswordForm
          onSubmit={this.handleForgotPassword}
          onBack={this.switchToRegister}
          isLoading={isLoading}
        />
      );
    }

    return null;
  }

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
