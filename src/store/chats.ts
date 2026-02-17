"use client";

import { create } from "zustand";
import {
  getDatabase,
  ref,
  set as dbSet,
  push,
  get as dbGet,
  child,
} from "firebase/database";
import { database } from "../firebase/firebase-config";

// Participant type
type Participant = {
  id: string;
  name: string;
  avatar: string;
  type?: string; // e.g., "user", "knowmigo", "twin"
};

// Message type
type Message = {
  id: string;
  content: string;
  timestamp: number; // epoch time
  ownerId: string; // refers to Participant.id
  userId: string;
  type: "text" | "image" | "system" | "twin"; // extendable
  event: "sent" | "received" | "system"; // extendable
};

// ChatData type
type ChatData = {
  participants: Participant[]; // key is participant id
  messages: Message[]; // key is message id
};

interface ChatStore {
  chatData: ChatData;
  chats: Record<string, ChatData>; // All chats for the user
  selectedChatId: string | null; // Currently selected chat ID
  fetchChats: (userId: string) => Promise<void>;
  selectChat: (chatId: string) => void;
  addChat: (
    userId: string,
    chatId: string,
    chatData: ChatData,
  ) => Promise<void>;
  addMessage: (message: Message) => void;
  clearMessages: () => void;
}

const update = async (
  message: Message,
  selectedChatId: string,
  updatedChatData: ChatData,
  userId: string,
  state?: any,
) => {
  try {
    // Update the messages in the database for the selected chat
    const chatRef = ref(database, `knowmigo/${userId}/chats/${selectedChatId}`);
    console.log("user id is", userId, "selected id si ", selectedChatId);
    await dbSet(chatRef, updatedChatData);

    console.log("Message added to the database successfully.");

    // Update the local Zustand state
  } catch (error) {
    console.error("Error updating messages in the database:", error);
    return state;
  }
};

const useChatStore = create<ChatStore>((set, get) => ({
  chatData: {
    participants: [
      // {
      //   id: "user1",
      //   name: "Kartheepan",
      //   avatar:
      //     "https://sdk.bitmoji.com/3d/render/10226021-sdZoCZZkfB_30rPVQ5U7_mOVBfyAx0yVqFnE9Qz49TG8lBo3INXz2Q-v1.png?trim=circle&ua=2",
      // },
      // {
      //   id: "user2",
      //   name: "Knowmigo",
      //   avatar:
      //     "https://sdk.bitmoji.com/3d/render/10226021-sdZoCZZkfB_30rPVQ5U7_mOVBfyAx0yVqFnE9Qz49TG8lBo3INXz2Q-v1.png?trim=circle&ua=2",
      // },
    ],
    messages: [
      {
        id: "1",
        content:
          "If you see this with a cartoon avatar, it means the chat store is working!",
        timestamp: Date.now(),
        ownerId: "user1",
        type: "text",
        event: "sent",
        userId: "",
      },
    ],
  },
  chats: {},
  selectedChatId: null,

  // Fetch all chats for a user
  fetchChats: async (userId: string) => {
    const userChatsRef = ref(database, `knowmigo/${userId}/chats`);
    const snapshot = await dbGet(userChatsRef);
    console.log("user id:", userId);

    if (snapshot.exists()) {
      const chats = snapshot.val();
      console.log("Fetched chats:", chats);
      set({ chats });
    } else {
      console.log("Fetched chats snapshot:");

      set({ chats: {} });
    }
  },

  // Select a specific chat by ID
  selectChat: (chatId: string) => {
    const chats = get().chats;
    const selectedChat = chats[chatId];

    if (selectedChat) {
      set({
        selectedChatId: chatId,
        chatData: selectedChat,
      });
    }
  },

  // Add a new chat to the database
  addChat: async (userId, chatId, chatData) => {
    console.log("Adding chat:", { userId, chatId, chatData });

    // Use a clear reference name (e.g., 'database' or 'db' as initialized)
    const chatRef = ref(database, `knowmigo/${userId}/chats/${chatId}`);

    try {
      // 1. Check if chat exists using get() for a one-time read
      const snapshot = await dbGet(chatRef);

      if (snapshot.exists()) {
        console.log("Chat already exists:", snapshot.val());
        // Optional: update(chatRef, chatData) if you want to merge data instead
      } else {
        // 2. Create chat if it doesn't exist
        await dbSet(chatRef, chatData);
        console.log("New chat created successfully.");
      }

      // 3. Update local state (if using a store like Zustand)
      set((state) => ({
        chats: {
          ...state.chats,
          [chatId]: chatData,
        },
      }));
    } catch (error) {
      console.error("Error in addChat operation:", error);
    }
  },
  // Add a new message to the current chat
  addMessage: (message) =>
    set((state) => {
      const updatedMessages = [...state.chatData.messages, message];
      const updatedChatData = {
        ...state.chatData,
        messages: updatedMessages,
      };

      // Update the selected chat in the local store
      const selectedChatId = state.selectedChatId;

      const dbref = ref(
        database,
        `knowmigo/${message.userId}/chats/${selectedChatId}/messages`,
      );

      if (selectedChatId) {
        update(message, selectedChatId, updatedChatData, message.userId, state);
        return {
          chatData: updatedChatData,
          chats: {
            ...state.chats,
            [selectedChatId]: updatedChatData,
          },
        };
      }

      return { chatData: updatedChatData };
    }),

  // Clear all messages in the current chat
  clearMessages: () =>
    set((state) => {
      const updatedChatData = {
        ...state.chatData,
        messages: [],
      };

      // Update the selected chat in the local store
      const selectedChatId = state.selectedChatId;
      if (selectedChatId) {
        return {
          chatData: updatedChatData,
          chats: {
            ...state.chats,
            [selectedChatId]: updatedChatData,
          },
        };
      }

      return { chatData: updatedChatData };
    }),
}));

export default useChatStore;

export type { ChatData, Message, Participant };
