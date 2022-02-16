import { Container } from "@mui/material";
import DashboardTable from "../components/DashboardTable";

const Dashboard = () => {
  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <DashboardTable />
    </Container>
  );
};

export default Dashboard;
