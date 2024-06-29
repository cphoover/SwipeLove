import React, { useEffect, useState } from "react";
import styled, { keyframes } from "styled-components";
import { useLoadingBar } from "./Providers/LoadingBarProvider";

const EaseImage = styled.img`
  opacity: 0;
  transition: opacity 0.5s;
`;

const fadeIn = keyframes`
  to {
    opacity: 1;
  }
`;

const Skeleton = styled.div`
  width: 100%;
  height: 100%;
  background: #d3d3d3;
  opacity: 0;
  animation: ${fadeIn} 1s forwards;
`;

const IMAGE_LOAD_TIMEOUT = 5000;

const Image = ({ src, alt, primary, nonBlocking, ...props }) => {
  const { initializeLoadingBar, finishLoadingBar } = useLoadingBar();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (src && !nonBlocking) {
      initializeLoadingBar(`imageLoad-${src}`);
    }

    setTimeout(handleImageLoad, IMAGE_LOAD_TIMEOUT);

    return () => {
      finishLoadingBar(`imageLoad-${src}`);
    };
  }, []);

  const handleImageLoad = () => {
    setIsLoaded(true);
    setTimeout(() => finishLoadingBar(`imageLoad-${src}`), 200);
  };

  return (
    <Skeleton>
      <EaseImage
        src={src}
        alt={alt}
        style={{ opacity: isLoaded ? 1 : 0 }}
        onLoad={handleImageLoad}
        {...props}
      />
    </Skeleton>
  );
};

export default Image;
