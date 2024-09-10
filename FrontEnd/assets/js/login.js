function displayErrorMessage() {
  alert("Erreur dans l'identifiant ou le mot de passe");
  console.log("mot de passe ou e-mail incorrect");
}

// Récupération du formulaire de connexion
const form = document.querySelector("form");

// Bouton envoyer renvoie le champs "email" et "password"
form.addEventListener("submit", async (event) => {
  event.preventDefault();
  const email = document.getElementById("email");
  const password = document.getElementById("password");
  console.log(email.value, password.value);

  const userInfo = { email: email.value, password: password.value };
  const stringUserInfo = JSON.stringify(userInfo);

  try {
    const response = await fetch("http://localhost:5678/api/users/login", {
      method: "POST",
      body: stringUserInfo,
      headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) {
      displayErrorMessage();
      throw new Error("Erreur de connexion");
    }

    const data = await response.json();
    console.log(data);
    window.localStorage.setItem("token", data.token);
    window.location.href = "index.html";
  } catch (error) {
    displayErrorMessage();
    console.error("Une erreur s'est produite :", error);
  }
});
