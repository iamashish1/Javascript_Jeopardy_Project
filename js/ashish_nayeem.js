import Category from "./model/category_model.js";
import Question from "./model/question_model.js";

document.addEventListener("DOMContentLoaded", function () {
  const jeopardyBoard = document.getElementById("jeopardy-board");
  let categories;
  let questionsArray;

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

      console.log("Data from the MODEL:", categories);

      // Fetch questions
      return fetch(`https://jservice.io/api/clues`);
    })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Error");
      }
      return response.json();
    })
    .then((questionData) => {
      // Use Promise.all to wait for all promises to resolve
      const promises = questionData.map((question) => {
        return new Promise((resolve) => {
          const newQuestion = new Question(
            question["id"],
            question["answer"],
            question["question"],
            question["value"],
            question["category_id"]
          );
          resolve(newQuestion);
        });
      });

      return Promise.all(promises);
    })
    .then((questions) => {
      questionsArray = questions;
      console.log(questionsArray);

      // Display the Jeopardy board with categories and questions here
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
      // Handle the error in a centralized way
    });

  // Function to display the question when a tile is clicked
  window.showQuestion = function (question, answer) {
    alert(`Question: ${question}\nAnswer: ${answer}`);
  };
});
