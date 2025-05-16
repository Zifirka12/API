"use strict";

const COMMENTS_API_URL = "https://wedev-api.sky.pro/api/v1/ttttemaa/comments";
const domElements = {
    commentsList: document.querySelector(".comments"),
    nameInput: document.querySelector(".add-form-name"),
    commentInput: document.querySelector(".add-form-text"),
    submitButton: document.querySelector(".add-form-button"),
    addForm: document.querySelector(".add-form"),
    loader: document.querySelector(".loader"),
    addFormLoader: document.querySelector(".add-form-loader"),
    loadingMessage: document.createElement("div")
};

// Настраиваем элемент с сообщением
domElements.loadingMessage.textContent = "Комментарий добавляется...";
domElements.loadingMessage.style.cssText = "text-align: center; margin: 10px 0; display: none;";
domElements.addForm.parentElement.insertBefore(domElements.loadingMessage, domElements.addForm.nextSibling);

let commentData = [];

const escapeHTML = (text) => text.replace(/</g, "&lt;").replace(/>/g, "&gt;");

const formatCommentDate = (isoDate) => {
    const date = new Date(isoDate);
    return date.toLocaleString("ru-RU", {
        day: "2-digit",
        month: "2-digit",
        year: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
    });
};

const renderCommentList = () => {
    domElements.commentsList.innerHTML = commentData
        .map(
            (comment, index) => `
        <li class="comment" data-index="${index}">
          <div class="comment-header">
            <div class="head-name">${escapeHTML(comment.name)}</div>
            <div class="head-time">${comment.date}</div>
          </div>
          <div class="comment-body">
            <div class="comment-text">${escapeHTML(comment.text)}</div>
          </div>
          <div class="comment-footer">
            <div class="likes">
              <span class="likes-counter">${comment.likes}</span>
              <button class="like-button ${comment.isLiked ? "-active-like" : ""}" data-index="${index}"></button>
            </div>
          </div>
        </li>`
        )
        .join("");

    domElements.commentsList.querySelectorAll(".like-button").forEach((button) =>
        button.addEventListener("click", (event) => {
            event.stopPropagation();
            const index = button.dataset.index;
            commentData[index].isLiked = !commentData[index].isLiked;
            commentData[index].likes += commentData[index].isLiked ? 1 : -1;
            renderCommentList();
        })
    );

    domElements.commentsList.querySelectorAll(".comment").forEach((commentElement) =>
        commentElement.addEventListener("click", () => {
            const index = commentElement.dataset.index;
            domElements.commentInput.value = `> ${escapeHTML(commentData[index].text)}\n`;
            domElements.nameInput.value = commentData[index].name;
        })
    );
};

const toggleLoader = (show) => {
    domElements.loader.classList.toggle('loader-active', show);
};

const toggleAddFormLoader = (show) => {
    domElements.addForm.style.display = show ? 'none' : 'flex';
    domElements.addFormLoader.classList.toggle('loader-active', show);
    domElements.loadingMessage.style.display = show ? 'block' : 'none';
    domElements.submitButton.disabled = show;
};

const getComments = () => {
    return fetch(COMMENTS_API_URL)
        .then((response) => {
            if (!response.ok) {
                if (response.status >= 500) {
                    throw new Error("Сервер сломался, попробуй позже");
                }
                throw new Error(`HTTP ${response.status}`);
            }
            return response.json();
        })
        .then((data) => {
            commentData = data.comments.map((comment) => ({
                name: comment.author.name,
                date: formatCommentDate(comment.date),
                text: comment.text,
                likes: 0,
                isLiked: false,
            }));
            renderCommentList();
        });
};

const initComments = () => {
    toggleLoader(true);
    return getComments()
        .catch((error) => {
            console.error("Fetch error:", error);
            if (!window.navigator.onLine) {
                alert("Кажется, у вас сломался интернет, попробуйте позже");
            } else {
                alert(error.message);
            }
        })
        .finally(() => {
            toggleLoader(false);
        });
};

const submitNewComment = (event) => {
    event.preventDefault();
    const name = domElements.nameInput.value.trim();
    const text = domElements.commentInput.value.trim();

    if (name.length < 3 || text.length < 3) {
        alert("Имя и комментарий должны быть не короче 3 символов");
        return;
    }

    toggleAddFormLoader(true);

    fetch(COMMENTS_API_URL, {
        method: "POST",
        body: JSON.stringify({ 
            name, 
            text,
            forceError: true
        }),
    })
        .then((response) => {
            if (!response.ok) {
                if (response.status >= 500) {
                    throw new Error("Сервер сломался, попробуй позже");
                }
                return response.json().then(error => {
                    throw new Error(error.error || "Некорректные данные");
                });
            }
            return response.json();
        })
        .then(() => getComments())
        .then(() => {
            domElements.nameInput.value = "";
            domElements.commentInput.value = "";
        })
        .catch((error) => {
            console.error("Post error:", error);
            if (!window.navigator.onLine) {
                alert("Кажется, у вас сломался интернет, попробуйте позже");
            } else {
                alert(error.message);
            }
        })
        .finally(() => {
            toggleAddFormLoader(false);
        });
};

domElements.addForm.addEventListener("submit", submitNewComment);
initComments();