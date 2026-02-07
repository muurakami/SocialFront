import React from "react";
import LiquidInput from "../../components/ui/LiquidInput";
import LiquidButton from "../../components/ui/LiquidButton";
import styles from "./RegisterPage.module.css";

class ForgotPasswordForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
    };
  }

  handleChange = (event) => {
    this.setState({ email: event.target.value });
  };

  handleSubmit = (event) => {
    event.preventDefault();
    this.props.onSubmit(this.state.email);
  };

  render() {
    const { isLoading, onBack } = this.props;
    const { email } = this.state;

    return (
      <form onSubmit={this.handleSubmit} className={styles.form}>
        <LiquidInput
          type="email"
          placeholder="ENTER YOUR E-MAIL"
          value={email}
          onChange={this.handleChange}
          required
        />

        <LiquidButton type="submit" disabled={isLoading}>
          {isLoading ? "SENDING..." : "SEND RECOVERY CODE"}
        </LiquidButton>

        <button type="button" onClick={onBack} className={styles.linkButton}>
          [ &lt; BACK TO REGISTRATION ]
        </button>
      </form>
    );
  }
}

export default ForgotPasswordForm;
