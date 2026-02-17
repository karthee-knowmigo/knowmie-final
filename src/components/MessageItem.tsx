import { auth, database } from "../firebase/firebase-config";

import { Avatar, AvatarImage } from "@/components/ui/avatar";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

import { ThumbsUp, Sparkles, MoreHorizontal, Volume2 } from "lucide-react";
import { useState, useRef, useEffect, SetStateAction, Dispatch } from "react";

import { Message } from "../store/chats";

const MessageItem = ({
  message,
  id,
  messageOwner,
  //  currentlyPlayingId,setCurrentlyPlayingId
}: {
  message: Message;
  id: string;
  messageOwner:
    | {
        name: string;
        avatar: string;
      }
    | undefined;
}) => {
  const [isScanning, setIsScanning] = useState(false);

  const handleClick = async () => {
    setIsScanning(true);
  };

  function formatTimestamp(timestamp: number) {
    // JavaScript timestamps are in milliseconds, so multiply by 1000 if the input is in seconds (Unix timestamp)
    const dateObj = new Date(timestamp * 1000);

    // Get date components
    const year = dateObj.getFullYear();
    const month = dateObj.getMonth() + 1; // getMonth() returns 0-11, so add 1
    const day = dateObj.getDate();

    // Get time components
    const hours = dateObj.getHours();
    const minutes = dateObj.getMinutes();

    // Function to add a leading zero if the number is less than 10
    const padWithZero = (num: number) => num.toString().padStart(2, "0");

    // Format the output
    const formattedDate = `${padWithZero(day)}-${padWithZero(month)}-${year}`;
    const formattedTime = `${padWithZero(hours)}:${padWithZero(minutes)}`;

    return `${formattedTime}`;
  }

  return (
    <div className="flex flex-col w-3/4">
      <div className="flex items-start w-full mb-4">
        <Avatar className=" h-[42px] w-[42px] mr-2">
          <AvatarImage
            src={messageOwner ? messageOwner.avatar : "images/vyshika.png"}
            className="rounded-full"
          />
        </Avatar>
        <div className="flex flex-col w-full">
          <div className="flex items-center gap-2">
            <div className="font-semibold">
              {messageOwner?.name || "knowmie"}
            </div>
            <div className="text-secondary-foreground text-sm">
              · {formatTimestamp(message.timestamp)}
            </div>
          </div>
          <div className="text-sm w-auto rounded-md">
            <span
              className={`transition-all duration-500 ${
                isScanning
                  ? "bg-gradient-to-r from-blue-500/20 to-blue-500/20 bg-[length:100%_20%] bg-no-repeat bg-bottom animate-pulse"
                  : ""
              }`}
            >
              {message.content}
            </span>
            <div className="flex  justify-left pt-2">
              <ThumbsUp className="h-4 w-4 " />

              <Sparkles
                className="h-4 w-4 ml-2 hover:cursor-pointer "
                onClick={handleClick}
              />

              <button
                className="h-4 w-4 ml-2 hover:cursor-pointer"
                // onClick={handlePlayPause}
                onClick={() => {
                  console.log("clicked");
                }}
              >
                <Volume2 className="h-4 w-4  hover:cursor-pointer" />
              </button>

              <DropdownMenu>
                <DropdownMenuTrigger>
                  <MoreHorizontal className="h-4 w-4 ml-2 hover:cursor-pointer" />
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem className="text-red-600">
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </div>
      {/* <audio ref={audioRef} /> */}
    </div>
  );
};

export default MessageItem;
