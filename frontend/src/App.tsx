import React from "react";
import { MantineProvider } from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import { ModalsProvider } from "@mantine/modals";
import { theme } from "./theme";
import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";

function App() {
  return (
    <MantineProvider theme={theme}>
      <ModalsProvider>
        <Notifications />
        <div style={{ padding: "2rem", textAlign: "center" }}>
          <h1 style={{ color: "#dc143c", marginBottom: "1rem" }}>
            Wheeler Knight Portfolio
          </h1>
          <p style={{ color: "#808080", fontSize: "1.2rem" }}>
            Welcome to my portfolio website! 🚀
          </p>
          <p style={{ marginTop: "1rem", color: "#666" }}>
            Development environment is ready. Let's build something amazing!
          </p>
        </div>
      </ModalsProvider>
    </MantineProvider>
  );
}

export default App;
