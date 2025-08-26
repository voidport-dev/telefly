import React, { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";

import {
  Form,
  Container,
  Button,
  Input,
  ErrorMessage,
  StepContainer,
  StepTitle,
  LoadingSpinner,
} from "./styled";
import { useTDL } from "../../hooks/useTDL";

type AuthStep = "phone" | "code" | "password" | "registration";

export default function Login() {
  const {
    isInitialized,
    isLoading,
    error,
    status,
    loginWithPhone,
    submitAuthCode,
    submitPassword,
    registerUser,
    clearError,
    init,
    getAuthState,
  } = useTDL();

  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<AuthStep>("phone");
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  useEffect(() => {
    init();
  }, []);

  useEffect(() => {
    if (status?.status === "logged_in") {
      navigate("/", { replace: true });
    }
  }, [status, navigate]);

  useEffect(() => {
    if (error) {
      clearError();
    }
  }, [currentStep]);

  useEffect(() => {
    if (isInitialized) {
      checkAuthState();

      const interval = setInterval(checkAuthState, 2000);

      return () => clearInterval(interval);
    }
  }, [isInitialized]);

  const checkAuthState = async () => {
    const authState = await getAuthState();

    if (authState.success && authState.authState) {
      switch (authState.authState) {
        case "authorizationStateWaitPhoneNumber":
          setCurrentStep("phone");
          break;
        case "authorizationStateWaitCode":
          setCurrentStep("code");
          break;
        case "authorizationStateWaitPassword":
          setCurrentStep("password");
          break;
        case "authorizationStateWaitRegistration":
          setCurrentStep("registration");
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
    if (!phone) return;

    const result = await loginWithPhone(phone);

    if (result.success) {
      await checkAuthState();
      setTimeout(async () => {
        await checkAuthState();
      }, 2000);
    } else {
      setTimeout(async () => {
        await checkAuthState();
      }, 500);
    }
  };

  const handleCodeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code) return;

    const result = await submitAuthCode(code);
    if (result.success) {
      await checkAuthState();
      setTimeout(async () => {
        await checkAuthState();
      }, 2000);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) return;

    const result = await submitPassword(password);
    if (result.success) {
      await checkAuthState();
      setTimeout(async () => {
        await checkAuthState();
      }, 2000);
    }
  };

  const handleRegistrationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName) return;

    const result = await registerUser(firstName, lastName);
    if (result.success) {
      await checkAuthState();
      setTimeout(async () => {
        await checkAuthState();
      }, 2000);
    }
  };

  const handleResendCode = async () => {
    const result = await loginWithPhone(phone);
    if (result.success) {
      setCode("");
      await checkAuthState();
      setTimeout(async () => {
        await checkAuthState();
      }, 2000);
    }
  };

  const renderPhoneStep = () => (
    <StepContainer>
      <StepTitle>Enter Phone Number</StepTitle>
      <Form onSubmit={handlePhoneSubmit}>
        <Input
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="+1234567890"
          type="tel"
          disabled={isLoading}
        />
        <Button type="submit" disabled={!isInitialized || isLoading || !phone}>
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
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="12345"
          type="text"
          maxLength={5}
          disabled={isLoading}
        />
        <Button type="submit" disabled={isLoading || !code}>
          {isLoading && <LoadingSpinner />}
          {isLoading ? "Verifying..." : "Verify Code"}
        </Button>
        <Button type="button" onClick={() => setCurrentStep("phone")} disabled={isLoading}>
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
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter your password"
          type="password"
          disabled={isLoading}
        />
        <Button type="submit" disabled={isLoading || !password}>
          {isLoading && <LoadingSpinner />}
          {isLoading ? "Verifying..." : "Verify Password"}
        </Button>
        <Button type="button" onClick={() => setCurrentStep("code")} disabled={isLoading}>
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
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          placeholder="First Name"
          type="text"
          disabled={isLoading}
        />
        <Input
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          placeholder="Last Name (optional)"
          type="text"
          disabled={isLoading}
        />
        <Button type="submit" disabled={isLoading || !firstName}>
          {isLoading && <LoadingSpinner />}
          {isLoading ? "Completing..." : "Complete Registration"}
        </Button>
        <Button type="button" onClick={() => setCurrentStep("password")} disabled={isLoading}>
          Back to Password
        </Button>
      </Form>
    </StepContainer>
  );

  const renderCurrentStep = () => {
    switch (currentStep) {
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
