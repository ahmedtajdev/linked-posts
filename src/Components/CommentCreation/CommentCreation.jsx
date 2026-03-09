import axios from "axios";
import { useContext, useRef } from "react";
import { IoIosSend } from "react-icons/io";
import { FaRegImage } from "react-icons/fa6";
import { authContext } from "../../Context/authContext";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { Oval } from "react-loader-spinner";

export default function CommentCreation({ postId, queryKey }) {
  const { userToken } = useContext(authContext);
  const commentInput = useRef(null);

  function handleCommentCreation() {
    const comment = {
      content: commentInput.current.value,
    };
    return axios.post(
      `https://route-posts.routemisr.com/posts/${postId}/comments`,
      comment,
      {
        headers: { token: userToken },
      },
    );
  }

  const queryClientConfig = useQueryClient();
  const { mutate: createComment, isPending } = useMutation({
    mutationFn: handleCommentCreation,
    onSuccess: (data) => {
      queryClientConfig.invalidateQueries({ queryKey });
      commentInput.current.value = null;
      toast.success(data.data.message, {
        position: "bottom-right",
      });
    },
    onError: () => {
      toast.error(`Error Occured, try again later!`, {
        position: "bottom-right",
      });
    },
  });

  return (
    <div className="p-3 relative">
      <input
        ref={commentInput}
        className="w-full bg-gray-100 border-gray-200 rounded-lg py-3"
        placeholder="Write your comment"
        type="text"
      />
      <button
        onClick={isPending ? undefined : createComment}
        className="bg-blue-500 text-white p-2.5 rounded-full absolute top-1/2 -translate-y-1/2 right-6 cursor-pointer hover:bg-blue-400 transition-colors duration-200"
      >
        {isPending ? (
          <Oval
            visible={true}
            height="15"
            width="15"
            color="#fff"
            ariaLabel="oval-loading"
            wrapperStyle={{}}
            wrapperClass=""
          />
        ) : (
          <IoIosSend />
        )}
      </button>
    </div>
  );
}
