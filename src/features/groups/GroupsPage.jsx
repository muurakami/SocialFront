import React from "react";
import GroupList from "./components/GroupList";
import GroupDetail from "./components/GroupDetail";
import CreateGroupModal from "./components/CreateGroupModal";
import EncryptButton from "../../components/ui/EncryptButton";
import styles from "./GroupsPage.module.css";

class GroupsPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      groups: [],
      selectedGroup: null,
      isCreateModalOpen: false,
      isLoading: true,
    };
  }

  componentDidMount() {
    this.loadGroups();
  }

  loadGroups = () => {
    setTimeout(() => {
      const mockGroups = [
        {
          id: 1,
          name: "Cyberpunk Developers",
          description: "Building the future, one neon line at a time",
          avatar: "https://i.pravatar.cc/150?img=20",
          memberCount: 1234,
          isJoined: true,
          isPrivate: false,
          owner: {
            id: 1,
            firstName: "John",
            lastName: "Doe",
          },
          admins: [
            {
              id: 2,
              firstName: "Sarah",
              lastName: "Connor",
              avatar: "https://i.pravatar.cc/150?img=5",
            },
            {
              id: 5,
              firstName: "Marcus",
              lastName: "Wright",
              avatar: "https://i.pravatar.cc/150?img=15",
            },
          ],
          roles: [
            {
              id: 1,
              name: "Owner",
              color: "#ff0080",
              priority: 1,
              permissions: ["all"],
            },
            {
              id: 2,
              name: "Admin",
              color: "#00ffff",
              priority: 2,
              permissions: ["post", "moderate", "manage_members"],
            },
            {
              id: 3,
              name: "Moderator",
              color: "#00ff88",
              priority: 3,
              permissions: ["post", "moderate"],
            },
            {
              id: 4,
              name: "Member",
              color: "#888888",
              priority: 4,
              permissions: ["post"],
            },
          ],
        },
        {
          id: 2,
          name: "React Masters",
          description: "Class components forever! Hooks are temporary.",
          avatar: "https://i.pravatar.cc/150?img=21",
          memberCount: 856,
          isJoined: true,
          isPrivate: false,
        },
        {
          id: 3,
          name: "Neo Tokyo Residents",
          description: "Exclusive community for city dwellers",
          avatar: "https://i.pravatar.cc/150?img=22",
          memberCount: 432,
          isJoined: false,
          isPrivate: true,
        },
        {
          id: 4,
          name: "Digital Artists Hub",
          description: "Share your art, get feedback, collaborate",
          avatar: "https://i.pravatar.cc/150?img=23",
          memberCount: 2341,
          isJoined: true,
          isPrivate: false,
        },
      ];

      this.setState({
        groups: mockGroups,
        selectedGroup: mockGroups[0],
        isLoading: false,
      });
    }, 500);
  };

  handleSelectGroup = (group) => {
    this.setState({ selectedGroup: group });
  };

  handleCreateGroup = (groupData) => {
    const newGroup = {
      id: Date.now(),
      ...groupData,
      memberCount: 1,
      isJoined: true,
    };

    this.setState((prev) => ({
      groups: [newGroup, ...prev.groups],
      selectedGroup: newGroup,
      isCreateModalOpen: false,
    }));
  };

  handleJoinGroup = (groupId) => {
    this.setState((prev) => ({
      groups: prev.groups.map((group) =>
        group.id === groupId
          ? { ...group, isJoined: true, memberCount: group.memberCount + 1 }
          : group
      ),
    }));
  };

  handleLeaveGroup = (groupId) => {
    this.setState((prev) => ({
      groups: prev.groups.map((group) =>
        group.id === groupId
          ? { ...group, isJoined: false, memberCount: group.memberCount - 1 }
          : group
      ),
    }));
  };

  render() {
    const { user } = this.props;
    const { groups, selectedGroup, isCreateModalOpen, isLoading } = this.state;

    return (
      <div className={styles.container}>
        <div className={styles.sidebar}>
          <div className={styles.sidebarHeader}>
            <h2 className={styles.title}>Groups</h2>
            <button
              className={styles.createButton}
              onClick={() => this.setState({ isCreateModalOpen: true })}
              aria-label="Create new group"
              title="Create new group"
            >
              +
            </button>
          </div>

          <GroupList
            groups={groups}
            selectedGroup={selectedGroup}
            onSelectGroup={this.handleSelectGroup}
            isLoading={isLoading}
          />
        </div>

        <div className={styles.main}>
          {selectedGroup ? (
            <GroupDetail
              group={selectedGroup}
              currentUser={user}
              onJoin={this.handleJoinGroup}
              onLeave={this.handleLeaveGroup}
            />
          ) : (
            <div className={styles.emptyState}>
              <div className={styles.emptyIcon}>👥</div>
              <h3 className={styles.emptyTitle}>Your Groups</h3>
              <p className={styles.emptyText}>
                Select a group or create a new one to get started
              </p>
            </div>
          )}
        </div>

        {isCreateModalOpen && (
          <CreateGroupModal
            onClose={() => this.setState({ isCreateModalOpen: false })}
            onCreate={this.handleCreateGroup}
          />
        )}
      </div>
    );
  }
}

export default GroupsPage;
