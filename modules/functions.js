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