import styled from "@emotion/styled";

export const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
`;

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

export const Input = styled.input`
  padding: 8px;
  font-size: 20px;
  color: #fff;
  background: #222;
  border: none;
`;

export const Button = styled.button`
  padding: 8px;
  font-size: 20px;
  color: #fff;
  cursor: pointer;
  background: #222;
  border: none;
  transition: background 0.2s ease-in-out;

  &:hover {
    background: #333;
  }
`;
