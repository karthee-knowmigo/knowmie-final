"use client";

import * as React from "react";
import { ChevronRight, File, Folder, MoreHorizontal } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarRail,
} from "@/components/ui/sidebar";
import { Avatar, AvatarImage } from "@/components/ui/avatar";

import { useViewStore } from "../store/view-store";

import { auth, database } from "../firebase/firebase-config";
import { NavUser } from "../components/NavUser";
import { v4 as uuidv4 } from "uuid";
import useChatStore, { ChatData } from "../store/chats";
import { useEffect } from "react";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  // const isFileSelected = selectedItem?.type === "file";
  const { chats, selectChat, addChat, fetchChats, chatData } = useChatStore();
  useEffect(() => {
    if (auth) {
      const unsubscribe = auth.onAuthStateChanged((user) => {
        if (user) {
          const userId = user.uid;
          fetchChats(userId); // Fetch chats only when the user is authenticated
        }
      });

      return () => unsubscribe();
    } // Cleanup the listener on unmount
  }, []);

  const handleCreateFile = async () => {
    if (auth) {
      const user = auth.currentUser;
      if (!user) return;

      const userId = user.uid;
      const chatId = uuidv4(); // Generate a unique chat ID
      const userAvatarId = uuidv4(); // Generate a unique avatar ID for the user

      // Default chat data
      const newChatData: ChatData = {
        participants: [
          {
            id: userId,
            name: user.displayName || "Anonymous",
            avatar:
              user.photoURL ||
              "https://sdk.bitmoji.com/3d/render/10226021-sdZoCZZkfB_30rPVQ5U7_mOVBfyAx0yVqFnE9Qz49TG8lBo3INXz2Q-v1.png?trim=circle&ua=2",
          },
          {
            id: userAvatarId,
            name: "Knowmigo",
            avatar:
              "https://sdk.bitmoji.com/3d/render/10226021-sdZoCZZkfB_30rPVQ5U7_mOVBfyAx0yVqFnE9Qz49TG8lBo3INXz2Q-v1.png?trim=circle&ua=2",
            type: "twin",
          },
        ],
        messages: [
          // {
          //   id: "1",
          //   content: "Hello! How can I assist you today?",
          //   timestamp: Date.now(),
          //   ownerId: userId,
          //   type: "text" as const,
          //   event: "sent" as const,
          // },
        ],
      };

      // Add the new chat
      await addChat(userId, chatId, newChatData);
    }
  };

  const handleCreateFolder = () => {
    const newFolderName = prompt("Enter folder name:");
    if (!newFolderName) return;

    // const newFolder: TreeItem = {
    //   type: "folder",
    //   name: newFolderName,
    //   children: [],
    // };
    // const targetPath = isFileSelected
    //   ? selectedPath.slice(0, -1)
    //   : selectedPath;
    // setTree(updateTree(tree, targetPath, newFolder));

    console.log(
      "Create Folder Clicked - Functionality to be implemented",
      newFolderName,
    );
  };

  const handleSelectChat = (chatId: string) => {
    selectChat(chatId); // Set the selected chat
    console.log(chats);
  };

  return (
    <Sidebar {...props}>
      <SidebarContent className="overflow-x-auto">
        <SidebarGroup>
          <SidebarGroupLabel>Discussions</SidebarGroupLabel>
          <div className="flex items-start gap-2 px-4 py-2 border-b flex-col justify-center">
            <button
              onClick={handleCreateFolder}
              // disabled={isFileSelected}
              className="p-1 hover:bg-gray-100 rounded flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Folder className="h-4 w-4" />
              <span className="text-sm">New Space</span>
            </button>
            <button
              onClick={handleCreateFile}
              // disabled={!auth?.currentUser ? true : false}
              className="p-1 hover:bg-gray-100 rounded flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <File className="h-4 w-4" />
              <span className="text-sm">New Discussion</span>
            </button>
          </div>
          <SidebarGroupContent className="min-w-fit">
            <SidebarMenu className="whitespace-nowrap">
              {Object.entries(chats).map(([chatId, chatData]) => (
                <SidebarMenuItem key={chatId}>
                  <SidebarMenuButton
                    onClick={() => handleSelectChat(chatId)}
                    className="flex items-center gap-2"
                  >
                    <Avatar>
                      <AvatarImage
                        src={chatData.participants[0]?.avatar}
                        className="rounded-full"
                        height={"30px"}
                        width={"30px"}
                      />
                    </Avatar>
                    <span>{chatId || "Chat"}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
              {/* {tree.map((item, index) => (
                <Tree key={index} item={item} />
              ))} */}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        {/* <Members /> */}
      </SidebarContent>
      <SidebarRail />
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}

const members = [
  {
    title: "Rathushan",
    url: "#",
    image: "/images/rathushan.png",
  },

  {
    title: "Kartheepan",
    url: "#",
    image: "/images/kartheepan.png",
  },
  {
    title: "Vyshika",
    url: "#",
    image: "/images/vyshika.png",
  },
  {
    title: "Aaruthi",
    url: "#",
    image: "/images/aaruthi.png",
  },
];

const Members = () => {
  const setActiveView = useViewStore((state) => state.setActiveView);
  const setActiveStudent = useViewStore((state) => state.setActiveStudent);

  const handleMemberClick =
    (member: (typeof members)[0]) => (e: React.MouseEvent) => {
      e.preventDefault();
      const studentData = {
        name: member.title,
        avatar: member.image,
        url: member.url,
      };
      setActiveView("members");
      setActiveStudent(studentData);
      console.log("Active Student:", studentData);
    };

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Knowmigos 😉</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {members.map((member) => (
            <SidebarMenuItem key={member.title}>
              <SidebarMenuButton asChild onClick={handleMemberClick(member)}>
                <a href={member.url}>
                  <Avatar>
                    <AvatarImage
                      src={member.image}
                      className="rounded-full"
                      height={"30px"}
                      width={"30px"}
                    />
                  </Avatar>
                  <span>{member.title}</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
          <SidebarMenuItem>
            <SidebarMenuButton className="text-sidebar-foreground/70">
              <MoreHorizontal />
              <span>More</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
};

const isFileSelected = (items: any[], path: string[]): boolean => {
  if (path.length === 0) return false;

  let current = items;
  for (let i = 0; i < path.length - 1; i++) {
    const found = current.find(
      (item: any) => Array.isArray(item) && item[0] === path[i],
    );
    if (!found) return false;
    current = found.slice(1);
  }

  const lastPathItem = path[path.length - 1];
  const lastItem = current.find((item: any) => {
    if (Array.isArray(item)) {
      return item[0] === lastPathItem;
    }
    return item === lastPathItem;
  });

  // If lastItem is an array, it's a folder, otherwise it's a file
  return !Array.isArray(lastItem);
};
