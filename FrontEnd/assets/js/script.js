console.log("script JS est chargé");
//Récupération du token
const token = window.localStorage.getItem("token");

if (token) {
  document.body.classList.add("mode-edit");
} else {
  document.body.classList.remove("mode-edit");
}

//Récupération des éléments modal step1 et step2
const stepOne = document.querySelector(".step-one");
const stepTwo = document.querySelector(".step-two");

//Déconnexion de l'utilisateur
const logoutUser = document.querySelector(".logout");
logoutUser.addEventListener("click", () => {
  window.localStorage.removeItem("token");
});
//fonction appel catégories depuis l'API
async function getDataCategories() {
  try {
    const response = await fetch("http://localhost:5678/api/categories");
    if (!response.ok) {
      throw new Error("erreur lors du chargement");
    } else {
      const dataCategories = await response.json();
      return dataCategories;
    }
  } catch (error) {
    console.error("erreur lors du chargement des catégories");
  }
}

//fonction appel works depuis l'API
async function getDataWorks() {
  try {
    const response = await fetch("http://localhost:5678/api/works");
    if (!response.ok) {
      throw new Error("erreur lors du chargement");
    } else {
      const dataWorks = await response.json();
      return dataWorks;
    }
  } catch (error) {
    console.error("erreur lors du chargement des works");
  }
}

