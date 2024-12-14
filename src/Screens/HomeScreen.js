// import { useEffect, useState } from "react";
import { Container, Content } from "../Layout";
import BottomTabMenu from "../BottomTabMenu";
import RejectButton from "../RejectButton";
import LikeButton from "../LikeButton";
import React, { useEffect, useState, useMemo, useRef } from "react";
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
import { getResizedURL } from "../utils";
import { useMatches } from "../Providers/MatchesProvider";

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

const HomeScreen = () => {
  // return false;

  // const [lastQueryTime, setLastQueryTimeState] = useState(getLastQueryTime());
  // const [matchesQueue, setMatchesQueue] = useState([]);
  // const [showMatch, setShowMatch] = useState(false);
  // const [currentMatchProfile, setCurrentMatchProfile] = useState(null);

  const { initializeLoadingBar, finishLoadingBar } = useLoadingBar();
  const [profiles, setProfiles] = useState([]);
  const [profilesLoaded, setProfilesLoaded] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const currentIndexRef = useRef(currentIndex);

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
              <StyledTinderCard
                className="swipe"
                preventSwipe={["right", "left", "up", "down"]}
              >
                <ProfileCard>
                  <NoMoreProfilePhoto>
                    <Image
                      src={`${process.env.PUBLIC_URL}/images/SadRobot.svg`}
                      alt="Profile photo"
                    />
                  </NoMoreProfilePhoto>
                  <ProfileName>
                    Sorry, you're all out of swipes
                    <br />
                    😢
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
    </>
  );
};

export default HomeScreen;
