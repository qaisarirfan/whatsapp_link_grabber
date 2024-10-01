import React from "react";
import styled from "styled-components";

const StyledHeader = styled.header`
  align-items: center;
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  padding: 8px;

  .logo {
    width: 70%;
    display: flex;
    align-items: center;

    img {
      height: auto;
      margin-right: 16px;
      width: 32px;
    }

    p {
      font-size: 18px;
    }
  }
  .buymeacoffee {
    width: 30%;
  }
`;

function Header() {
  return (
    <StyledHeader className="ff-card bg-white">
      <div className="logo">
        <img src="./images/logo.png" alt="logo" />
        <p>Grab whatsapp group invite links</p>
      </div>
      <a
        className="buymeacoffee"
        href="https://www.buymeacoffee.com/qaisarirfan"
        target="_blank"
        rel="noreferrer"
      >
        <img
          src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png"
          alt="Buy Me A Coffee"
        />
      </a>
    </StyledHeader>
  );
}

export default Header;
