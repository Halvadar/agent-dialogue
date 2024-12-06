"use client";

import {
  Card,
  CardContent,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Box,
  Button,
  DialogActions,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import { useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import { useAgents } from "@/app/context/AgentsContext";
import { Agent } from "@/app/types/agentTypes";
import { Timestamp } from "firebase/firestore";
import DeleteIcon from "@mui/icons-material/Delete";
import { deleteAgent } from "@/app/actions";

interface AgentsProps {
  currentTab: number;
}

export default function Agents({ currentTab }: AgentsProps) {
  const { selectedAgents, setSelectedAgent, agents, myAgents, chatIsActive } =
    useAgents();
  const [openedAgent, setOpenedAgent] = useState<Agent | null>(null);
  const [open, setOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [agentToDelete, setAgentToDelete] = useState<Agent | null>(null);
  const displayedAgents = currentTab === 0 ? agents : myAgents;

  const handleOpen = (agent: Agent) => {
    setOpenedAgent(agent);
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  const handleCardClick = (event: React.MouseEvent, agent: Agent) => {
    if (
      event.target instanceof HTMLElement &&
      event.target.closest(".MuiCheckbox-root")
    ) {
      return; // Don't open dialog if checkbox was clicked
    }
    handleOpen(agent);
  };

  const handleAgentSelect = (event: React.MouseEvent, agent: Agent) => {
    event.stopPropagation();
    if (!chatIsActive) {
      setSelectedAgent(agent);
    }
  };

  const handleDeleteClick = (event: React.MouseEvent, agent: Agent) => {
    event.stopPropagation();
    if (!chatIsActive) {
      setAgentToDelete(agent);
      setDeleteConfirmOpen(true);
    }
  };

  const handleDeleteConfirm = async () => {
    if (agentToDelete) {
      const formData = new FormData();
      formData.append("agentId", agentToDelete.id);
      await deleteAgent(formData);
      setDeleteConfirmOpen(false);
      setAgentToDelete(null);
    }
  };

  return (
    <>
      {displayedAgents.map((agent, index) => (
        <Grid size={{ xs: 12, sm: 6, md: 6, lg: 4, xl: 3 }} key={index}>
          <Card
            sx={{
              height: "100%",
              cursor: chatIsActive ? "not-allowed" : "pointer",
              transition: "all 0.2s ease-in-out",
              position: "relative",
              backgroundColor: (theme) => {
                return selectedAgents[agent.id]
                  ? theme.palette.mode === "dark"
                    ? "#434343!important"
                    : "primary.light"
                  : "background.paper";
              },
              "&:hover": {
                boxShadow: 6,
                transform: "translateY(-4px)",
              },
            }}
            onClick={(e) => !chatIsActive && handleCardClick(e, agent)}
          >
            <CardContent
              sx={{
                display: "flex",
                flexDirection: "column",
                height: "100%",
              }}
            >
              <Typography
                variant="h6"
                gutterBottom
                sx={{
                  fontWeight: 600,
                  color: "primary.main",
                  pr: 4, // Make room for checkbox
                }}
              >
                {agent.name}
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  mb: 2,
                  minHeight: "4.5em",
                  flexGrow: 1, // Allow this to grow and push the button down
                }}
              >
                {agent.instructions.length > 200
                  ? `${agent.instructions.substring(0, 200)}...`
                  : agent.instructions}
              </Typography>
              <Typography variant="caption" display="block" sx={{ mt: "auto" }}>
                Created by: {agent.creator || "N/A"}
              </Typography>
              <Typography variant="caption" display="block">
                Created:{" "}
                {agent.createdAt
                  ? new Date(agent.createdAt).toUTCString()
                  : "N/A"}
              </Typography>
              <Box
                sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}
              >
                <Button
                  variant="contained"
                  color="primary"
                  onClick={(e) => handleAgentSelect(e, agent)}
                  disabled={chatIsActive}
                  sx={{
                    flex: 1,
                    mr: 1,
                    opacity: chatIsActive ? 0.5 : 1,
                  }}
                >
                  {selectedAgents[agent.id] ? "Deselect" : "Select"}
                </Button>
                {currentTab === 1 && ( // Only show delete button for my agents
                  <IconButton
                    onClick={(e) => handleDeleteClick(e, agent)}
                    disabled={chatIsActive}
                    color="error"
                    sx={{
                      opacity: chatIsActive ? 0.5 : 1,
                    }}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      ))}

      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 2,
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.08)",
          },
        }}
      >
        <Card variant="outlined" sx={{ p: 4 }}>
          <DialogTitle
            sx={{
              pr: 6,
              pb: 1,
              borderBottom: 1,
              borderColor: "divider",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Typography variant="h5" sx={{ fontWeight: 600 }}>
                {openedAgent?.name}
              </Typography>
            </Box>
            <IconButton
              onClick={handleClose}
              sx={{
                color: "grey.500",
                "&:hover": {
                  color: "grey.700",
                  backgroundColor: "grey.100",
                },
              }}
            >
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent sx={{ mt: 2 }}>
            <Typography
              variant="body1"
              sx={{
                lineHeight: 1.7,
                color: "text.primary",
              }}
            >
              {openedAgent?.instructions}
            </Typography>
            <Typography
              variant="caption"
              display="block"
              sx={{
                mt: 2,
                color: "text.secondary",
                fontStyle: "italic",
              }}
            >
              Created by: {openedAgent?.creator}
            </Typography>
            <Typography
              variant="caption"
              display="block"
              sx={{
                color: "text.secondary",
                fontStyle: "italic",
              }}
            >
              Created on:{" "}
              {openedAgent?.createdAt
                ? new Date(openedAgent.createdAt).toUTCString()
                : "N/A"}
            </Typography>
          </DialogContent>
        </Card>
      </Dialog>

      <Dialog
        open={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        aria-labelledby="delete-dialog-title"
      >
        <DialogTitle id="delete-dialog-title">Delete Agent</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete {agentToDelete?.name}? This action
            cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteConfirmOpen(false)}>Cancel</Button>
          <Button
            onClick={handleDeleteConfirm}
            color="error"
            variant="contained"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
