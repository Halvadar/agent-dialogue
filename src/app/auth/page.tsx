"use client";
import { Box, Typography, Container, Paper } from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import SignIn from "@/components/templates/sign-in/SignIn";

const theme = createTheme({
  palette: {
    primary: {
      main: "#6366f1",
    },
    secondary: {
      main: "#8b5cf6",
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          display: "flex",
          minHeight: "100vh",
        }}
      >
        {/* Left side - SignIn */}
        <Box
          sx={{
            flex: 1,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            p: 4,
          }}
        >
          <SignIn />
        </Box>

        {/* Right side - Design */}
        <Box
          sx={{
            flex: 1,
            bgcolor: "",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            p: 4,
            backgroundColor: "#a9e2ff94",
          }}
        >
          <Container maxWidth="sm">
            <Box sx={{ textAlign: "center" }}>
              <Typography variant="h3" component="h1" gutterBottom>
                Welcome Back
              </Typography>
              <Typography variant="body1" color="text.secondary" paragraph>
                Sign in to access your account and continue your journey with
                us.
              </Typography>
            </Box>
          </Container>
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default App;
