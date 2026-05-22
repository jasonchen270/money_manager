import React from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { useGlobalContext } from "../context/globalContext";

const Home = () => {
  const navigate = useNavigate();

  const { getUser, setError } = useGlobalContext();

  const handleLogin = async () => {
    const success = await getUser();

    if (success) {
      navigate("/dashboard");
    } else {
      setError(null);
      navigate("/login");
    }
  };

  const handleSignup = async () => {
    const success = await getUser();

    if (success) {
      navigate("/dashboard");
    } else {
      setError(null);
      navigate("/signup");
    }
  };
  return (
    <HomeContainer>
      <div className="NavBar">
        <h1>Money Manager</h1>

        <div className="Button">
          <div className="login-button" onClick={handleLogin}>
            Log In
          </div>

          <div className="signup-button" onClick={handleSignup}>
            Sign Up
          </div>
        </div>
      </div>
    </HomeContainer>
  );
};

const HomeContainer = styled.div`
  .NavBar {
    display: flex;
    justify-content: space-between;
    width: 100%;
    height: 100px;
    padding: 30px 25%;
    align-items: center;
    border-bottom: 2px solid;
    background-color: var(--secondary-color);
  }

  .Button {
    display: flex;
  }

  .login-button {
    font-weight: 600;
    font-size: 1rem;
    padding: 15px 15px;
    border: 2px solid;
    border-radius: 10px;
    cursor: pointer;
    transition: all 0.3s ease 0s;
    &:hover {
      color: #0f2c85;
    }
  }

  .signup-button {
    background: #556b2f;
    margin-left: 10px;
    font-weight: 600;
    font-size: 1rem;
    padding: 15px 15px;
    border: 2px solid #556b2f;
    border-radius: 10px;
    cursor: pointer;
    transition: all 0.3s ease 0s;
    &:hover {
      background: var(--hover-color);
    }
  }
`;

export default Home;
