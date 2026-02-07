import apiClient from "../api/apiClient";

class UserService {
  static async getMe() {
    try {
      const response = await apiClient.get("/api/users/me");
      localStorage.setItem("user", JSON.stringify(response.data));
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Failed to fetch user");
    }
  }

  static async getUserById(id) {
    try {
      const response = await apiClient.get(`/api/users/${id}`, {
        params: { id },
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "User not found");
    }
  }

  static async updateProfile(userId, data) {
    try {
      const response = await apiClient.put(`/api/users/${userId}`, data);

      const user = JSON.parse(localStorage.getItem("user") || "{}");
      const updatedUser = { ...user, ...response.data };
      localStorage.setItem("user", JSON.stringify(updatedUser));

      return updatedUser;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Update failed");
    }
  }

  static async uploadAvatar(userId, file) {
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await apiClient.post(
        `/api/users/addAvatar/${userId}/newAvatar`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } },
      );

      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Avatar upload failed");
    }
  }

  static async updatePassword(userId, currentPassword, newPassword) {
    try {
      const response = await apiClient.put(
        `/api/users/update-user-password/${userId}`,
        null,
        { params: { currentPassword, newPassword } },
      );
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Password change failed",
      );
    }
  }
}

export default UserService;
