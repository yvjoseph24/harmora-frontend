async function buy() {
  const status = document.getElementById("status");
  status.innerText = "Redirecting to checkout...";

  try {
    const res = await fetch("https://harmora-backend.onrender.com/create-checkout-session", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        product: {
          name: "Beat Pack 1",
          price: 10
        }
      })
    });

    const data = await res.json();

    if (!data.url) {
      status.innerText = "Error: No checkout link returned.";
      return;
    }

    window.location.href = data.url;

  } catch (err) {
    console.error(err);
    status.innerText = "Error connecting to server.";
  }
}
