// Mantine Theme Configuration
import { createTheme, MantineColorsTuple } from "@mantine/core";

// Define Wheeler Knight's color scheme
const crimson: MantineColorsTuple = [
  "#ffeaea",
  "#ffd1d1",
  "#ffa8a8",
  "#ff7e7e",
  "#ff5454",
  "#ff2a2a",
  "#dc143c", // Main crimson color
  "#b81111",
  "#9a0e0e",
  "#7c0b0b",
];

const grey: MantineColorsTuple = [
  "#f8f9fa",
  "#e9ecef",
  "#dee2e6",
  "#ced4da",
  "#adb5bd",
  "#6c757d",
  "#495057",
  "#343a40",
  "#212529",
  "#808080", // Main grey color
];

export const theme = createTheme({
  colors: {
    crimson,
    grey,
  },
  primaryColor: "crimson",
  primaryShade: 6,

  // Typography
  fontFamily:
    "Inter, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif",
  fontFamilyMonospace: "Monaco, Courier, monospace",

  // Headings
  headings: {
    fontFamily:
      "Inter, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif",
    fontWeight: "600",
  },

  // Spacing
  spacing: {
    xs: "0.5rem",
    sm: "0.75rem",
    md: "1rem",
    lg: "1.5rem",
    xl: "2rem",
  },

  // Border radius
  radius: {
    xs: "0.25rem",
    sm: "0.375rem",
    md: "0.5rem",
    lg: "0.75rem",
    xl: "1rem",
  },

  // Shadows
  shadows: {
    xs: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
    sm: "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)",
    md: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
    lg: "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
    xl: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
  },

  // Breakpoints
  breakpoints: {
    xs: "30em",
    sm: "48em",
    md: "64em",
    lg: "74em",
    xl: "90em",
  },

  // Components
  components: {
    Button: {
      defaultProps: {
        radius: "md",
      },
    },
    Card: {
      defaultProps: {
        radius: "md",
        shadow: "sm",
      },
    },
    TextInput: {
      defaultProps: {
        radius: "md",
      },
    },
    Textarea: {
      defaultProps: {
        radius: "md",
      },
    },
    Select: {
      defaultProps: {
        radius: "md",
      },
    },
  },
});
