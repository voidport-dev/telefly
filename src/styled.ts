import { css } from "@emotion/react";

export const globalStyles = css`
  * {
    box-sizing: border-box;
    padding: 0;
    margin: 0;
    font-family: Arial, Helvetica, sans-serif;
    user-select: none;
    outline: none;
  }

  #root,
  html,
  body {
    height: 100%;
  }

  #root {
    height: 100dvh;
    color: #fff;
    background: #111;
  }
`;
