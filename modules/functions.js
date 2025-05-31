import { updateComments, userComments } from "./comments.js";
import { renderCommentsFunction } from "./render.js";
export const getDataUserComments = () => {
  fetch("https://wedev-api.sky.pro/api/v1/lexarkh/comments")
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      updateComments(data.comments);
      renderCommentsFunction();
    });
};

export const formatDate = (isoDateString) => {
  const date = new Date(isoDateString);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  return `${day}.${month}.${year} ${hours}:${minutes}`;
};

export const userLike = () => {
  const likeButtonElements = document.querySelectorAll(".like-button");
  for (const likeButtonElement of likeButtonElements) {
    likeButtonElement.addEventListener("click", (event) => {
      event.stopPropagation();
      const indexLike = likeButtonElement.dataset.index;

      if (userComments[indexLike].isLiked === false) {
        userComments[indexLike].likes++;
        userComments[indexLike].isLiked = true;
        renderCommentsFunction();
      } else {
        userComments[indexLike].likes--;
        userComments[indexLike].isLiked = false;
        renderCommentsFunction();
      }
    });
  }
};
export const textQuote = () => {
  const cemmentElements = document.querySelectorAll(".comment");
  for (const commentElement of cemmentElements) {
    commentElement.addEventListener("click", () => {
      const textQuote = commentElement.dataset.quote;
      textInput.value = `"${userComments[textQuote].author.name}"\n"${userComments[textQuote].text}"`;
    });
  }
};

export const sinitizeHtml = (value) => {
  return value.replaceAll("<", "&lt;").replaceAll(".>", "&gt;");
};
export const addCommemt = () => {
  const buttonEL = document.getElementById("submitComment");
  const nameInput = document.getElementById("nameInput");
  const textInput = document.getElementById("textInput");

  buttonEL.addEventListener("click", function () {
    
    if (nameInput.value === "" || nameInput.value === " ") {
      nameInput.classList.add("error");
      nameInput.placeholder = "Это поле не может быть пустым";
      return;
    } else if (textInput.value === "" || textInput.value === " ") {
      textInput.classList.add("error");
      textInput.placeholder = "Это поле не может быть пустым";
      return;
    } else {
      nameInput.classList.remove("error");
      textInput.classList.remove("error");
      textInput.placeholder = "Введите Ваш коментарий";
      nameInput.placeholder = "Введите Ваше имя";
    } 

    const dateTime = new Date().toLocaleString("ru-RU");
    const newComment = {
      name: sinitizeHtml(nameInput.value),
      date: dateTime,
      text: sinitizeHtml(textInput.value),
      likes: 0,
      isLiked: false,
    };

    fetch("https://wedev-api.sky.pro/api/v1/lexarkh/comments", {
      method: "POST",
      body: JSON.stringify(newComment),
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        if (data.result === "ok") {
          getDataUserComments();
        }
      });

    textInput.value = ""; 
    nameInput.value = "";
  });
  renderCommentsFunction();
};
