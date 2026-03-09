import React, { useContext } from "react";
import { useParams } from "react-router-dom";
import PostCard from "../PostCard/PostCard";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { authContext } from "../../Context/authContext";
import LoadingPage from "../LoadingPage/LoadingPage";
import PostComments from "../PostComments/PostComments";

export default function PostDetails() {
  const { userToken } = useContext(authContext);
  const { id } = useParams();
  function getPostDetails() {
    return axios.get(`https://route-posts.routemisr.com/posts/${id}`, {
      headers: { token: userToken },
    });
  }

  const {
    data: response,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["getPostDetails", id],
    queryFn: getPostDetails,
  });

  const post = response?.data.data.post;

  const commentsCount = response?.data.data.post.commentsCount;
  return (
    <>
      {isLoading && <LoadingPage />}
      {isError && (
        <div className="h-screen flex justify-center items-center text-red-600 text-2xl font-semibold">
          {error.message}
        </div>
      )}
      {post && (
        <div className="flex flex-col gap-3 pt-7">
          <PostCard
            post={post}
            isPostDetailsPage={true}
            queryKey={["getPostDetails", id]}
          />
          {commentsCount > 0 ? (
            <PostComments />
          ) : (
            <div className="text-gray-600 flex justify-center items-center">
              <span>No Comments</span>
            </div>
          )}
        </div>
      )}
    </>
  );
}
