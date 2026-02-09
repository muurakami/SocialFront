import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import UserManager from "./context/UserContext";
import Header from "./components/layout/Header";
import HomePage from "./features/home/HomePage";
import RegisterPage from "./features/auth/RegisterPage";
import FeedPage from "./features/feed/FeedPage";
import ProfilePage from "./features/profile/ProfilePage";
import LoginPage from "./features/auth/LoginPage";
import MessagesPage from "./features/messages/MessagesPage";
import GroupsPage from "./features/groups/GroupsPage";
import ToastContainer from "./components/ui/Toast";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: UserManager.load(),
      isLoading: true,
      editProfileHandler: null,
    };
  }

  componentDidMount() {
    this.setState({ isLoading: false });
  }

  handleEditProfileMount = (handler) => {
    this.setState({ editProfileHandler: handler });
  };

  handleEditProfileClick = () => {
    const { editProfileHandler } = this.state;
    if (editProfileHandler) {
      editProfileHandler();
    }
  };

  renderRoutes() {
    const { user } = this.state;

    return (
      <Routes>
        <Route
          path="/"
          element={
            <>
              {user && <Header user={user} onEditProfile={this.handleEditProfileClick} />}
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
                <Header user={user} onEditProfile={this.handleEditProfileClick} />
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
                <Header user={user} onEditProfile={this.handleEditProfileClick} />
                <ProfilePage user={user} onEditProfileMount={this.handleEditProfileMount} />
              </>
            ) : (
              <Navigate to="/" replace />
            )
          }
        />

        <Route
          path="/messages"
          element={
            user ? (
              <>
                <Header user={user} onEditProfile={this.handleEditProfileClick} />
                <MessagesPage user={user} />
              </>
            ) : (
              <Navigate to="/" replace />
            )
          }
        />

        <Route
          path="/groups"
          element={
            user ? (
              <>
                <Header user={user} onEditProfile={this.handleEditProfileClick} />
                <GroupsPage user={user} />
              </>
            ) : (
              <Navigate to="/" replace />
            )
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

    return (
      <BrowserRouter>
        {this.renderRoutes()}
        <ToastContainer />
      </BrowserRouter>
    );
  }
}

export default App;
