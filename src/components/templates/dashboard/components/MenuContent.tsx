"use client";
import * as React from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useAgents } from "@/app/context/AgentsContext";
import { Box, Divider } from "@mui/material";
import { useConversations } from "@/app/context/ConversationContext";

export default function MenuContent() {
  const { activeConversation, setActiveConversation } = useConversations();
  const { conversations, chatIsActive } = useAgents();
  return (
    <Stack sx={{ flexGrow: 1, p: 1, pt: 0, overflowY: "auto" }}>
      <Box
        sx={{
          position: "sticky",
          top: 0,
          zIndex: 1,
          backgroundColor: "background.paper",
        }}
      >
        <Typography
          variant="subtitle2"
          sx={{ px: 2, color: "text.secondary", my: 1, fontWeight: 600 }}
        >
          Recent Conversations
        </Typography>
        <Divider sx={{ mt: 0 }} />
      </Box>

      <List
        sx={{
          width: "100%",
          p: 0,
          gap: 2,
          mt: 1,
        }}
      >
        {conversations.map((conversation) => (
          <ListItem key={conversation.id} disablePadding>
            <ListItemButton
              onClick={() =>
                !chatIsActive && setActiveConversation(conversation.id)
              }
              disabled={chatIsActive}
              sx={{
                borderRadius: 1,
                mx: 1,
                cursor: chatIsActive ? "not-allowed" : "pointer",
                opacity: chatIsActive ? 0.5 : 1,
                "&:hover": {
                  backgroundColor: "action.hover",
                },
                backgroundColor:
                  activeConversation === conversation.id
                    ? "action.selected"
                    : "background.paper",
              }}
            >
              <ListItemText
                primary={conversation.firstMessage}
                sx={{
                  ".MuiListItemText-primary": {
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    fontWeight:
                      activeConversation === conversation.id ? 600 : 400,
                  },
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Stack>
  );
}
