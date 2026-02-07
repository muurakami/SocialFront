class UserManager {
  static KEY = "user";

  static load() {
    try {
      const userStr = localStorage.getItem(this.KEY);
      return userStr ? JSON.parse(userStr) : null;
    } catch (error) {
      console.error("Failed to load user:", error);
      return null;
    }
  }

  static save(user) {
    if (!user) {
      this.clear();
      return;
    }
    localStorage.setItem(this.KEY, JSON.stringify(user));
  }

  static clear() {
    localStorage.removeItem(this.KEY);
  }

  static isAuthenticated() {
    const token = localStorage.getItem("accessToken");
    const user = this.load();
    return !!(token && user);
  }
}

export default UserManager;
