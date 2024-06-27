import React, { createContext, useContext, useState, useEffect } from "react";
// import MainMapScreen from "./Screens/MainMapScreenUseReactMarkers";
import NotificationsScreen from "./Screens/NotificationsScreen";

import RedirectUnregistered from "./RedirectUnregistered";
import HomeScreen from "./Screens/HomeScreen";
import ChatsScreen from "./Screens/ChatsScreen";
import ConversationScreen from "./Screens/ConversationScreen";
import ProfileScreen from "./Screens/ProfileScreen";
import UpdatePhotosScreen from "./Screens/UpdatePhotosScreen";
import ProfileSettingsScreen from "./Screens/ProfileSettingsScreen";
import GlobalLoadingBar from "./LoadingBar";
import { useLoadingBar } from "./Providers/LoadingBarProvider";
import AdminScreen from "./Screens/AdminScreen";
import { MatchWrapper } from "./MatchWrapper";

// Create a context
const RouterContext = createContext();

function parseHash(hash) {
  const [page, queryString] = hash.split("?");
  const queryParams = new URLSearchParams(queryString);
  return { page, queryParams };
}

function Router() {
  const [currentPage, setCurrentPage] = useState(() => {
    const { page } = parseHash(window.location.hash.substr(1));
    return page || "home";
  });

  const [queryParams, setQueryParams] = useState(() => {
    const { queryParams } = parseHash(window.location.hash.substr(1));
    return queryParams;
  });

  useEffect(() => {
    const handleHashChange = () => {
      const { page, queryParams } = parseHash(window.location.hash.substr(1));
      setCurrentPage(page);
      setQueryParams(queryParams);
    };

    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  // Function to check if the current page is the page in question
  const isCurrentPage = (page) => currentPage === page;

  // Function to navigate to a different page
  const goto = (page, params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const newHash = queryString ? `${page}?${queryString}` : page;
    window.location.hash = newHash;
    window.scrollTo(0, 0);
  };

  // Function to render the component based on the current page
  const renderRoute = () => {
    switch (currentPage) {
      case "home":
        return (
          <MatchWrapper>
            <HomeScreen />
          </MatchWrapper>
        );
      case "chats":
        return (
          <MatchWrapper>
            <ChatsScreen />
          </MatchWrapper>
        );
      case "admin":
        return <AdminScreen />;
      case "conversation":
        return <ConversationScreen />;
      case "settings":
        return <ProfileSettingsScreen />;
      case "update-photos":
        return <UpdatePhotosScreen />;
      case "profile":
        return (
          <MatchWrapper>
            <ProfileScreen />
          </MatchWrapper>
        );
      case "notifications":
        return <NotificationsScreen />;
      default:
        return <HomeScreen />; // Default route or add a NotFound screen if preferred
    }
  };

  const contextValue = {
    currentPage,
    isCurrentPage,
    goto,
    queryParams,
  };

  return (
    <RouterContext.Provider value={contextValue}>
      <RedirectUnregistered>{renderRoute()}</RedirectUnregistered>

      <GlobalLoadingBar />
      {/* {renderRoute()} */}
    </RouterContext.Provider>
  );
}

// Export the context for use in other components
export const useRouter = () => useContext(RouterContext);

export default Router;
