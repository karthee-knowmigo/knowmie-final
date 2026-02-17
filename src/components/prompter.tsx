import { findDiscussionByPath } from "../firebase/constants/messages";
import { auth, database } from "../firebase/firebase-config";

import { ref, set } from "firebase/database";
import {
  SmilePlus,
  Sparkle,
  AtSign,
  Image,
  BarChart,
  Minus,
  Plus,
  Cross,
  X,
} from "lucide-react";
import { useEffect, useState, useRef, KeyboardEvent, useCallback } from "react";
import { Portal } from "@radix-ui/react-portal";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import useChatStore from "../store/chats";
import { BrowserView, MobileView, isMobile } from "react-device-detect";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

import SnapLogin from "../components/loggedIn";
import { useUserStore } from "../store/snapStore";

export const NewPrompter = ({
  fn,
  controller,
}: {
  fn: React.Dispatch<React.SetStateAction<string>>;
  controller: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const [message, setmessage] = useState("");

  const [showMentions, setShowMentions] = useState(false);
  const [mentionFilter, setMentionFilter] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [cursorPosition, setCursorPosition] = useState({ top: 0, left: 0 });

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Add this state near your other states
  const [mentionedUsers, setMentionedUsers] = useState<Suggestion[]>([]);

  const { addMessage, chatData } = useChatStore();
  const user = useUserStore((state) => state.user);

  useEffect(() => {
    console.log("user from the prompter", user);
  }, [user]);

  const suggestions: Suggestion[] = [
    {
      name: "Kartheepan",
      nickname: "kartheepan",
      image: "/images/kartheepan.png",
    },
    {
      name: "vyshik",
      nickname: "YC",
      image: "/images/vyshika.png",
    },
    {
      name: "Aaru",
      nickname: "aaru",
      image: "/images/aaruthi.png",
    },
    {
      name: "Rathu",
      nickname: "rathu",
      image: "/images/rathushan.png",
    },
  ];

  const filteredSuggestions = suggestions.filter(
    (s) =>
      s.name.toLowerCase().includes(mentionFilter.toLowerCase()) ||
      s.nickname.toLowerCase().includes(mentionFilter.toLowerCase()),
  );

  const updateCursorPosition = () => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const { selectionEnd } = textarea;
    const textBeforeCursor = message.slice(0, selectionEnd);
    const lines = textBeforeCursor.split("\n");
    const currentLineNumber = lines.length - 1;

    const coords = textarea.getBoundingClientRect();
    const lineHeight = parseInt(getComputedStyle(textarea).lineHeight || "20");
    const charWidth = 8; // Approximate character width in pixels

    setCursorPosition({
      top: coords.top + currentLineNumber * lineHeight,
      left:
        coords.left +
        (lines[currentLineNumber].length % textarea.cols) * charWidth,
    });
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (!showMentions) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev < filteredSuggestions.length - 1 ? prev + 1 : prev,
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : prev));
        break;
      case "Enter":
        e.preventDefault();
        if (filteredSuggestions[selectedIndex]) {
          insertMention(filteredSuggestions[selectedIndex]);
        }
        break;
      case "Escape":
        setShowMentions(false);
        break;
    }
  };

  // Add this at the top with other imports

  // Add this type definition if it's missing
  type Suggestion = {
    name: string;
    nickname: string;
    image: string;
  };

  // Inside your component, update these parts:

  // Update the findMentions function to return matched users
  const findMentions = (text: string): Suggestion[] => {
    const mentionRegex = /@(\w+)/g;
    const matches = Array.from(text.matchAll(mentionRegex));
    return matches
      .map((match) => {
        const nickname = match[1];
        return suggestions.find(
          (s) => s.nickname.toLowerCase() === nickname.toLowerCase(),
        );
      })
      .filter((user): user is Suggestion => user !== undefined);
  };

  // Update the onChange handler in Textarea
  <Textarea
    ref={textareaRef}
    value={message}
    onChange={(e) => {
      const newValue = e.target.value;
      setmessage(newValue);
      fn(newValue);

      // Update mentioned users based on text content

      const lastAtIndex = newValue.lastIndexOf("@");
      if (lastAtIndex !== -1 && lastAtIndex === newValue.length - 1) {
        setShowMentions(true);
        setMentionFilter("");
        updateCursorPosition();
      } else if (lastAtIndex !== -1) {
        const filter = newValue.slice(lastAtIndex + 1);
        setMentionFilter(filter);
        setShowMentions(true);
        updateCursorPosition();
      } else {
        setShowMentions(false);
      }
    }}
    onKeyDown={(e) => {
      console.log(
        `Key pressed: ${e.key}, Meta: ${e.metaKey}, Ctrl: ${e.ctrlKey}`,
      );
      if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
        // Check for Command (Mac) or Control (Windows/Linux)
        e.preventDefault(); // Prevent default behavior of Enter
        handleSubmit(); // Call the handleSubmit function
      }
      handleKeyDown(e); // Handle other key events
    }}
    placeholder={'Comment or Type "@" to mention'}
    className="min-h-[100px] max-h-[300px] resize-y whitespace-pre-wrap break-words w-full p-2 rounded-md border border-input focus:outline-none focus:ring-2 focus:ring-ring"
    style={{
      caretColor: "black",
    }}
    rows={5}
  />;

  useEffect(() => {
    if (mentionedUsers.length > 0) {
      setShowMentions(false);
    }
  }, [mentionedUsers]);
  // Update the insertMention function
  const insertMention = useCallback(
    (suggestion: Suggestion) => {
      const textarea = textareaRef.current;
      if (!textarea) return;

      const lastAtIndex = message.lastIndexOf("@");
      const newMessage =
        message.slice(0, lastAtIndex) + `@${suggestion.nickname} `;
      setmessage(newMessage);
      fn(newMessage);

      // Immediately hide mentions
      setShowMentions(false);
      setSelectedIndex(0);

      // Focus and move cursor to end
      textarea.focus();
      const newPosition = newMessage.length;
      textarea.setSelectionRange(newPosition, newPosition);
    },
    [message, fn],
  );

  // Update the Portal section in the render

  const handleSubmit = async () => {
    if (message) {
      addMessage({
        id: auth?.currentUser?.uid || "user1",
        content: message,
        timestamp: 1676100000000,
        ownerId: auth?.currentUser?.uid || "user1",
        type: "text",
        event: "sent",
        userId: auth?.currentUser?.uid as string,
      });
    }
    if (mentionedUsers.length > 0) {
      const sanitizedMessage = message.replace(/@\w+/g, "").trim();
      console.log("This should send back a response");
      console.log("And this is the prompt", sanitizedMessage);
      fetch("http://localhost:8080/askTwin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          // Add CORS headers if needed
          "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify({
          question: sanitizedMessage,
          userId: auth?.currentUser?.uid,
        }),
      })
        .then(async (response) => {
          const responseBody = await response.json(); // Read the stream as text
          console.log("Raw response body:", responseBody["answer"]);
          if (response.ok && responseBody["answer"]) {
            console.log("Response from /api/askTwin:", responseBody["answer"]);
            addMessage({
              id: "msg1",
              content:
                responseBody["answer"] || "Sorry, I couldn't get an answer.",
              timestamp: 1676100000000,
              ownerId:
                chatData.participants.find((p) => p.type === "twin")?.id ||
                "knowmigo",
              // auth?.currentUser?.uid || ""

              type: "twin",
              event: "received",
              userId: auth?.currentUser?.uid as string,
            });
          } else {
            console.error(
              "Error response from /api/askTwin:",
              response.status,
              responseBody["answer"],
            );
          }
        })
        .catch((error) => {
          console.error("Error calling /api/askTwin:", error);
        });
    } else {
      if (message) {
        fetch("http://localhost:8080/extract", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            // Add CORS headers if needed
            "Access-Control-Allow-Origin": "*",
          },
          body: JSON.stringify({
            text: message,
            userId: auth?.currentUser?.uid,
          }),
        })
          .then(async (response) => {
            const responseBody = await response.json(); // Read the stream as text
            if (response.ok) {
              console.log("Response from /api/askTwin:", responseBody);
            } else {
              console.error(
                "Error response from /api/askTwin:",
                response.status,
                responseBody,
              );
            }
          })
          .catch((error) => {
            console.error("Error calling /api/askTwin:", error);
          });
      }
    }

    setmessage("");
  };

  const handleSubmit2 = () => {
    if (auth) {
      console.log("id is ", auth.currentUser?.uid);
    }
  };

  useEffect(() => {
    console.log("Mentioned users updated:", mentionedUsers);
  }, [mentionedUsers]);

  const [clicked, setClicked] = useState(false);
  const [snapLoggedIn, setSnapLoggedIn] = useState(true);
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <div
      className="flex items-start w-full "
      onClick={() => {
        // setDrawerOpen(false);
      }}
    >
      <Avatar className="h-10.5 w-10.5 mr-2">
        <AvatarImage
          // src={
          //   auth && auth.currentUser?.photoURL
          //     ? auth.currentUser?.photoURL
          //     : "/images/kartheepan.png"
          // }
          src={
            "https://sdk.bitmoji.com/3d/render/10226021-sdZoCZZkfB_30rPVQ5U7_mOVBfyAx0yVqFnE9Qz49TG8lBo3INXz2Q-v1.png?trim=circle&ua=2"
          }
          className="rounded-full "
        />
      </Avatar>

      <div className="grid w-[90%] gap-1.5 items-center">
        {mentionedUsers.length > 0 && (
          <div
            className={
              !isMobile
                ? "absolute right-[90] top-[-73]"
                : "absolute right-5 -top-22.5"
            }
            onClick={() => {
              if (!user) {
                console.log("no user");

                setDrawerOpen(true);
              }
              // setSnapLoggedIn(false)
            }}
          >
            <img
              src={user ? user.bitmoji.avatar : "avatar/image.jpg"}
              onClick={() => {}}
              width={100}
              height={100}
              style={{
                color: "black",
              }}
              className="transform scale-x-[-1]"
            />
          </div>
        )}

        <Drawer open={drawerOpen} direction="right">
          <DrawerContent>
            <div className="flex flex-col">
              <div
                className="flex justify-end"
                onClick={() => setDrawerOpen(!drawerOpen)}
              >
                <X />
              </div>

              <div className="flex h-full justify-center items-center flex-col">
                <p>Add your bitmoji to give an identity</p>
                {!user ? (
                  <>
                    <div>hii</div>
                    <SnapLogin />
                    <div id="my-login-button-target"></div>
                  </>
                ) : user.bitmoji ? (
                  <>
                    <div>{user.displayName}</div>

                    <img src={user ? user.bitmoji.avatar : ""} alt="" />
                  </>
                ) : (
                  <>
                    <h1>hiii</h1>
                  </>
                )}
              </div>
            </div>
            {
              //  <div className="mx-auto w-full max-w-sm">
              //     <DrawerHeader>
              //       <DrawerTitle>Move Goal</DrawerTitle>
              //       <DrawerDescription>
              //         Set your daily activity goal.
              //       </DrawerDescription>
              //     </DrawerHeader>
              //     <div className="p-4 pb-0">
              //       <div className="flex items-center justify-center space-x-2">
              //         <Button
              //           variant="outline"
              //           size="icon"
              //           className="h-8 w-8 shrink-0 rounded-full"
              //         >
              //           <Minus />
              //           <span className="sr-only">Decrease</span>
              //         </Button>
              //         <div className="flex-1 text-center">
              //           <div className="text-7xl font-bold tracking-tighter">
              //             {/* {goal} */}
              //           </div>
              //           <div className="text-muted-foreground text-[0.70rem] uppercase">
              //             Calories/day
              //           </div>
              //         </div>
              //         <Button
              //           variant="outline"
              //           size="icon"
              //           className="h-8 w-8 shrink-0 rounded-full"
              //           // onClick={() => onClick(10)}
              //           // disabled={goal >= 400}
              //         >
              //           <Plus />
              //           <span className="sr-only">Increase</span>
              //         </Button>
              //       </div>
              //     </div>
              //     <DrawerFooter>
              //       <Button>Submit</Button>
              //       <DrawerClose asChild>
              //         <Button variant="outline">Cancel</Button>
              //       </DrawerClose>
              //     </DrawerFooter>
              //   </div>
            }
          </DrawerContent>
        </Drawer>
        <div className="relative bg-white">
          <Textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => {
              const newValue = e.target.value;
              setmessage(newValue);
              fn(newValue);

              const foundMentions = findMentions(newValue);
              setMentionedUsers(foundMentions);

              const lastAtIndex = newValue.lastIndexOf("@");
              if (lastAtIndex !== -1 && lastAtIndex === newValue.length - 1) {
                setShowMentions(true);
                setMentionFilter("");
                updateCursorPosition();
              } else if (lastAtIndex !== -1) {
                const filter = newValue.slice(lastAtIndex + 1);
                setMentionFilter(filter);
                setShowMentions(true);
                updateCursorPosition();
              } else {
                setShowMentions(false);
              }
            }}
            onKeyDown={handleKeyDown}
            placeholder={'Comment or Type "@" to mention'}
            className="min-h-[100px] max-h-[300px] resize-y whitespace-pre-wrap break-words w-full p-2 rounded-md border border-input focus:outline-none focus:ring-2 focus:ring-ring"
            style={{
              caretColor: "black",
            }}
            rows={5}
          />

          {showMentions && filteredSuggestions.length > 0 && (
            <Portal>
              <div
                className="bg-white rounded-md shadow-lg border border-input overflow-hidden z-50 absolute"
                style={{
                  bottom: `${
                    textareaRef.current?.getBoundingClientRect().height ??
                    0 + 10
                  }px`,
                  left: textareaRef.current?.getBoundingClientRect().left ?? 0,
                  maxHeight: "200px",
                  overflowY: "auto",
                  width: "250px",
                }}
              >
                {filteredSuggestions.map((suggestion, index) => (
                  <div
                    key={suggestion.nickname}
                    className={`p-2 cursor-pointer flex items-center gap-2 ${
                      index === selectedIndex
                        ? "bg-accent"
                        : "hover:bg-accent/50"
                    }`}
                    onClick={() => {
                      insertMention(suggestion);
                    }}
                  >
                    <Avatar>
                      <AvatarImage
                        src={suggestion.image}
                        className="rounded-full"
                        height="24"
                        width="24"
                        alt={suggestion.name}
                      />
                    </Avatar>
                    <div className="flex flex-col">
                      <span className="text-sm font-medium">
                        {suggestion.name}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        @{suggestion.nickname}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </Portal>
          )}
          {/* </div> */}
          {/* <Editor
            onChange={(value) => {
              setmessage(value);
              fn(value);
            }}
            // placeholder={
            //   replyTo
            //     ? "Write your reply..."
            //     : 'Comment or Type "/" to ask a question'
            // }
          /> */}
          <div className="absolute bottom-2 left-2 flex gap-2">
            {/* <Button variant="ghost" size="icon" className="h-8 w-8">
              <SmilePlus className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Image className="h-5 w-5" />
            </Button>{" "}
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => {
                controller((prev) => !prev);
              }}
            >
              <Sparkle className="h-5 w-5" />
            </Button> */}
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => {
                const textarea = textareaRef.current;
                if (textarea) {
                  const { selectionStart, selectionEnd } = textarea;
                  const newMessage =
                    message.slice(0, selectionStart) +
                    "@" +
                    message.slice(selectionEnd);
                  setmessage(newMessage);
                  fn(newMessage);
                  textarea.focus();
                  const newPosition = selectionStart + 1;
                  textarea.setSelectionRange(newPosition, newPosition);

                  // Show mentions overlay
                  setShowMentions(true);
                  setMentionFilter("");

                  // Calculate cursor position
                  const coords = textarea.getBoundingClientRect();
                  const textBeforeCursor = newMessage.slice(0, newPosition);
                  const lines = textBeforeCursor.split("\n");
                  const currentLineNumber = lines.length - 1;
                  const currentLine = lines[currentLineNumber];
                  const lineHeight = parseInt(
                    getComputedStyle(textarea).lineHeight,
                  );

                  setCursorPosition({
                    top: coords.top + currentLineNumber * lineHeight,
                    left: coords.left + currentLine.length * 8,
                  });
                }
              }}
            >
              <AtSign className="h-5 w-5" />
            </Button>
          </div>
          <div className="absolute bottom-2 right-2 ">
            <Button
              variant="secondary"
              // size="icon"
              className="mr-2"
              onClick={() => console.log("Discarded")}
            >
              Discard
              {/* <Send className="h-5 w-5" /> */}
            </Button>
            <Button
              variant="default"
              className="bg-[#0090FD] hover:bg-secondary hover:text-secondary-foreground"
              onClick={handleSubmit}
            >
              Post
              {/* <Send className="h-5 w-5" /> */}
            </Button>
          </div>
        </div>
        <p className="text-sm text-muted-foreground">
          Your message will be used to personalise the responses.
        </p>
      </div>
    </div>
  );
};
