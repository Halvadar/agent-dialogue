import * as React from "react";
import Header from "./components/Header";
import MainGrid from "./components/MainGrid";
import DashboardClient from "./DashboardClient";
import { Box } from "@mui/material";
import Conversation from "./components/Conversation";
import { ConversationProvider } from "@/app/context/ConversationContext";

export default function Dashboard(props: { disableCustomTheme?: boolean }) {
  return (
    <ConversationProvider>
      <DashboardClient {...props}>
        <Header />
        <Box sx={{ flex: 1, display: "flex", gap: 2, width: "100%" }}>
          <Conversation />
          <MainGrid />
        </Box>
      </DashboardClient>
    </ConversationProvider>
  );
}
