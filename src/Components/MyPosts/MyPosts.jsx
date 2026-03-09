import React, { useContext } from "react";
import { authContext } from "../../Context/authContext";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import PostCard from "./../PostCard/PostCard";
import { RotatingLines } from "react-loader-spinner";

export default function MyPosts() {
  const { loggedInUserId, userToken } = useContext(authContext);

  function getMyPosts() {
    return axios.get(
      `https://route-posts.routemisr.com/users/${loggedInUserId}/posts`,
      {
        headers: { token: userToken },
      },
    );
  }

  const { data, isLoading, isSuccess, isError } = useQuery({
    queryKey: ["myPosts"],
    queryFn: getMyPosts,
  });

  const myPosts = data?.data.data.posts;

  return (
    <div className="py-3">
      <h1 className="font-bold text-4xl text-brand-medium text-shadow-2xs">
        My Posts
      </h1>
      {isLoading && (
        <div className="flex justify-center pt-7">
          <RotatingLines
            visible={true}
            height="40"
            width="40"
            color="#155DFC"
            strokeWidth="5"
            animationDuration="0.75"
            ariaLabel="rotating-lines-loading"
            wrapperStyle={{}}
            wrapperClass=""
          />
        </div>
      )}
      {isSuccess && (
        <div className="flex flex-col gap-5 mt-4">
          {myPosts.map((post) => (
            <PostCard post={post} key={post._id} queryKey={["myPosts"]} />
          ))}
        </div>
      )}
    </div>
  );
}
