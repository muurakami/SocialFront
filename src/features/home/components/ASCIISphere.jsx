import React from "react";
import styles from "./ASCIISphere.module.css";

class ASCIISphere extends React.Component {
  constructor(props) {
    super(props);
    this.canvasRef = React.createRef();
    this.animationId = null;
    this.A = 0;
    this.B = 0;
  }

  componentDidMount() {
    this.initTorus();
  }

  componentWillUnmount() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
  }

  initTorus = () => {
    const canvas = this.canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    const width = (canvas.width = 600);
    const height = (canvas.height = 600);

    const R1 = 13;
    const R2 = 10;
    const K2 = 40;
    const K1 = (width * K2 * 3) / (8 * (R1 + R2));

    const chars = ".:-=+*#%@";

    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      const zbuffer = new Array(width * height).fill(0);
      const output = new Array(width * height).fill(" ");

      for (let theta = 0; theta < 6.28; theta += 0.07) {
        const costheta = Math.cos(theta);
        const sintheta = Math.sin(theta);

        for (let phi = 0; phi < 6.28; phi += 0.02) {
          const cosphi = Math.cos(phi);
          const sinphi = Math.sin(phi);

          const circlex = R2 + R1 * costheta;
          const circley = R1 * sintheta;

          const x =
            circlex *
              (Math.cos(this.B) * cosphi +
                Math.sin(this.A) * Math.sin(this.B) * sinphi) -
            circley * Math.cos(this.A) * Math.sin(this.B);
          const y =
            circlex *
              (Math.sin(this.B) * cosphi -
                Math.sin(this.A) * Math.cos(this.B) * sinphi) +
            circley * Math.cos(this.A) * Math.cos(this.B);
          const z =
            K2 +
            Math.cos(this.A) * circlex * sinphi +
            circley * Math.sin(this.A);
          const ooz = 1 / z;

          const xp = Math.floor(width / 2 + K1 * ooz * x);
          const yp = Math.floor(height / 2 - K1 * ooz * y);

          if (xp >= 0 && xp < width && yp >= 0 && yp < height) {
            const idx = xp + yp * width;

            if (ooz > zbuffer[idx]) {
              zbuffer[idx] = ooz;

              const N =
                Math.cos(phi) * costheta * Math.sin(this.B) -
                Math.cos(this.A) * Math.cos(theta) * sinphi -
                Math.sin(this.A) * Math.sin(theta) +
                Math.cos(phi) * costheta * Math.cos(this.B) * Math.sin(this.A);

              const luminance = N > 0 ? N : 0;
              const luminance_index = Math.floor(luminance * 8);
              output[idx] = chars[luminance_index];
            }
          }
        }
      }

      ctx.font = "8px monospace";
      for (let k = 0; k < width * height; k++) {
        if (output[k] !== " ") {
          const x = k % width;
          const y = Math.floor(k / width);
          const brightness = chars.indexOf(output[k]) / chars.length;
          ctx.fillStyle = `rgba(0, 255, 136, ${brightness * 0.9 + 0.1})`;
          ctx.fillText(output[k], x, y);
        }
      }

      this.A += 0.04;
      this.B += 0.02;

      this.animationId = requestAnimationFrame(animate);
    };

    animate();
  };

  render() {
    return (
      <div className={styles.container}>
        <canvas ref={this.canvasRef} className={styles.canvas} />
      </div>
    );
  }
}

export default ASCIISphere;
