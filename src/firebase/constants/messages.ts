import { get, ref, set } from "firebase/database";
import { auth, database } from "../firebase-config"

export interface Message {
  id: string;
  owner: {
    name: string;
    avatar: string;
  };
  content: string;
  timestamp: string;
  type?: string;
  event?: string;
}

export interface Discussion {
  id: string;
  path: string[];
  title: string;
  messages: Message[];
}

export const discussions: Discussion[] = [
  {
    id: "cellular-respiration-1",
    path: [
      "Biology 🫀",
      "Biochemistry 🧪",
      "Carb Metabolism",
      "Carbohydrates",
      "Cellular Respiration",
    ],
    title: "Cellular Respiration in Living Organisms",
    messages: [
      {
        id: "1",
        owner: {
          name: "Kartheepan",
          avatar: "/images/kartheepan.png",
        },
        content:
          "Cellular respiration is the process of breaking down macromolecules, releasing energy in the process",
        timestamp: "12:54 PM",
      },
      {
        id: "2",
        owner: {
          name: "Rathushan",
          avatar: "/images/rathushan.png",
        },
        content:
          "The process occurs in multiple stages, including glycolysis, the citric acid cycle, and the electron transport chain.",
        timestamp: "1:02 PM",
      },
      {
        id: "3",
        owner: {
          name: "Vyshika",
          avatar: "/images/vyshika.png",
        },
        content:
          "During glycolysis, glucose is broken down into pyruvate, producing a small amount of ATP and NADH.",
        timestamp: "1:15 PM",
      },
      {
        id: "4",
        owner: {
          name: "Kartheepan",
          avatar: "/images/kartheepan.png",
        },
        content:
          "Right! And after glycolysis, where does the pyruvate go in eukaryotic cells?",
        timestamp: "1:17 PM",
      },
      {
        id: "5",
        owner: {
          name: "Rathushan",
          avatar: "/images/rathushan.png",
        },
        content:
          "The pyruvate enters the mitochondria, where it's converted to acetyl-CoA before entering the citric acid cycle.",
        timestamp: "1:20 PM",
      },
      {
        id: "6",
        owner: {
          name: "Vyshika",
          avatar: "/images/vyshika.png",
        },
        content:
          "And don't forget, this process requires oxygen as the final electron acceptor in the electron transport chain!",
        timestamp: "1:22 PM",
      },
      {
        id: "7",
        owner: {
          name: "Kartheepan",
          avatar: "/images/kartheepan.png",
        },
        content:
          "Exactly! That's why it's called aerobic respiration. The electron transport chain is where most of the ATP is produced.",
        timestamp: "1:25 PM",
      },
      {
        id: "8",
        owner: {
          name: "Rathushan",
          avatar: "/images/rathushan.png",
        },
        content:
          "Through oxidative phosphorylation, right? The proton gradient drives ATP synthase to produce ATP.",
        timestamp: "1:27 PM",
      },
      {
        id: "9",
        owner: {
          name: "Vyshika",
          avatar: "/images/vyshika.png",
        },
        content:
          "Yes! And for each glucose molecule, how many ATP molecules are produced in total during aerobic respiration?",
        timestamp: "1:29 PM",
      },
      {
        id: "10",
        owner: {
          name: "Kartheepan",
          avatar: "/images/kartheepan.png",
        },
        content:
          "Around 36-38 ATP molecules! Much more efficient than anaerobic respiration which only produces 2 ATP.",
        timestamp: "1:31 PM",
      },
      {
        id: "11",
        owner: {
          name: "Rathushan",
          avatar: "/images/rathushan.png",
        },
        content:
          "And this efficiency is why most complex organisms rely on aerobic respiration for their energy needs.",
        timestamp: "1:33 PM",
      },
      {
        id: "12",
        owner: {
          name: "Vyshika",
          avatar: "/images/vyshika.png",
        },
        content:
          "Interesting fact: Some organisms can switch between aerobic and anaerobic respiration depending on oxygen availability!",
        timestamp: "1:35 PM",
      },
      {
        id: "13",
        owner: {
          name: "Kartheepan",
          avatar: "/images/kartheepan.png",
        },
        content:
          "Like yeast during fermentation! They use anaerobic respiration to produce alcohol and CO2.",
        timestamp: "1:37 PM",
      },
      {
        id: "14",
        owner: {
          name: "Rathushan",
          avatar: "/images/rathushan.png",
        },
        content:
          "And in our muscle cells during intense exercise, when oxygen supply can't keep up with demand, leading to lactic acid production.",
        timestamp: "1:39 PM",
      },
    ],
  },
  {
    id: "glycolysis-1",
    path: [
      "Biology 🫀",
      "Biochemistry 🧪",
      "Carb Metabolism",
      "Carbohydrates",
      "Glycolysis",
      "Glucose Breakdown",
    ],
    title: "Understanding Glucose Breakdown in Glycolysis",
    messages: [
      {
        id: "g1",
        owner: {
          name: "Kartheepan",
          avatar: "/images/kartheepan.png",
        },
        content:
          "Let's discuss how glucose is broken down during glycolysis. What's the first step?",
        timestamp: "2:00 PM",
      },
      {
        id: "g2",
        owner: {
          name: "Rathushan",
          avatar: "/images/rathushan.png",
        },
        content:
          "The first step is phosphorylation of glucose by hexokinase, using ATP to form glucose-6-phosphate!",
        timestamp: "2:02 PM",
      },
      {
        id: "g3",
        owner: {
          name: "Vyshika",
          avatar: "/images/vyshika.png",
        },
        content:
          "Right! And this phosphorylation traps glucose in the cell since glucose-6-phosphate can't cross the membrane.",
        timestamp: "2:04 PM",
      },
      {
        id: "g4",
        owner: {
          name: "Kartheepan",
          avatar: "/images/kartheepan.png",
        },
        content: "Excellent! What happens next to glucose-6-phosphate?",
        timestamp: "2:06 PM",
      },
      {
        id: "g5",
        owner: {
          name: "Rathushan",
          avatar: "/images/rathushan.png",
        },
        content:
          "It's isomerized to fructose-6-phosphate by phosphoglucose isomerase!",
        timestamp: "2:08 PM",
      },
      {
        id: "g6",
        owner: {
          name: "Vyshika",
          avatar: "/images/vyshika.png",
        },
        content:
          "Then another ATP is used to phosphorylate fructose-6-phosphate to fructose-1,6-bisphosphate by phosphofructokinase!",
        timestamp: "2:10 PM",
      },
      {
        id: "g7",
        owner: {
          name: "Kartheepan",
          avatar: "/images/kartheepan.png",
        },
        content:
          "This is a key regulatory step in glycolysis. What happens to fructose-1,6-bisphosphate next?",
        timestamp: "2:12 PM",
      },
      {
        id: "g8",
        owner: {
          name: "Rathushan",
          avatar: "/images/rathushan.png",
        },
        content:
          "It's split into two 3-carbon compounds: glyceraldehyde-3-phosphate (G3P) and dihydroxyacetone phosphate (DHAP) by aldolase.",
        timestamp: "2:14 PM",
      },
      {
        id: "g9",
        owner: {
          name: "Vyshika",
          avatar: "/images/vyshika.png",
        },
        content:
          "And DHAP is converted to G3P by triose phosphate isomerase, so we end up with two G3P molecules!",
        timestamp: "2:16 PM",
      },
      {
        id: "g10",
        owner: {
          name: "Kartheepan",
          avatar: "/images/kartheepan.png",
        },
        content:
          "Perfect! This is where the energy-yielding steps begin. What happens to G3P?",
        timestamp: "2:18 PM",
      },
    ],
  },
];
// const fetcher = async () => {
//   const user = auth.currentUser;
//   if (!user) return;

