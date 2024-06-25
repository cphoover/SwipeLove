// import { useEffect, useState } from "react";
import styled from "styled-components";
import { Container, Content } from "../Layout";
import BottomTabMenu from "../BottomTabMenu";
import TinderCard from "react-tinder-card";
import RejectButton from "../RejectButton";
import LikeButton from "../LikeButton";
import React, { useEffect, useState, useMemo, useRef } from "react";
// import { supabase } from "../db";
// import { getUserId } from "../utils";
import NotificationIcon from "../icons/notification";
import { useRouter } from "../Router";
import Image from "../Image";
import QuickFlingsLogo from "../icons/quickflings";
import { getUserId } from "../utils";
import { supabase } from "../db";
import Match from "../Match";
import { useLoadingBar } from "../Providers/LoadingBarProvider";

const CardList = styled.ul`
  list-style-type: none;
  padding: 0;
`;

const CardLine = styled.li`
  & svg {
    vertical-align: middle;
    margin-right: 8px;
    position: relative;
    top: -2px;
  }
  color: #121212;
  font-size: 12px;
  font-family: "Montserrat";
  font-weight: 500;
  // height: 48px;

  background-color: #ffffff;
  padding: 16px;
  margin-bottom: 13px;
  border-radius: 24px;
  box-shadow: 0px 2px 10px rgba(3, 3, 3, 0.1);
  &.active {
    background-color: black;
    color: white;
    box-shadow: none;
    & svg {
      fill: white;
    }
  }
`;

const ScoreWrapper = styled.div`
  display: flex;
`;

const PhotoWrapper = styled.div`
  width: fit-content;
  margin-right: 20px;
`;

const ScoreDetails = styled.div`
  flex: 1;
`;

const PersonName = styled.div`
  // color: #030303;
  font-size: 20px;
  font-family: "Montserrat";
  font-weight: 600;
  line-height: 24px;
`;

const Score = styled.div`
  // color: #030303;
  font-size: 18px;
  font-family: "Montserrat";
  font-weight: 400;
  line-height: 21px;
  margin-top: 4px;
`;

const HomeHeaderWrapper = styled.div`
  height: 68px;
  border-bottom: 1px solid #e5e7eb;
  box-sizing: border-box;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
`;

const HomeHeaderLogo = styled.div`
  display: flex;
  align-items: center;
`;

const HomeHeaderText = styled.span`
  color: #41626d;
  font-size: 20px;
  font-family: "Montserrat";
  letter-spacing: -0.5px;
  line-height: 28px;
  padding-left: 5px;
  font-weight: 500;
`;

const HomeHeaderButton = styled.div`
  background: none;
  border: none;
  cursor: pointer;
  & svg {
    fill: #7f7f7f;
    width: 24px;
  }
`;

const ProfileCard = styled.div`
  width: calc(100% - 40px);
  background-color: #ffffff;
  border-radius: 24px;
  height: 500px;
  padding: 24px;
  box-shadow: 2px 0px 10px rgb(233 232 232);
`;

/**
 * 
 * style="
   
"
 */

const NoMoreProfileCard = styled(ProfileCard)`
  background: #aae5d6;
  & img {
    width: 82%;
  }
`;

const ProfilePhoto = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 300px;
  width: 100%; /* Adjust as needed */
  overflow: hidden; /* To hide the overflow part of the image */
  position: relative; /* Necessary for absolute positioning */
  border-radius: 24px;
  & img {
    width: 100%;
    border-radius: 24px;
    display: block;
    height: auto; /* Maintain aspect ratio */
    position: absolute; /* Absolute positioning within the parent */
    top: 50%; /* Move to the vertical center */
    left: 50%; /* Move to the horizontal center */
    transform: translate(-50%, -50%); /* Center the image */
  }
  overflow: hidden;
`;

const NoMoreProfilePhoto = styled(ProfilePhoto)`
  & div {
    background: #aae5d6;
  }
  & img {
    width: 82%;
  }
`;

const ProfileName = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 24px;
  font-family: "Open Sans";
  font-weight: 500;
  line-height: 32px;
  text-align: center;
  padding-top: 20px;
  & svg {
    width: 18px;
  }
`;

const ProfileAge = styled.div`
  color: #030303;
  font-size: 18px;
  font-family: "Open Sans";
  font-weight: 600;
  line-height: 28px;
  text-align: center;
  padding-top: 8px;
`;

const ProfileBio = styled.div`
  color: #030303;
  font-size: 14px;
  font-family: "Open Sans";
  line-height: 20px;
  text-align: center;
`;

const InteractionContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 40px;
  padding-top: 20px;
