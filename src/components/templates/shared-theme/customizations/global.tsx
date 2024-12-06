import { Theme, Components } from "@mui/material/styles";

/* eslint-disable import/prefer-default-export */
export const globalCustomizations: Components<Theme> = {
  MuiCssBaseline: {
    styleOverrides: {
      body: {
        "*::-webkit-scrollbar": {
          width: 10,
        },

        "*::-webkit-scrollbar-track-piece": {
          backgroundColor: "#FFF",
        },

        "*::-webkit-scrollbar-thumb": {
          backgroundColor: "#CBCBCB",
          outline: "2px solid #FFF",
          outlineOffset: -2,
          border: ".1px solid #B7B7B7",
        },

        "*::-webkit-scrollbar-thumb:hover": {
          backgroundColor: "#909090",
        },
      },
    },
  },
};
