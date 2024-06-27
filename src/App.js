import React from "react";
// import Router from "./Router";
// import { LocationProvider } from "./Providers/LocationProvider";
// import { OnlineUsersProvider } from "./Providers/OnlineUsersProvider";
// import { OtherUsersProvider } from "./Providers/OtherUsersProvider";
// import { MapFiltersProvider } from "./Providers/MapFiltersProvider";
// import { MyUserProvider } from "./Providers/MyUserProvider";
// import { CompletionsProvider } from "./Providers/CompletionsProvider";
import Router from "./Router";
import { MyUserProvider } from "./Providers/MyUserProvider";
import { LoadingBarProvider } from "./Providers/LoadingBarProvider";
import { MyPhotosProvider } from "./Providers/MyPhotosProvider";
import { MatchesProvider } from "./Providers/MatchesProvider";

const AppWrapper = ({ children }) => {
  return (
    <LoadingBarProvider>
      <MyUserProvider>
        <MyUserProvider>
          <MatchesProvider>
            <MyPhotosProvider>
              <Router />
            </MyPhotosProvider>
          </MatchesProvider>
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
