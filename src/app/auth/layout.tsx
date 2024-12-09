import { Box, Typography, Container } from "@mui/material";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
      }}
    >
      <Box
        sx={{
          flex: 1,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          p: 4,
        }}
      >
        {children}
      </Box>

      <Box
        sx={{
          flex: 1,
          bgcolor: "",
          display: { xs: "none", md: "flex" },
          justifyContent: "center",
          alignItems: "center",
          p: 4,
          backgroundColor: "#a9e2ff94",
        }}
      >
        <Container maxWidth="sm">
          <Box sx={{ textAlign: "center" }}>
            <Typography variant="h1" component="h1" gutterBottom>
              Welcome Back
            </Typography>
            <Typography variant="h6" color="text.secondary">
              Sign in to access your account and continue your journey with us.
            </Typography>
          </Box>
        </Container>
      </Box>
    </Box>
  );
}
