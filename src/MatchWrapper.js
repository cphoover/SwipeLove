import { useEffect } from "react";
import Match from "./Match";
import { useMatches } from "./Providers/MatchesProvider";
import { useRouter } from "./Router";

export const MatchWrapper = ({ children }) => {
  const { showMatch, currentMatchProfile, setShowMatch } = useMatches();
  const { goto } = useRouter();

//   useEffect(() => {
//     if (showMatch && currentMatchProfile) {
//       [...document.querySelectorAll("html, body")].forEach((node) =>
//         node.classList.add("no-scroll")
//       );
//     } else {
//       [...document.querySelectorAll("html, body")].forEach((node) =>
//         node.classList.remove("no-scroll")
//       );
//     }

//     return () => {
//       [...document.querySelectorAll("html, body")].forEach((node) =>
//         node.classList.remove("no-scroll")
//       );
//     };
//   }, [showMatch, currentMatchProfile]);

  return (
    <>
      {children}
      {showMatch && currentMatchProfile && (
        
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
      
      )}
    </>
  );
};
