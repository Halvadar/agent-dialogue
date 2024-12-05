import { Timestamp } from "firebase/firestore";

export type Agent = {
  id: string;
  name: string;
  instructions: string;
  creator: string;
  createdAt: Timestamp;
};