`;

const StyledTinderCard = styled(TinderCard)`
  width: 100%;
  max-width: 400px; /* Adjust as per your design */
  height: 100%;
  max-height: 600px; /* Adjust as per your design */
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: relative;
`;

const SwipeArea = styled.div`
  position: relative;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: stretch;

  height: 570px; // need to find a better way to set this
  & .swipe {
    position: absolute;
  }
`;

const HiddenAdminButton = styled.div`
  background: white;
  flex: 1;
  height: 100%;
  margin-right: 20px;
`;

const fetchUserProfile = async (user_id) => {
  const { data, error } = await supabase
    .from("user_profiles")
    .select("*")
    .eq("user_id", user_id)
    .single();

  if (error) {
    console.error("Error fetching user profile:", error);
    return null;
  }

  return data;
};

const Centered = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

function calculateAge(birthDateString) {
  const birthDate = new Date(birthDateString);
  if (isNaN(birthDate)) {
    throw new Error("Invalid date format. Please use 'YYYY-MM-DD'");
  }

  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  const dayDiff = today.getDate() - birthDate.getDate();

  if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
    age--;
  }

  return age;
}

function getResizedURL(seedURL, { width, height }) {
  const url = new URL(seedURL);
  url.searchParams.set("width", width);
  url.searchParams.set("height", height);
  return url.toString();
}

const recordInteraction = async (user_id_to, interaction_type) => {
  const { error } = await supabase.from("interactions").insert([
    {
      user_id_from: getUserId(),
      user_id_to: user_id_to,
      interaction_type: interaction_type,
      created_at: new Date().toISOString(),
    },
  ]);

  if (error) {
    console.error("Error recording interaction:", error);
  }
};

const getLastQueryTime = () => {
  return localStorage.getItem("lastQueryTime") || new Date().toISOString();
};

const setLastQueryTime = (time) => {
  localStorage.setItem("lastQueryTime", time);
};

const HomeScreen = () => {
  // return false;
  const [lastQueryTime, setLastQueryTimeState] = useState(getLastQueryTime());
  const [matchesQueue, setMatchesQueue] = useState([]);
  const [showMatch, setShowMatch] = useState(false);
  const [currentMatchProfile, setCurrentMatchProfile] = useState(null);

  const updateLastQueryTime = (time) => {
    setLastQueryTimeState(time);
    setLastQueryTime(time);
  };

  const { initializeLoadingBar, finishLoadingBar } = useLoadingBar();
  const [profiles, setProfiles] = useState([]);
  const [profilesLoaded, setProfilesLoaded] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const currentIndexRef = useRef(currentIndex);

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
      .gt("created_at", lastQueryTime);

    if (error) {
      console.error("Error fetching recent matches:", error);
    } else {
      const profiles = await Promise.all(
        data.map(async (match) => {
          const otherUserId =
            match.user_id_1 === getUserId() ? match.user_id_2 : match.user_id_1;

          // remove duplicates
          if (
            !matchesQueue.some((profile) => profile.user_id === otherUserId)
          ) {
            const profile = await fetchUserProfile(otherUserId);
            if (profile) {
              return profile;
            }
          }
          return null;
        })
      );

      profiles.forEach((profile) => {
        if (profile) {
          setMatchesQueue((prevQueue) => [...prevQueue, profile]);
        }
      });

      updateLastQueryTime(new Date().toISOString());
    }
  };

  // const fetchRecentMatches = async () => {
  //   const { data, error } = await supabase
  //     .from("matches")
  //     .select("*")
  //     .or(`user_id_1.eq.${getUserId()},user_id_2.eq.${getUserId()}`)
  //     .gt("created_at", lastQueryTime);

  //   if (error) {
  //     console.error("Error fetching recent matches:", error);
  //   } else {
  //     const profiles = await Promise.all(
  //       data.map(async (match) => {
  //         const otherUserId =
  //           match.user_id_1 === getUserId() ? match.user_id_2 : match.user_id_1;
  //         return fetchUserProfile(otherUserId);
  //       })
  //     );

  //     profiles.forEach((profile) => {
  //       if (profile) {
  //         setMatchesQueue((prevQueue) => [...prevQueue, profile]);
  //       }
  //     });

  //     updateLastQueryTime(new Date().toISOString());
  //   }
  // };
  useEffect(() => {
    const channel = supabase
      .channel("matches")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "matches",
          filter: `user_id_1=eq.${getUserId()} OR user_id_2=eq.${getUserId()}`,
        },
        (payload) => {
          handleNewMatch(payload.new);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []); // Empty dependency array to run only once

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        fetchRecentMatches();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  const handleNewMatch = async (match) => {
    const otherUserId =
      match.user_id_1 === getUserId() ? match.user_id_2 : match.user_id_1;

    if (!matchesQueue.some((profile) => profile.user_id === otherUserId)) {
      const profile = await fetchUserProfile(otherUserId);

      if (profile) {
        setMatchesQueue((prevQueue) => [...prevQueue, profile]);
      }
    }
  };

  const childRefs = useMemo(
    () =>
      Array(profiles.length)
        .fill(0)
        .map((i) => React.createRef()),
    [profiles.length]
  );

  const updateCurrentIndex = (val) => {
    setCurrentIndex(val);
    currentIndexRef.current = val;
  };

  const canSwipe = currentIndex < profiles.length;

  const swiped = (direction, index) => {
    const interaction_type = direction === "right" ? "like" : "dislike";
    recordInteraction(
      profiles[profiles.length - currentIndex - 1].user_id,
      interaction_type
    );
    updateCurrentIndex(currentIndex + 1);
  };

  const swipe = async (dir) => {
    if (canSwipe) {
      await childRefs[childRefs.length - currentIndex - 1].current.swipe(dir); // Swipe the card!
    }
  };

  useEffect(() => {
    const fetchProfiles = async () => {
      initializeLoadingBar("fetchProfiles");
      const { data, error } = await supabase.rpc(
        "get_filtered_profiles_for_user",
        { p_user_id: getUserId() }
      );
      if (error) {
        console.error("Error fetching profiles:", error);
      } else {
        setProfiles(data);
      }
      setProfilesLoaded(true);
      finishLoadingBar("fetchProfiles");
    };

    fetchProfiles();
  }, []);

  const { goto } = useRouter();
  // if (!profiles) return <div>Loading...</div>;

  return (
    <>
      <Container>
        <HomeHeaderWrapper>
          <HomeHeaderLogo>
            {/* <HeartIcon /> */}
            <QuickFlingsLogo />
            <HomeHeaderText>QuickFlings</HomeHeaderText>
          </HomeHeaderLogo>
          <HiddenAdminButton
            onClick={() => {
              goto("admin");
            }}
          ></HiddenAdminButton>
          <HomeHeaderButton
            onClick={() => {
              goto("notifications");
            }}
          >
            <NotificationIcon />
          </HomeHeaderButton>
        </HomeHeaderWrapper>
        <Content>
          {profilesLoaded && (
            <SwipeArea className="asdf">
              <StyledTinderCard className="swipe">
                <ProfileCard>
                  <NoMoreProfilePhoto>
                    <Image src={"./images/SadRobot.svg"} alt="Profile photo" />
                  </NoMoreProfilePhoto>
                  <ProfileName
                    onTouchEnd={() => {
                      goto("profile");
                    }}
                  >
                    Sorry but you're all out of swipes :(&nbsp;
                    {/* <img src="/images/right-arrow.svg" alt="Right Arrow" /> */}
                  </ProfileName>

                  <ProfileBio>
                    {" "}
                    Please come back later and we should have more profiles for
                    you to review.
                  </ProfileBio>
                  <br />
                  {/* <Centered><Button>View Profile</Button></Centered> */}
                </ProfileCard>
              </StyledTinderCard>
              {profiles.map((profile, index) => (
                <StyledTinderCard
                  ref={childRefs[index]}
                  className="swipe"
                  key={profile.user_id}
                  onSwipe={(dir) => swiped(dir, index)}
                >
                  <ProfileCard>
                    <ProfilePhoto>
                      <Image
                        src={getResizedURL(profile.main_photo_med, {
                          width: 700,
                          height: 700,
                        })}
                        alt="Profile photo"
                      />
                    </ProfilePhoto>
                    <ProfileName
                      onTouchEnd={() => {
                        goto("profile");
                      }}
                    >
                      {profile.first_name} {profile.last_name}&nbsp;
                      {/* <img src="/images/right-arrow.svg" alt="Right Arrow" /> */}
                    </ProfileName>

                    <ProfileAge>
                      {calculateAge(profile.birthdate)} years old
                    </ProfileAge>
                    <ProfileBio>{profile.bio}</ProfileBio>
                    <br />
                    {/* <Centered><Button>View Profile</Button></Centered> */}
                  </ProfileCard>
                </StyledTinderCard>
              ))}
            </SwipeArea>
          )}
          <InteractionContainer>
            <RejectButton onClick={() => swipe("left")} />
            <LikeButton onClick={() => swipe("right")} />
          </InteractionContainer>
        </Content>
      </Container>
      <BottomTabMenu />
      {showMatch && currentMatchProfile && (
        <Match
          profile={currentMatchProfile}
          onClose={() => setShowMatch(false)}
          onSendMsg={() => {
            setShowMatch(false);
            goto("chat");
          }}
        />
      )}
    </>
  );
};

export default HomeScreen;
