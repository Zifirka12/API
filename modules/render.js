import { userComments } from "./comments.js";
import { formatDate, userLike, textQuote } from "./functions.js";

export const renderCommentsFunction = () => {
    const commentsHtml = userComments
        .map((userComment, index) => {
            const formattedDate = formatDate(userComment.date);
            return `
                <li data-quote="${index}" class="comment">
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

    const commentsContainer = document.getElementById('commentsContainer');
    if (commentsContainer) {
        commentsContainer.innerHTML = commentsHtml;
    }

    const commentForm = document.getElementById('commentForm');
    if (commentForm) {
        commentForm.innerHTML = `
            <div class="add-comment">
                <textarea
                    class="add-comment-text"
                    id="textInput"
                    placeholder="Введите ваш комментарий"
                    rows="4"
                ></textarea>
                <div class="add-comment-butt">
                    <button class="add-comment-button" id="submitComment">
                        Отправить
                    </button>
                </div>
                <div id="responseMessage" class="response-message"></div>
            </div>
        `;
    }

    // Инициализируем обработчики событий
    userLike();
    textQuote();
};