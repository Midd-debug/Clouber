// theme.js
import { extendTheme } from "@chakra-ui/react";

const theme = extendTheme({
  colors: {
    brand: {
      50: "#f5f5f5",  // fondo claro
      100: "#e0e0e0",
      200: "#bdbdbd",
      300: "#9e9e9e",
      400: "#757575",
      500: "#616161",
      600: "#424242",
      700: "#333333",  // fondo oscuro
      800: "#212121",
      900: "#121212",
    },
    accent: {
      500: "#A6C0FE",  // color suave para botones y highlights
    },
  },
  fonts: {
    heading: "Poppins, sans-serif",
    body: "Roboto, sans-serif",
  },
  styles: {
    global: {
      body: {
        bg: "brand.800",
        color: "brand.50",
      },
      input: {
        bg: "brand.700",
        color: "brand.50",
        borderColor: "brand.600",
      },
      button: {
        bg: "accent.500",
        color: "brand.800",
        _hover: {
          bg: "accent.500",
          opacity: 0.8,
        },
      },
      box: {
        bg: "brand.700",
      },
    },
  },
});

export default theme;
