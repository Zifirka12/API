import { domElements } from './constants.js';
import { escapeHTML } from './utils.js';

export const renderCommentList = (commentData) => {
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
              <button class="like-button ${comment.isLiked ? '-active-like' : ''}" data-index="${index}"></button>
            </div>
          </div>
        </li>`
    )
    .join('');
};
