import { useAppSelector } from "../hooks";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import getBlogTheme from "../theme/getBlogTheme";
import React from "react";
import { Container, CssBaseline } from "@mui/material";
import AppAppBar from "./AppAppBar";
import { Outlet } from "react-router-dom";
import Footer from "./Footer";

export default function Layout() {
    const mode = useAppSelector((state) => state.theme.mode);

    const blogTheme = createTheme(getBlogTheme(mode));
    
    return (
      <ThemeProvider theme={blogTheme}>
        <CssBaseline enableColorScheme />
        <AppAppBar />
        <Container
          maxWidth="lg"
          component="main"
          sx={{ display: 'flex', flexDirection: 'column', my: 16, gap: 4 }}
        >
          <Outlet />
        </Container>
        <Footer />
      </ThemeProvider>
    )
}