import { useState } from "react";
import StarRating from "./StarRating";
import api from "../utils/api";

function ReviewForm({ bookId, currentUser, onAdd }) {
  const [rating, setRating] = useState(5);
  const [text, setText] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!currentUser) return alert("You must be logged in to add a review");

    try {
      const res = await api.post(`/reviews/${bookId}`, {
        rating: Number(rating),
        reviewText: text,
      });

      const newReview = { ...res.data, user: currentUser };
      onAdd(newReview);

      setRating(5);
      setText("");
    } catch (err) {
      console.error(err.response?.data || err.message);
      alert(err.response?.data?.message || "Failed to add review");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md space-y-3"
    >
      <h4 className="font-semibold text-lg text-gray-800 dark:text-gray-200">
        Add Your Review
      </h4>
      <StarRating rating={rating} editable={true} onChange={setRating} />
      <textarea
  value={text}
  onChange={(e) => setText(e.target.value)}
  placeholder="Write your review..."
  className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400 
             dark:bg-gray-700 dark:text-white dark:border-gray-600
             bg-white text-black"
  required
/>

      <button
        type="submit"
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
      >
        Add Review
      </button>
    </form>
  );
}

export default ReviewForm;
