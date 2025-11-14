import React from "react";
import { AuthProvider } from "./AuthContext";
import { HotelProvider } from "./HotelContext";
import { ThemeProvider } from "./ThemeContext";

export const AppProviders: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <HotelProvider>{children}</HotelProvider>
      </AuthProvider>
    </ThemeProvider>
  );
};
