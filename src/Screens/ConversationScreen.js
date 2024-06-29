import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { Button, Container, Content } from "../Layout";
import MainHeader from "../MainHeader";
import BottomTabMenu from "../BottomTabMenu";
import { LYFT_PINK } from "../themes/colors";
import { ChatProvider, useChat } from "../Providers/ChatProvider";
import { useRouter } from "../Router";
import { getUserId } from "../utils";
import { useMyPhotos } from "../Providers/MyPhotosProvider";
import { supabase } from "../db";
import Image from "../Image";
import { Menu, Item, Separator, useContextMenu } from "react-contexify";
import "react-contexify/ReactContexify.css";
import {
  OtherUsersProfileProvider,
  useOtherUsersProfile,
} from "../Providers/OtherUsersProfileProvider";

const ChatWrapper = styled.div`
  display: flex;
  flex-direction: column;
  /* height: calc(100vh - 120px); // Adjust for header and bottom menu */
  padding: 16px;
  /* overflow-y: auto; */
`;

const MessageList = styled.div`
  flex: 1;
  margin-bottom: 50px;
  /* overflow-y: auto; */
`;

const Message = styled.div`
  display: flex;
  align-items: flex-start;
  margin-bottom: 12px;
`;

const UserMessage = styled(Message)`
  justify-content: flex-end;
`;

const Avatar = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  overflow: hidden;
  /* margin-right: 12px; */
  & img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const Bubble = styled.div`
  max-width: 70%;
  padding: 12px;
  border-radius: 16px;
  background-color: ${(props) => (props.isUser ? LYFT_PINK : "#e5e5ea")};
  color: ${(props) => (props.isUser ? "#fff" : "#000")};
  white-space: pre-wrap;
`;

const InputWrapper = styled.div`
  background: #fff;
  display: flex;
  padding: 16px;
  border-top: 1px solid #e5e7eb;
  position: fixed;
  bottom: 60px;
  width: 100%;
  box-sizing: border-box;
`;

const MessageInput = styled.textarea`
  flex: 1;
  padding: 12px;
  border: 1px solid #d8d8d8;
  border-radius: 24px;
  box-shadow: 0px 1px 2px rgba(0, 0, 0, 0.08);
  background-color: #ffffff;
  font-size: 16px;
  font-family: "Montserrat";
  line-height: 130%;
  outline: none;
  resize: none;
  overflow: hidden; /* Ensure no scrollbars appear */
  min-height: 20px; /* Ensure it starts with one row */
  max-height: 200px; /* Maximum height for the input */
  rows: 1; /* Ensure it starts with one row */
`;

const SendButton = styled(Button)`
  margin-left: 12px;
`;

const MESSAGE_MENU_ID = "message-context-menu";

