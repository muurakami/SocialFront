import React from "react";
import Header from "../../components/layout/Header";
import LinksSearch from "./components/LinksSearch";
import LinksGrid from "./components/LinksGrid";
import styles from "./LinksPage.module.css";

class LinksPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      allLinks: [
        {
          id: 1,
          name: "CyberSec",
          description: "Security & encryption discussions",
          members: 12340,
          image: "https://picsum.photos/seed/cyber/400/300",
          category: "Security",
          isSubscribed: true,
        },
        {
          id: 2,
          name: "Dev Community",
          description: "Programming and development",
          members: 56780,
          image: "https://picsum.photos/seed/dev/400/300",
          category: "Development",
          isSubscribed: true,
        },
        {
          id: 3,
          name: "AI Research",
          description: "Artificial intelligence & ML",
          members: 8900,
          image: "https://picsum.photos/seed/ai/400/300",
          category: "AI",
          isSubscribed: true,
        },
        {
          id: 4,
          name: "Blockchain Hub",
          description: "Crypto, DeFi, Web3",
          members: 23400,
          image: "https://picsum.photos/seed/blockchain/400/300",
          category: "Crypto",
          isSubscribed: false,
        },
        {
          id: 5,
          name: "Design System",
          description: "UI/UX & design patterns",
          members: 15600,
          image: "https://picsum.photos/seed/design/400/300",
          category: "Design",
          isSubscribed: false,
        },
        {
          id: 6,
          name: "Data Science",
          description: "Analytics, Big Data, ML",
          members: 34200,
          image: "https://picsum.photos/seed/data/400/300",
          category: "Data",
          isSubscribed: false,
        },
        {
          id: 7,
          name: "Game Dev",
          description: "Game development & engines",
          members: 19800,
          image: "https://picsum.photos/seed/gamedev/400/300",
          category: "Gaming",
          isSubscribed: false,
        },
        {
          id: 8,
          name: "Cloud Native",
          description: "DevOps, K8s, Containers",
          members: 27300,
          image: "https://picsum.photos/seed/cloud/400/300",
          category: "DevOps",
          isSubscribed: false,
        },
      ],
      filteredLinks: [],
      searchQuery: "",
      activeFilter: "all", // 'all', 'subscribed', 'discover'
    };
  }

  componentDidMount() {
    this.setState({ filteredLinks: this.state.allLinks });
  }

  handleSearch = (query) => {
    this.setState({ searchQuery: query }, this.applyFilters);
  };

  handleFilterChange = (filter) => {
    this.setState({ activeFilter: filter }, this.applyFilters);
  };

  applyFilters = () => {
    const { allLinks, searchQuery, activeFilter } = this.state;

    let filtered = allLinks;

    // Фильтр по подписке
    if (activeFilter === "subscribed") {
      filtered = filtered.filter((link) => link.isSubscribed);
    } else if (activeFilter === "discover") {
      filtered = filtered.filter((link) => !link.isSubscribed);
    }

    // Поиск
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (link) =>
          link.name.toLowerCase().includes(query) ||
          link.description.toLowerCase().includes(query) ||
          link.category.toLowerCase().includes(query),
      );
    }

    this.setState({ filteredLinks: filtered });
  };

  handleSubscribe = (linkId) => {
    this.setState(
      (prev) => ({
        allLinks: prev.allLinks.map((link) =>
          link.id === linkId
            ? { ...link, isSubscribed: !link.isSubscribed }
            : link,
        ),
      }),
      this.applyFilters,
    );
  };

  render() {
    const { filteredLinks, searchQuery, activeFilter } = this.state;
    const { user } = this.props;

    return (
      <>
        <Header user={user} />
        <div className={styles.page}>
          <div className={styles.container}>
            {/* Заголовок */}
            <div className={styles.header}>
              <h1 className={styles.title}>
                <span className={styles.icon}>⚡</span>
                LINKS_DIRECTORY
              </h1>
              <p className={styles.subtitle}>Explore and join communities</p>
            </div>

            {/* Поиск */}
            <LinksSearch
              onSearch={this.handleSearch}
              searchQuery={searchQuery}
            />

            {/* Фильтры */}
            <div className={styles.filters}>
              <button
                className={`${styles.filterBtn} ${activeFilter === "all" ? styles.active : ""}`}
                onClick={() => this.handleFilterChange("all")}
              >
                All Links
              </button>
              <button
                className={`${styles.filterBtn} ${activeFilter === "subscribed" ? styles.active : ""}`}
                onClick={() => this.handleFilterChange("subscribed")}
              >
                My Links
              </button>
              <button
                className={`${styles.filterBtn} ${activeFilter === "discover" ? styles.active : ""}`}
                onClick={() => this.handleFilterChange("discover")}
              >
                Discover
              </button>
            </div>

            {/* Счетчик */}
            <div className={styles.count}>
              <span className={styles.countText}>
                {filteredLinks.length} links found
              </span>
            </div>

            {/* Сетка линков */}
            <LinksGrid
              links={filteredLinks}
              onSubscribe={this.handleSubscribe}
            />
          </div>
        </div>
      </>
    );
  }
}

export default LinksPage;
