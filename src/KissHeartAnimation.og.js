import React, { useEffect } from "react";
import styled, { keyframes } from "styled-components";

// const AnimationContainer = styled.div`
//   position: absolute;
//   top: 0;
//   left: 0;
//   width: 100%;
//   height: 100%;
//   pointer-events: none;
//   z-index: 1000;
// `;

const AnimationContainer = styled.div`
  position: fixed; /* Changed from absolute to fixed */
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh; /* Ensure it does not exceed the viewport height */
  pointer-events: none;
  overflow: hidden; /* Hide the overflow */
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

    for (let i = 0; i < 30; i++) {
      const emoji = document.createElement("div");
      emoji.className = "kiss-emoji";
      emoji.innerHTML = "💋";
      emoji.style.left = Math.random() * 100 + "vw";
      emoji.style.animationDuration = Math.random() * 3 + 2 + "s";
      emoji.style.opacity = Math.random();

      container.appendChild(emoji);

      // Remove the emoji after the animation duration
      setTimeout(() => {
        container.removeChild(emoji);
      }, (Math.random() * 3 + 2) * 1000);
    }
  }

  return (
    <>
      <AnimationContainer id="animation-container" />
      <style>{`
  
#animation-container {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
}

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
