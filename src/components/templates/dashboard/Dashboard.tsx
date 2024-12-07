import * as React from "react";
import Header from "./components/Header";
import MainGrid from "./components/MainGrid";
import DashboardClient from "./DashboardClient";
import { Box } from "@mui/material";
import Conversation from "./components/Conversation";
import { ConversationProvider } from "@/app/context/ConversationContext";
import { AIChatProvider } from "../../../app/context/AIChatContext";

export default function Dashboard(props: { disableCustomTheme?: boolean }) {
  return (
    <ConversationProvider>
      <AIChatProvider>
        <DashboardClient {...props}>
          <Header />
          <Box
            sx={{
              flex: 1,
              display: "flex",
              gap: 2,
              width: "100%",
              maxHeight: "calc(100vh - 50px)",
            }}
          >
            <Conversation />
            <MainGrid />
          </Box>
        </DashboardClient>
      </AIChatProvider>
    </ConversationProvider>
  );
}
