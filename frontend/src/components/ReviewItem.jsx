import { useState } from "react";
import StarRating from "./StarRating";
import api from "../utils/api";

function ReviewItem({ review, currentUser, onUpdate, onDelete }) {
  const isOwner = currentUser?._id === review.userId?._id;
  const [editing, setEditing] = useState(false);
  const [text, setText] = useState(review.reviewText);
  const [rating, setRating] = useState(review.rating);

  const handleSave = async () => {
    try {
      const res = await api.put(`/reviews/${review._id}`, { rating, reviewText: text });
      onUpdate(res.data);
      setEditing(false);
    } catch (err) {
      console.error(err.response?.data || err.message);
      alert(err.response?.data?.message || "Failed to update review");
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Delete this review?")) return;
    try {
      await api.delete(`/reviews/${review._id}`);
      onDelete(review._id);
    } catch (err) {
      console.error(err.response?.data || err.message);
      alert(err.response?.data?.message || "Failed to delete review");
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow hover:shadow-lg transition space-y-2">
      <div className="flex justify-between items-center">
        <strong className="text-gray-800 dark:text-gray-200">
          {review.user?.name || "User"}
        </strong>
        <StarRating rating={rating} editable={editing} onChange={setRating} />
      </div>

      {editing ? (
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-700 dark:text-white dark:border-gray-600"
        />
      ) : (
        <p className="text-gray-700 dark:text-gray-300">{text}</p>
      )}

      {isOwner && (
        <div className="flex gap-2 text-sm">
          {editing ? (
            <>
              <button
                onClick={handleSave}
                className="text-green-500 underline hover:text-green-600"
              >
                Save
              </button>
              <button
                onClick={() => setEditing(false)}
                className="text-gray-500 underline hover:text-gray-600"
              >
                Cancel
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setEditing(true)}
                className="text-blue-500 underline hover:text-blue-600"
              >
                Edit
              </button>
              <button
                onClick={handleDelete}
                className="text-red-500 underline hover:text-red-600"
              >
                Delete
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default ReviewItem;
