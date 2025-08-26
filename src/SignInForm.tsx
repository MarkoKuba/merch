"use client";
import { useAuthActions } from "@convex-dev/auth/react";
import { useState } from "react";
import { toast } from "sonner";

export function SignInForm() {
  const { signIn } = useAuthActions();
  const [flow, setFlow] = useState<"signIn" | "signUp">("signIn");
  const [submitting, setSubmitting] = useState(false);

  return (
    <div className="w-full space-y-4">
      <form
        className="flex flex-col"
        onSubmit={(e) => {
          e.preventDefault();
          setSubmitting(true);
          const formData = new FormData(e.target as HTMLFormElement);
          formData.set("flow", flow);
          void signIn("password", formData).catch((error) => {
            let toastTitle = "";
            if (error.message.includes("Invalid password")) {
              toastTitle = "Invalid password. Please try again.";
            } else {
              toastTitle =
                flow === "signIn"
                  ? "Could not sign in, did you mean to sign up?"
                  : "Could not sign up, did you mean to sign in?";
            }
            toast.error(toastTitle);
            setSubmitting(false);
          });
        }}
      >
        <div className="form-control w-full gap-4">
          <input
            className="input input-bordered w-full bg-base-200"
            type="email"
            name="email"
            placeholder="Email"
            required
          />
          <input
            className="input input-bordered w-full bg-base-200 mt-3"
            type="password"
            name="password"
            placeholder="Password"
            required
          />
        </div>
        <button type="submit" disabled={submitting} className="btn btn-primary w-full mt-6">
          {submitting ? <span className="loading loading-spinner"></span> : 
           flow === "signIn" ? "Sign in" : "Sign up"}
        </button>
        <div className="text-center text-sm mt-4">
          <span className="opacity-70">
            {flow === "signIn"
              ? "Don't have an account? "
              : "Already have an account? "}
          </span>
          <button
            type="button"
            className="link link-primary font-medium"
            onClick={() => setFlow(flow === "signIn" ? "signUp" : "signIn")}
          >
            {flow === "signIn" ? "Sign up instead" : "Sign in instead"}
          </button>
        </div>
      </form>
      <div className="divider">or
      </div>
      <button className="btn btn-outline w-full" onClick={() => void signIn("anonymous")}>
        Sign in anonymously
      </button>
    </div>
  );
}
