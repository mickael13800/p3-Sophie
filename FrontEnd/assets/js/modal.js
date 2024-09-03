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
