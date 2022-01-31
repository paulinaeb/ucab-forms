import { Container } from "@mui/material";
import Table from "../components/Table";

const Dashboard = () => {
  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Table />
    </Container>
  );
};

export default Dashboard;
