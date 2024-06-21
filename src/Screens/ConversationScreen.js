import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { Button, Container, Content } from "../Layout";
import MainHeader from "../MainHeader";
import BottomTabMenu from "../BottomTabMenu";

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
  background-color: ${(props) => (props.isUser ? "#007bff" : "#e5e5ea")};
  color: ${(props) => (props.isUser ? "#fff" : "#000")};
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

const ConversationScreen = () => {
  const textareaRef = useRef(null);
  const messageListRef = useRef(null);
  const [messages, setMessages] = useState([
    { id: 1, text: "Hi there!", user: "other" },
    { id: 2, text: "Hello!", user: "self" },
    { id: 3, text: "How are you?", user: "other" },
    { id: 4, text: "I'm good, thanks! How about you?", user: "self" },
    /** slightly longer message */
    {
      id: 5,
      text: "I'm doing great! I just finished my React Native project and I'm excited to show it to you. Can we meet tomorrow?",
    },
    {
      id: 6,
      text: "Sure! I'd love to see it. Let's meet at the coffee shop near your place",
    },
    {
      id: 7,
      text: "Sounds good! See you there!",
    },
    {
      id: 8,
      text: "Bye!",
    },
    {
      id: 9,
      text: "Bye!",
    },
    {
      id: 10,
      text: "Bye!",
    },
    {
      id: 11,
      text: "hmm I forgot to tell you that I have a meeting tomorrow",
    },
  ]);
  const [newMessage, setNewMessage] = useState("");

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      setMessages([
        ...messages,
        { id: messages.length + 1, text: newMessage, user: "self" },
      ]);
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
    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: "smooth",
    });
  };    

  useEffect(() => {
    console.log("scroll to bottom");
    scrollToBottom();
  }, [messages]);

  return (
    <>
      <Container>
        <MainHeader title="Chat" />
        <Content>
          <ChatWrapper>
            <MessageList ref={messageListRef}>
              {messages.map((message) => (
                <Message
                  key={message.id}
                  as={message.user === "self" ? UserMessage : Message}
                >
                  {message.user !== "self" && (
                    <Avatar>
                      <img
                        src="/images/profile-photos/person2.jpeg"
                        alt="Avatar"
                      />
                    </Avatar>
                  )}
                  &nbsp;
                  <Bubble isUser={message.user === "self"}>
                    {message.text}
                  </Bubble>
                  &nbsp;
                  {message.user === "self" && (
                    <Avatar>
                      <img
                        src="/images/profile-photos/person3.jpeg"
                        alt="Avatar"
                      />
                    </Avatar>
                  )}
                </Message>
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
    </>
  );
};

export default ConversationScreen;
