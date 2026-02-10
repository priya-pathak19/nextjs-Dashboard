import { sleep } from "workflow";
import { FatalError } from "workflow";

// Our workflow function defined earlier
/**
 * Business logic lives inside steps: That means the real work (like sending emails, calling APIs, saving data) is written inside steps.
 * When a step is invoked inside a workflow, it gets added to queue to run on a separate request while the workflow is suspended, just like sleep.
 * If a step throws an error, like in sendWelcomeEmail, the step will automatically be retried until it succeeds (or hits the step's max retry count).
 * Steps can throw a FatalError if an error is intentional and should not be retried.
 */
async function createUser(email: string) {
  "use step";
  console.log(`Creating user with email: ${email}`);
  // Full Node.js access - database calls, APIs, etc.
  return { id: crypto.randomUUID(), email };
}
async function sendWelcomeEmail(user: { id: string; email: string }) {
  "use step";
  console.log(`Sending welcome email to user: ${user.id}`);
  if (Math.random() < 0.3) {
    // By default, steps will be retried for unhandled errors
    throw new Error("Retryable!");
  }
}
async function sendOnboardingEmail(user: { id: string; email: string }) {
  "use step";
  if (!user.email.includes("@")) {
    // To skip retrying, throw a FatalError instead
    throw new FatalError("Invalid Email");
  }
  console.log(`Sending onboarding email to user: ${user.id}`);
}

export async function handleUserSignup(email: string) {
  // "use workflow" is a directive that must be scoped to a single function, not the whole file.
  // "use workflow" tells the runtime to treat THIS function as a workflow.
  // This means the function follows special execution rules such as:
  //
  // - Deterministic execution (same inputs → same behavior on replay)
  // - Replayability (the workflow can be re-run from history)
  // - Durable state (state is persisted across restarts)
  // - Non-blocking pauses using `sleep` (no resources consumed while waiting)
  // - Step tracking for inspection and debugging in workflow tools
  //
  "use workflow";
  const user = await createUser(email);

  await sendWelcomeEmail(user);

  await sleep("5s"); // Pause for 5s - doesn't consume any resources, Pauses the workflow without blocking a thread
  // Step-by-step what happens when a workflow hits sleep("5s"):
  //
  // 📝 The workflow reaches sleep("5s").
  // 💾 The workflow saves its current state
  //    (current position, variables, next instruction).
  // ⏰ A timer is registered with the workflow system:
  //    "Wake me up in 5 seconds."
  // ❌ The function stops running completely, does not consume CPU, thread, container, active process memory. state is persisted (saved) to durable storage
  // So, sleep does uses durable storage, but not active memory only minimal persisted storage.
  // 📴 No thread, no container, no server is tied up.
  //    Nothing is busy while waiting.
  //
  // After 5 seconds:
  // ⏱️ The workflow system triggers the timer.
  // ▶️ The workflow is reloaded from the saved state.
  // 🚶 Execution continues from the next line after sleep().

  await sendOnboardingEmail(user);

  console.log(
    "Workflow is complete! Run 'npx workflow web' to inspect your run",
  );
  return { userId: user.id, status: "onboarded" };
}
