export async function submitNetlifyForm(formData: FormData) {
  const body = new URLSearchParams();
  for (const [key, value] of formData.entries()) {
    if (typeof value === "string") {
      body.append(key, value);
    }
  }

  const response = await fetch("/__forms.html", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: body.toString(),
  });

  if (!response.ok) {
    throw new Error(
      `Form submission failed: ${response.status} ${response.statusText}`,
    );
  }
}
