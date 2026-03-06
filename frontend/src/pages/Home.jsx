import axios from "axios";
import Footer from "../components/Footer";
import HomePosts from "../components/HomePosts";
import Navbar from "../components/Navbar";
import { IF, URL } from "../url";
import { useContext, useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import Loader from "../components/Loader";
import { UserContext } from "../context/UserContext";

const Home = () => {
  const { search } = useLocation();

  const [posts, setPosts] = useState([]);
  const [noResults, setNoResults] = useState(false);
  const [loader, setLoader] = useState(false);

  const { user } = useContext(UserContext);

  const fetchPosts = async () => {
    setLoader(true);

    try {
      const res = await axios.get(`${URL}/api/posts${search}`);

      setPosts(res.data);

      if (res.data.length === 0) {
        setNoResults(true);
      } else {
        setNoResults(false);
      }
    } catch (err) {
      console.log(err);
      setNoResults(true);
    } finally {
      setLoader(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [search]);

  return (
    <>
      <Navbar />

      <div className="px-8 md:px-[200px] min-h-[80vh]">
        {loader ? (
          <div className="h-[40vh] flex justify-center items-center">
            <Loader />
          </div>
        ) : noResults ? (
          <h3 className="text-center font-bold mt-16">No posts available</h3>
        ) : (
          posts.map((post) => (
            <Link
              key={post._id}
              to={user ? `/posts/post/${post._id}` : "/login"}
            >
              <HomePosts post={post} />
            </Link>
          ))
        )}
      </div>

      <Footer />
    </>
  );
};

export default Home;