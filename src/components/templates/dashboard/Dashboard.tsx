import * as React from "react";
import type {} from "@mui/x-date-pickers/themeAugmentation";
import type {} from "@mui/x-charts/themeAugmentation";
import type {} from "@mui/x-data-grid/themeAugmentation";
import type {} from "@mui/x-tree-view/themeAugmentation";
import Header from "./components/Header";
import MainGrid from "./components/MainGrid";
import AgentsData from "./components/AgentsData";
import DashboardClient from "./DashboardClient";

export default function Dashboard(props: { disableCustomTheme?: boolean }) {
  return (
    <DashboardClient {...props}>
      <Header />
      <MainGrid agents={<AgentsData />} />
    </DashboardClient>
  );
}
