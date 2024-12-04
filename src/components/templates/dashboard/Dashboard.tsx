import * as React from "react";
import type {} from "@mui/x-date-pickers/themeAugmentation";
import type {} from "@mui/x-charts/themeAugmentation";
import type {} from "@mui/x-data-grid/themeAugmentation";
import type {} from "@mui/x-tree-view/themeAugmentation";
import Header from "./components/Header";
import MainGrid from "./components/MainGrid";
import DashboardClient from "./DashboardClient";
import { Box } from "@mui/material";
import Conversation from "./components/Conversation";
import Agents from "./components/Agents";

export default function Dashboard(props: { disableCustomTheme?: boolean }) {
  return (
    <DashboardClient {...props}>
      <Header />
      <Box sx={{ flex: 1, display: "flex", gap: 2, width: "100%" }}>
        <Conversation />
        <MainGrid agents={<Agents />} />
      </Box>
    </DashboardClient>
  );
}
