"use strict";

const COMMENTS_API_URL = "https://wedev-api.sky.pro/api/v1/ttttemaa/comments";
const domElements = {
    commentsList: document.querySelector(".comments"),
    nameInput: document.querySelector(".add-form-name"),
    commentInput: document.querySelector(".add-form-text"),
    submitButton: document.querySelector(".add-form-button"),
};

let commentData = [];

const escapeHTML = (text) => text.replace(/</g, "<").replace(/>/g, ">");

const formatCommentDate = (isoDate) => {
    const date = new Date(isoDate);
    return `${date.toLocaleString("ru-RU", {
        day: "2-digit",
        month: "2-digit",
        year: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
    })}`;
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

const fetchCommentData = async () => {
    try {
        const response = await fetch(COMMENTS_API_URL);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const { comments: fetchedComments } = await response.json();
        commentData = fetchedComments.map((comment) => ({
            name: comment.author.name,
            date: formatCommentDate(comment.date),
            text: comment.text,
            likes: 0,
            isLiked: false,
        }));
        renderCommentList();
    } catch (error) {
        console.error("Fetch error:", error);
        alert(`Не удалось загрузить комментарии: ${error.message}`);
    }
};

const submitNewComment = async () => {
    const name = domElements.nameInput.value.trim();
    const text = domElements.commentInput.value.trim();
    try {
        const response = await fetch(COMMENTS_API_URL, {
            method: "POST",
            body: JSON.stringify({ name, text }),
        });
        if (!response.ok) throw new Error((await response.json()).error);
        await fetchCommentData();
        domElements.nameInput.value = "";
        domElements.commentInput.value = "";
    } catch (error) {
        console.error("Post error:", error);
        alert(`Ошибка добавления: ${error.message}`);
    }
};

domElements.submitButton.addEventListener("click", submitNewComment);
fetchCommentData();