import Category from "./model/category_model.js";
import Question from "./model/question_model.js";

document.addEventListener("DOMContentLoaded", function () {
  let categories;
  let questionsArray = [];

  //FINISHED ALERT BOX
  // MODAL BOX
  function showQuestionWithInstruction(question, answer, questionDiv) {
    // Check if the question has already been clicked
    if (questionDiv.classList.contains("question-clicked")) {
      return;
    }

    // Create a modal container
    const modalContainer = document.createElement("div");
    modalContainer.classList.add("modal-container");

    // Create modal content
    const modalContent = document.createElement("div");
    modalContent.classList.add("modal-content");

    // Create elements to display question and answer
    const questionElement = document.createElement("p");
    questionElement.textContent = `Question: ${question}`;

    // Create covered surface with "Show Answer" button
    const coveredSurface = document.createElement("div");
    coveredSurface.classList.add("covered-surface");

    const showAnswerButton = document.createElement("button");
    showAnswerButton.textContent = "Show Answer";
    showAnswerButton.addEventListener("click", () => {
      // Replace covered surface with the answer
      coveredSurface.innerHTML = `<p>Answer: ${answer}</p>`;
      questionDiv.classList.add("question-clicked");
    });

    // Create a button to close the modal
    const closeButton = document.createElement("button");
    closeButton.textContent = "Close";
    closeButton.addEventListener("click", () => {
      modalContainer.remove();
    });

    coveredSurface.appendChild(showAnswerButton);

    // Append elements to modal content
    modalContent.appendChild(questionElement);
    modalContent.appendChild(coveredSurface);
    modalContent.appendChild(closeButton);

    // Append modal content to modal container
    modalContainer.appendChild(modalContent);

    // Append modal container to the body
    document.body.appendChild(modalContainer);
  }
  // FINISHED MODAL BOX

  //BUILD JEOPARDY BOX
  function buildJeopardyBoard(categories, questions) {
    console.log("Success fetching data:", questions);
    console.log("Success fetching data:", categories);

    const jeopardyBoard = document.getElementById("jeopardy-board");

    // Loop through categories
    categories.forEach((category) => {
      // Create a category div
      const categoryDiv = document.createElement("div");
      categoryDiv.classList.add("category");

      // Create a heading for the category
      const categoryHeading = document.createElement("div");
      categoryHeading.classList.add("question", "categoryName");
      categoryHeading.textContent = category.title;
      categoryDiv.appendChild(categoryHeading);

      // Filter questions for the current category
      const categoryQuestions = questions.find(
        (q) => q.category === category.title
      );

      // Loop through questions for the current category
      for (let i = 0; i < 5; i++) {
        let question = categoryQuestions.questions[i];
        // Create a div for each question
        const questionDiv = document.createElement("div");
        questionDiv.classList.add("question");
        questionDiv.textContent = `$${100 * (i + 1)}`;
        // Attach the showQuestion function to display the question and answer
        questionDiv.onclick = function () {
          showQuestionWithInstruction(
            question.question,
            question.answer,
            questionDiv
          );
        };

        // Append the question div to the category div
        categoryDiv.appendChild(questionDiv);
      }
      // Append the category div to the Jeopardy board
      jeopardyBoard.appendChild(categoryDiv);
    });
  }

  //FINISHED JEOPARDY BOX

  // Fetch categories from jservice.io
  const categoryUrl = `https://jservice.io/api/categories?count=5`;

  fetch(categoryUrl)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      // Continue processing data or perform additional actions
      categories = data.map(
        (categoryData) =>
          new Category(
            categoryData["id"],
            categoryData["title"],
            categoryData["clues_count"]
          )
      );

      // Fetch questions for each category
      const fetchQuestions = categories.map((category) =>
        fetch(`https://jservice.io/api/clues?category=${category.id}`)
          .then((response) => {
            if (!response.ok) {
              throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
          })
          .then((questions) => {
            const firstFiveElements = questions.slice(0, 5);
            const modelFiveElements = firstFiveElements.map((question) => {
              return new Question(
                question["id"],
                question["answer"],
                question["question"],
                question["category_id"]
              );
            });
            return {
              category: category.title,
              questions: modelFiveElements,
            };
          })
      );

      // Use Promise.all to wait for all promises to resolve
      return Promise.all(fetchQuestions);
    })
    .then((resolvedQuestions) => {
      // Now resolvedQuestions is an array of objects with category and questions
      questionsArray = resolvedQuestions;
      hideLoadingSpinner();
      buildJeopardyBoard(categories, questionsArray);
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
      // Handle the error in a centralized way
    });
});
function hideLoadingSpinner() {
  const loaderContainer = document.querySelector(".loader-container");
  loaderContainer.remove();
}
