import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../utils/api";

function BookForm({ isEdit }) {
  const [form, setForm] = useState({
    title: "",
    author: "",
    description: "",
    genre: "",
    year: "",
  });
  const { id } = useParams();
  const navigate = useNavigate();

  // Fetch existing book details if editing
  useEffect(() => {
    if (isEdit && id) {
      api.get(`/books/${id}`).then((res) => {
        setForm({
          title: res.data.title || "",
          author: res.data.author || "",
          description: res.data.description || "",
          genre: res.data.genre || "",
          year: res.data.year || "",
        });
      });
    }
  }, [isEdit, id]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEdit) {
        await api.put(`/books/${id}`, form); // token auto-attached via interceptor
      } else {
        await api.post("/books", form); // token auto-attached via interceptor
      }
      navigate("/");
    } catch (error) {
      console.error("Error saving book:", error.response?.data || error.message);
      alert(error.response?.data?.message || "Something went wrong!");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {["title", "author", "description", "genre", "year"].map((field) => (
        <input
          key={field}
          type="text"
          name={field}
          placeholder={field}
          value={form[field] || ""}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
      ))}
      <button
        type="submit"
        className="px-4 py-2 bg-blue-600 text-white rounded"
      >
        {isEdit ? "Update Book" : "Add Book"}
      </button>
    </form>
  );
}

export default BookForm;
