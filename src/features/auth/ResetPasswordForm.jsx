import React from "react";
import LiquidInput from "../../components/ui/LiquidInput";
import LiquidButton from "../../components/ui/LiquidButton";
import styles from "./RegisterPage.module.css";

class ResetPasswordForm extends React.Component {
  state = { code: "", newPassword: "" };

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.onSubmit(this.state.code, this.state.newPassword);
  };

  render() {
    return (
      <form onSubmit={this.handleSubmit} className={styles.form}>
        <LiquidInput
          placeholder="CODE FROM EMAIL"
          value={this.state.code}
          onChange={(e) => this.setState({ code: e.target.value })}
        />
        <LiquidInput
          type="password"
          placeholder="NEW PASSWORD"
          value={this.state.newPassword}
          onChange={(e) => this.setState({ newPassword: e.target.value })}
        />
        <LiquidButton type="submit" disabled={this.props.isLoading}>
          CHANGE PASSWORD
        </LiquidButton>
      </form>
    );
  }
}
export default ResetPasswordForm;
