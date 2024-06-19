import { useEffect, useState, useContext, createContext } from "react";
import { getUserId } from "../utils.js";
import { supabase } from "../db";

const OtherUsersContext = createContext(null);

export const useOtherUsers = () => {
  const context = useContext(OtherUsersContext);
  if (!context) {
    throw new Error("useOtherUsers must be used within a OtherUsersProvider");
  }
  return context;
};

export const OtherUsersProvider = ({ children }) => {
  const [nonFilteredUsers, setNonFilteredUsers] = useState([]);
  const [otherUsersDetails, setOtherUsersDetails] = useState(new Map());
  const userId = getUserId();

  const userIsRegistered = (userId) => {
    debug("userIsRegistered", userId, otherUsersDetails.has(userId));
    return otherUsersDetails.has(userId);
  };

  // Filter users
  const otherUsersPositions = nonFilteredUsers.filter(
    (user) => user.user_id !== userId && userIsRegistered(user.user_id)
  );

  async function fetchUserDetails(userIds) {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .in("user_id", userIds);

    if (error) {
      console.error("Error fetching user details:", error);
      return;
    }

    const userDetailsMap = new Map(otherUsersDetails);
    data.forEach((user) => {
      userDetailsMap.set(user.user_id, user);
    });
    debug("userDetailsMap", userDetailsMap);
    setOtherUsersDetails(userDetailsMap);
  }

  useEffect(() => {
    const oneHourAgo = new Date(
      new Date().getTime() - 3600 * 1000
    ).toISOString();
    const fetchOtherUsers = async () => {
      const { data, error } = await supabase
        .from("userPositions")
        .select("*")
        .neq("user_id", userId)
        .or(`created_at.gte.${oneHourAgo},updated_at.gte.${oneHourAgo}`);

      debug("fetchOtherUsers data", data);

      try {
        await fetchUserDetails(data.map((user) => user.user_id));
      } catch (error) {
        console.error("Error fetching user details:", error);
      }

      if (error) {
        console.error("Error fetching other users:", error.message);
      } else {
        setNonFilteredUsers(data);
      }
    };

    fetchOtherUsers();

    const channel = supabase
      .channel("userPositions")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "userPositions" },
        async (payload) => {
          await fetchUserDetails([payload.new.user_id]);
          setNonFilteredUsers((users) => [...users, payload.new]);
        }
      )
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "userPositions" },
        async (payload) => {
          await fetchUserDetails([payload.new.user_id]);
          setNonFilteredUsers((users) =>
            users.map((user) =>
              user.user_id === payload.new.user_id ? payload.new : user
            )
          );
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId]);

  const getUserAvatar = (userId) => {
    return otherUsersDetails.get(userId)?.avatar_url;
  };

  const getSmallAvatar = (userId) => {
    return otherUsersDetails.get(userId)?.avatar_small;
  };

  const UserHelpers = {
    getUserAvatar,
    getSmallAvatar,
  };

  return (
    <OtherUsersContext.Provider
      value={{
        otherUsersPositions,
        otherUsersDetails,
        UserHelpers,
      }}
    >
      {children}
    </OtherUsersContext.Provider>
  );
};