"use client";

import { Card, CardContent, Typography } from "@mui/material";
import Grid from "@mui/material/Grid2";

type Agent = {
  id: string;
  name: string;
  instructions: string;
  creator: string;
};

type AgentsProps = {
  agents: Agent[];
};

export default function Agents({ agents }: AgentsProps) {
  return agents.map((agent, index) => (
    <Grid size={{ xs: 12, sm: 6, md: 4, lg: 2 }} key={index}>
      <Card sx={{ height: "100%" }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            {agent.name}
          </Typography>
          <Typography
            variant="body2"
            sx={{
              mb: 2,
              minHeight: "4.5em",
            }}
          >
            {agent.instructions.length > 200
              ? `${agent.instructions.substring(0, 200)}...`
              : agent.instructions}
          </Typography>
          <Typography variant="caption" display="block" sx={{ mt: "auto" }}>
            Created by: {agent.creator}
          </Typography>
        </CardContent>
      </Card>
    </Grid>
  ));
}