//fonction affichage des works
function displayWorks() {
  //Récupération de la div .gallery
  let divGallery = document.querySelector(".gallery");
  // Vider la galerie avant de la remplir à nouveau
  divGallery.innerHTML = "";

  //Appel à l'API pour récupérer les works et les afficher
  getDataWorks().then((dataWorks) => {
    //Création de la section Works dans le fichier HTML
    for (let i = 0; i < dataWorks.length; i++) {
      let userGallery = document.createElement("figure");
      userGallery.setAttribute("data-category-id", dataWorks[i].categoryId);

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
}
displayWorks();

//fonction pour effacer une photo
async function deleteImg(imgId) {
  try {
    // Requête de suppression
    const response = await fetch(`http://localhost:5678/api/works/${imgId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) {
      throw new Error("Échec de la suppression");
    }
    // Mise à jour de la galerie principale et de la modale
    displayWorks();
    updateModalGallery();
  } catch (error) {
    console.error("Erreur lors de la suppression :", error);
  }
}

//fonction de mise à jour de la gallery modal
function updateModalGallery() {
  const galleryPhoto = document.querySelector(".photo");
  // Vider la galerie avant de la remplir
  galleryPhoto.innerHTML = "";

  getDataWorks().then((dataWorks) => {
    for (let i = 0; i < dataWorks.length; i++) {
      let photoContainer = document.createElement("div");
      photoContainer.classList.add("photo-container");

      let imgModal = document.createElement("img");
      imgModal.src = dataWorks[i].imageUrl;
      imgModal.alt = dataWorks[i].title;

      let trashIcon = document.createElement("i");
      trashIcon.classList.add("fa-solid", "fa-trash-can", "trash-icon");
      trashIcon.dataset.id = dataWorks[i].id;

      photoContainer.appendChild(imgModal);
      photoContainer.appendChild(trashIcon);
      galleryPhoto.appendChild(photoContainer);

      // Ajout de l'événement de suppression à chaque icône
      trashIcon.addEventListener("click", (event) => {
        const imgId = event.target.dataset.id;
        deleteImg(imgId);
      });
    }
  });
}

//fonction de réinitialisation de la modal
function resetModal() {
  // Réinitialiser le champ de fichier et l'aperçu de l'image
  const inputFile = document.querySelector(".upload-photo");
  const imgDiv = document.querySelector(".add-img img");
  const iconImage = document.querySelector(".fa-image");
  const addNewPhoto = document.querySelector(".add-new-photo");
  const infoText = document.querySelector(".add-img p");

  inputFile.value = "";

  imgDiv.style.display = "none";
  iconImage.style.display = "block";
  addNewPhoto.style.display = "block";
  infoText.style.display = "block";

  // Réinitialiser les champs de titre et de catégorie
  const inputTitle = document.getElementById("title");
  const selectCategorie = document.getElementById("categorie");

  inputTitle.value = "";
  selectCategorie.value = "";
  selectCategorie.disabled = true;
  // Vider toutes les options de la liste déroulante
  selectCategorie.innerHTML = "";

  // Réinitialiser les boutons
  const btnNewPhoto = document.querySelector(".btn-new-photo");
  btnNewPhoto.disabled = true;
}

//CREATION DES BOUTONS DE FILTRE
//Récupération de la div .filtre
let divFiltre = document.querySelector(".filtres");
//Création du bouton filtres "Tous" + intégration dans le fichier HTML
let boutonTous = document.createElement("button");
boutonTous.innerText = "Tous";
boutonTous.setAttribute("data-category-id", "All");
boutonTous.classList.add("btn-filtre", "active");
divFiltre.appendChild(boutonTous);

//GENERER LES CATEGORIES SUR HTML
getDataCategories()
  .then((dataCategories) => {
    for (let i = 0; i < dataCategories.length; i++) {
      let boutonFiltre = document.createElement("button");
      boutonFiltre.innerText = dataCategories[i].name;
      boutonFiltre.setAttribute("data-category-id", dataCategories[i].id);
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
      const categoryId = event.target.getAttribute("data-category-id");
      console.log("Category Id: ", categoryId);
      //Afficher les éléments filtrés
      const imgWorks = document.querySelectorAll(".gallery figure");

      for (let i = 0; i < imgWorks.length; i++) {
        if (
          categoryId === "All" ||
          imgWorks[i].getAttribute("data-category-id") === categoryId
        ) {
          // Affiche les images correspondant à "All" ou au filtre sélectionné
          imgWorks[i].style.display = "block";
        } else {
          // Masque les images qui ne correspondent pas
          imgWorks[i].style.display = "none";
        }
      }
    });
  });

//MODALE
const modalContainer = document.querySelector(".modal-container");
const modalTriggers = document.querySelectorAll(".modal-trigger");

modalTriggers.forEach((trigger) =>
  trigger.addEventListener("click", (event) => {
    event.preventDefault();
    toggleModal();
    updateModalGallery();
  })
);

//Fonction afficher/masquer la modal
function toggleModal() {
  modalContainer.classList.toggle("active");
  stepTwo.style.display = "none";
  stepOne.style.display = "flex";
}

//Passage au step2
const btnAddPhoto = document.querySelector(".add-photo");
btnAddPhoto.addEventListener("click", () => {
  stepOne.style.display = "none";
  stepTwo.style.display = "flex";
});

//MODALE STEP2
//Récupération des éléments step2
const backStep = document.querySelector(".back-step");
const inputFile = document.querySelector(".upload-photo");
const addImgDiv = document.querySelector(".add-img");
const iconImage = document.querySelector(".fa-image");
const infoText = document.querySelector(".add-img p");
const addNewPhoto = document.querySelector(".add-new-photo");
const selectCategorie = document.getElementById("categorie");

//Ajout d'une photo
addNewPhoto.addEventListener("click", (event) => {
  event.preventDefault();
  // Déclencher l'ouverture de la fenêtre de sélection de fichier
  inputFile.click();
});

//Fonction de soumission d'une nouvelle photo
async function submitNewPhoto() {
  const inputTitle = document.getElementById("title");
  const selectCategorie = document.getElementById("categorie");
  const inputFile = document.querySelector(".upload-photo");
  const btnNewPhoto = document.querySelector(".btn-new-photo");
  try {
    const formData = new FormData();
    formData.append("title", inputTitle.value);
    formData.append("category", selectCategorie.value);
    formData.append("image", inputFile.files[0]);

    const response = await fetch("http://localhost:5678/api/works", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });
    if (!response.ok) {
      throw new Error("Erreur lors de l'ajout de la nouvelle photo");
    }
    const data = await response.json();
    console.log("Success:", data);
    //alert ajout réussi
    alert("Photo ajoutée avec succès !");
    //Fermeture de la modale
    //toggleModal();
    resetModal();
    // Mise à jour des galeries principale et modale
    displayWorks();
    updateModalGallery();
  } catch (error) {
    console.error("Error:", error);
    alert("Une erreur est survenue lors de l'ajout de la photo.");
  }
}

inputFile.addEventListener("change", (event) => {
  const file = event.target.files[0];
  // Taille maximale de 4 Mo
  const tailleMax = 4 * 1024 * 1024;
  //Format fichier .jpg, .jpeg, .png
  const formatsAutorises = ["image/jpeg", "image/jpg", "image/png"];

  if (file.size > tailleMax) {
    // Si la taille dépasse 4 Mo
    alert("L'image est trop grande ! Maximum 4 Mo");
    // Réinitialise le champ de fichier
    resetModal();
    //on arrête l'exécution
    return;
    //vérifier le type de fichier
  } else if (!formatsAutorises.includes(file.type)) {
    //alert mauvais type de fichier
    alert(
      "Le format du fichier n'est pas accepté ! .jpg, .jpeg ou .png uniquement"
    );
    // Réinitialise le champ de fichier
    resetModal();
    //on arrête l'exécution
    return;
  } else {
    if (file) {
      // Créer un objet URL pour afficher l'aperçu de l'image
      const imageUrl = URL.createObjectURL(file);
      // Masquer les éléments existants
      iconImage.style.display = "none";
      addNewPhoto.style.display = "none";
      infoText.style.display = "none";
      // Supprimer l'ancienne prévisualisation si elle existe
      const oldPreview = addImgDiv.querySelector("img");
      if (oldPreview) {
        oldPreview.remove();
      }
      // Créer un élément <img> pour l'aperçu de la photo
      let imgPreview = document.createElement("img");
      imgPreview.src = imageUrl;
      // Ajouter l'image dans la div .add-img
      addImgDiv.appendChild(imgPreview);
      //rendre la liste déroulante active
      selectCategorie.disabled = false;

      //GENERER LES CATEGORIES DANS LA LISTE DEROULANTE
      // Ajouter une option par défaut vide
      let optionVide = document.createElement("option");
      optionVide.innerText = "";
      optionVide.setAttribute("value", "");
      optionVide.setAttribute("selected", true);
      selectCategorie.appendChild(optionVide);
      //Générer les catégories dans la liste déroulante
      getDataCategories().then((dataCategories) => {
        for (let i = 0; i < dataCategories.length; i++) {
          let optionCategorie = document.createElement("option");
          optionCategorie.innerText = dataCategories[i].name;
          optionCategorie.setAttribute("value", dataCategories[i].id);
          selectCategorie.appendChild(optionCategorie);
        }
      });
    }
  }
  //Activation du bouton valider
  const inputTitle = document.getElementById("title");
  const btnNewPhoto = document.querySelector(".btn-new-photo");

  //fonction de vérification pour les champs obligatoire
  function checkFormValidity() {
    if (inputTitle.value !== "" && selectCategorie.value !== "") {
      btnNewPhoto.disabled = false;
    } else {
      btnNewPhoto.disabled = true;
    }
  }
  inputTitle.addEventListener("input", checkFormValidity);
  selectCategorie.addEventListener("change", checkFormValidity);

  // Soumission du formulaire pour ajouter une nouvelle photo
  btnNewPhoto.addEventListener("click", submitNewPhoto);
});

//Retour step1
backStep.addEventListener("click", () => {
  stepTwo.style.display = "none";
  stepOne.style.display = "flex";
});
