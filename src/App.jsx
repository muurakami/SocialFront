import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import UserManager from "./context/UserContext";
import Header from "./components/layout/Header";
import HomePage from "./features/home/HomePage";
import RegisterPage from "./features/auth/RegisterPage";
import FeedPage from "./features/feed/FeedPage";
import ProfilePage from "./features/profile/ProfilePage";
import LinksPage from "./features/links/LinksPage";
import LoginPage from "./features/auth/LoginPage";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: UserManager.load(),
      isLoading: true,
    };
  }

  componentDidMount() {
    this.setState({ isLoading: false });
  }

  renderRoutes() {
    const { user } = this.state;

    return (
      <Routes>
        <Route
          path="/"
          element={
            <>
              {user && <Header user={user} />}
              {user ? <FeedPage user={user} /> : <HomePage />}
            </>
          }
        />
        <Route path="/register" element={<RegisterPage />} />
        <Route
          path="/feed"
          element={
            user ? (
              <>
                <Header user={user} />
                <FeedPage user={user} />
              </>
            ) : (
              <Navigate to="/" replace />
            )
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
        <Route
          path="/profile"
          element={
            user ? (
              <>
                <Header user={user} />
                <ProfilePage user={user} />
              </>
            ) : (
              <Navigate to="/" replace />
            )
          }
        />

        <Route
          path="/links"
          element={
            user ? <LinksPage user={user} /> : <Navigate to="/" replace />
          }
        />

        <Route path="/login" element={<LoginPage />} />
      </Routes>
    );
  }

  render() {
    const { isLoading } = this.state;

    if (isLoading) {
      return (
        <div
          style={{
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          Loading...
        </div>
      );
    }

    return <BrowserRouter>{this.renderRoutes()}</BrowserRouter>;
  }
}

export default App;
