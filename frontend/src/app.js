export function createAppModel() {
  return {
    title: "CI Starter Frontend",
    status: "ready",
    checks: ["build", "test", "security scan"]
  };
}

const container = globalThis.document?.querySelector("#app");

if (container) {
  const model = createAppModel();
  container.innerHTML = `
    <div class="card">
      <h2>${model.title}</h2>
      <p>Status: <strong>${model.status}</strong></p>
      <ul>
        ${model.checks.map((check) => `<li>${check}</li>`).join("")}
      </ul>
    </div>
  `;
}