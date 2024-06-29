import React, { useCallback, useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import { Container, Content } from "../Layout";
import MainHeader from "../MainHeader";
import BottomTabMenu from "../BottomTabMenu";
import PersonAvatar from "../PersonAvatar";
import { useRouter } from "../Router";
import { useMatches } from "../Providers/MatchesProvider";
import { getUserId } from "../utils";
import { supabase } from "../db";

const SearchInput = styled.input`
  width: 100%;
  height: 38px;
  padding: 0px 8px;
  border: 1px solid #d8d8d8;
  box-sizing: border-box;
  border-radius: 24px;
  box-shadow: 0px 1px 2px rgba(0, 0, 0, 0.08);
  background-color: #ffffff;
  color: #94a3b8;
  font-size: 16px;
  font-family: "Open Sans";
  line-height: 38px;
  outline: none;
`;

const ChatsList = styled.ul`
  list-style-type: none;
  padding: 0;
  margin-top: 32px;
`;

const ChatListItem = styled.li`
  display: flex;
  align-items: center;
  padding-bottom: 20px;
`;

const ChatDetails = styled.div`
  display: flex;
  flex-direction: column;
  padding-left: 16px;
`;
const ChatName = styled.div`
  font-size: 18px;
  font-family: "Open Sans";
  font-weight: 600;
  line-height: 28px;
`;

const ChatText = styled.div`
  font-size: 14px;
  font-family: "Open Sans";
  font-weight: 300;
  line-height: 20px;
`;

const ChatsScreen = () => {
  const { goto } = useRouter();
  const res = useMatches();
  const [chats, setChats] = useState([]);
  console.log("### res", res);

  const fetchChats = useCallback(async () => {
    const userId = getUserId(); // This should be dynamically obtained, possibly from user auth state

    const { data, error } = await supabase.rpc(
      "get_user_matches_and_messages",
      { user_id_param: userId }
    );

    const newData = data.map((d) =>
      getUserId() === d.user1_user_id
        ? {
            user_id: d.user2_user_id,
            created_at: d.created_at,
            first_name: d.user2_first_name,
            last_name: d.user2_last_name,
            small_photo: d.user2_small_photo,
            last_message: d.content,
            author_id: d.author_id,
          }
        : {
            user_id: d.user1_user_id,
            created_at: d.created_at,
            first_name: d.user1_first_name,
            last_name: d.user1_last_name,
            small_photo: d.user1_small_photo,
            last_message: d.content,
            author_id: d.author_id,
          }
    );

    if (error) {
      console.error("Error fetching data: ", error);
    } else {
      setChats(newData);
    }
  }, []);

  useEffect(() => {
    const channel = supabase
      .channel("messages")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "messages",
          filter: `author_id=eq.${getUserId()}`,
        },
        (payload) => {
          fetchChats();
        }
      )
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "messages",
          filter: `recipient_id=eq.${getUserId()}`,
        },
        (payload) => {
          fetchChats();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // we will add a visibility change listener to fetch messages when the chat is opened
  useEffect(() => {
    const visibilityChangeListener = () => {
      if (document.visibilityState === "visible") {
        fetchChats();
      }
    };

    document.addEventListener("visibilitychange", visibilityChangeListener);

    // fetch messages when the chat is opened
    fetchChats();

    return () => {
      document.removeEventListener(
        "visibilitychange",
        visibilityChangeListener
      );
    };
  }, []);

  return (
    <>
      <Container>
        <MainHeader title="Chats" />
        <Content>
          <SearchInput type="search" placeholder="Search..." />
          <ChatsList>
            {chats.map((chat) => (
              <ChatListItem
                key={chat.user_id}
                onClick={() => goto("conversation", { user_id: chat.user_id })}
              >
                <PersonAvatar photoUrl={chat.small_photo} />
                <ChatDetails>
                  <ChatName>
                    {chat.first_name} {chat.last_name}
                  </ChatName>
                  <ChatText>
                    {Boolean(chat.last_message)
                      ? chat.author_id === getUserId()
                        ? "You: "
                        : `${chat.first_name}: `
                      : "Greet your match!"}

                    {chat.last_message}
                  </ChatText>
                </ChatDetails>
              </ChatListItem>
            ))}
            {/* <ChatListItem onClick={() => goto("conversation")}>
              <PersonAvatar
                photoUrl={`${process.env.PUBLIC_URL}/images/profile-photos/person1.png`}
              />
              <ChatDetails>
                <ChatName>Jane Doe</ChatName>
                <ChatText>Hey, how are you?</ChatText>
              </ChatDetails>
            </ChatListItem>
            <ChatListItem onClick={() => goto("conversation")}>
              <PersonAvatar
                photoUrl={`${process.env.PUBLIC_URL}/images/profile-photos/person4.jpeg`}
              />
              <ChatDetails>
                <ChatName>Heather Braxton</ChatName>
                <ChatText>Hey, how are you?</ChatText>
              </ChatDetails>
            </ChatListItem>
            <ChatListItem onClick={() => goto("conversation")}>
              <PersonAvatar
                photoUrl={`${process.env.PUBLIC_URL}/images/profile-photos/person3.jpeg`}
              />
              <ChatDetails>
                <ChatName>April Smith</ChatName>
                <ChatText>Can I get your numbah?</ChatText>
              </ChatDetails>
            </ChatListItem>
            <ChatListItem onClick={() => goto("conversation")}>
              <PersonAvatar
                photoUrl={`${process.env.PUBLIC_URL}/images/profile-photos/person2.jpeg`}
              />
              <ChatDetails>
                <ChatName>Kami Kline</ChatName>
                <ChatText>so... how was your day today?</ChatText>
              </ChatDetails>
            </ChatListItem>
            <ChatListItem onClick={() => goto("conversation")}>
              <PersonAvatar
                photoUrl={`${process.env.PUBLIC_URL}/images/profile-photos/person5.jpeg`}
              />
              <ChatDetails>
                <ChatName>Silvia Ortega</ChatName>
                <ChatText>Are you going to that concert this weekend?</ChatText>
              </ChatDetails>
            </ChatListItem>
            <ChatListItem onClick={() => goto("conversation")}>
              <PersonAvatar
                photoUrl={`${process.env.PUBLIC_URL}/images/profile-photos/person6.jpeg`}
              />
              <ChatDetails>
                <ChatName>Margeret Greene</ChatName>
                <ChatText>I absolutely love your Barcelona photos!</ChatText>
              </ChatDetails>
            </ChatListItem>
            <ChatListItem onClick={() => goto("conversation")}>
              <PersonAvatar
                photoUrl={`${process.env.PUBLIC_URL}/images/profile-photos/person7.jpeg`}
              />
              <ChatDetails>
                <ChatName>Kami Kline</ChatName>
                <ChatText>so... how was your day today?</ChatText>
              </ChatDetails>
            </ChatListItem> */}
          </ChatsList>
        </Content>
      </Container>
      <BottomTabMenu />
    </>
  );
};

export default ChatsScreen;
