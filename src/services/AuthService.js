import apiClient from "../api/apiClient";

class AuthService {
  // Регистрация
  static async register(userData) {
    console.log("AuthService.register payload:", userData);

    const response = await apiClient.post("/api/users/registration", {
      name: userData.firstName,
      secondName: userData.lastName,
      email: userData.email,
      password: userData.password,
      birthDay: userData.birthDay || null,
    });

    return response.data;
  }

  static async verify(code) {
    try {
      const response = await apiClient.post(
        "/api/users/confirm-registration",
        null,
        {
          params: { code },
        },
      );
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Verification failed");
    }
  }

  static async resendCode(email) {
    try {
      const response = await apiClient.post(
        "/api/users/resend-confirm-registration",
        null,
        {
          params: { email },
        },
      );
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Resend failed");
    }
  }

  static async login(credentials) {
    try {
      const response = await apiClient.post("/auth/sign-in", {
        email: credentials.email,
        password: credentials.password,
      });

      console.log("LOGIN RESPONSE:", response.data);

      const accessToken = response.data.accessToken || response.data.token;
      const refreshToken = response.data.refreshToken;

      const user = response.data.user || { email: credentials.email };

      if (!accessToken) {
        throw new Error("Access Token is missing in server response");
      }

      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
      localStorage.setItem("user", JSON.stringify(user));

      return { user, accessToken, refreshToken };
    } catch (error) {
      console.error("Login Error Details:", error);
      throw new Error(error.response?.data?.message || "Login failed");
    }
  }

  static async sendPasswordResetCode(email) {
    try {
      const response = await apiClient.post(
        "/api/users/send-password-resetCode",
        null,
        {
          params: { email },
        },
      );
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to send reset code",
      );
    }
  }

  static async resetPassword(email, code, newPassword) {
    try {
      const response = await apiClient.post(
        "/api/users/reset-password-with-code",
        null,
        {
          params: { email, code, newPassword },
        },
      );
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Password reset failed");
    }
  }

  static async refreshToken() {
    const refreshToken = localStorage.getItem("refreshToken");

    if (!refreshToken) {
      throw new Error("No refresh token available");
    }

    try {
      const response = await apiClient.post("/auth/refresh", { refreshToken });

      const accessToken = response.data.accessToken || response.data.token;
      const newRefreshToken = response.data.refreshToken;

      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", newRefreshToken);

      return { accessToken, refreshToken: newRefreshToken };
    } catch (error) {
      this.logout();
      throw new Error("Session expired");
    }
  }

  static logout() {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
    window.location.href = "/";
  }

  static getCurrentUser() {
    const userJson = localStorage.getItem("user");
    try {
      if (!userJson || userJson === "undefined") return null;
      return JSON.parse(userJson);
    } catch (e) {
      console.error("Error parsing user from localStorage", e);
      return null;
    }
  }

  static isAuthenticated() {
    return !!localStorage.getItem("accessToken");
  }
}

export default AuthService;
