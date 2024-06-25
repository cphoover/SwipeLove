import styled, { keyframes } from "styled-components";
import React from "react";
import { useLoadingBar } from "./Providers/LoadingBarProvider";
import { LYFT_PINK } from "./themes/colors";

const loadingAnimation = keyframes`
  0% { transform: translateX(-100%); }
  50% { transform: translateX(0); }
  100% { transform: translateX(100%); }
`;

const LoadingBar = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 4px;
  background: linear-gradient(to right, ${LYFT_PINK}, ${LYFT_PINK}, ${LYFT_PINK});
  opacity: .5;
  animation: ${loadingAnimation} 1.5s infinite linear;
  z-index: 1000;
`;

const Blocker = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(255, 255, 255, 0.5);
  z-index: 999;
`;

const GlobalLoadingBar = () => {
  const { loading } = useLoadingBar();

  return loading ? (
    <>
      <LoadingBar />
      <Blocker />
    </> 
  ) : null;
};

export default GlobalLoadingBar;
