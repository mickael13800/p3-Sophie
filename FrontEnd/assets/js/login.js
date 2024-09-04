document.addEventListener("DOMContentLoaded", (event) => {
  console.log("Login JS est chargé");
});

function displayErrorMessage() {
  alert("mot de passe ou e-mail incorrect");
  console.log("mot de passe ou e-mail incorrect");
}

//Récupération du formulaire de connexion
const form = document.querySelector("form");

//Bouton envoyer renvoie le champs "email" et "password"
form.addEventListener("submit", (event) => {
  event.preventDefault();
  const email = document.getElementById("email");
  const password = document.getElementById("password");
  console.log(email.value, password.value);

  const userInfo = { email: email.value, password: password.value };
  const stringUserInfo = JSON.stringify(userInfo);

  fetch("http://localhost:5678/api/users/login", {
    method: "POST",
    body: stringUserInfo,
    headers: { "Content-Type": "application/json" },
  })
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        displayErrorMessage();
        throw new Error("Erreur de connexion");
      }
    })
    .then((data) => {
      console.log(data);
      window.localStorage.setItem("token", data.token);
      window.location.href = "index.html";
    })
    .catch((error) => {
      displayErrorMessage();
    });
});
