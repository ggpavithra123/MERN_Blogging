
import { useContext, useEffect, useState } from "react"
import Footer from "../components/Footer"
import Navbar from "../components/Navbar"
import { ImCross } from "react-icons/im"
import axios from "axios"
import { URL } from "../url"
import { useNavigate, useParams } from "react-router-dom"
import { UserContext } from "../context/UserContext"

const EditPost = () => {

  const { id: postId } = useParams()
  const { user } = useContext(UserContext)
  const navigate = useNavigate()

  const [title, setTitle] = useState("")
  const [desc, setDesc] = useState("")
  const [file, setFile] = useState(null)
  const [cat, setCat] = useState("")
  const [cats, setCats] = useState([])
  const [photo, setPhoto] = useState("")

  // Fetch Post
  const fetchPost = async () => {
    try {
      const res = await axios.get(`${URL}/api/posts/${postId}`)

      setTitle(res.data.title)
      setDesc(res.data.desc)
      setCats(res.data.categories || [])
      setPhoto(res.data.photo || "")

    } catch (err) {
      console.log(err)
    }
  }

  // Update Post
  const handleUpdate = async (e) => {
    e.preventDefault()

    const post = {
      title,
      desc,
      username: user.username,
      userId: user._id,
      categories: cats
    }

    try {

      // Upload new image if selected
      if (file) {

        const data = new FormData()
        const filename = Date.now() + "-" + file.name

        data.append("img", filename)
        data.append("file", file)

        post.photo = filename

        await axios.post(`${URL}/api/upload`, data)
      } else {
        post.photo = photo
      }

      const res = await axios.put(
        `${URL}/api/posts/${postId}`,
        post,
        { withCredentials: true }
      )

      navigate(`/posts/post/${res.data._id}`)

    } catch (err) {
      console.log(err)
    }
  }

  // Delete Category
  const deleteCategory = (i) => {
    const updatedCats = cats.filter((_, index) => index !== i)
    setCats(updatedCats)
  }

  // Add Category
  const addCategory = () => {
    if (cat.trim() !== "") {
      setCats([...cats, cat])
      setCat("")
    }
  }

  useEffect(() => {
    fetchPost()
  }, [postId])

  return (
    <div>
      <Navbar />

      <div className="px-6 md:px-[200px] mt-8">

        <h1 className="font-bold md:text-2xl text-xl">
          Update a Post
        </h1>

        <form
          onSubmit={handleUpdate}
          className="w-full flex flex-col space-y-4 md:space-y-8 mt-4"
        >

          {/* Title */}
          <input
            type="text"
            placeholder="Enter post title"
            className="px-4 py-2 outline-none"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          {/* Image Preview */}
          {photo && !file && (
            <img
              src={`${URL}/images/${photo}`}
              className="w-60 rounded"
              alt="post"
            />
          )}

          {file && (
            <img
              src={window.URL.createObjectURL(file)}
              className="w-60 rounded"
              alt="preview"
            />
          )}

          {/* File Upload */}
          <input
            type="file"
            className="px-4"
            onChange={(e) => setFile(e.target.files[0])}
          />

          {/* Category Input */}
          <div className="flex flex-col">

            <div className="flex items-center space-x-4 md:space-x-8">

              <input
                type="text"
                placeholder="Enter post category"
                className="px-4 py-2 outline-none"
                value={cat}
                onChange={(e) => setCat(e.target.value)}
              />

              <div
                onClick={addCategory}
                className="bg-black text-white px-4 py-2 font-semibold cursor-pointer"
              >
                Add
              </div>

            </div>

            {/* Categories */}
            <div className="flex flex-wrap px-4 mt-3">

              {cats.map((c, i) => (

                <div
                  key={i}
                  className="flex items-center space-x-2 mr-4 mb-2 bg-gray-200 px-2 py-1 rounded-md"
                >

                  <p>{c}</p>

                  <p
                    onClick={() => deleteCategory(i)}
                    className="text-white bg-black rounded-full cursor-pointer p-1 text-sm"
                  >
                    <ImCross />
                  </p>

                </div>

              ))}

            </div>

          </div>

          {/* Description */}
          <textarea
            rows={15}
            placeholder="Enter post description"
            className="px-4 py-2 outline-none"
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
          />

          {/* Submit */}
          <button
            type="submit"
            className="bg-black w-full md:w-[20%] mx-auto text-white font-semibold px-4 py-2 md:text-xl text-lg"
          >
            Update
          </button>

        </form>

      </div>

      <Footer />
    </div>
  )
}

export default EditPost
