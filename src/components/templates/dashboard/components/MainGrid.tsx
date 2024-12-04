"use client";

import * as React from "react";
import Paper from "@mui/material/Paper";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Divider from "@mui/material/Divider";
import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid2";
import AddIcon from "@mui/icons-material/Add";
import IconButton from "@mui/material/IconButton";
import { Box, Button, Dialog } from "@mui/material";
import { createAgent } from "@/app/actions";
export default function MainGrid({ agents }) {
  const [tabValue, setTabValue] = React.useState(0);
  const [open, setOpen] = React.useState(false);
  const handleTabChange = (
    event: React.ChangeEvent<unknown>,
    newValue: number
  ) => {
    setTabValue(newValue);
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = async (formData: FormData) => {
    await createAgent(formData);
    handleClose();
  };

  return (
    <Paper
      elevation={3}
      sx={{
        width: "100%",
        maxWidth: { sm: "100%", md: "1700px" },
        flexGrow: 1,
        alignSelf: "flex-start",
        display: "flex",
        flexDirection: "column",
        gap: 2,
        p: 3,
      }}
    >
      <Tabs value={tabValue} onChange={handleTabChange}>
        <Tab label="All agents" />
        <Tab label="My agents" />
      </Tabs>
      <Divider />
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, sm: 6, md: 4, lg: 2 }}>
          <Card
            sx={{
              height: "100%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              cursor: "pointer",
              "&:hover": {
                bgcolor: "action.hover",
              },
              py: 4,
            }}
            onClick={handleOpen}
          >
            <IconButton
              color="primary"
              sx={{
                mb: 1,
                width: 60,
                height: 60,
                bgcolor: "primary.light",
                "&:hover": {
                  bgcolor: "primary.main",
                },
              }}
            >
              <AddIcon sx={{ fontSize: 32, color: "white" }} />
            </IconButton>
            <Typography variant="h6" color="primary">
              Create New Agent
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Click to add a new agent
            </Typography>
          </Card>
        </Grid>
        {agents}
      </Grid>
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <Card variant="outlined" sx={{ p: 4 }}>
          <Typography
            component="h1"
            variant="h4"
            sx={{
              width: "100%",
              fontSize: "clamp(2rem, 10vw, 2.15rem)",
              mb: 3,
            }}
          >
            Create an Agent
          </Typography>
          <Box
            component="form"
            action={handleSubmit}
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 3,
            }}
          >
            <TextField
              autoComplete="name"
              name="name"
              required
              fullWidth
              id="name"
              placeholder="Philosophical Agent"
              variant="outlined"
              label="Name"
            />

            <TextField
              required
              fullWidth
              id="instructions"
              placeholder="You are a philosophical agent..."
              name="instructions"
              variant="outlined"
              rows={4}
              multiline
              label="Instructions"
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{
                mt: 2,
                maxWidth: 200,
                alignSelf: "flex-end",
                py: 1.5,
                borderRadius: 1,
                textTransform: "none",
                boxShadow: 2,
                "&:hover": {
                  boxShadow: 4,
                },
                backgroundColor: "secondary",
              }}
            >
              Create Agent
            </Button>
          </Box>
        </Card>
      </Dialog>
    </Paper>
  );
}
