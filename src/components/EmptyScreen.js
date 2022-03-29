import React from "react";
import { Link as RouterLink } from "react-router-dom";
import { Box, Typography, Link } from "@material-ui/core";

export default function EmptyScreen({ title, subtitle, link }) {
  console.log("--> LINK", link);
  return (
    <Box height={200}>
      {title && (
        <Typography variant="h4" gutterBottom>
          {title}
        </Typography>
      )}
      {subtitle && (
        <Typography variant="subtitle2" gutterBottom>
          {subtitle}
        </Typography>
      )}
      {link && (
        <Link component={RouterLink} to={link}>
          Go Back
        </Link>
      )}
    </Box>
  );
}
