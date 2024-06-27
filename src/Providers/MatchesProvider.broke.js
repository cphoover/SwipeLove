import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useMemo,
} from "react";
import { supabase } from "../db";
import { getUserId } from "../utils";

const MatchesContext = createContext();

const FETCH_RECENT_MATCHES_INTERVAL = 5000;

export const MatchesProvider = ({ children }) => {
  const [matchesQueue, setMatchesQueue] = useState([]);
  const [showMatch, setShowMatch] = useState(false);
  const [currentMatchProfile, setCurrentMatchProfile] = useState(null);
  const [lastQueryTime, setLastQueryTimeState] = useState(getLastQueryTime());
  /*
new Date("2024-06-26T15:31:54.243186+00:00") > 
new Date( 2024-06-26T15:27:55.219Z)
*/
  const updateLastQueryTime = (epochTime) => {
    console.log('~~ Updating lastQueryTime to: ', epochTime);
    setLastQueryTimeState(epochTime);
    setLastQueryTime(epochTime.toString());
  };

  /*
  Fetched 1 matches from the server: [1719418064595]
MatchesProvider.js:68 ~~ Filtered data to 1 matches after client-side filtering.
MatchesProvider.js:80 ~~ Fetched profile for user_id: 4cb79c73-2618-4941-bc0e-1f2448d05d4d
MatchesProvider.js:25 ~~ Updating lastQueryTime to:  1719418064595
MatchesProvider.js:61 ~~ Fetching recent matches after: 1719417848068
MatchesProvider.js:64 ~~ Fetched 1 matches from the server: [1719418064595]
MatchesProvider.js:68 ~~ Filtered data to 1 matches after client-side filtering.
MatchesProvider.js:80 ~~ Fetched profile for user_id: 4cb79c73-2618-4941-bc0e-1f2448d05d4d
MatchesProvider.js:25 ~~ Updating lastQueryTime to:  1719418064595
MatchesProvider.js:61 ~~ Fetching recent matches after: 1719417848068
MatchesProvider.js:64 ~~ Fetched 1 matches from the server: [1719418064595]
MatchesProvider.js:68 ~~ Filtered data to 1 matches after client-side filtering.
MatchesProvider.js:80 ~~ Fetched profile for user_id: 4cb79c73-2618-4941-bc0e-1f2448d05d4d
MatchesProvider.js:25 ~~ Updating lastQueryTime to:  1719418064595
MatchesProvider.js:61 ~~ Fetching recent matches after: 1719417848068
MatchesProvider.js:64 ~~ Fetched 1 matches from the server: [1719418064595]
MatchesProvider.js:68 ~~ Filtered data to 1 matches after client-side filtering.
MatchesProvider.js:80 ~~ Fetched profile for user_id: 4cb79c73-2618-4941-bc0e-1f2448d05d4d
MatchesProvider.js:25 ~~ Updating lastQueryTime to:  1719418064595
MatchesProvider.js:61 ~~ Fetching recent matches after: 1719417848068
MatchesProvider.js:64 ~~ Fetched 1 matches from the server: [1719418064595]
MatchesProvider.js:68 ~~ Filtered data to 1 matches after client-side filtering.
MatchesProvider.js:80 ~~ Fetched profile for user_id: 4cb79c73-2618-4941-bc0e-1f2448d05d4d
MatchesProvider.js:25 ~~ Updating lastQueryTime to:  1719418064595
*/

  const showNextMatch = () => {
    if (matchesQueue.length > 0) {
      const nextMatch = matchesQueue.shift();
      setCurrentMatchProfile(nextMatch);
      setShowMatch(true);
    } else {
      setShowMatch(false);
    }
  };

  useEffect(() => {
    if (matchesQueue.length > 0 && !showMatch) {
      showNextMatch();
    }
  }, [matchesQueue, showMatch]);

  const fetchRecentMatches = async () => {
    const { data, error } = await supabase
      .from("matches")
      .select("*")
      .or(`user_id_1.eq.${getUserId()},user_id_2.eq.${getUserId()}`)
      .gt("created_at", new Date(lastQueryTime + 1).toISOString())
      .order("created_at", { ascending: true }); // Ensure the latest matches are last

    if (error) {
      console.error("Error fetching recent matches:", error);
    } else {
      const filteredData = data.filter(
        (match) => new Date(match.created_at).getTime() > lastQueryTime
      );

      console.log(
        `~~ Fetching recent matches after: ${lastQueryTime}`
      );
      console.log(
        `~~ Fetched ${data.length} matches from the server:`,
        data.map((match) => new Date(match.created_at).getTime())
      );
      console.log(
        `~~ Filtered data to ${filteredData.length} matches after client-side filtering.`
      );

      const profiles = await Promise.all(
        filteredData.map(async (match) => {
          const otherUserId =
            match.user_id_1 === getUserId() ? match.user_id_2 : match.user_id_1;

          if (
            !matchesQueue.some((profile) => profile.user_id === otherUserId)
          ) {
            console.log(`~~ Fetched profile for user_id: ${otherUserId}`);
            const profile = await fetchUserProfile(otherUserId);

            if (profile) {
              return profile;
            }
            console.log(
              `~~ Adding profile for user_id: ${profile.user_id} to matchesQueue`
            );
          }
          return null;
        })
      );

      profiles.forEach((profile) => {
        if (profile) {
          setMatchesQueue((prevQueue) => [...prevQueue, profile]);
        }
      });

      if (filteredData.length > 0) {
        const latestMatchTime = new Date(
          filteredData[filteredData.length - 1].created_at
        ).getTime();

        updateLastQueryTime(latestMatchTime);
      }
    }
  };

  useEffect(() => {
    const channel = supabase
      .channel("matches")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "matches",
        },
        (payload) => {
          if (
            payload.new.user_id_1 === getUserId() ||
            payload.new.user_id_2 === getUserId()
          ) {
            console.log(`~~ New match received with ID: ${payload.new.id}`);
            handleNewMatch(payload.new);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // // New useEffect for polling
  // useEffect(() => {
  //   const intervalId = setInterval(
  //     fetchRecentMatches,
  //     FETCH_RECENT_MATCHES_INTERVAL
  //   );

  //   return () => {
  //     clearInterval(intervalId);
  //   };
  // }, []);

  // useEffect(() => {
  //   const handleVisibilityChange = () => {
  //     if (document.visibilityState === "visible") {
  //       fetchRecentMatches();
  //     }
  //   };

  //   document.addEventListener("visibilitychange", handleVisibilityChange);

  //   return () => {
  //     document.removeEventListener("visibilitychange", handleVisibilityChange);
  //   };
  // }, []);

  const handleNewMatch = async (match) => {
    const matchCreatedAtEpoch = new Date(match.created_at).getTime();
    console.log(
      `~~ Handling new match with ID: ${match.id} created at ${matchCreatedAtEpoch}`
    );

    if (matchCreatedAtEpoch <= lastQueryTime) {
      console.log(
        `~~ Match ID ${match.id} is older than lastQueryTime. Skipping.`
      );
      return;
    }

    const otherUserId =
      match.user_id_1 === getUserId() ? match.user_id_2 : match.user_id_1;

    // Check if the profile is already in the queue
    if (!matchesQueue.some((profile) => profile.user_id === otherUserId)) {
      const profile = await fetchUserProfile(otherUserId);

      if (profile) {
        setMatchesQueue((prevQueue) => [...prevQueue, profile]);
        updateLastQueryTime(new Date(match.created_at).getTime());
      }
    }
  };

  return (
    <MatchesContext.Provider
      value={{
        matchesQueue,
        showMatch,
        setShowMatch,
        currentMatchProfile,
        showNextMatch,
      }}
    >
      {children}
    </MatchesContext.Provider>
  );
};

export const useMatches = () => useContext(MatchesContext);

const fetchUserProfile = async (user_id) => {
  const { data: userProfile, error: userProfileError } = await supabase
    .from("user_profiles")
    .select("*")
    .eq("user_id", user_id)
    .single();

  if (userProfileError) {
    console.error("Error fetching user profile:", userProfileError);
    return null;
  }

  const { data: mainPhoto, error: mainPhotoError } = await supabase
    .from("main_photos")
    .select("photo_id")
    .eq("user_id", user_id)
    .single();

  if (mainPhotoError) {
    console.error("Error fetching main photo:", mainPhotoError);
    return userProfile;
  }

  const { data: profilePhoto, error: profilePhotoError } = await supabase
    .from("profile_photos")
    .select("photo_med")
    .eq("id", mainPhoto.photo_id)
    .single();

  if (profilePhotoError) {
    console.error("Error fetching profile photo:", profilePhotoError);
    return userProfile;
  }

  return { ...userProfile, photo_med: profilePhoto.photo_med };
};

const getLastQueryTime = () => {
  return parseInt(localStorage.getItem("lastQueryTime"), 10) || 0;
};

const setLastQueryTime = (time) => {
  localStorage.setItem("lastQueryTime", time);
};
