import React from "react";
import LiquidInput from "../../components/ui/LiquidInput";
import LiquidButton from "../../components/ui/LiquidButton";
import styles from "./RegisterPage.module.css";

class VerifyForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      code: "",
    };
  }

  handleChange = (event) => {
    this.setState({ code: event.target.value });
  };

  handleSubmit = (event) => {
    event.preventDefault();
    this.props.onSubmit(this.state.code);
  };

  render() {
    const { onResend } = this.props;
    const { code } = this.state;

    return (
      <form onSubmit={this.handleSubmit} className={styles.form}>
        <LiquidInput
          type="text"
          placeholder="00-00-00"
          value={code}
          onChange={this.handleChange}
          maxLength={6}
          className={styles.codeInput}
        />

        <LiquidButton type="submit">CONFIRM_ACCESS</LiquidButton>

        <LiquidButton type="button" variant="secondary" onClick={onResend}>
          [ RE-SEND TRANSMISSION ]
        </LiquidButton>
      </form>
    );
  }
}

export default VerifyForm;
