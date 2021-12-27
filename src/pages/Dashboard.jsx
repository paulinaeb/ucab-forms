import { Box, Typography, Button } from "@mui/material";
import { signOut } from "../api/auth";
import { useUser } from "../hooks/useUser";

const Dashboard = () => {
  const user = useUser();

  return (
    <Box>
      <Typography variant="h2">Dashboard</Typography>
      <Typography variant="h3">{user.name}</Typography>
      <Button onClick={signOut}>Sign Out</Button>
    </Box>
  );
};

export default Dashboard;
