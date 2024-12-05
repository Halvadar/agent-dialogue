"use client";

import { useAgents } from "@/app/context/AgentsContext";
import { Box, Card, Typography, TextField, Button, Paper } from "@mui/material";
import { useEffect, useMemo, useRef, useState } from "react";
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
  } = useChat({});
  const { selectedAgents } = useAgents();
  const [chatIsActive, setChatIsActive] = useState(false);
  const currentAgent = useRef(selectedAgents[Object.keys(selectedAgents)[0]]);
  const [messagesUpdated, setMessagesUpdated] = useState(false);
  const [messageIdentities, setMessageIdentities] = useState<
    Record<string, string>
  >({});
  const [messageSequence, setMessageSequence] = useState<MessageWithIdentity[]>(
    []
  );
  useEffect(() => {
    console.log(messages.length, isLoading);
    if (messages.length > 0 && !isLoading && !messagesUpdated) {
      console.log(messages);
      const newMessages = messages.filter((m) => !messageIdentities[m.id]);
      const newMessagesWithIdentities = newMessages.map((m) => ({
        ...m,
        identity: m.role === "assistant" ? currentAgent.current?.id : m.role,
        ignore: m.role === "system" || m.id === "empty-message" ? true : false,
      }));
      setMessageSequence((pastMessageSequence) => [
        ...pastMessageSequence,
        ...newMessagesWithIdentities,
      ]);
      setMessageIdentities((pastMessageIdentities) => ({
        ...pastMessageIdentities,
        ...Object.fromEntries(
          newMessagesWithIdentities.map((m) => [m.id, m.identity])
        ),
      }));
      setMessagesUpdated(true);
    }
  }, [messages, isLoading]);
  //   useEffect(() => {
  //     console.log(messages);
  //     if (isLoading && messages.length > 0 && !messagesUpdated) {
  //       setMessages((messages) =>

  //       );
  //       setMessagesUpdated(true);
  //     }
  //   }, [messages, setMessages, isLoading, messagesUpdated]);
  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (chatIsActive && !isLoading) {
      if (messages.length === 0) {
        append(
          {
            role: "system",
            content:
              "You are an agent in a conversation with other agents. Make an introduction of yourself. Let everyone knwo who you are. sometimes your messages are not from you, but from other agents. Give answers based on the past messages.",
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
        timeout = setTimeout(() => {
          setMessages((messages) => [
            ...messages,
            {
              id: "empty-message",
              role: "assistant",
              content: "empty message",
              data: { ignore: true },
            },
          ]);
          reload({
            body: { systemMessage: currentAgent.current?.instructions },
          }).then(() => {
            currentAgent.current =
              currentAgent.current ===
              selectedAgents[Object.keys(selectedAgents)[0]]
                ? selectedAgents[Object.keys(selectedAgents)[1]]
                : selectedAgents[Object.keys(selectedAgents)[0]];
            setMessagesUpdated(false);
          });
        }, 6000);
      }
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
  console.log(messageSequence);

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
            {messageSequence.map((m, index) => {
              if (!m.ignore) {
                const isUser = m.identity === "user";
                const agentKeys = Object.keys(selectedAgents);
                const isFirstAgent =
                  m.identity === selectedAgents[agentKeys[0]]?.id;

                return (
                  <Box
                    key={m.id || index}
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: isUser
                        ? "flex-end"
                        : isFirstAgent
                        ? "flex-start"
                        : "flex-end",
                      alignSelf: isUser
                        ? "flex-end"
                        : isFirstAgent
                        ? "flex-start"
                        : "flex-end",
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
                      {selectedAgents[m.identity]
                        ? selectedAgents[m.identity].name
                        : "User"}
                    </Typography>
                    <Paper
                      elevation={1}
                      sx={{
                        p: 2,
                        borderRadius: 2,
                        bgcolor: isUser
                          ? "primary.main"
                          : isFirstAgent
                          ? "#f0f0f0"
                          : "#e3f2fd",
                        color: isUser ? "white" : "text.primary",
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
              }
              return null;
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
