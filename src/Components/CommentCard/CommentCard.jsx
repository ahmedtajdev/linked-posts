import { useContext, useRef, useState } from "react";
import MyCardHeader from "../MyCardHeader/MyCardHeader";
import {
  Modal,
  Card,
  CardBody,
  CardHeader,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
  Avatar,
  Button,
} from "@heroui/react";
import { authContext } from "../../Context/authContext";
import axios from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { ThreeDots } from "react-loader-spinner";

export default function CommentCard({ comment, queryKey }) {
  const { userToken } = useContext(authContext);
  const {
    commentCreator,
    content,
    createdAt,
    post: postId,
    _id: commentId,
  } = comment;
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const queryClientConfig = useQueryClient();
  const [commentValue, setCommentValue] = useState(content);
  // const commentInput = useRef(null);

  function handleDeleteComment() {
    return axios.delete(
      `https://route-posts.routemisr.com/posts/${postId}/comments/${commentId}`,
      {
        headers: { token: userToken },
      },
    );
  }

  const { mutate: deleteComment } = useMutation({
    mutationFn: handleDeleteComment,
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

  function handleUpdateComment() {
    onOpen();
    const updatedComment = new FormData();
    updatedComment.append("content", commentValue);
    return axios.put(
      `https://route-posts.routemisr.com/posts/${postId}/comments/${commentId}`,
      updatedComment,
      {
        headers: { token: userToken },
      },
    );
  }

  const { isPending, mutate: updateComment } = useMutation({
    mutationFn: handleUpdateComment,
    onSuccess: (data) => {
      queryClientConfig.invalidateQueries({ queryKey });
      toast.success(data.data.message, {
        position: "bottom-right",
      });
      onClose();
    },
    onError: () => {
      toast.error(`Error Occured, try again later!`, {
        position: "bottom-right",
      });
    },
  });

  return (
    <>
      <Card>
        <MyCardHeader
          userInfo={commentCreator}
          date={createdAt}
          deleteCard={deleteComment}
          updateCard={handleUpdateComment}
        />
        <p className="p-3 pt-0">{content}</p>
      </Card>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Update Comment
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
                      onInput={(e) => setCommentValue(e.target.value)}
                      value={commentValue}
                      className="w-full bg-gray-100 border-gray-200 rounded-lg py-3 resize-none"
                      placeholder=""
                      type="text"
                    />
                  </CardBody>
                </Card>
              </ModalBody>
              <ModalFooter className="items-center">
                <Button color="danger" variant="light" onPress={onClose}>
                  Cancel
                </Button>
                <Button
                  color="primary"
                  onPress={updateComment}
                  disabled={isPending}
                >
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
                    "Update Comment"
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
