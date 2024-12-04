"use client";

import { useAgents } from "@/app/context/AgentsContext";
import {
  Box,
  Card,
  Typography,
  TextField,
  Button,
  Avatar,
  Paper,
} from "@mui/material";
import { useState } from "react";

type Message = {
  content: string;
  sender: string;
  timestamp: Date;
};

export default function Conversation() {
  const { selectedAgents, agents } = useAgents();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const message: Message = {
        content: newMessage,
        sender: agents[0].id, // For now, always send from first agent
        timestamp: new Date(),
      };
      setMessages([...messages, message]);
      setNewMessage("");
    }
  };

  return (
    <Paper
      elevation={3}
      sx={{
        flexGrow: 1,
        alignSelf: "stretch",
        flexDirection: "column",
        gap: 2,
        p: 3,
        display: { xs: "none", md: "flex" },
      }}
    >
      {Object.keys(selectedAgents).length > 0 ? (
        <>
          <Box
            sx={{
              p: 2,
              borderBottom: 1,
              borderColor: "divider",
              display: "flex",
              gap: 2,
            }}
          >
            {Object.values(selectedAgents).map((agent) => (
              <Box
                key={agent.id}
                sx={{ display: "flex", alignItems: "center", gap: 1 }}
              >
                <Box
                  sx={{
                    fontWeight: "bold",
                    fontSize: "1.2rem",
                    border: 1,
                    p: 1,
                    borderRadius: 1,
                    bgcolor: "primary.light",
                    color: "primary.contrastText",
                  }}
                >
                  {agent.name}
                </Box>
              </Box>
            ))}
          </Box>

          {/* Messages Area */}
          <Box
            sx={{
              height: "400px",
              overflowY: "auto",
              p: 2,
              display: "flex",
              flexDirection: "column",
              gap: 2,
            }}
          >
            {messages.map((message, index) => (
              <Box
                key={index}
                sx={{
                  alignSelf:
                    message.sender === agents[0].id ? "flex-start" : "flex-end",
                  maxWidth: "70%",
                }}
              >
                <Card
                  variant="outlined"
                  sx={{
                    p: 1,
                    bgcolor:
                      message.sender === agents[0].id
                        ? "primary.light"
                        : "secondary.light",
                  }}
                >
                  <Typography variant="body1">{message.content}</Typography>
                </Card>
              </Box>
            ))}
          </Box>

          {/* Message Input */}
          <Box
            sx={{
              p: 2,
              borderTop: 1,
              borderColor: "divider",
              display: "flex",
              gap: 2,
            }}
          >
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Type a message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  handleSendMessage();
                }
              }}
            />
            <Button
              variant="contained"
              onClick={handleSendMessage}
              disabled={!newMessage.trim()}
            >
              Send
            </Button>
          </Box>
        </>
      ) : (
        <Card sx={{ p: 4, textAlign: "center", mt: 2 }}>
          <Typography variant="h6">
            Please select two agents to start a conversation
          </Typography>
        </Card>
      )}
    </Paper>
  );
}
