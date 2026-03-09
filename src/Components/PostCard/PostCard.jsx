import {
  Avatar,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Divider,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@heroui/react";
import { FaRegComment } from "react-icons/fa";
import { BiLike } from "react-icons/bi";
import { PiShareFat } from "react-icons/pi";
import imagePlaceholder from "../../assets/images/image-placeholder.jpg";
import MyCardHeader from "../MyCardHeader/MyCardHeader";
import CommentCard from "../CommentCard/CommentCard";
import { useContext, useRef, useState } from "react";
import { Link } from "react-router-dom";
import CommentCreation from "../CommentCreation/CommentCreation";
import axios from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import LoadingPage from "../LoadingPage/LoadingPage";
import { authContext } from "../../Context/authContext";
import { RiCloseCircleLine } from "react-icons/ri";
import { MdOutlineAddPhotoAlternate } from "react-icons/md";
import { ThreeDots } from "react-loader-spinner";

export default function PostCard({
  post,
  isPostDetailsPage = false,
  queryKey,
}) {
  const imgInput = useRef();
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const { userToken } = useContext(authContext);
  const { user, body, image, createdAt, topComment, id, commentsCount } = post;
  const [postBody, setPostBody] = useState(body);
  const [previewImg, setPreviewImg] = useState(image);
  const queryClientConfig = useQueryClient();
  const wrongPath = "/uploads/https://";

  function handleDeletePost() {
    return axios.delete(`https://route-posts.routemisr.com/posts/${id}`, {
      headers: { token: userToken },
    });
  }

  const { mutate: deletePost } = useMutation({
    mutationFn: handleDeletePost,
    onSuccess: (data) => {
      queryClientConfig.invalidateQueries({ queryKey });
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

  function handleUpdatePost() {
    onOpen();
    const updatedPost = new FormData();
    const updatedPostBody = postBody;
    const updatedPostImg = imgInput.current?.value;
    updatedPostBody && updatedPost.append("body", updatedPostBody);
    updatedPostImg && updatedPost.append("image", imgInput.current.files[0]);
    return axios.put(
      `https://route-posts.routemisr.com/posts/${id}`,
      updatedPost,
      {
        headers: { token: userToken },
      },
    );
  }

  const { mutate: updatePost, isPending } = useMutation({
    mutationFn: handleUpdatePost,
    onSuccess: (data) => {
      onClose();
      queryClientConfig.invalidateQueries({ queryKey });
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

  function handleImgClear() {
    setPreviewImg(null);
    imgInput.current.value = "";
  }

  function handleImgChange(e) {
    setPreviewImg(URL.createObjectURL(e.target.files[0]));
  }

  return (
    <>
      <Card>
        <MyCardHeader
          isPostCard={true}
          userInfo={user}
          date={createdAt}
          deleteCard={deletePost}
          updateCard={handleUpdatePost}
        />

        <Divider />

        <Link to={`/postDetails/${id}`}>
          <CardBody className="flex flex-col gap-2">
            <p>{body}</p>
            {image && (
              <img
                src={
                  image.includes(wrongPath)
                    ? `https://${image.split(wrongPath)[1]}`
                    : image
                }
                alt={body}
                onError={(e) => (e.target.src = imagePlaceholder)}
              />
            )}
          </CardBody>
        </Link>

        <Divider />

        <CardFooter className="flex justify-around">
          <div className="flex gap-2 items-center text-medium cursor-pointer">
            <BiLike />
            <span>Like</span>
          </div>
          <div className="flex gap-2 items-center text-medium cursor-pointer">
            <FaRegComment />
            <span>Comment</span>
          </div>
          <div className="flex gap-2 items-center text-medium cursor-pointer">
            <PiShareFat />
            <span>Share</span>
          </div>
        </CardFooter>

        <CommentCreation postId={id} queryKey={queryKey} />

        {!isPostDetailsPage && commentsCount > 1 && (
          <Link to={`/postDetails/${id}`} className="text-blue-400 text-center">
            view more comments...
          </Link>
        )}

        {!isPostDetailsPage && topComment && (
          <div className="p-3">
            <CommentCard comment={topComment} queryKey={queryKey} />
          </div>
        )}
      </Card>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Update Post
              </ModalHeader>
              <ModalBody>
                <Card className="py-4">
                  <CardHeader className="pb-3 pt-2 px-4 flex-col items-start">
                    <div className="flex items-center gap-3">
                      <Avatar
                        isBordered
                        radius="full"
                        size="sm"
                        src="https://i.pravatar.cc/150?u=a042581f4e29026704d"
                      />
                      <span>Ahmed</span>
                    </div>
                  </CardHeader>
                  <CardBody className="overflow-visible py-2 flex flex-col gap-3">
                    <textarea
                      onChange={(e) => setPostBody(e.target.value)}
                      value={postBody}
                      className="w-full bg-gray-100 border-gray-200 rounded-lg py-3 resize-none"
                      placeholder="Write something..."
                      type="text"
                    />

                    <div className="relative">
                      {previewImg && (
                        <img
                          alt="Card background"
                          className="object-cover rounded-lg w-full"
                          src={previewImg}
                        />
                      )}
                      <span
                        onClick={handleImgClear}
                        className="absolute top-2.5 right-2.5 z-10"
                      >
                        <RiCloseCircleLine
                          color="#fff"
                          size={20}
                          cursor={"pointer"}
                        />
                      </span>
                    </div>
                  </CardBody>
                </Card>
              </ModalBody>
              <ModalFooter className="items-center">
                <label>
                  <MdOutlineAddPhotoAlternate cursor={"pointer"} size={20} />
                  <input
                    ref={imgInput}
                    onInput={handleImgChange}
                    type="file"
                    hidden
                  />
                </label>
                <Button color="danger" variant="light" onPress={onClose}>
                  Cancel
                </Button>
                <Button disabled={isPending} color="primary" onPress={updatePost}>
                 {isPending ? (
                    <ThreeDots
                      visible={true}
                      height="30"
                      width="40"
                      color="#fff"
                      radius="9"
                      ariaLabel="three-dots-loading"
                      wrapperStyle={{}}
                      wrapperClass=""
                    />
                  ) : (
                    "Update Post"
                  )}
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
