import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { authContext } from "../../Context/authContext";
import PostCard from "../PostCard/PostCard";
import LoadingPage from "../LoadingPage/LoadingPage";
import { useQuery } from "@tanstack/react-query";
import PostCreation from "../PostCreation/PostCreation";

export default function Home() {
  const { userToken } = useContext(authContext);

  function getAllPosts() {
    return axios.get(`https://route-posts.routemisr.com/posts`, {
      headers: { token: userToken },
    });
  }

  const { data, isLoading, isSuccess, error } = useQuery({
    queryKey: ["allPosts"],
    queryFn: getAllPosts,
  });

  const allPosts = data?.data.data.posts;

  // console.log(allPosts);

  return (
    <>
      {isLoading ? (
        <LoadingPage />
      ) : isSuccess ? (
        <div className="min-h-screen w-[95%] md:w-2/3 mx-auto flex flex-col gap-5 pt-8">
          <PostCreation />
          {allPosts.map(
            (post) =>
              post.body && (
                <PostCard key={post.id} post={post} queryKey={["allPosts"]} />
              ),
          )}
        </div>
      ) : (
        <div className="h-screen flex justify-center items-center text-red-600 text-2xl font-semibold">
          {error.message}
        </div>
      )}
    </>
  );
}
