// export default Message;
import { cache, useEffect, useState } from "react";

import MessageItem from "../components/MessageItem";

import { StepType } from "../firebase/types/step";

import React from "react";

import useChatStore from "../store/chats";

export interface BreakDownObject {
  [key: string]: BreakDown | string;

  id: string;
  lastUpdated: string;
}

export interface BreakDown {
  breakdown: StepType[];
  createdAt: string;
  discussionId: string;
  messageId: string;
  prompt: string;
}

// In the Message component, add new state
const Message = ({
  prmpt,
  condition,
}: {
  prmpt: string;
  condition: boolean;
}) => {
  const { chats, chatData, selectedChatId } = useChatStore();
  useEffect(() => {
    console.log("Chat Data in Message Component:", chatData);
  }, [chats, selectedChatId, chatData]);

  return (
    <div className="flex flex-col gap-4 p-4 pb-[200px] ">
      {chatData.messages.map((message, index) => (
        <div className="flex flex-col justify-center items-center" key={index}>
          <MessageItem
            key={message.id}
            message={message}
            id={message.id}
            messageOwner={chatData.participants.find(
              (participant) => participant.id === message.ownerId,
            )}
          />
          {/* <EventMessage message={message.event as string} /> */}
        </div>
      ))}
    </div>
  );
};

export default Message;
