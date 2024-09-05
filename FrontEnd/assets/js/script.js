document.addEventListener("DOMContentLoaded", async (event) => {
  console.log("script JS est chargé");
  //Bouton se connecter ajoute la classe mode-edit en HTML
  const editMode = window.localStorage.getItem("token");

  if (editMode) {
    document.body.classList.add("mode-edit");
  } else {
    document.body.classList.remove("mode-edit");
  }

  //Déconnexion de l'utilisateur
  const logoutUser = document.querySelector(".logout");
  logoutUser.addEventListener("click", () => {
    window.localStorage.removeItem("token");
  });
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

        for (let i = 0; i < imgWorks.length; i++) {
          if (
            categoryId === "All" ||
            imgWorks[i].getAttribute("data-id") === categoryId
          ) {
            // Affiche les images correspondant à "All" ou au filtre sélectionné
            imgWorks[i].style.display = "block";
          } else {
            // Masque les images qui ne correspondent pas
            imgWorks[i].style.display = "none";
          }
        }
      });

      //MODALE
      const modalContainer = document.querySelector(".modal-container");
      const modalTriggers = document.querySelectorAll(".modal-trigger");

      modalTriggers.forEach((trigger) =>
        trigger.addEventListener("click", (event) => {
          event.preventDefault();
          toggleModal();
        })
      );

      function toggleModal() {
        modalContainer.classList.toggle("active");
      }

      //Modale step 1
      //Récupération des éléments pour la 1ère modale
      const stepOne = document.querySelector(".step-one");
      const galleryPhoto = document.querySelector(".photo");
      const btnAddPhoto = document.querySelector(".add-photo");

      getDataWorks().then((dataWorks) => {
        //Création de la galerie photo
        for (let i = 0; i < dataWorks.length; i++) {
          //création d'une div pour chaque photo + icone corbeille
          let photoContainer = document.createElement("div");
          photoContainer.classList.add("photo-container");
          //création de la galerie d'image
          let imgModal = document.createElement("img");
          imgModal.src = dataWorks[i].imageUrl;
          imgModal.alt = dataWorks[i].title;
          //création de l'icone corbeille
          let trashIcon = document.createElement("i");
          trashIcon.classList.add("fa-solid", "fa-trash-can", "trash-icon");
          // Associer l'ID de la photo à l'icône corbeille
          trashIcon.dataset.id = dataWorks[i].id;

          photoContainer.appendChild(imgModal);
          photoContainer.appendChild(trashIcon);
          galleryPhoto.appendChild(photoContainer);
          stepOne.appendChild(galleryPhoto);
          stepOne.appendChild(btnAddPhoto);

          // Ajout d'un événement pour supprimer la photo au clic sur l'icône
          trashIcon.addEventListener("click", (event) => {
            const imgId = event.target.dataset.id;
            deleteImg(imgId);
          });
          //fonction pour effacer la photo
          function deleteImg(imgId) {
            fetch(`http://localhost:5678/api/works/${imgId}`, {
              method: "DELETE",
              headers: { "Content-Type": "application/json" },
            })
              .then((response) => {
                if (response.ok) {
                  return response.json();
                } else {
                  throw new Error("Echec de la suppression");
                }
              })
              .catch((error) => {
                console.error("Erreur lors de la suppression :", error);
              });
          }
          //Passage au step2
          btnAddPhoto.addEventListener("click", () => {
            stepOne.style.display = "none";
            stepTwo.style.display = "flex";
          });

          //MODALE STEP2
          //Récupération des éléments step2
          const stepTwo = document.querySelector(".step-two");
          const backStep = document.querySelector(".back-step");
          const inputFile = document.querySelector(".upload-photo");
          const addImgDiv = document.querySelector(".add-img");
          const iconImage = document.querySelector(".fa-image");
          const infoText = document.querySelector(".add-img p");
          const addNewPhoto = document.querySelector(".add-new-photo");
          const inputTitle = document.getElementById("title");
          const btnNewPhoto = document.querySelector(".btn-new-photo");

          //Ajout d'une photo
          addNewPhoto.addEventListener("click", (event) => {
            event.preventDefault();
            // Déclencher l'ouverture de la fenêtre de sélection de fichier
            inputFile.click();
          });

          //Retour step1
          backStep.addEventListener("click", () => {
            stepOne.style.display = "flex";
            stepTwo.style.display = "none";
          });
        }
      });
    });
});
