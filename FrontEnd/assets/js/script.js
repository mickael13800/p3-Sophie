document.addEventListener("DOMContentLoaded", async (event) => {
  console.log("script JS est chargé");
  //Bouton se connecter ajoute la classe mode-edit en HTML
  const editMode = window.localStorage.getItem("editMode");

  if (editMode === "true") {
    document.body.classList.add("mode-edit");
    window.localStorage.removeItem("editMode");
  }

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
      divFiltre.addEventListener("click", (event) => {
        listeBoutons.forEach((btn) => btn.classList.remove("active"));
        event.target.classList.add("active");
        // Récupérer le categoryId du bouton cliqué
        const categoryId = event.target.getAttribute("data-id");
        console.log("Category Id: ", categoryId);
        //Afficher les éléments filtrés
        getDataWorks().then((dataWorks) => {
          for (let i = dataWorks.length - 1; i >= 0; i--) {
            if (dataWorks.categoryId !== listeBoutons.categoryId) {
              dataWorks.splice(i, 1);
            }
          }
        });
      });
    });
});

/*faire une boucle for sur dataWorks
v   Générer les works coté html avec sur chaque figure le dataAttribute de la categoryId
v    Ecouter le click sur un filtre => ca doit supprimer la classe active sur tous les filtres et ajouter la classe 
      active 
v    Sur le filtre clické! il ne peut pas y avoir plus d'un filtre écouté a la fois
v    J'ajoute la classe active sur le filtre clické
v    Je recupere la data de la categoryId du filtre clické 
v    Dans les works, je mets en display none tout les works qui n'ont pas les bon data attribute correspondant au 
      filtre*/

/*
v    Marre de JS = CSS sur bouton class=filtre : CSS special quand le bouton a la class active
      dans index.html 
v    En mode login marge noire en haut et pas en logout : filtres masqué en login
v    Wording login devient logout*/
