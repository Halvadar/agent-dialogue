import * as React from "react";
import { styled } from "@mui/material/styles";
import Avatar from "@mui/material/Avatar";
import MuiDrawer, { drawerClasses } from "@mui/material/Drawer";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import MenuContent from "./MenuContent";
import OptionsMenu from "./OptionsMenu";
import AgentIcon from "@/public/ai-assistant.svg";
import Image from "next/image";
import Link from "next/link";
import { useContext } from "react";
import { AuthContext } from "@/app/context/AuthContext";

const drawerWidth = 240;

const Drawer = styled(MuiDrawer)({
  width: drawerWidth,
  flexShrink: 0,
  boxSizing: "border-box",
  mt: 10,
  [`& .${drawerClasses.paper}`]: {
    width: drawerWidth,
    boxSizing: "border-box",
  },
});

export default function SideMenu() {
  const { user } = useContext(AuthContext);
  return (
    <Drawer
      variant="permanent"
      sx={{
        display: { xs: "none", md: "block" },

        [`& .${drawerClasses.paper}`]: {
          display: "flex",
          flexDirection: "column",
          backgroundColor: "background.paper",
          width: "260px",
        },
      }}
    >
      <Link href="/dashboard">
        <Box
          position="relative"
          sx={{
            display: "flex",
            height: 40,
            m: 2,
          }}
        >
          <Image src={AgentIcon} alt="Agents" fill objectFit="contain" />
        </Box>
      </Link>
      <Divider />
      <MenuContent />

      <Stack
        direction="row"
        sx={{
          p: 2,
          gap: 1,
          alignItems: "center",
          borderTop: "1px solid",
          borderColor: "divider",
        }}
      >
        <Avatar
          sizes="small"
          alt="Riley Carter"
          src="/static/images/avatar/7.jpg"
          sx={{ width: 36, height: 36 }}
        />
        <Box sx={{ mr: "auto" }}>
          <Typography
            variant="body2"
            sx={{ fontWeight: 500, lineHeight: "16px" }}
          >
            {user?.displayName || "Unknown User"}
          </Typography>
          <Typography variant="caption" sx={{ color: "text.secondary" }}>
            {user?.email || "Unknown User"}
          </Typography>
        </Box>
        <OptionsMenu />
      </Stack>
    </Drawer>
  );
}
