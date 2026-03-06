import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { ImCross } from "react-icons/im";
import { useContext, useState } from "react";
import { UserContext } from "../context/UserContext";
import { URL } from "../url";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const CreatePost = () => {
  const navigate = useNavigate();
  const { user } = useContext(UserContext);

  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [file, setFile] = useState(null);
  const [cat, setCat] = useState("");
  const [cats, setCats] = useState([]);

  // Add category
  const addCategory = () => {
    if (!cat.trim()) return;
    setCats([...cats, cat]);
    setCat("");
  };

  // Delete category
  const deleteCategory = (index) => {
    const updated = [...cats];
    updated.splice(index, 1);
    setCats(updated);
  };

  // Create post
  const handleCreate = async (e) => {
    e.preventDefault();

    if (!title || !desc) {
      alert("Title and description are required");
      return;
    }

    let photoName = "";

    try {
      // Upload image
      if (file) {
        const formData = new FormData();
        formData.append("image", file);

        const uploadRes = await axios.post(`${URL}/api/upload`, formData);
        photoName = uploadRes.data.filename;
      }

      // Save post
      const postData = {
        title,
        desc,
        username: user.username,
        userId: user._id,
        categories: cats,
        photo: photoName,
      };

      const res = await axios.post(`${URL}/api/posts/create`, postData, { withCredentials: true });
      navigate(`/posts/post/${res.data._id}`);
    } catch (err) {
      console.error("Post creation error:", err);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="px-6 md:px-[200px] mt-8">
        <h1 className="font-bold text-xl md:text-2xl">Create a Post</h1>
        <form onSubmit={handleCreate} className="flex flex-col space-y-6 mt-6">
          <input
            type="text"
            placeholder="Enter post title"
            className="px-4 py-2 border outline-none"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <input type="file" className="px-2" onChange={(e) => setFile(e.target.files[0])} />
          <div>
            <div className="flex gap-4">
              <input
                type="text"
                placeholder="Enter category"
                className="px-4 py-2 border outline-none"
                value={cat}
                onChange={(e) => setCat(e.target.value)}
              />
              <button type="button" onClick={addCategory} className="bg-black text-white px-4 py-2">
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2 mt-3">
              {cats.map((c, i) => (
                <div key={i} className="flex items-center gap-2 bg-gray-200 px-3 py-1 rounded">
                  <span>{c}</span>
                  <ImCross onClick={() => deleteCategory(i)} className="cursor-pointer text-sm" />
                </div>
              ))}
            </div>
          </div>
          <textarea
            rows="12"
            placeholder="Enter post description"
            className="px-4 py-2 border outline-none"
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
          />
          <button type="submit" className="bg-black text-white py-2 font-semibold md:w-[200px] mx-auto">
            Create Post
          </button>
        </form>
      </div>
      <Footer />
    </div>
  );
};

export default CreatePost;