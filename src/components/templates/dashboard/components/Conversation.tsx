"use client";

import { useAgents } from "@/app/context/AgentsContext";
import { Box, Card, Typography, TextField, Button, Paper } from "@mui/material";
import { useEffect, useMemo, useRef, useState } from "react";
import { useChat } from "ai/react";
import { Agent } from "@/app/types/agents";
type Message = {
  content: string;
  sender: string;
  timestamp: Date;
};

export default function Conversation() {
  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    append,
    setMessages,
    reload,
    stop,
    isLoading,
  } = useChat();
  const { selectedAgents } = useAgents();
  const [chatIsActive, setChatIsActive] = useState(false);
  const currentAgent = useRef(selectedAgents[Object.keys(selectedAgents)[0]]);
  useEffect(() => {
    let timeout: NodeJS.Timeout;

    if (chatIsActive && !isLoading) {
      console.log("chatIsActive");
      timeout = setTimeout(() => {
        if (messages.length === 0) {
          append(
            {
              role: "user",
              content:
                "You are an agent in a conversation with another agent. Make an introduction of yourself",
            },
            { body: { systemMessage: currentAgent.current?.instructions } }
          ).then(() => {
            currentAgent.current =
              currentAgent.current ===
              selectedAgents[Object.keys(selectedAgents)[0]]
                ? selectedAgents[Object.keys(selectedAgents)[1]]
                : selectedAgents[Object.keys(selectedAgents)[0]];
          });
        } else {
          setMessages((messages) =>
            messages.map((message) => ({
              ...message,
              role: message.role === "user" ? "assistant" : "user",
            }))
          );
          reload({
            body: { systemMessage: currentAgent.current?.instructions },
          }).then(() => {
            currentAgent.current =
              currentAgent.current ===
              selectedAgents[Object.keys(selectedAgents)[0]]
                ? selectedAgents[Object.keys(selectedAgents)[1]]
                : selectedAgents[Object.keys(selectedAgents)[0]];
          });
        }
      }, 6000);
    }
    return () => clearTimeout(timeout);
  }, [
    setMessages,
    chatIsActive,
    handleSubmit,
    append,
    selectedAgents,
    reload,
    messages.length,
    isLoading,
  ]);

  const handleInputSubmit = () => {
    if (chatIsActive) {
      stop();
      setChatIsActive(false);
    } else {
      handleSubmit();
      setChatIsActive(true);
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
        maxWidth: { xs: "100%", md: "40%" },
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
              flexGrow: 1,
            }}
          >
            {messages.map((m) => (
              <>
                {m.role === "user" ? "User: " : "AI: "}
                {m.toolInvocations ? (
                  <pre>{JSON.stringify(m.toolInvocations, null, 2)}</pre>
                ) : (
                  <p>{m.content}</p>
                )}
              </>
            ))}
          </Box>

          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-end",
            }}
          >
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
                placeholder="Type an opening message..."
                value={input}
                onChange={handleInputChange}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleInputSubmit();
                  }
                }}
              />
              <Button variant="contained" onClick={handleInputSubmit}>
                Start
              </Button>
            </Box>
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
