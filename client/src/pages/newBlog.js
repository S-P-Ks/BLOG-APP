import React, { useRef, useState, useEffect, useCallback } from "react";
import Editor from "../components/Editor";
import CategoryBox from "../components/CategoryBox";
import { AiFillCloseCircle } from "react-icons/ai";
import { createCategory, getAllCategories } from "../API/category.js";
import {
  createPost,
  handleUpload,
  updatePost,
  getPostById,
} from "../API/post.js";
import { toast } from "react-hot-toast";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import auth from "../store/auth";
import { useSelector } from "react-redux";

function NewBlog() {
  const [title, settitle] = useState("");
  const [description, setdescription] = useState("");
  const [categories, setcategories] = useState([]);
  const [openNewCategory, setopenNewCategory] = useState(false);
  const [newCategory, setnewCategory] = useState("");
  const [selectedCategories, setselectedCategories] = useState([]);
  const [content, setcontent] = useState("");
  const [isLoading, setisLoading] = useState(false);
  const [file, setFile] = useState("");
  const [percent, setPercent] = useState(0);
  const [imageUrl, setimageUrl] = useState("");

  const [params] = useSearchParams();
  const auth = useSelector((state) => state.auth);

  // console.log(params.get("isUpdate"));
  // console.log(params.get("blog_id"));

  const navigate = useNavigate();

  const [totalCount, settotalCount] = useState(100);

  const [page, setpage] = useState(1);
  const limit = 5;

  const getAllCategory = async () => {
    await getAllCategories(
      page,
      limit,
      ({ data, total_count }) => {
        setcategories([...categories, ...data]);
        settotalCount(total_count);

        setpage(page + 1);
      },
      (err) => {
        console.log(err);
        toast.error(err.response.data.message);
      }
    );
  };

  const createNewCategory = async () => {
    await createCategory(
      { title: newCategory },
      (data) => {
        setcategories([...categories, data]);
      },
      (err) => {
        toast.error("Something went wrong!");
      }
    );
  };

  const onCategorySelected = (id) => {
    if (selectedCategories.includes(id)) {
      setselectedCategories(selectedCategories.filter((el) => el != id));
    } else {
      setselectedCategories([...selectedCategories, id]);
    }
  };

  async function handleFileChange(event) {
    console.log(event.target.files[0]);
    setFile(event.target.files[0]);
  }

  const clearAllFields = () => {
    settitle("");
    setdescription("");
    setcontent("");
    setselectedCategories([]);
    setFile(null);
  };

  const createBlog = async () => {
    const body = {};

    if (title.length == 0 || description.length == 0 || content.length == 0) {
      toast.error("Please fill all the values!");
      return;
    }

    if (selectedCategories.length == 0) {
      toast.error("Please select some categories!");
      return;
    }

    let imgUrl = imageUrl;
    if (file) {
      let error = false;
      setisLoading(true);
      await handleUpload(file)
        .then((res) => {
          setimageUrl(res);
          imgUrl = res;
        })
        .catch((err) => {
          toast.error("Some error occured while uploading the image!");
          error = true;
        })
        .finally(() => {
          setisLoading(false);
        });

      if (error) {
        setisLoading(false);
        return;
      }
    } else if (imgUrl.length == 0 && !file) {
      toast.error("Please provid the blog banner!");
      return;
    }

    body["title"] = title;
    body["description"] = description;
    body["categories"] = selectedCategories;
    body["content"] = content;
    body["imageUrl"] = imgUrl;
    body["author"] = auth.user._id;

    setisLoading(true);

    if (params.get("isUpdate")) {
      console.log(params.get("blog_id"));
      await updatePost(
        params.get("blog_id"),
        body,
        ({ data }) => {
          console.log(data);
          setisLoading(false);
          clearAllFields();
          navigate(`/blog/${data._id}`);
        },
        (err) => {
          console.log(err);
          setisLoading(false);
          toast.error("Something went wrong!");
        },
        () => {}
      );
    } else {
      await createPost(
        body,
        ({ data }) => {
          console.log(data._id);
          setisLoading(false);
          clearAllFields();
          navigate(`/blog/${data._id}`);
        },
        (err) => {
          console.log(err);
          setisLoading(false);
          toast.error("Something went wrong!");
        },
        () => {}
      );
    }
  };

  const getPostToUpdate = async () => {
    setisLoading(true);
    await getPostById(
      params.get("blog_id"),
      (res) => {
        console.log(res);
        settitle(res.title);
        setdescription(res.description);
        setcontent(res.content);
        setimageUrl(res.imageUrl);

        for (let c of res.categories) {
          setselectedCategories([...selectedCategories, c._id]);
        }
        // setselectedCategories([...res.categories]);
      },
      (err) => {
        console.log(err);
        toast.error("Something went wrong!");
      },
      () => {
        setisLoading(false);
      }
    );
  };

  useEffect(() => {
    getAllCategory();
    // console.log(params);
    if (params.get("isUpdate")) {
      getPostToUpdate();
    }
  }, []);

  if (isLoading) {
    return (
      <div className="h-full w-full flex justify-center items-center">
        <div className="text-2xl text-white">Loading...</div>
      </div>
    );
  }

  return (
    <div
      className="p-4 overflow-hidden scrollbar-thick scrollbar-thumb-blue-500 scrollbar-track-blue-100"
      style={{ height: "95vh" }}
    >
      <div className="flex justify-between mb-2">
        <div className="mb-4">Add New Blog</div>
        <div
          className="p-2 bg-orange-500 hover:bg-lime-800 rounded-lg"
          onClick={createBlog}
        >
          {params.get("isUpdate") ? "Update Blog" : "Create Blog"}
        </div>
      </div>
      <div className="overflow-y-scroll h-full">
        <div className="flex flex-col mb-2 mr-2">
          <label htmlFor="title">Add Title</label>
          <input
            className="rounded-lg p-2 mt-2 bg-black ml-1"
            type="title"
            name="title"
            value={title}
            onChange={(e) => settitle(e.target.value)}
          />
        </div>
        <div className="flex flex-col mb-2 mr-2">
          <label htmlFor="Description">Add Description</label>
          <input
            className="rounded-lg p-2 mt-2 bg-black ml-1"
            type="description"
            name="description"
            value={description}
            onChange={(e) => setdescription(e.target.value)}
          />
        </div>
        <div className="my-2">
          <div className="mb-2">Add Blog Banner</div>
          <input type="file" accept="image/*" onChange={handleFileChange} />

          <div>{imageUrl}</div>
        </div>
        <div className="flex flex-col mr-2">
          <div>Add Categories</div>
          <div className="flex flex-wrap items-center">
            {categories.map((el) => (
              <CategoryBox
                key={el._id}
                category={el}
                onClick={onCategorySelected}
                isSelected={selectedCategories.includes(el._id)}
              />
            ))}
            {categories.length >= 5 && totalCount > categories.length && (
              <div
                className="p-2 rounded-lg bg-blue-500 mr-2 my-2 cursor-pointer"
                onClick={getAllCategory}
              >
                Show More
              </div>
            )}
          </div>
          <div className="flex my-2">
            <input
              className="rounded-lg p-2 bg-black ml-1"
              type="text"
              name="category"
              value={newCategory}
              onChange={(e) => setnewCategory(e.target.value)}
            />
            <div
              className="hover:bg-gray-400 p-2 rounded-lg ml-2"
              onClick={createNewCategory}
            >
              Add new Category
            </div>
          </div>
        </div>
        <div>Add Content</div>
        <div className="text-black rounded-lg mt-2 mr-2">
          <Editor onChange={(e) => setcontent(e)} content={content} />
        </div>
      </div>
    </div>
  );
}

export default NewBlog;
