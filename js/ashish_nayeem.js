import Category from "./model/category_model.js";
import Question from "./model/question_model.js";

// Add the variable here
var isModalOpen = false;
var currentPlayer = 1;
var score1 = 0;
var score2 = 0;
var isNameSet = false;
var initialHighScore = 0;
document.addEventListener("DOMContentLoaded", function () {
  let categories;
  let questionsArray = [];

  //FINISHED ALERT BOX
  // MODAL BOX
  function showQuestionWithInstruction(
    question,
    answer,
    questionDiv,
    questionPoint
  ) {
    // Check if the question has already been clicked
    if (
      questionDiv.classList.contains("question-clicked") ||
      isNameSet == false
    ) {
      return;
    }

    document.getElementById("jeopardy-board").classList.add("modal-open");
    // Set the modal state to open
    isModalOpen = true;
    // Add a temporary highlight class
    questionDiv.classList.add("highlighted");

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
    coveredSurface.style.display = "flex";
    coveredSurface.style.justifyContent = "center";
    coveredSurface.style.alignItems = "center";

    coveredSurface.classList.add("covered-surface");
    //
    const rightAnswer = document.createElement("span");
    rightAnswer.setAttribute("id", "right-button");

    rightAnswer.innerHTML = '<img src="assets/right.png" alt="Right Answer">';

    rightAnswer.onclick = function () {
      handleAnswerSubmit(questionPoint, true);
      // Set the modal state to closed
      isModalOpen = false;
      // Remove the highlight class when the answer is shown
      questionDiv.classList.remove("highlighted");
      modalContainer.remove();
    };

    const wrongAnswer = document.createElement("span");

    wrongAnswer.innerHTML = '<img src="assets/Wrong.png" alt="Wrong Answer">';
    wrongAnswer.onclick = function () {
      handleAnswerSubmit(questionPoint, false);
      // Set the modal state to closed
      isModalOpen = false;
      // Remove the highlight class when the answer is shown
      questionDiv.classList.remove("highlighted");
      modalContainer.remove();
    };

    const showAnswerButton = document.createElement("button");
    showAnswerButton.textContent = "Show Answer";
    showAnswerButton.addEventListener("click", () => {
      closeButton.style.backgroundColor = "grey";

      closeButton.disabled = "true";
      // document.getElementById("jeopardy-board").classList.remove("modal-open");
      // Set the modal state to closed
      // Remove the highlight class when the answer is shown
      questionDiv.classList.remove("highlighted");
      // Replace covered surface with the answer

      coveredSurface.innerHTML = `<p>Answer: ${answer}</p>`;
      coveredSurface.appendChild(wrongAnswer);
      coveredSurface.insertBefore(
        rightAnswer,
        coveredSurface.firstElementChild
      );

      questionDiv.classList.add("question-clicked");
    });

    // Create a button to close the modal
    const closeButton = document.createElement("button");
    closeButton.textContent = "Close";
    closeButton.addEventListener("click", () => {
      document.getElementById("jeopardy-board").classList.remove("modal-open");
      // Set the modal state to closed
      isModalOpen = false;
      // Remove the highlight class when the answer is shown
      questionDiv.classList.remove("highlighted");
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
    const jeopardyBoard = document.getElementById("jeopardy-board");

    //GET HIGH SCORE FROM COOKIE WHEN LOADED
    let getFromCookie = readCookie();

    document.getElementById("high_score_id").innerHTML = "";
    document.getElementById(
      "high_score_id"
    ).innerHTML = `High Score: ${getFromCookie}`;
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
          if (!isModalOpen) {
            showQuestionWithInstruction(
              question.question,
              question.answer,
              questionDiv,
              100 * (i + 1)
            );
          }
        };

        // Append the question div to the category div
        categoryDiv.appendChild(questionDiv);
      }

      // Append the category div to the Jeopardy board
      jeopardyBoard.appendChild(categoryDiv);
      //APPEND RESET BUTTON
    });

    //RESET BUTTON AND ALL with IIFE

    (function () {
      if (document.getElementById("button-div") == null) {
        const gameControlsDiv = document.createElement("div");
        const buttonDiv = document.createElement("div");

        gameControlsDiv.classList.add("control-div");

        buttonDiv.setAttribute("id", "button-div");
        const resetButton = document.createElement("button");

        resetButton.innerHTML = "RESET";
        resetButton.style.height = "50px";
        resetButton.style.width = "100px";
        resetButton.style.margin = "auto";

        resetButton.style.background = "purple";
        resetButton.style.color = "white";
        // resetButton.style.position = "absolute";

        resetButton.style.borderRadius = "5px";
        resetButton.style.border = "none";
        buttonDiv.appendChild(resetButton);

        //create input fields for player names
        const playerName1 = document.createElement("input");
        playerName1.setAttribute("type", "text");
        playerName1.style.marginRight = "10px";
        playerName1.style.height = "50px";
        playerName1.setAttribute("id", "p1");

        playerName1.setAttribute("placeholder", "Player 1");

        //create set suffix button for player1
        let suffix1 = document.createElement("span");
        suffix1.innerHTML = "ENTER PLAYER NAMES TO START";
        suffix1.style.backgroundColor = "green";
        suffix1.style.padding = "12px";

        suffix1.style.color = "white";
        suffix1.style.marginRight = "10px";
        suffix1.style.cursor = "pointer";

        suffix1.addEventListener("click", function () {
          let getWhatsInside1 = document.getElementById("p1").value;
          let getWhatsInside2 = document.getElementById("p2").value;

          if (getWhatsInside1 != "" && getWhatsInside2 != "") {
            let newlyCreated1 = document.createElement("span");
            newlyCreated1.setAttribute("id", "playervsplayer");

            newlyCreated1.innerHTML =
              " " + getWhatsInside1 + " VS " + getWhatsInside2;
            newlyCreated1.style.color = "green";
            newlyCreated1.style.marginRight = "10px";
            newlyCreated1.style.marginLeft = "10px";
            document.getElementById("p2").value = null;
            document.getElementById("p1").value = null;

            document.getElementById("p2").style.display = "none";
            document.getElementById("p1").style.display = "none";
            gameControlsDiv.insertBefore(
              newlyCreated1,
              document.getElementById("avatar2")
            );

            suffix1.style.display = "none";
            isNameSet = true;
          }
        });

        const playerName2 = document.createElement("input");
        playerName2.setAttribute("type", "text");
        playerName2.style.height = "50px";
        playerName2.setAttribute("id", "p2");

        playerName2.setAttribute("placeholder", "Player 2");
        //CREATE A SET BUTTON
        let suffix2 = document.createElement("span");
        suffix2.style.backgroundColor = "red";
        suffix2.style.color = "white";

        resetButton.onclick = function () {
          if (isModalOpen) {
            return;
          }
          jeopardyBoard.innerHTML = "";
          document.getElementById("player-2").innerHTML = 0;
          document.getElementById("player-1").innerHTML = 0;
          score1 = 0;
          score2 = 0;
          currentPlayer = 1;
          document.getElementById("p2").style.display = "block";
          document.getElementById("p1").style.display = "block";

          if (isNameSet) {
            document.getElementById("playervsplayer").remove();
            suffix1.style.display = "block";
          } else {
          }
          isNameSet = false;

          buildJeopardyBoard(categories, questions);
        };

        //sscores texts

        const player1Score = document.createElement("p");
        player1Score.setAttribute("id", "player-1");

        player1Score.innerHTML = score1;
        player1Score.style.color = "white";
        player1Score.style.marginRight = "10px";

        const player2Score = document.createElement("p");
        player2Score.setAttribute("id", "player-2");
        player2Score.innerHTML = score2;
        player2Score.style.color = "white";
        player2Score.style.marginLeft = "10px";

        //Circle avatars to the div

        let avatar1 = document.createElement("img");

        avatar1.classList.add("avatar");
        avatar1.setAttribute("id", "avatar1");
        avatar1.style.border = "4px solid green";
        avatar1.classList.add("avatar-transition"); // Add the transition class

        avatar1.src = "assets/player.png";
        let avatar2 = document.createElement("img");
        avatar2.classList.add("avatar");
        avatar2.setAttribute("id", "avatar2");

        avatar2.src = "assets/player2.png";

        gameControlsDiv.appendChild(player1Score);

        gameControlsDiv.appendChild(avatar1);

        gameControlsDiv.appendChild(playerName1);
        gameControlsDiv.appendChild(suffix1);

        gameControlsDiv.appendChild(playerName2);
        gameControlsDiv.appendChild(suffix2);

        gameControlsDiv.appendChild(avatar2);
        gameControlsDiv.appendChild(player2Score);

        document
          .getElementById("body-id")
          .insertBefore(
            gameControlsDiv,
            document.getElementById("body-id").lastElementChild
          );
        document
          .getElementById("body-id")
          .insertBefore(
            buttonDiv,
            document.getElementById("body-id").lastElementChild
          );
      } else if (
        document.getElementById("p1") != null &&
        document.getElementById("p2")
      ) {
        document.getElementById("p1").value = null;
        document.getElementById("p2").value = null;
      }
    })();

    //END RESET BUTTON AND ALL
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
            categoryData.id,
            categoryData.title,
            categoryData.cluesCount
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
                question.id,
                question.answer,
                question.question,
                question.categoryId
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
      throw new Error(`Error fetching data: ${error}`);
    });
});
function hideLoadingSpinner() {
  const loaderContainer = document.querySelector(".loader-container");
  loaderContainer.remove();
}

