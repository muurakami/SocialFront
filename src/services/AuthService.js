import apiClient from "../api/apiClient";

class AuthService {
  static async register(userData) {
    try {
      const response = await apiClient.post("/api/users/registration", {
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        password: userData.password,
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Registration failed");
    }
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

      const { accessToken, refreshToken, user } = response.data;

      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
      localStorage.setItem("user", JSON.stringify(user));

      return { user, accessToken, refreshToken };
    } catch (error) {
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
      const { accessToken, refreshToken: newRefreshToken } = response.data;

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
    return userJson ? JSON.parse(userJson) : null;
  }

  static isAuthenticated() {
    return !!localStorage.getItem("accessToken");
  }
}

export default AuthService;
