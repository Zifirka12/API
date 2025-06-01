import { userComments } from "./comments.js";
import { formatDate, userLike, textQuote } from "./functions.js";

export const renderCommentsFunction = () => {
  //функция рендера комментариев
  const ulElement = document.getElementById("commentsContainer");
  const userCommentsHtml = userComments
    .map((userComment, index) => {
      const formattedDate = formatDate(userComment.date); //форматируем дату под нужный формат, на сервере он отличается
      return `<li data-quote="${index}" class="comment">
                <div class="comment-header">
                    <div>${userComment.author.name}</div>
                    <div>${formattedDate}</div>
                </div>
                <div class="comment-body">
                  <div class="comment-text">${userComment.text}</div>
                </div>
                <div class="comment-footer">
                    <div class="likes">
                        <span class="likes-counter">${userComment.likes}</span>
                        <button data-index="${index}" class="like-button ${
        userComment.isLiked ? "-active-like" : ""
      }"></button> 
                    </div>
                    
                </div>
               </li>`;
    })
    .join("");
  ulElement.innerHTML = userCommentsHtml;

  userLike();
  textQuote();
};
