document.addEventListener("DOMContentLoaded", async (event) => {
  console.log("script JS est chargé");
  //Bouton se connecter ajoute la classe mode-edit en HTML
  const editMode = window.localStorage.getItem("token");

  if (editMode) {
    document.body.classList.add("mode-edit");
  } else {
    document.body.classList.remove("mode-edit");
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
        const imgWorks = document.querySelectorAll(".gallery figure");

        if (categoryId === "All") {
          for (let i = 0; i < imgWorks.length; i++) {
            // Affiche toutes les images
            imgWorks[i].style.display = "block";
          }
        } else {
          for (let i = 0; i < imgWorks.length; i++) {
            if (imgWorks[i].getAttribute("data-id") === categoryId) {
              // Affiche les images avec le bon ID
              imgWorks[i].style.display = "block";
            } else {
              // Masque les images qui ne correspondent pas
              imgWorks[i].style.display = "none";
            }
          }
        }
      });
    });
});