function handleAnswerSubmit(score, isCorrect) {
  //Update the score based on player number

  //at last switch the player number
  if (currentPlayer == 1) {
    let player1 = document.getElementById("player-1");

    let current = parseInt(player1.innerHTML);

    let upadtedOne;
    if (isCorrect) {
      upadtedOne = current + score;
      if (upadtedOne > initialHighScore) {
        initialHighScore = upadtedOne;

        createCookie(upadtedOne, "PLAYER");
        document.getElementById("high_score_id").innerHTML = "";
        document.getElementById(
          "high_score_id"
        ).innerHTML = `High Score: ${upadtedOne}`;
      }
    } else {
      upadtedOne = current - score;
    }

    player1.innerHTML = "";
    player1.innerHTML = upadtedOne;

    currentPlayer = 2;
    document.getElementById("avatar1").style.border = "none";
    document.getElementById("avatar1").style.animation = "none";
    avatar2.style.animation = "blink 1s infinite"; // Restart the animation

    document.getElementById("avatar2").style.border = "4px solid green";
    avatar2.classList.add("avatar-transition"); // Add the transition class
  } else if (currentPlayer == 2) {
    let player2 = document.getElementById("player-2");
    let current = parseInt(player2.innerHTML);
    let upadtedOne;
    if (isCorrect) {
      upadtedOne = current + score;

      if (upadtedOne > initialHighScore) {
        initialHighScore = upadtedOne;

        createCookie(initialHighScore, "PLAYER");
        document.getElementById("high_score_id").innerHTML = "";
        document.getElementById(
          "high_score_id"
        ).innerHTML = `High Score: ${upadtedOne}`;
      }
    } else {
      upadtedOne = current - score;
    }

    player2.innerHTML = "";
    player2.innerHTML = upadtedOne;

    currentPlayer = 1;
    document.getElementById("avatar2").style.border = "none";
    document.getElementById("avatar2").style.animation = "none";
    avatar1.style.animation = "blink 1s infinite"; // Restart the animation
    document.getElementById("avatar1").style.border = "4px solid green";
    avatar1.classList.add("avatar-transition"); // Add the transition class
  }
}

function readCookie() {
  let cookie = document.cookie;
  let decodedCookie = decodeURIComponent(document.cookie);
  let splittedCookie = decodedCookie.split(";");

  for (let item of splittedCookie) {
    let findKeyValue = item.split("=");
    if (findKeyValue[0].trim() === "score") {
      return parseInt(findKeyValue[1].trim());
    }
  }
  return 0;
}

function createCookie(score, playerName) {
  let date = new Date();
  document.cookie = "score" + "=" + score + ";" + date + ";path=/";
  document.cookie = "player_name" + "=" + score + ";" + date + ";path=/";
}
