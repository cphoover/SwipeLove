import { useEffect, useLayoutEffect, useState } from "react";
import Match from "./Match";
import { useMatches } from "./Providers/MatchesProvider";
import { useRouter } from "./Router";
import { set } from "lodash";

let timeoutPtr;
export const MatchWrapper = ({ children }) => {
  const { showMatch, currentMatchProfile, setShowMatch } = useMatches();
  const { goto } = useRouter();

//   // stupid hack to prevent scrolling when match is shown
//   useLayoutEffect(() => {
//     if (showMatch) {
//       if (timeoutPtr) {
//         clearTimeout(timeoutPtr);
//       }
//       [...document.querySelectorAll("html,body")].forEach((node) =>
//         node.classList.add("no-scroll")
//       );
//     } else {
//       timeoutPtr = setTimeout(
//         () =>
//           [...document.querySelectorAll("html,body")].forEach((node) =>
//             node.classList.remove("no-scroll")
//           ),
//         2000
//       );
//     }

//     return () => {
//       timeoutPtr = setTimeout(
//         () =>
//           [...document.querySelectorAll("html,body")].forEach((node) =>
//             node.classList.remove("no-scroll")
//           ),
//         500
//       );
//     };
//   }, [showMatch]);

  return (
    <>
      {children}
      {showMatch && currentMatchProfile && (
        <>
          <Match
            profile={currentMatchProfile}
            onClose={() => setShowMatch(false)}
            onClickProfilePhoto={() => {
              setShowMatch(false);
              goto(`profile?user_id=${currentMatchProfile.user_id}`);
            }}
            onSendMsg={() => {
              setShowMatch(false);
              goto(`conversation?user_id=${currentMatchProfile.user_id}`);
            }}
          />
        </>
      )}
    </>
  );
};
