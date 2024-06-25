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

// Create a context
const RouterContext = createContext();

function Router() {
  const [currentPage, setCurrentPage] = useState(
    window.location.hash.substr(1) || "map"
  );

  useEffect(() => {
    const handleHashChange = () => {
      setCurrentPage(window.location.hash.substr(1));
    };

    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  // Function to check if the current page is the page in question
  const isCurrentPage = (page) => currentPage === page;

  // Function to navigate to a different page
  const goto = (page) => {
    // scroll to top of the page

    window.location.hash = page;
    window.scrollTo(0, 0);
  };

  // Function to render the component based on the current page
  const renderRoute = () => {
    switch (currentPage) {
      case "home":
        return <HomeScreen />;
      case "chats":
        return <ChatsScreen />;
      case "admin":
        return <AdminScreen />;
      case "conversation":
        return <ConversationScreen />;
      case "settings":
        return <ProfileSettingsScreen />;
      case "update-photos":
        return <UpdatePhotosScreen />;
      case "profile":
        return <ProfileScreen />;
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