//   const discussionsRef = ref(database, `users/${user.uid}/discussions`);
//   const snapshot = await get(discussionsRef);

//   if (!snapshot.exists()) {
//     // Create discussions and their corresponding spaces
//     const discussionsData = discussions.reduce((acc, discussion) => {
//       acc[discussion.id] = {
//         id: discussion.id,
//         title: discussion.title,
//         messages: [
//           {
//             id: "welcome",
//             owner: {
//               name: "AI Assistant",
//               avatar: "/images/ai-assistant.png",
//             },
//             content: `Welcome to the discussion about ${discussion.title}! Feel free to start the conversation or ask any questions.`,
//             timestamp: new Date().toLocaleTimeString([], {
//               hour: "2-digit",
//               minute: "2-digit",
//             }),
//           },
//           ...discussion.messages,
//         ],
//       };
//       return acc;
//     }, {});

//     // Store discussions
//     await set(discussionsRef, discussionsData);

//     // Update spaces to include discussion IDs
//     const spacesRef = ref(database, `users/${user.uid}/spaces`);
//     const spacesSnapshot = await get(spacesRef);
//     const spaces = spacesSnapshot.val() || [];

//     // Helper to update space tree with discussion IDs
//     const updateSpaceTree = (
//       items: any[],
//       path: string[],
//       discussionId: string
//     ) => {
//       if (path.length === 0) return items;

//       const [current, ...rest] = path;
//       let item = items.find((i) => i.name === current);

//       if (!item) {
//         item = { type: "folder", name: current, children: [] };
//         items.push(item);
//       }

//       if (rest.length === 0) {
//         items.push({ type: "file", name: current, discussionId });
//       } else if (item.type === "folder") {
//         item.children = updateSpaceTree(
//           item.children || [],
//           rest,
//           discussionId
//         );
//       }

//       return items;
//     };

//     // Update spaces with discussion IDs
//     const updatedSpaces = discussions.reduce((acc, discussion) => {
//       return updateSpaceTree(acc, discussion.path, discussion.id);
//     }, spaces);

//     await set(spacesRef, updatedSpaces);
//   }
// };

// Update findDiscussionByPath to work with the new structure
export const findDiscussionByPath = async (
  path: string[]
): Promise<Discussion | undefined> => {
  if (auth) {
    const user = auth.currentUser;
    if (!user) return undefined;

    // First find the discussion ID from spaces
    const spacesRef = ref(database, `users/${user.uid}/spaces`);
    const spacesSnapshot = await get(spacesRef);
    const spaces = spacesSnapshot.val() || [];

    // Helper to find discussion ID in space tree
    const findDiscussionId = (
      items: any[],
      searchPath: string[]
    ): string | undefined => {
      if (!items || searchPath.length === 0) return undefined;

      const [current, ...rest] = searchPath;
      const item = items.find((i) => i.name === current);

      if (!item) return undefined;
      if (item.type === "file") return item.discussionId;
      if (item.type === "folder" && rest.length > 0) {
        return findDiscussionId(item.children || [], rest);
      }
      return undefined;
    };

    const discussionId = findDiscussionId(spaces, path);
    if (!discussionId) return undefined;

    // Get discussion data directly using the ID
    const discussionRef = ref(
      database,
      `users/${user.uid}/discussions/${discussionId}`
    );
    const discussionSnapshot = await get(discussionRef);
    if (!discussionSnapshot.exists()) return undefined;

    const discussionData = discussionSnapshot.val();
    return {
      ...discussionData,
      path, // Keep the navigation path for breadcrumb
      messages: Object.values(discussionData.messages || {}),
    };
  }
};

// Initialize the data
// fetcher();

// Export current discussion's messages for backward compatibility
export const messages = discussions[0].messages;
