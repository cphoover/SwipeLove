import { useEffect } from "react";
import { useMyUser } from "./Providers/MyUserProvider";
import { useRouter } from "./Router";
import styled, { keyframes } from "styled-components";

const loadingAnimation = keyframes`
  0% {
    content: "Loading.";
  }
  33% {
    content: "Loading..";
  }
  66% {
    content: "Loading...";
  }
  100% {
    content: "Loading..";
  }
`;

const LoadingMsgWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  font-size: 2rem;
  font-family: "Montserrat", sans-serif;

  &:before {
    content: "Loading.";
    animation: ${loadingAnimation} 1s infinite;
  }
`;

const LoadingMsg = () => <LoadingMsgWrapper />;

const RedirectUnregistered = ({ children }) => {
  const { isCurrentPage, goto } = useRouter();
  const { myDetails, myUserDataLoaded, iAmRegistered } = useMyUser();
  // TODO local storage is not the way to do this...

  const notOnRegistrationPage =
    !isCurrentPage("settings") &&
    !isCurrentPage("update-photos") &&
    !isCurrentPage("admin");
  const userIsNotRegistered = !myDetails?.registered;

  useEffect(() => {
    if (myUserDataLoaded && !iAmRegistered && notOnRegistrationPage) {
      setTimeout(() => goto("settings"), 0);
    }
  }, [myUserDataLoaded, goto]);

  if (!myUserDataLoaded) return <LoadingMsg />;

  if (!iAmRegistered && notOnRegistrationPage) return <LoadingMsg />;
  // what if we just returned the registration page here?
  return children;
};

export default RedirectUnregistered;
