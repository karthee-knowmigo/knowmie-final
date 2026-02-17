"use client";
import { useEffect, useState } from "react";
import React from "react";
import { BrowserView, MobileView, isMobile } from "react-device-detect";

import Message from "../components/Message";
import { NewPrompter } from "../components/prompter";
import useChatStore from "../store/chats";
import { auth } from "../firebase/firebase-config";
import SnapLogin from "../components/loggedIn";

// Add after the imports
export interface StepType {
  id: number;
  title: string;
  content: string;
  equation: string;
  messages: Array<{
    id: string;
    content: string;
    owner: {
      name: string;
      avatar: string;
    };
    timestamp: string;
  }>;
}

export default function Page() {
  const { fetchChats } = useChatStore();
  const [promptMessage, setpromptMessage] = useState("second");
  const [isAskAi, setIsAskAi] = React.useState(false);

  return (
    <div className="flex flex-col h-screen w-full ">
      <SnapLogin />
      <div className="flex flex-col h-full w-full ">
        <div className="flex flex-col items-center justify-center p-4 bg-background sticky top-0 z-10 ">
          <span className="self-center font-semibold">
            Cellular Respiration in Living organisms
          </span>
        </div>
        {/* <div className="flex-1 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none'] justify-center items-center"> */}
        <div className="flex flex-col justify-center items-center ">
          <Message prmpt={promptMessage} condition={isAskAi} />
          <BrowserView className="w-full">
            <div className="sticky bottom-0 flex justify-center w-[90%]  items-center p-4">
              <NewPrompter fn={setpromptMessage} controller={setIsAskAi} />
            </div>
          </BrowserView>
          <MobileView className="w-full">
            <div className="sticky bottom-0 flex  w-full items-center pr-2 pb-0">
              <NewPrompter fn={setpromptMessage} controller={setIsAskAi} />
            </div>
          </MobileView>
        </div>
      </div>
    </div>
  );
}

{
  // <SnapLogin />
  //     <div className="flex flex-col h-full w-full ">
  //       <div className="flex flex-col items-center justify-center p-4 bg-background sticky top-0 z-10 ">
  //         <span className="self-center font-semibold">
  //           Cellular Respiration in Living organisms
  //         </span>
  //         <OpenedDiscussion />
  //       </div>
  //       {/* <div className="flex-1 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none'] justify-center items-center"> */}
  //       <div className="flex flex-col justify-center items-center ">
  //         <Message prmpt={promptMessage} condition={isAskAi} />
  //         <BrowserView className="w-full">
  //           <div className="sticky bottom-0 flex justify-center w-[90%]  items-center p-4">
  //             <NewPrompter fn={setpromptMessage} controller={setIsAskAi} />
  //           </div>
  //         </BrowserView>
  //         <MobileView className="w-full">
  //           <div className="sticky bottom-0 flex  w-full items-center pr-2 pb-0">
  //             <NewPrompter fn={setpromptMessage} controller={setIsAskAi} />
  //           </div>
  //         </MobileView>
  //       </div>
  //     </div>
  //
}
