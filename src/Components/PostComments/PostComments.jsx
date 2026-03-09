import axios from "axios";
import { useContext } from "react";
import { useParams } from "react-router-dom";
import { authContext } from "../../Context/authContext";
import { useQuery } from "@tanstack/react-query";
import LoadingPage from "../LoadingPage/LoadingPage";
import CommentCard from "../CommentCard/CommentCard";
import { Comment } from "react-loader-spinner";

export default function PostComments() {
  const { userToken } = useContext(authContext);
  const { id } = useParams();

  function getPostComments() {
    return axios.get(
      `https://route-posts.routemisr.com/posts/${id}/comments?page=1&limit=10`,
      {
        headers: { token: userToken },
      },
    );
  }

  const {
    data: response,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["getPostComments", id],
    queryFn: getPostComments,
  });

  const comments = response?.data.data.comments;

  return (
    <>
      {isLoading && (
        <div className="flex justify-center items-center">
          <Comment
            visible={true}
            height="80"
            width="80"
            ariaLabel="comment-loading"
            wrapperStyle={{}}
            wrapperClass="comment-wrapper"
            color="#fff"
            backgroundColor="#09c"
          />
        </div>
      )}
      {isError && (
        <div className="h-screen flex justify-center items-center text-red-600 text-2xl font-semibold">
          {error.message}
        </div>
      )}

      {comments && (
        <div className="rounded-lg flex flex-col gap-2 bg-gray-50 p-3 shadow-md">
          {comments.map((comment) => (
            <CommentCard comment={comment} key={comment._id} queryKey={["getPostComments", id]} />
          ))}
        </div>
      )}
    </>
  );
}
