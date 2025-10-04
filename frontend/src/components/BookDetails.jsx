import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../utils/api";
import ReviewForm from "../components/ReviewForm";
import ReviewItem from "../components/ReviewItem";
import StarRating from "../components/StarRating";
import RatingChart from "../components/RatingChart";

function BookDetails() {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  const { user } = useAuth();
  const navigate = useNavigate();

  const fetchBookAndReviews = async () => {
    try {
      const resBook = await api.get(`/books/${id}`);
      setBook(resBook.data);

      const resReviews = await api.get(`/reviews/book/${id}`);
      setReviews(resReviews.data.reviews);
      setAverageRating(resReviews.data.averageRating);
    } catch (err) {
      console.error(err.response?.data || err.message);
    }
  };

  useEffect(() => {
    fetchBookAndReviews();
  }, [id]);

  const handleDeleteBook = async () => {
    if (!window.confirm("Are you sure you want to delete this book?")) return;
    await api.delete(`/books/${id}`);
    navigate("/");
  };

  const handleAddReview = (newReview) => {
    setReviews([...reviews, newReview]);
    const newAvg =
      (parseFloat(averageRating) * reviews.length + newReview.rating) /
      (reviews.length + 1);
    setAverageRating(newAvg.toFixed(2));
  };

  const handleUpdateReview = (updatedReview) => {
    const updatedReviews = reviews.map((r) =>
      r._id === updatedReview._id ? updatedReview : r
    );
    setReviews(updatedReviews);
    const newAvg =
      updatedReviews.reduce((sum, r) => sum + r.rating, 0) /
      updatedReviews.length;
    setAverageRating(newAvg.toFixed(2));
  };

  const handleDeleteReview = (reviewId) => {
    const updatedReviews = reviews.filter((r) => r._id !== reviewId);
    setReviews(updatedReviews);
    const newAvg =
      updatedReviews.length > 0
        ? updatedReviews.reduce((sum, r) => sum + r.rating, 0) /
          updatedReviews.length
        : 0;
    setAverageRating(newAvg.toFixed(2));
  };

  if (!book) return <p className="text-center mt-6 text-gray-500">Loading...</p>;

  return (
    <div className="p-4 max-w-4xl mx-auto space-y-6">
      {/* Book Info */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
        <h2 className="text-3xl font-bold mb-2">{book.title}</h2>
        <p className="text-gray-700 dark:text-gray-300">
          <span className="font-semibold">Author:</span> {book.author}
        </p>
        <p className="text-gray-700 dark:text-gray-300">
          <span className="font-semibold">Genre:</span> {book.genre}
        </p>
        <p className="text-gray-700 dark:text-gray-300">
          <span className="font-semibold">Year:</span> {book.year}
        </p>
        <p className="mt-2 text-gray-600 dark:text-gray-400">{book.description}</p>
        <p className="mt-2 text-gray-500 dark:text-gray-400">
          Added by: {book.addedBy?.name}
        </p>

        {user && user._id === book.addedBy?._id && (
          <div className="mt-4 flex gap-2">
            <Link
              to={`/edit/${book._id}`}
              className="px-4 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition"
            >
              Edit
            </Link>
            <button
              onClick={handleDeleteBook}
              className="px-4 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition"
            >
              Delete
            </button>
          </div>
        )}
      </div>

      {/* Rating Chart */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
        <RatingChart bookId={book._id} />
      </div>

      {/* Reviews */}
      <div className="space-y-4">
        <h3 className="text-2xl font-semibold">
          Reviews ({reviews.length}) - Average:{" "}
          <StarRating rating={Math.round(averageRating)} />
        </h3>

        {user && (
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
            <ReviewForm
              bookId={book._id}
              currentUser={user}
              onAdd={handleAddReview}
            />
          </div>
        )}

        <div className="space-y-3">
          {reviews.map((r) => (
            <div
              key={r._id}
              className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow hover:shadow-lg transition"
            >
              <ReviewItem
                review={r}
                currentUser={user}
                onUpdate={handleUpdateReview}
                onDelete={handleDeleteReview}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default BookDetails;
