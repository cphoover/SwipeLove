import React from "react";
// import Router from "./Router";
// import { LocationProvider } from "./Providers/LocationProvider";
// import { OnlineUsersProvider } from "./Providers/OnlineUsersProvider";
// import { OtherUsersProvider } from "./Providers/OtherUsersProvider";
// import { MapFiltersProvider } from "./Providers/MapFiltersProvider";
// import { MyUserProvider } from "./Providers/MyUserProvider";
// import { CompletionsProvider } from "./Providers/CompletionsProvider";
import HomeScreen from "./Screens/HomeScreen";
import ChatsScreen from "./Screens/ChatsScreen";
import NotificationsScreen from "./Screens/NotificationsScreen";
import UpdatePhotosScreen from "./Screens/UpdatePhotosScreen";
import ProfileSettingsScreen from "./Screens/ProfileSettingsScreen";
import ConversationScreen from "./Screens/ConversationScreen";
import ProfileScreen from "./Screens/ProfileScreen";
import Router from "./Router";
import { MyUserProvider } from "./Providers/MyUserProvider";
import { LoadingBarProvider } from "./Providers/LoadingBarProvider";
import GlobalLoadingBar from "./LoadingBar";
import { MyPhotosProvider } from "./Providers/MyPhotosProvider";

const AppWrapper = ({ children }) => {
  return (
    <LoadingBarProvider>
      <MyUserProvider>
        <MyUserProvider>
          <MyPhotosProvider>
            <Router />
          </MyPhotosProvider>
        </MyUserProvider>
      </MyUserProvider>
    </LoadingBarProvider>
  );
  // return <ProfileScreen />;
  // return <ConversationScreen />;
  // return <UpdatePhotosScreen />;
  // return <NotificationsScreen />;
  // return <ChatsScreen />;
  // return <ProfileSettingsScreen />;
  // return <HomeScreen />;
  // return (
  //   <>
  //     <MyUserProvider>
  //       <MapFiltersProvider>
  //         <CompletionsProvider>
  //           <OtherUsersProvider>
  //             <OnlineUsersProvider>
  //               <LocationProvider>
  //                 <Router />
  //               </LocationProvider>
  //             </OnlineUsersProvider>
  //           </OtherUsersProvider>
  //         </CompletionsProvider>
  //       </MapFiltersProvider>
  //     </MyUserProvider>
  //   </>
  // );
};

export default AppWrapper;
