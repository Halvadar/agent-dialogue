"use client";

import { useAgents } from "@/app/context/AgentsContext";
import { Box, Card, Typography, TextField, Button, Paper } from "@mui/material";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useChat } from "ai/react";
import type { Message } from "ai/react";
import { Agent } from "@/app/types/agents";

interface MessageWithIdentity extends Message {
  identity: string;
  ignore: boolean;
}
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
  } = useChat({ onFinish: onFinishReceivingMessage });
  let timeOutRef = useRef<NodeJS.Timeout | null>(null);
  function onFinishReceivingMessage() {
    timeOutRef.current = setTimeout(() => {
      getCurrentAgent.getNextAgent();
      setMessages((prevMessages) => {
        const prevMessagesCopy = [...prevMessages];

        return prevMessagesCopy.map((m) =>
          m.role === "assistant" ? { ...m, role: "user" } : m
        );
      });
      reload({
        body: {
          systemMessage: getCurrentAgent.currentAgent.instructions,
        },
      });
    }, 5000);
  }
  const { selectedAgents } = useAgents();
  const getCurrentAgent = useMemo(() => {
    return {
      currentAgent: selectedAgents[Object.keys(selectedAgents)[0]],
      getNextAgent: function () {
        this.currentAgent =
          Object.values(selectedAgents)[
            (Object.values(selectedAgents).indexOf(this.currentAgent) + 1) %
              Object.values(selectedAgents).length
          ];
      },
    };
  }, [selectedAgents]);
  const [chatIsActive, setChatIsActive] = useState(false);

  const [messageSequence, setMessageSequence] = useState<MessageWithIdentity[]>(
    []
  );

  const handleInputSubmit = () => {
    if (chatIsActive) {
      stop();
      setChatIsActive(false);
      clearTimeout(timeOutRef.current!);
    } else {
      setChatIsActive(true);
      if (messages.length === 0) {
        append(
          {
            role: "system",
            content: "Introduce yourself and ask a question.",
          },
          { body: { systemMessage: getCurrentAgent.currentAgent.instructions } }
        );
      } else {
        handleSubmit();
      }
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
            {messages
              .filter((m) => m.role !== "system")
              .map((m, index) => {
                const agentKeys = Object.keys(selectedAgents);
                const isFirstAgent = index % 2 === 0;

                return (
                  <Box
                    key={m.id || index}
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: isFirstAgent ? "flex-start" : "flex-end",
                      alignSelf: isFirstAgent ? "flex-start" : "flex-end",
                      maxWidth: "70%",
                    }}
                  >
                    <Typography
                      variant="caption"
                      sx={{
                        mb: 0.5,
                        color: "text.secondary",
                        px: 1,
                      }}
                    >
                      {selectedAgents[agentKeys[isFirstAgent ? 0 : 1]].name}
                    </Typography>
                    <Paper
                      elevation={1}
                      sx={{
                        p: 2,
                        borderRadius: 2,
                        bgcolor: isFirstAgent ? "#f0f0f0" : "#e3f2fd",
                        color: "text.primary",
                        maxWidth: "100%",
                        wordBreak: "break-word",
                      }}
                    >
                      {m.toolInvocations ? (
                        <pre style={{ margin: 0, whiteSpace: "pre-wrap" }}>
                          {JSON.stringify(m.toolInvocations, null, 2)}
                        </pre>
                      ) : (
                        <Typography>{m.content}</Typography>
                      )}
                    </Paper>
                  </Box>
                );
              })}
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
              <Button
                variant="contained"
                onClick={handleInputSubmit}
                sx={{
                  bgcolor: chatIsActive ? "red" : "primary.main",
                  "&:hover": {
                    bgcolor: chatIsActive ? "darkred" : "primary.dark",
                  },
                }}
              >
                {chatIsActive ? "Stop" : "Start"}
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
