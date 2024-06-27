// import { useEffect, useState } from "react";
import { Container, Content } from "../Layout";
import BottomTabMenu from "../BottomTabMenu";
import RejectButton from "../RejectButton";
import LikeButton from "../LikeButton";
import React, { useEffect, useState, useMemo, useRef } from "react";
// import { supabase } from "../db";
// import { getUserId } from "../utils";
import NotificationIcon from "../icons/notification";
import { useRouter } from "../Router";
import Image from "../Image";
import QuickFlingsLogo from "../icons/quickflings";
import { getUserId, calculateAge } from "../utils";
import { supabase } from "../db";
import Match from "../Match";
import { useLoadingBar } from "../Providers/LoadingBarProvider";
import {
  HomeHeaderWrapper,
  HomeHeaderLogo,
  HomeHeaderText,
  HomeHeaderButton,
  ProfileCard,
  ProfilePhoto,
  NoMoreProfilePhoto,
  ProfileName,
  ProfileAge,
  ProfileBio,
  InteractionContainer,
  StyledTinderCard,
  SwipeArea,
  HiddenAdminButton,
} from "./HomeScreen.styles";


const fetchUserProfile = async (user_id) => {
  // Fetch user profile
  const { data: userProfile, error: userProfileError } = await supabase
    .from("user_profiles")
    .select("*")
    .eq("user_id", user_id)
    .single();

  if (userProfileError) {
    console.error("Error fetching user profile:", userProfileError);
    return null;
  }

  // Fetch main profile photo
  const { data: mainPhoto, error: mainPhotoError } = await supabase
    .from("main_photos")
    .select("photo_id")
    .eq("user_id", user_id)
    .single();

  if (mainPhotoError) {
    console.error("Error fetching main photo:", mainPhotoError);
    return userProfile; // Return profile without photo
  }

  // Fetch photo_med from profile_photos using photo_id
  const { data: profilePhoto, error: profilePhotoError } = await supabase
    .from("profile_photos")
    .select("photo_med")
    .eq("id", mainPhoto.photo_id)
    .single();

  if (profilePhotoError) {
    console.error("Error fetching profile photo:", profilePhotoError);
    return userProfile; // Return profile without photo
  }

  // Attach photo_med to user profile
  return { ...userProfile, photo_med: profilePhoto.photo_med };
};


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
          // filter: `user_id_1=eq.${getUserId()} OR user_id_2=eq.${getUserId()}`,
        },
        (payload) => {
          // filter on the client for now
          if (
            payload.new.user_id_1 === getUserId() ||
            payload.new.user_id_2 === getUserId()
          ) {
            console.log("YAYYY New match:", payload.new);
            handleNewMatch(payload.new);
          }
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
        .map(() => React.createRef()),
    [profiles.length]
  );

  const updateCurrentIndex = (val) => {
    setCurrentIndex(val);
    currentIndexRef.current = val;
  };

  const canSwipe = currentIndex < profiles.length;

  const swiped = (direction) => {
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
                  <ProfileName>
                    Sorry you're all out of swipes
                    <br />
                    :(&nbsp;
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
                        goto(`profile?user_id=${profile.user_id}`);
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
            goto(`conversation?user_id=${currentMatchProfile.user_id}`); 
          }}
        />
      )}
    </>
  );
};

export default HomeScreen;
