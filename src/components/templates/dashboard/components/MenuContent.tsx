import * as React from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import ChatRoundedIcon from "@mui/icons-material/ChatRounded";
import { useAgents } from "@/app/context/AgentsContext";
import { Timestamp } from "firebase/firestore";

export default function MenuContent() {
  // We'll need to add a conversations state to AgentsContext later
  const { conversations } = useAgents();

  return (
    <Stack sx={{ flexGrow: 1, p: 1, gap: 2 }}>
      <Typography variant="subtitle2" sx={{ px: 2, color: "text.secondary" }}>
        Recent Conversations
      </Typography>
      <List sx={{ width: "100%", p: 0 }}>
        {conversations.map((conversation) => (
          <ListItem key={conversation.id} disablePadding>
            <ListItemButton>
              <ListItemText primary={conversation.agent1Id} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Stack>
  );
}