const ConversationScreenUnwrapped = () => {
  const textareaRef = useRef(null);
  const messageListRef = useRef(null);
  const { mainPhoto } = useMyPhotos();
  const [otherUserProfile, setOtherUserProfile] = useState(null); // State to hold other user's profile data

  const { queryParams, goto } = useRouter();
  const otherUserId = queryParams.get("user_id");

  /** @TODO move this to a provider... and deduplicate the fetching of user profiles across the app... */
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        // Fetch user profile data including main profile photo URL
        const { data: userProfile, error } = await supabase
          .from("user_profiles")
          .select("first_name, last_name")
          .eq("user_id", otherUserId)
          .single();

        if (error) {
          throw error;
        }

        // Fetch main profile photo data by joining main_photos to profile_photos
        const { data: profilePhoto, error: photoError } = await supabase
          .from("main_photos")
          .select("profile_photos(photo_small)")
          .eq("user_id", otherUserId)
          .single();

        if (photoError) {
          throw photoError;
        }

        // Extract photo_small URL from profile_photos
        const photoSmallUrl = profilePhoto.profile_photos.photo_small;

        // Combine fetched data
        const combinedData = {
          ...userProfile,
          photo_small: photoSmallUrl,
        };

        setOtherUserProfile(combinedData);
      } catch (error) {
        console.error("Error fetching other user profile:", error.message);
      }
    };

    if (otherUserId) {
      fetchUserProfile();
    }
  }, [otherUserId]);

  const { messages, sendMessage, deleteMessage, greatestMessageId } = useChat();
  // const [messages, setMessages] = useState([
  //   { id: 1, text: "Hi there!", user: "other" },
  //   { id: 2, text: "Hello!", user: "self" },
  //   { id: 3, text: "How are you?", user: "other" },
  //   { id: 4, text: "I'm good, thanks! How about you?", user: "self" },
  //   /** slightly longer message */
  //   {
  //     id: 5,
  //     text: "I'm doing great! I just finished my React Native project and I'm excited to show it to you. Can we meet tomorrow?",
  //   },
  //   {
  //     id: 6,
  //     text: "Sure! I'd love to see it. Let's meet at the coffee shop near your place",
  //   },
  //   {
  //     id: 7,
  //     text: "Sounds good! See you there!",
  //   },
  //   {
  //     id: 8,
  //     text: "Bye!",
  //   },
  //   {
  //     id: 9,
  //     text: "Bye!",
  //   },
  //   {
  //     id: 10,
  //     text: "Bye!",
  //   },
  //   {
  //     id: 11,
  //     text: "hmm I forgot to tell you that I have a meeting tomorrow",
  //   },
  // ]);
  const [newMessage, setNewMessage] = useState("");

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      sendMessage(newMessage);
      setNewMessage("");
      resetTextAreaSize();
    }
  };

  const resetTextAreaSize = () => {
    if (!textareaRef.current) return;
    const textarea = textareaRef.current;
    textarea.style.height = "auto";
  };

  const handleInputChange = (e) => {
    if (!textareaRef.current) return;

    const textarea = textareaRef.current;
    textarea.style.height = "auto"; // Reset the height
    textarea.style.height = `${textarea.scrollHeight}px`; // Set it to the scroll height
    setNewMessage(e?.target?.value || "");
    if (!e?.target?.value) {
      resetTextAreaSize();
    }
  };

  const scrollToBottom = () => {
    document.documentElement.scrollTo({
      left: 0,
      top:  document.documentElement.scrollHeight,
      behavior: "smooth",
    });
    document.body.scrollTo({
      left: 0,
      top: document.body.scrollHeight,
      behavior: "smooth",
    });
  };

  const isSelf = (message) => message.author_id === getUserId();

  useEffect(() => {
    setTimeout(scrollToBottom, 500);
  }, []);

  useEffect(() => {
   
    setTimeout(scrollToBottom, 100);
    scrollToBottom();
  }, [messages]);

  const { show: showContextMenu } = useContextMenu({
    id: MESSAGE_MENU_ID,
  });

  const mkHandleMessageDoubleClick = (messageId) => (event) => {
    // Show context menu on double-tap
    showContextMenu({
      event,
      props: { key: "value", messageId },
    });
  };

  if (!otherUserProfile) {
    return <></>;
  }

  return (
    <>
      <Container>
        <MainHeader
          onClick={() => {
            goto(`profile?user_id=${otherUserId}`);
          }}
          title={`${otherUserProfile.first_name} ${otherUserProfile.last_name}
        `}
          back
        />
        <Content>
          <ChatWrapper>
            {/* <strong>Greatest Message ID: {greatestMessageId}</strong>
            <pre>
              <code>{JSON.stringify(otherUserProfile, null, 4)}</code>{" "}
            </pre> */}
            <MessageList ref={messageListRef}>
              {messages.map((message) => (
                <>
                  {" "}
                  {message.visible && (
                    <Message
                      key={message.id}
                      as={isSelf(message) ? UserMessage : Message}
                    >
                      {!isSelf(message) && (
                        <Avatar>
                          <Image
                            src={otherUserProfile.photo_small}
                            alt="Avatar"
                            nonBlocking
                            onClick={() => {
                              goto(`profile?user_id=${otherUserId}`);
                            }}
                          />
                        </Avatar>
                      )}
                      &nbsp;
                      <Bubble
                        onClick={mkHandleMessageDoubleClick(message.id)}
                        isUser={isSelf(message)}
                      >
                        {/* <strong>{message.id}</strong> */}
                        {/* {JSON.stringify(message, null, 4)} */}
                        {message.content}
                      </Bubble>
                      &nbsp;
                      {isSelf(message) && (
                        <Avatar>
                          <img src={mainPhoto.photo_small} alt="Avatar" />
                        </Avatar>
                      )}
                    </Message>
                  )}
                </>
              ))}
            </MessageList>
          </ChatWrapper>
        </Content>
      </Container>
      <InputWrapper>
        <MessageInput
          ref={textareaRef}
          placeholder="Type a message..."
          rows="1"
          value={newMessage}
          onChange={handleInputChange}
        />
        <SendButton onClick={handleSendMessage}>Send</SendButton>
      </InputWrapper>
      <BottomTabMenu />
      <Menu id={MESSAGE_MENU_ID}>
        <Item onClick={(props) => void props.messageId}>Edit Message</Item>
        <Item
          onClick={({ props }) => {
            deleteMessage(props?.messageId);
          }}
        >
          <span
            style={{
              color: "red",
            }}
          >
            Delete Message
          </span>
        </Item>
      </Menu>
    </>
  );
};

const ConversationScreen = () => {
  const { queryParams } = useRouter();
  const otherUserId = queryParams.get("user_id");

  return (
    <ChatProvider otherUserId={otherUserId}>
      <ConversationScreenUnwrapped />
    </ChatProvider>
  );
};
export default ConversationScreen;
