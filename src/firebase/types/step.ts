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
  