import apiClient from "../api/apiClient";

class UserService {
  static async getMyProfile(id) {
    try {
      const response = await apiClient.get(`/api/profile/my-profile/${id}`);

      this._updateLocalStorageUser(response.data);

      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to fetch profile",
      );
    }
  }

  static async getPublicProfileByEmail(email) {
    try {
      const response = await apiClient.get("/api/profile/findProfile", {
        params: { email },
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "User not found");
    }
  }

  static async updateProfile(userId, data) {
    try {
      const response = await apiClient.put(`/api/profile/${userId}`, data);

      this._updateLocalStorageUser(response.data);
      return response.data;
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
        {
          params: { currenPassword: currentPassword, newPassword: newPassword },
        },
      );
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Password change failed",
      );
    }
  }
  static _updateLocalStorageUser(newData) {
    try {
      const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
      const updatedUser = { ...currentUser, ...newData };
      localStorage.setItem("user", JSON.stringify(updatedUser));
    } catch (e) {
      console.error("Error updating local storage", e);
    }
  }
}

export default UserService;
