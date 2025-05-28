import "@testing-library/jest-dom"
import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { SignupForm } from "../signup-form";
import { useAuth } from "../../context/authContext";
import { useRouter } from "next/navigation";
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

// Mock useAuth context
jest.mock("../../context/authContext", () => ({
  useAuth: jest.fn(),
}));

describe("SignupForm", () => {
  const pushMock = jest.fn();
  const signupMock = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    useRouter.mockReturnValue({ push: pushMock });
    useAuth.mockReturnValue({ signup: signupMock });
  });

  it("should render form inputs", () => {
    render(<SignupForm />);

    const nameInput = screen.getByPlaceholderText("Your full name");
    expect(nameInput).toBeInTheDocument();

    const emailInput = screen.getByPlaceholderText("email@example.com");
    expect(emailInput).toBeInTheDocument();

    const passwordInput = screen.getByPlaceholderText("Enter password");
    expect(passwordInput).toBeInTheDocument();

    const repeatPasswordInput = screen.getByPlaceholderText("Repeat password");
    expect(repeatPasswordInput).toBeInTheDocument();
  });

  it("should call signup and redirects on successful submit", async () => {
    signupMock.mockResolvedValueOnce();

    render(<SignupForm />);

    const  nameInput = screen.getByPlaceholderText("Your full name");
    fireEvent.change(nameInput, { target: { value: "John Doe" } });

    const emailInput = screen.getByPlaceholderText("email@example.com");
    fireEvent.change(emailInput, { target: { value: "john@example.com" } });

    const passwordInput = screen.getByPlaceholderText("Enter password");
    fireEvent.change(passwordInput, { target: { value: "password123" } });

    const repeatPasswordInput = screen.getByPlaceholderText("Repeat password");
    fireEvent.change(repeatPasswordInput, { target: { value: "password123" } });

    const signupButton = screen.getByRole("button", { name: /sign up/i });
    fireEvent.click(signupButton);

    await waitFor(() => {
      expect(signupMock).toHaveBeenCalledWith("john@example.com", "password123", "John Doe");
      expect(pushMock).toHaveBeenCalledWith("/dashboard");
    });
  });

  it("should display firebase error message if signup fails", async () => {
    signupMock.mockRejectedValueOnce(new Error("Firebase error"));

    render(<SignupForm />);

    const nameInput = screen.getByLabelText("Name");
    fireEvent.change(nameInput, { target: { value: "John Doe" } });

    const emailInput = screen.getByLabelText("Email");
    fireEvent.change(emailInput, { target: { value: "john@example.com" } });

    const passwordInput = screen.getByLabelText("Password");
    fireEvent.change(passwordInput, { target: { value: "password123" } });

    const repeatPasswordInput = screen.getByLabelText("Repeat Password");
    fireEvent.change(repeatPasswordInput, { target: { value: "password123" } });

    const signupButton = screen.getByRole("button", { name: /sign up/i })
    fireEvent.click(signupButton);

    expect(await screen.findByText("Firebase error")).toBeInTheDocument();
  });
});