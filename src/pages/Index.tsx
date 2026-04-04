import { Navigate } from "react-router-dom";
import { store } from "@/lib/store";

const Index = () => {
  if (store.isLoggedIn()) {
    return <Navigate to="/admin" replace />;
  }
  return <Navigate to="/login" replace />;
};

export default Index;
