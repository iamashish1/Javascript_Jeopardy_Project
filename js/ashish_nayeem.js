import Category from "./model/category_model.js";
import Question from "./model/question_model.js";

document.addEventListener("DOMContentLoaded", function () {
  let categories;
  let questionsArray = [];
  //ALERT BOX
  function showQuestionWithInstruction(question, answer) {
    const answerButton = document.createElement("button");
    answerButton.textContent = "Show Answer";
    answerButton.classList.add("answer-button");
    alert(`Question: ${question}\n`);
    document
      .getElementsByClassName("answer-button")
      .addEventListener("onclick", () => {});
  }
  //FINISHED ALERT BOX

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
          showQuestionWithInstruction(question.question, question.answer);
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
        fetch(`https://jservice.io/api/clues?id=${category.id}`)
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
