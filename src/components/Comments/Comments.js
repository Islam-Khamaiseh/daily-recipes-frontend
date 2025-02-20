import React, { useEffect, useState } from "react";
import axios from "axios";
import { auth } from "../../config/firebase";
import { useNavigate } from "react-router-dom";
import "./Comments.css";

const Comments = ({ recipeId }) => {
  const [comments, setComments] = useState([]);
  const [content, setContent] = useState("");
  const [refresh, setRefresh] = useState(true);
  const navigate = useNavigate();

  const fetchComments = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/api/getComments?recipeId=${recipeId}`
      );

      setComments(response.data.comments);
    } catch (error) {
      console.error(
        "Error fetching comments:",
        error.response?.data || error.message
      );
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = await auth.currentUser.getIdToken();
      await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/addComment`,
        { recipeId, content },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setContent("");
      setRefresh(!refresh);
    } catch (error) {
      console.error(
        "Error adding comment:",
        error.response?.data || error.message
      );
    }
  };

  useEffect(() => {
    fetchComments();
  }, [recipeId]);

  useEffect(() => {
    fetchComments();
  }, [refresh]);

  return (
    <div className="comment-section">
      <form onSubmit={handleSubmit} className="comment">
        <textarea
          className="comment-input"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write your comment here..."
          required
        ></textarea>
        <button className="comment-button" type="submit">
          Add Comment
        </button>
      </form>
      <div className="comments">
        {comments.length > 0 ? (
          comments.map((comment) => (
            <div key={comment.commentId} className="comments-content">
              <img
                className="comments-content-avatar"
                src={
                  comment.avatar ||
                  "https://res.cloudinary.com/diwtb2b9i/image/upload/v1737088355/default-avatar-icon-of-social-media-user-vector_umub9i.jpg"
                }
                alt="avatar"
              />
              <div className="comments-details">
                <p
                  className="comments-content-user-name"
                  onClick={() => navigate(`/user/${comment.userId}`)}
                >
                  {comment.userName || "Anonymous"}
                </p>
                <p className="comments-content-text">
                  {comment.content || "No content"}
                </p>
                <p className="comments-content-timestamp">
                  {new Date(comment.timestamp).toLocaleString()}
                </p>
              </div>
            </div>
          ))
        ) : (
          <p>No comments yet.</p>
        )}
      </div>
    </div>
  );
};

export default Comments;
