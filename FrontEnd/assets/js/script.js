document.addEventListener("DOMContentLoaded", async (event) => {
  console.log("script JS est chargé");

  //fonction appel catégories depuis l'API
  async function getDataCategories() {
    const categories = await fetch("http://localhost:5678/api/categories");
    const dataCategories = await categories.json();
    return dataCategories;
  }

  //fonction appel works depuis l'API
  async function getDataWorks() {
    const works = await fetch("http://localhost:5678/api/works");
    const dataWorks = await works.json();
    return dataWorks;
  }

  //GENERER LES WORKS SUR HTML
  getDataWorks().then((dataWorks) => {
    //Récupération de la div .gallery
    let divGallery = document.querySelector(".gallery");
    //Création de la section Works dans le fichier HTML
    for (let i = 0; i < dataWorks.length; i++) {
      let userGallery = document.createElement("figure");
      userGallery.setAttribute("data-id", dataWorks[i].categoryId);

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

  //Récupération de la div .filtre
  let divFiltre = document.querySelector(".filtres");
  //Création du bouton filtres "Tous" + intégration dans le fichier HTML
  let boutonTous = document.createElement("button");
  boutonTous.innerText = "Tous";
  boutonTous.setAttribute("data-id", "All");
  boutonTous.classList.add("btn-filtre", "active");
  divFiltre.appendChild(boutonTous);

  //GENERER LES CATEGORIES SUR HTML
  getDataCategories()
    .then((dataCategories) => {
      for (let i = 0; i < dataCategories.length; i++) {
        let boutonFiltre = document.createElement("button");
        boutonFiltre.innerText = dataCategories[i].name;
        boutonFiltre.setAttribute("data-id", dataCategories[i].id);
        boutonFiltre.classList.add("btn-filtre");
        divFiltre.appendChild(boutonFiltre);
      }
    })
    .then(() => {
      //GENERER LA CLASS ACTIVE SUR LE BOUTON CLIQUE
      //Récupération des boutons
      let listeBoutons = document.querySelectorAll(".btn-filtre");
      console.log(listeBoutons.length);
      //Création class active pour bouton cliqué
      listeBoutons.forEach((btnActive) => {
        btnActive.addEventListener("click", (event) => {
          listeBoutons.forEach((btn) => btn.classList.remove("active"));
          btnActive.classList.add("active");
          // Récupérer le categoryId du bouton cliqué
          const categoryId = btnActive.getAttribute("data-id");
          console.log("Category Id: ", categoryId);
        });
      });
    });
});

/*faire une boucle for sur dataWorks
v   Générer les works coté html avec sur chaque figure le dataAttribute de la categoryId
    Ecouter le click sur un filtre => ca doit supprimer la classe active sur tous les filtres et ajouter la classe 
      active 
    Sur le filtre clické! il ne peut pas y avoir plus d'un filtre écouté a la fois
    J'ajoute la classe active sur le filtre clické
    Je recupere la data de la categoryId du filtre clické 
    Dans les works, je mets en display none tout les works qui n'ont pas les bon data attribute correspondant au 
      filtre*/

/*
v    Marre de JS = CSS sur bouton class=filtre : CSS special quand le bouton a la class active
      dans index.html 
    En mode login marge noire en haut et pas en logout : filtres masqué en login
    Wording login devient logout*/
