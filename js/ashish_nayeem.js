document.addEventListener('DOMContentLoaded', function () {
    // Attach click event listeners to each question
    var questions = document.querySelectorAll(
      ".category > .question:not(.categoryName)"
    );
    questions.forEach(function (question) {
      question.addEventListener("click", function () {
        // Create the modal dynamically
        var modal = document.createElement("div");
        modal.classList.add("modal");

        var modalContent = document.createElement("div");
        modalContent.classList.add("modal-content");

        // Customize the modal content here
        modalContent.innerText = "Your Jeopardy game contents go here";

        modal.appendChild(modalContent);

        // Show the modal
        document.body.appendChild(modal);
        modal.style.display = "flex";

        // Close modal on "Esc" key press
        document.addEventListener("keydown", function (event) {
          if (event.key === "Escape") {
            modal.style.display = "none";
            document.body.removeChild(modal);
          }
        });
      });
    });
  });
