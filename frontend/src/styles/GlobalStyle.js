import { createGlobalStyle } from "styled-components";

export const GlobalStyle = createGlobalStyle`
    * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
        list-style: none;
        font-family: Geneva, Verdana, sans-serif;
        color: var(--text-color);
    }

    :root {
        --primary-color: #0C0C0C;
        --secondary-color: #161B22;
        --third-color: #28323E;
        --hover-color: #1c252b;
        --text-color: #d9d9d9;
        --button-color: #112f4f;
        --placeholder-color: #757575;
        --expense-color: #F0648C;
        --income-color: #3EDBB0;
    }

    body {
        background-color: var(--primary-color);
        min-height: 100vh;
    }
`;
