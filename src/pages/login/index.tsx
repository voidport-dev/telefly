import React, { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";

import { useTDL } from "../../hooks/use-tdl";
import {
  Form,
  Container,
  Button,
  Input,
  ErrorMessage,
  StepContainer,
  StepTitle,
  LoadingSpinner,
} from "../../types/styled";

type AuthStep = "phone" | "code" | "password" | "registration";

interface DataType {
  currentStep: AuthStep;
  phone: string;
  code: string;
  password: string;
  firstName: string;
  lastName: string;
}

export default function Login() {
  const {
    isInitialized,
    isLoading,
    error,
    init,
    getAuthState,
    loginWithPhone,
    submitAuthCode,
    submitPassword,
  } = useTDL();

  const navigate = useNavigate();

  const [data, setData] = useState<DataType>({
    currentStep: "phone",
    phone: "",
    code: "",
    password: "",
    firstName: "",
    lastName: "",
  });

  useEffect(() => {
    init();
  }, []);

  useEffect(() => {
    if (isInitialized) {
      checkAuthState();

      const interval = setInterval(checkAuthState, 2000);

      return () => clearInterval(interval);
    }
  }, [isInitialized]);

  const checkAuthState = async () => {
    const authState = await getAuthState();

    if (authState.success && authState.data) {
      switch (authState.data) {
        case "authorizationStateWaitPhoneNumber":
          setData((prev) => ({ ...prev, currentStep: "phone" }));
          break;
        case "authorizationStateWaitCode":
          setData((prev) => ({ ...prev, currentStep: "code" }));
          break;
        case "authorizationStateWaitPassword":
          setData((prev) => ({ ...prev, currentStep: "password" }));
          break;
        case "authorizationStateWaitRegistration":
          setData((prev) => ({ ...prev, currentStep: "registration" }));
          break;
        case "authorizationStateReady":
          localStorage.setItem("auth", "true");
          navigate("/", { replace: true });
          break;
        default:
          break;
      }
    }
  };

  const handlePhoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!data.phone) return;

    await loginWithPhone(data.phone);
  };

  const handleCodeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!data.code) return;

    const result = await submitAuthCode(data.code);
    if (result.success) {
      await checkAuthState();
      setTimeout(async () => {
        await checkAuthState();
      }, 2000);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!data.password) return;

    const result = await submitPassword(data.password);
    if (result.success) {
      await checkAuthState();
      setTimeout(async () => {
        await checkAuthState();
      }, 2000);
    }
  };

  const handleRegistrationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  };

  const handleResendCode = async () => {};

  const renderPhoneStep = () => (
    <StepContainer>
      <StepTitle>Enter Phone Number</StepTitle>
      <Form onSubmit={handlePhoneSubmit}>
        <Input
          value={data.phone}
          onChange={(e) => setData((prev) => ({ ...prev, phone: e.target.value }))}
          placeholder="+1234567890"
          type="tel"
          disabled={isLoading}
        />
        <Button type="submit" disabled={!isInitialized || isLoading || !data.phone}>
          {isLoading && <LoadingSpinner />}
          {isLoading ? "Sending..." : "Send Code"}
        </Button>
      </Form>
    </StepContainer>
  );

  const renderCodeStep = () => (
    <StepContainer>
      <StepTitle>Enter Verification Code</StepTitle>
      <Form onSubmit={handleCodeSubmit}>
        <Input
          value={data.code}
          onChange={(e) => setData((prev) => ({ ...prev, code: e.target.value }))}
          placeholder="12345"
          type="text"
          maxLength={5}
          disabled={isLoading}
        />
        <Button type="submit" disabled={isLoading || !data.code}>
          {isLoading && <LoadingSpinner />}
          {isLoading ? "Verifying..." : "Verify Code"}
        </Button>
        <Button
          type="button"
          onClick={() => setData((prev) => ({ ...prev, currentStep: "phone" }))}
          disabled={isLoading}
        >
          Back to Phone
        </Button>
        <Button type="button" onClick={handleResendCode} disabled={isLoading}>
          Resend Code
        </Button>
      </Form>
    </StepContainer>
  );

  const renderPasswordStep = () => (
    <StepContainer>
      <StepTitle>Enter 2FA Password</StepTitle>
      <Form onSubmit={handlePasswordSubmit}>
        <Input
          value={data.password}
          onChange={(e) => {
            setData((prev) => ({ ...prev, password: e.target.value }));
          }}
          placeholder="Enter your password"
          type="password"
          disabled={isLoading}
        />
        <Button type="submit" disabled={isLoading || !data.password}>
          {isLoading && <LoadingSpinner />}
          {isLoading ? "Verifying..." : "Verify Password"}
        </Button>
        <Button
          type="button"
          onClick={() => setData((prev) => ({ ...prev, currentStep: "code" }))}
          disabled={isLoading}
        >
          Back to Code
        </Button>
      </Form>
    </StepContainer>
  );

  const renderRegistrationStep = () => (
    <StepContainer>
      <StepTitle>Complete Registration</StepTitle>
      <Form onSubmit={handleRegistrationSubmit}>
        <Input
          value={data.firstName}
          onChange={(e) => setData((prev) => ({ ...prev, firstName: e.target.value }))}
          placeholder="First Name"
          type="text"
          disabled={isLoading}
        />
        <Input
          value={data.lastName}
          onChange={(e) => setData((prev) => ({ ...prev, lastName: e.target.value }))}
          placeholder="Last Name (optional)"
          type="text"
          disabled={isLoading}
        />
        <Button type="submit" disabled={isLoading || !data.firstName}>
          {isLoading && <LoadingSpinner />}
          {isLoading ? "Completing..." : "Complete Registration"}
        </Button>
        <Button
          type="button"
          onClick={() => setData((prev) => ({ ...prev, currentStep: "password" }))}
          disabled={isLoading}
        >
          Back to Password
        </Button>
      </Form>
    </StepContainer>
  );

  const renderCurrentStep = () => {
    switch (data.currentStep) {
      case "phone":
        return renderPhoneStep();
      case "code":
        return renderCodeStep();
      case "password":
        return renderPasswordStep();
      case "registration":
        return renderRegistrationStep();
      default:
        return renderPhoneStep();
    }
  };

  if (!isInitialized) {
    return (
      <Container>
        <StepContainer>
          <StepTitle>Initializing TDLib...</StepTitle>
        </StepContainer>
      </Container>
    );
  }

  return (
    <Container>
      {renderCurrentStep()}
      {error && <ErrorMessage>{error}</ErrorMessage>}
    </Container>
  );
}
