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
  //boucle for sur dataWorks
  for (let i = 0; i < dataWorks.length; i++) {
    console.log(dataWorks[i].title);
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

  //GENERER LES WORKS SUR HTML
  //Récupération de la div .gallery
  let divGallery = document.querySelector(".gallery");
  //Création de la section Works dans le fichier HTML
  for (let i = 0; i < dataWorks.length; i++) {
    let userGallery = document.createElement("figure");
    userGallery.setAttribute = ("id", dataWorks[i].categoryId);

    let imgGallery = document.createElement("img");
    imgGallery.src = dataWorks[i].imageUrl;
    imgGallery.alt = dataWorks[i].title;

    let figcaptionGallery = document.createElement("figcaption");
    figcaptionGallery.textContent = dataWorks[i].title;

    divGallery.appendChild(userGallery);
    userGallery.appendChild(imgGallery);
    userGallery.appendChild(figcaptionGallery);
  }
});

/*faire une boucle for sur dataWorks
générer les works coté html avec sur chaque figure le dataAttribute de la categoryId
écouter le click sur un filtre => ca doit supprimer la clase active sur tous les filtres et ajouter la classe active 
  sur le filtre clické! il ne peut pas y avoir plus d'un filtre écouté a la fois
j'ajoute la classe active sur le filtre clické
je recupere la data de la categoryId du filtre clické 
dans les works, je mets en display none tout les works qui n'ont pas les bon data attribute correspondant au filtre*/

/*marre de JS = CSS sur bouton class=filtre : CSS special quand le bouton a la class active
dans index.html en mode login marge noire en haut et pas en logout : filtres masqué en login
wording login devient logout*/
