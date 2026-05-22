import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { useGlobalContext } from "../context/globalContext";
import { toast } from "react-hot-toast";

const Navigation = () => {
  const { logout, getUser, user } = useGlobalContext();

  const navigate = useNavigate();

  const handleLogout = async () => {
    const success = await logout();

    if (success) {
      toast.success("Logged out successfully");
      navigate("/");
    }
  };

  useEffect(() => {
    getUser();
  }, []);
  return (
    <NavStyled>
      <div>
        <div className="user">
          <i className="fa-solid fa-circle-user"></i>
          {/* name is null if name is not loaded yet*/}
          <h2>{user ? user.name : null}</h2>
        </div>

        <ul className="menu-items">
          <li onClick={() => navigate("/dashboard")}>
            <i className="fa-solid fa-chart-line"></i>
            <span>Dashboard</span>
          </li>

          <li onClick={() => navigate("/transactions")}>
            <i className="fa-solid fa-credit-card"></i>
            <span>Transactions</span>
          </li>

          <li onClick={() => navigate("/add-transaction")}>
            <i className="fa-solid fa-money-bill-transfer"></i>
            <span>Add Transaction</span>
          </li>
        </ul>
      </div>

      <ul className="menu-items">
        <li onClick={handleLogout}>
          <i className="fa-solid fa-right-from-bracket"></i>
          <span>Logout</span>
        </li>
      </ul>
    </NavStyled>
  );
};

const NavStyled = styled.div`
  padding: 30px 0px;
  border: 2px solid;
  border-radius: 10px;
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  background: var(--secondary-color);
  width: 300px;
  margin-left: 40px;
  margin-top: 40px;

  @media (max-width: 768px) {
    width: 100%;
    margin: 0;
  }

  .user {
    display: flex;
    align-items: center;
    justify-content: left;
    width: 100%;
    padding-bottom: 20px;
    margin-left: 10px;
  }

  .user h2 {
    font-size: 20px;
    font-weight: 600px;
  }

  .fa-circle-user {
    font-size: 40px;
    color: white;
    margin-right: 10px;
    margin-left: 10px;
  }

  ul {
    padding: 10px;
  }

  ul li {
    display: flex;
    align-items: center;
    cursor: pointer;
    margin-bottom: 5px;
    padding: 10px;
    border-radius: 5px;
  }

  ul li span {
    margin-left: 10px;
  }

  ul li:hover {
    background: var(--hover-color);
  }
`;

export default Navigation;
