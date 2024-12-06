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

export default function MenuContent() {
  // We'll need to add a conversations state to AgentsContext later
  const { conversations } = useAgents();
  const list = Array.from({ length: 30 }).map(() => conversations[0]);
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
        {list.map((conversation) => (
          <ListItem key={conversation.id} disablePadding>
            <ListItemButton
              sx={{
                borderRadius: 1,
                mx: 1,
                "&:hover": {
                  backgroundColor: "action.hover",
                },
                backgroundColor: "background.paper",
              }}
            >
              <ListItemText
                primary={conversation.firstMessage}
                sx={{
                  ".MuiListItemText-primary": {
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
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
