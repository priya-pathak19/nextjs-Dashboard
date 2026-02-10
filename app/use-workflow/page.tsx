"use client";

import { useState } from "react";

export default function SignupPage() {
  const [message, setMessage] = useState("");

  async function onSubmit(formData: FormData) {
    const res = await fetch("/use-workflow-route", {
      method: "POST",
      body: JSON.stringify({
        email: formData.get("email"),
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (res.ok) {
      setMessage("Signup started successfully!");
    } else {
      setMessage("Something went wrong");
    }
  }

  return (
    <form action={onSubmit} className="flex flex-col gap-2">
      <input name="email" type="email" placeholder="Email" required />

      <button type="submit">Sign up</button>

      {message && <p>{message}</p>}
    </form>
  );
}
