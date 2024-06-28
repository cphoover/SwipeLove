import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
} from "react";
import { useEffect } from "react";
import { supabase } from "../db";
import { getUserId } from "../utils";
import { set } from "lodash";
const ChatContext = createContext();

export const ChatProvider = ({ otherUserId, children }) => {
  const [messages, setMessages] = useState([]);
  const greatestMessageId = useMemo(() => {
    return messages.reduce((greatestId, message) => {
      console.log(`~~ greatestId: ${greatestId}, message.id: ${message.id}`);
      return Math.max(greatestId, message.id);
    }, 0);
  }, [messages]);

  const userId = getUserId();

  const fetchMessages = useCallback(async () => {
    const { data, error } = await supabase
      .from("messages")
      .select("*")
      .or(
        `and(author_id.eq.${userId},recipient_id.eq.${otherUserId}),and(recipient_id.eq.${userId},author_id.eq.${otherUserId})`
      )
      .order("id", { ascending: true });

    if (error) {
      console.error("~~ Error fetching messages:", error);
      return;
    }

    // filter out messages that are already in the state
    const newMessages = data.filter(
      (message) => message.id > greatestMessageId
    );

    setMessages(
        [
            ...messages,
            ...newMessages
        ]
    );

    console.log(`@@ Fetching messages after: ${greatestMessageId}`);
    console.log(
      `@@ Fetched ${newMessages.length} new messages from the server:`,
      newMessages
    );

    // setMessages((prevMessages) => {
    //   const res = [...prevMessages, ...newMessages];
    //   console.log(`@@ debug setMessages:`, {
    //     prevMessages,
    //     newMessages,
    //     res,
    //   });
    //   console.log(`@@ Setting messages to:`, res);
    //   return res;
    // });
  }, [greatestMessageId, userId, otherUserId]);

  // we will add a visibility change listener to fetch messages when the chat is opened
  useEffect(() => {
    const visibilityChangeListener = () => {
      if (document.visibilityState === "visible") {
        fetchMessages();
      }
    };

    document.addEventListener("visibilitychange", visibilityChangeListener);

    // fetch messages when the chat is opened
    fetchMessages();

    return () => {
      document.removeEventListener(
        "visibilitychange",
        visibilityChangeListener
      );
    };
  }, []);

  const sendMessage = useCallback(
    async (content) => {
      const tempID = greatestMessageId + 1;

      const message = {
        content,
        author_id: userId,
        recipient_id: otherUserId,
      };

      const { data, error } = await supabase
        .from("messages")
        .insert([message])
        .select();

      if (error) {
        console.error("Error sending message:", error);
      }
    },
    [userId, otherUserId]
  );

  useEffect(() => {
    const channel = supabase
      .channel("messages")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `ids_realtime_filter=in.(${userId}|${otherUserId},${otherUserId}|${userId})`,
        },
        (payload) => {
          console.log("~~ New message received:", payload.new);

          // Ignore messages that are already in the state
          if (payload.new.id <= greatestMessageId) {
            return;
          }

          setMessages((prevMessages) => [...prevMessages, payload.new]);

        //   setMessages((prevMessages) => [...prevMessages, payload.new]);
        }
      )
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "messages",
          filter: `ids_realtime_filter=in.(${userId}|${otherUserId},${otherUserId}|${userId})`,
        },
        (payload) => {
          setMessages((prevMessages) => {
            return prevMessages.map((message) =>
              message.id === payload.new.id ? payload.new : message
            );
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <ChatContext.Provider
      value={{
        messages,
        sendMessage,
        greatestMessageId,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChat must be used within a LoadingBarProvider");
  }
  return context;
};
