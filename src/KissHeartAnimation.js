import React, { useEffect } from "react";
import styled from "styled-components";

const ANIMATION_COUNT = 30;

const AnimationContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  pointer-events: none;
  overflow: hidden;
  z-index: 1000;
`;

const KissHeartAnimation = ({ start }) => {
  useEffect(() => {
    if (start) {
      startKissAnimation();
    }
  }, [start]);

  function startKissAnimation() {
    const container = document.getElementById("animation-container");

 

    for (let i = 0; i < ANIMATION_COUNT; i++) {
      const emoji = document.createElement("div");
      emoji.className = "kiss-emoji";
      emoji.innerHTML = "💋";
      emoji.style.left = Math.random() * 100 + "vw";
      const duration = Math.random() * 3 + 2;
      emoji.style.animationDuration = duration + "s";
      emoji.style.opacity = Math.random();

      container.appendChild(emoji);

      // Remove the emoji after the animation duration
      setTimeout(() => {
        container.removeChild(emoji);
        // Check if this is the last emoji to be removed
      }, duration * 1000);
    }
  }

  return (
    <>
      <AnimationContainer id="animation-container" />
      <style>{`

        .kiss-emoji {
          position: absolute;
          font-size: 2rem;
          animation: fall linear infinite;
        }

        @keyframes fall {
          0% {
            transform: translateY(-100%);
          }
          100% {
            transform: translateY(100vh);
          }
        }

        #start-animation {
          position: absolute;
          z-index: 10;
          padding: 10px 20px;
          font-size: 1rem;
          background: #ff4081;
          color: white;
          border: none;
          border-radius: 5px;
          cursor: pointer;
        }
      `}</style>
    </>
  );
};

export default KissHeartAnimation;
