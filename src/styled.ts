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
    height: 100vh;
    color: #fff;
    background: #111;
  }

  ::-webkit-scrollbar {
    width: 8px;
    background: #111;
  }

  ::-webkit-scrollbar-thumb {
    background: #555;
    border-radius: 4px;
    cursor: pointer;
  }

  ::-webkit-scrollbar-thumb:hover {
    background: #444;
  }

  scrollbar-color: #333 #222;
  scrollbar-width: thin;
`;
