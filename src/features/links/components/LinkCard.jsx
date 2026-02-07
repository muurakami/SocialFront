import React from "react";
import styles from "./LinkCard.module.css";

class LinkCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      imageLoaded: false,
      imageError: false,
    };
  }

  handleImageLoad = () => {
    this.setState({ imageLoaded: true });
  };

  handleImageError = () => {
    this.setState({ imageError: true });
  };

  handleSubscribe = (e) => {
    e.stopPropagation();
    this.props.onSubscribe(this.props.link.id);
  };

  handleCardClick = () => {
    // TODO: Навигация на страницу линка
    console.log("Navigate to link:", this.props.link.id);
  };

  render() {
    const { link } = this.props;
    const { imageLoaded, imageError } = this.state;

    return (
      <div className={styles.card} onClick={this.handleCardClick}>
        {/* Изображение */}
        <div className={styles.imageContainer}>
          {!imageError ? (
            <>
              {!imageLoaded && (
                <div className={styles.skeleton}>
                  <div className={styles.skeletonPulse} />
                </div>
              )}
              <img
                src={link.image}
                alt={link.name}
                className={`${styles.image} ${imageLoaded ? styles.loaded : ""}`}
                onLoad={this.handleImageLoad}
                onError={this.handleImageError}
              />
            </>
          ) : (
            <div className={styles.imageFallback}>
              <span className={styles.fallbackIcon}>⚡</span>
            </div>
          )}

          {/* Категория badge */}
          <div className={styles.categoryBadge}>{link.category}</div>
        </div>

        {/* Контент */}
        <div className={styles.content}>
          <h3 className={styles.name}>{link.name}</h3>
          <p className={styles.description}>{link.description}</p>

          <div className={styles.meta}>
            <span className={styles.members}>
              <span className={styles.metaIcon}>◉</span>
              {link.members.toLocaleString()} members
            </span>
          </div>
        </div>

        {/* Кнопка подписки */}
        <div className={styles.actions}>
          <button
            className={`${styles.subscribeBtn} ${link.isSubscribed ? styles.subscribed : ""}`}
            onClick={this.handleSubscribe}
          >
            {link.isSubscribed ? "✓ SUBSCRIBED" : "+ SUBSCRIBE"}
          </button>
        </div>

        {/* Эффект сканирования */}
        <div className={styles.scanline} />
      </div>
    );
  }
}

export default LinkCard;
