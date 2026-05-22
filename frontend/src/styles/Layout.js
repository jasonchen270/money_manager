import styled from "styled-components";

export const Layout = styled.div`
  display: flex;
  gap: 30px;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 0;
  }
`;
