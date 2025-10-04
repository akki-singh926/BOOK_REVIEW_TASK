import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../utils/api";

function BookList() {
  const [books, setBooks] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // ✅ Search, filter, sort states
  const [search, setSearch] = useState("");
  const [genre, setGenre] = useState("");
  const [sort, setSort] = useState("");

  const fetchBooks = async () => {
    try {
      let query = `/books?page=${page}`;
      if (search) query += `&search=${search}`;
      if (genre) query += `&genre=${genre}`;
      if (sort) query += `&sort=${sort}`;

      const res = await api.get(query);
      const booksData = res.data.books;

      const booksWithRating = await Promise.all(
        booksData.map(async (book) => {
          try {
            const ratingRes = await api.get(`/reviews/book/${book._id}`);
            return { ...book, averageRating: parseFloat(ratingRes.data.averageRating) };
          } catch {
            return { ...book, averageRating: 0 };
          }
        })
      );

      setBooks(booksWithRating);
      setTotalPages(res.data.totalPages);
    } catch (err) {
      console.error(err.response?.data || err.message);
      alert("Failed to fetch books");
    }
  };

  useEffect(() => {
    fetchBooks();
  }, [page, search, genre, sort]);

  const renderStars = (rating) => {
    const rounded = Math.round(rating);
    return (
      <span className="text-yellow-400">
        {"★".repeat(rounded) + "☆".repeat(5 - rounded)}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold mb-4 text-center">Books</h2>

      {/* Search, Filter & Sort */}
      <div className="flex flex-wrap gap-3 justify-center mb-6">
        <input
          type="text"
          placeholder="Search by title or author"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="p-2 rounded border focus:ring-2 focus:ring-blue-400 focus:outline-none w-60"
        />
        <select
          value={genre}
          onChange={(e) => setGenre(e.target.value)}
          className="p-2 rounded border focus:ring-2 focus:ring-blue-400 focus:outline-none"
        >
          <option value="">All Genres</option>
          <option value="Fiction">Fiction</option>
          <option value="Non-fiction">Non-fiction</option>
          <option value="Science">Science</option>
          <option value="History">History</option>
        </select>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="p-2 rounded border focus:ring-2 focus:ring-blue-400 focus:outline-none"
        >
          <option value="">Sort By</option>
          <option value="year">Published Year</option>
        </select>
      </div>

      {/* Books Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {books.map((book) => (
          <Link
            key={book._id}
            to={`/book/${book._id}`}
            className="p-4 border rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
          >
            <h3 className="text-lg font-semibold mb-1">{book.title}</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-2">{book.author}</p>
            <div className="flex items-center space-x-2">
              {renderStars(book.averageRating)}
              <span className="text-gray-500 dark:text-gray-400 text-sm">{book.averageRating.toFixed(1)}/5</span>
            </div>
          </Link>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-center mt-6 flex-wrap gap-2">
        {[...Array(totalPages)].map((_, i) => (
          <button
            key={i}
            onClick={() => setPage(i + 1)}
            className={`px-3 py-1 rounded-md border ${
              page === i + 1
                ? "bg-blue-500 text-white"
                : "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600"
            } transition-colors duration-200`}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
}

export default BookList;
