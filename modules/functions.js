import { userComments, updateComments } from "./comments.js";
import { renderCommentsFunction } from "./render.js";

export const getDataUserComments = async () => {
    try {
        const response = await fetch("https://wedev-api.sky.pro/api/v2/lexarkh/comments");
        const data = await response.json();
        
        if (data.error) {
            throw new Error(data.error);
        }
        
        console.log("Получены комментарии:", data.comments); // Для отладки
        
        // Обновляем список комментариев
        updateComments(data.comments);
        
        // Рендерим комментарии
        renderCommentsFunction();
        
        return data;
    } catch (error) {
        console.error("Ошибка при получении комментариев:", error);
        throw error;
    }
};

export const formatDate = (date) => {
    const dateNow = new Date();
    const dateComment = new Date(date);
    const diffInMinutes = Math.floor((dateNow - dateComment) / (1000 * 60));
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInMinutes < 60) {
        return `${diffInMinutes} минут назад`;
    } else if (diffInHours < 24) {
        return `${diffInHours} часов назад`;
    } else if (diffInDays < 7) {
        return `${diffInDays} дней назад`;
    } else {
        return dateComment.toLocaleDateString();
    }
};

export const userLike = () => {
    const likeButtons = document.querySelectorAll(".like-button");
    likeButtons.forEach((likeButton) => {
        likeButton.addEventListener("click", (event) => {
            event.stopPropagation();
            const index = likeButton.dataset.index;
            const comment = userComments[index];
            comment.isLiked = !comment.isLiked;
            comment.likes += comment.isLiked ? 1 : -1;
            renderCommentsFunction();
        });
    });
};

export const textQuote = () => {
    const comments = document.querySelectorAll(".comment");
    comments.forEach((comment) => {
        comment.addEventListener("click", () => {
            const index = comment.dataset.quote;
            const text = userComments[index].text;
            const textInput = document.getElementById("textInput");
            textInput.value = `> ${text}\n\n`;
            textInput.focus();
        });
    });
};

export const sanitizeHtml = (html) => {
    const div = document.createElement("div");
    div.textContent = html;
    return div.innerHTML;
};