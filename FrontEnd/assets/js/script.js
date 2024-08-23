document.addEventListener("DOMContentLoaded", async (event) => {
  console.log("script JS est chargé");

  //Récupération des catégories depuis l'API
  const categories = await fetch("http://localhost:5678/api/categories");
  const dataCategories = await categories.json();
  console.log(dataCategories);
  //Récupération des works depuis l'API
  const works = await fetch("http://localhost:5678/api/works");
  const dataWorks = await works.json();
  console.log(dataWorks);
  //Affichage chaque label catégorie avec boucle
  for (let i = 0; i < dataCategories.length; i++) {
    console.log(dataCategories[i].name);
  }
  //GENERER BOUTONS FILTRES EN JS SUR HTML
  //Récupération de la div .filtre
  let divFiltre = document.querySelector(".filtres");
  //Création des boutons filtres + intégration dans le fichier HTML
  let boutonTous = document.createElement("button");
  boutonTous.innerText = "Tous";
  boutonTous.classList.add("filtre");
  divFiltre.appendChild(boutonTous);

  for (let i = 0; i < dataCategories.length; i++) {
    let boutonFiltre = document.createElement("button");
    boutonFiltre.innerText = dataCategories[i].name;
    boutonFiltre.classList.add("filtre");
    divFiltre.appendChild(boutonFiltre);
  }
});
/*convertir la response en JSON
      stocker ce data dans une variable dataCategories
      faire le console.log
      faire une boucle sur dataCategories pour que le data affiche le console.log du label de chaque categorie
      generer en JS a l'emplacement du DOM .filtres les button : le 1er button on choisi "tous" et utiliser les 
      boucles pour generer les boutons suivant a partir du dataCategories*/

/*marre de JS = CSS sur bouton class=filtre : CSS special quand le bouton a la class active
dans index.html en mode login marge noire en haut et pas en logout : filtres masqué en login
wording login devient logout*/
