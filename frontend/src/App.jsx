import { BrowserRouter, Routes, Route } from "react-router-dom";
import Signup from "./components/Signup";
import Login from "./components/Login";
import Home from "./components/Home";
import Dashboard from "./components/Dashboard";
import AddTransaction from "./components/AddTransaction";
import Transactions from "./components/Transactions";
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <BrowserRouter>
      <Toaster
        position="top-right"
        toastOptions={{
          className: "custom-toast",
          duration: 2000,
          style: {
            marginTop: "10px",
            marginBottom: "10px",
          },
        }}
        containerStyle={{
          marginRight: "3rem",
          marginTop: "3rem",
        }}
      />

      <Routes>
        <Route path="/" element={<Home />}></Route>
        <Route path="/signup" element={<Signup />}></Route>
        <Route path="/login" element={<Login />}></Route>
        <Route path="/dashboard" element={<Dashboard />}></Route>
        <Route path="/add-transaction" element={<AddTransaction />}></Route>
        <Route path="/transactions" element={<Transactions />}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
