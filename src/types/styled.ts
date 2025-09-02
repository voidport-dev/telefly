import styled from "@emotion/styled";

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
`;

export const StepContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  min-width: 300px;
`;

export const StepTitle = styled.h2`
  color: #fff;
  margin: 0;
  font-size: 24px;
  font-weight: 500;
`;

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
`;

export const Input = styled.input`
  padding: 12px;
  font-size: 16px;
  color: #fff;
  background: #222;
  border: 1px solid #333;
  border-radius: 4px;
  outline: none;
  transition: border-color 0.2s ease-in-out;

  &:focus {
    border-color: #555;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

export const Button = styled.button`
  padding: 12px;
  font-size: 16px;
  color: #fff;
  cursor: pointer;
  background: #333;
  border: none;
  border-radius: 4px;
  transition: background 0.2s ease-in-out;

  &:hover:not(:disabled) {
    background: #444;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    background: #222;
  }
`;

export const ErrorMessage = styled.div`
  color: #ff6b6b;
  background: rgb(255 107 107 / 10%);
  border: 1px solid #ff6b6b;
  border-radius: 4px;
  padding: 12px;
  margin-top: 16px;
  text-align: center;
  max-width: 300px;
`;

export const LoadingSpinner = styled.div`
  display: inline-block;
  width: 16px;
  height: 16px;
  border: 2px solid #fff;
  border-radius: 50%;
  border-top-color: transparent;
  animation: spin 1s ease-in-out infinite;
  margin-right: 8px;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;
