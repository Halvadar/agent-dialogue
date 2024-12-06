import { Theme, Components } from "@mui/material/styles";

/* eslint-disable import/prefer-default-export */
export const globalCustomizations: Components<Theme> = {
  MuiCssBaseline: {
    styleOverrides: {
      body: {
        "*::-webkit-scrollbar": {
          width: "8px",
        },

        "*::-webkit-scrollbar-track-piece": {
          backgroundColor: "background.paper",
        },

        "*::-webkit-scrollbar-thumb": {
          backgroundColor: "#CBCBCB",
          border: ".1px solid #B7B7B7",
        },

        "*::-webkit-scrollbar-thumb:hover": {
          backgroundColor: "#909090",
        },
      },
    },
  },
};
