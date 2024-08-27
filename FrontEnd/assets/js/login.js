document.addEventListener("DOMContentLoaded", (event) => {
  console.log("Login JS est chargé");
  /*
    étape 1 créer le HTML et CSS de la page login
    étape 2 le fichier login HTML doit appeler le fichier login.js = console.log de la ligne 2 doit s'afficher dans la console
    étape 3 coder en javascript quand je clique sur le bouton envoyer : console.log ("boutonCliquer")
    étape 4 qd je clique sur le bouton envoyer, je fais un console.log de ce qui a été saisie dans le champ e-mail
    étape 5 coté login.html rendre obligatoire le champ email et password
    étape 6 compléter l'étape 4  avec console.log de ce qui est saisi dans le champs password
    étape 7 regarder un tuto d'un appel API fetch Post on aura besoin de passer les infos comme swagger montre qu'il 
      faut avoir une 200. Il y aura donc un else pour afficher le mess d'erreur si on a pas une reponse 200 de l'API
    étape 8 si j'obtiens en réponse 200, j'ai un token a stocker en localStorage et je fais une redirection vers 
      index.html
    */
});
function displayErrorMessage() {
  console.log(
    "je peux maintenant codé ce qu'il faut pour afficher un message d'erreur dans ma page"
  );
}
let form = document.querySelector("form");

form.addEventListener("submit", (event) => {
  event.preventDefault();
  let email = document.getElementById("email");
  console.log(email.value);
  /*
  if réponse de l'API post = 200 alors stocké le token et redirigé index html
  else {displayErrorMessage();// ici j'instancie la function créée avant}*/
});
