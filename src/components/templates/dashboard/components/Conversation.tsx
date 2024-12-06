"use client";

import { useAgents } from "@/app/context/AgentsContext";
import {
  Box,
  Card,
  Typography,
  TextField,
  Button,
  Paper,
  CircularProgress,
} from "@mui/material";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useChat } from "ai/react";
import { createConversation } from "@/app/actions";
import { useConversations } from "@/app/context/ConversationContext";

export default function Conversation() {
  const { messages, append, setMessages, reload, stop, isLoading } = useChat({
    onFinish: onFinishReceivingMessage,
  });
  const { setActiveConversation } = useConversations();
  const createConversationHandlerRef = useRef(async () => {});
  const timeOutRef = useRef<NodeJS.Timeout | null>(null);
  const [isConvoCreated, setIsConvoCreated] = useState(false);
  const { selectedAgents } = useAgents();
  const [chatIsActive, setChatIsActive] = useState(false);
  const getCurrentAgent = useMemo(() => {
    return {
      currentAgent: selectedAgents[Object.keys(selectedAgents)[0]],
      getNextAgent: function () {
        const agentValues = Object.values(selectedAgents);
        this.currentAgent =
          agentValues[
            (agentValues.indexOf(this.currentAgent) + 1) % agentValues.length
          ];
      },
    };
  }, [selectedAgents]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  function onFinishReceivingMessage() {
    createConversationHandlerRef.current();
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

  const onCreateConversation = useCallback(async () => {
    if (!isConvoCreated) {
      setIsConvoCreated(true);
      const formData = new FormData();
      const agentKeys = Object.keys(selectedAgents);
      formData.append("agent1Id", selectedAgents[agentKeys[0]].id);
      formData.append("agent2Id", selectedAgents[agentKeys[1]].id);
      formData.append("firstMessage", messages[messages.length - 1].content);
      const conversation = await createConversation(formData);
      console.log(conversation);
      if (conversation.success) {
        setActiveConversation(conversation.id);
      }
    }
  }, [messages, selectedAgents, isConvoCreated, setActiveConversation]);
  useEffect(() => {
    createConversationHandlerRef.current = onCreateConversation;
  }, [onCreateConversation]);

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
        onFinishReceivingMessage();
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
                        bgcolor: (theme) =>
                          isFirstAgent
                            ? theme.palette.mode === "dark"
                              ? "grey.900"
                              : "info.light"
                            : theme.palette.mode === "dark"
                            ? "grey.500"
                            : "primary.50",
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
            <div ref={messagesEndRef} />
          </Box>

          <Box
            sx={{
              p: 2,
              borderTop: 1,
              borderColor: "divider",
              display: "flex",
              justifyContent: "center",
            }}
          >
            <Button
              variant="contained"
              onClick={handleInputSubmit}
              disabled={isLoading}
              sx={{
                bgcolor: chatIsActive ? "red" : "primary.main",
                "&:hover": {
                  bgcolor: chatIsActive ? "darkred" : "primary.dark",
                },
                px: 4,
                py: 1,
              }}
            >
              {isLoading ? (
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <CircularProgress size={20} color="inherit" />
                  <span>Thinking...</span>
                </Box>
              ) : chatIsActive ? (
                "Stop"
              ) : messages.length > 1 ? (
                "Continue Conversation"
              ) : (
                "Start Conversation"
              )}
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
