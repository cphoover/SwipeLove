import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useMemo,
  useCallback,
} from "react";
import { supabase } from "../db";
import { getUserId } from "../utils";
import { add } from "lodash";

const MatchesContext = createContext();

/*

const getLastQueryTime = () => {
  return parseInt(localStorage.getItem("lastQueryTime"), 10) || 0;
};


*/

export const MatchesProvider = ({ children }) => {
  const [latestMatchEpoch, setLatestMatchEpoch] = useState(
    parseInt(localStorage.getItem(`latestMatchEpoch-${getUserId()}`) || 0, 10)
  );
  const [matchesMap, setMatchesMap] = useState(new Map());
  const [showMatch, setShowMatch] = useState(false);
  const [currentMatchProfile, setCurrentMatchProfile] = useState(null);

  const showNextMatch = () => {
    console.log("~~ Showing next match...");
    const matches = [...matchesMap];
    const nextMatch = matches.shift()?.[1];
    // console.log(
    //   "~~ showNextMatch before: ",
    //   [...matchesMap],
    //   "after: ",
    //   matches,
    //   "nextMatch: ",
    //   nextMatch
    // );
    setCurrentMatchProfile(nextMatch);
    setMatchesMap(new Map([...matches]));
    setShowMatch(true);
  };

  useEffect(() => {
    console.log("~~ show next useEffect", {
      matchesMap,
      showMatch,
    });
    if (matchesMap.size > 0 && !showMatch) {
      showNextMatch();
    }
  }, [matchesMap, showMatch]);

  const processMatches = async (matches) => {
    if (!matches || matches.length === 0) {
      return;
    }
    console.log(
      "~~ @ processing matches",
      matches,
      matches.map((m) => new Date(m.created_at).getTime())
    );

    // sort matches by created_at
    const sortedMatches = matches.sort(
      (a, b) =>
        new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
    );

    const latestMatch = sortedMatches[sortedMatches.length - 1];
    // const now = new Date().getTime();
    const latestTime = new Date(latestMatch.created_at).getTime();

    console.log("~~ @ latestMatch:", latestTime);

    const filteredMatches = sortedMatches.filter(
      (match) => new Date(match.created_at).getTime() > latestMatchEpoch
    );

    if (filteredMatches.length === 0) {
      console.log("~~ @ No new matches to process.");
      return;
    }

    const profilePromiseArray = filteredMatches.map(async (match) => {
      const otherUserId =
        match.user_id_1 === getUserId() ? match.user_id_2 : match.user_id_1;

      console.log("~~ otherUserId:", otherUserId);
      if (matchesMap.has(otherUserId)) {
        return null;
      }
      return fetchUserProfile(otherUserId);
    });

    const profiles = (await Promise.all(profilePromiseArray)).filter(Boolean);

    const newMatchesMap = new Map([
      ...matchesMap,
      ...profiles
        .filter((profile) => profile)
        .map((profile) => [profile.user_id, profile]),
    ]);

    console.log("~~ newMatchesMap:", newMatchesMap);

    setMatchesMap(newMatchesMap);

    setLatestMatchEpoch(latestTime);
    localStorage.setItem(`latestMatchEpoch-${getUserId()}`, latestTime);
  };

  useEffect(() => {
    console.log("~~ Subscribing to matches channel...");

    const cb = (payload) => {
      console.log("~~ Received new match:", payload.new);
      return processMatches([payload.new]);
    };
    // @TODO should use broadcast and listen for the changes on the server end...
    const channel = supabase
      .channel("matches")
      .on(
        "postgres_changes",
        {
          /** @TODO  WE should be using broadcast instead of postgres_changes...
           *  as this will cause a seperate db read for each user to check RLS **/
          event: "INSERT",
          schema: "public",
          table: "matches",
          filter: `user_id_1=eq.${getUserId()}`,
        },
        cb
      )
      .on(
        "postgres_changes",
        {
          /** @TODO  WE should be using broadcast instead of postgres_changes...
           *  as this will cause a seperate db read for each user to check RLS **/
          event: "INSERT",
          schema: "public",
          table: "matches",
          filter: `user_id_2=eq.${getUserId()}`,
        },
        cb
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchRecentMatches = useCallback(async () => {
    console.log("~~ @ Fetching recent matches after...", latestMatchEpoch + 1);
    const { data, error } = await supabase
      .from("matches")
      .select("*")
      .or(`user_id_1.eq.${getUserId()},user_id_2.eq.${getUserId()}`)
      .gt("created_at", new Date(latestMatchEpoch + 1).toISOString())
      .order("created_at", { ascending: true }); // Ensure the latest matches are last

    return processMatches(data);
  }, [latestMatchEpoch, processMatches]);

  useEffect(() => {
    const fetchMatchesPoll = setInterval(() => fetchRecentMatches() , 5000);

    return () => {
      clearInterval(fetchMatchesPoll);
    };
  }, [fetchRecentMatches]);

  return (
    <MatchesContext.Provider
      value={{
        matchesMap,
        showMatch,
        setShowMatch,
        currentMatchProfile,
        showNextMatch,
        setLatestMatchEpoch,
      }}
    >
      {children}
    </MatchesContext.Provider>
  );
};

export const useMatches = () => useContext(MatchesContext);

const fetchUserProfile = async (user_id) => {
  console.log(`~~ Fetching profile for user_id: ${user_id}`);
  const { data: userProfile, error: userProfileError } = await supabase
    .from("user_profiles")
    .select("*")
    .eq("user_id", user_id)
    .single();

  console.log({ userProfile, userProfileError });

  if (userProfileError) {
    console.error("~~ Error fetching user profile:");
    console.error(userProfileError.message);
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
