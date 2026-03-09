import {
  Card,
  Avatar,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Textarea,
  CardHeader,
  CardBody,
  Image,
} from "@heroui/react";
import { RiCloseCircleLine } from "react-icons/ri";
import { MdOutlineAddPhotoAlternate } from "react-icons/md";
import { useContext, useRef, useState } from "react";
import testImg from "./../../assets/images/image-placeholder.jpg";
import axios from "axios";
import { authContext } from "../../Context/authContext";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ThreeDots } from "react-loader-spinner";

export default function PostCreation() {
  const [previewImg, setPreviewImg] = useState("");
  const imgInput = useRef();
  const captionInput = useRef();
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const { userToken } = useContext(authContext);
  const queryClient = useQueryClient();

  const {
    isPending,
    mutate: createPost,
    data,
  } = useMutation({
    mutationFn: handleCreatePost,
    onSuccess: () => {
      handleImgClear();
      handleCaptionClear();
      onClose();
      invalidateAllPosts();
    },
  });

  function handleImgChange() {
    setPreviewImg(URL.createObjectURL(imgInput.current.files[0]));
  }

  function handleImgClear() {
    setPreviewImg(null);
    imgInput.current.value = "";
  }

  function handleCaptionClear() {
    captionInput.current.value = "";
  }

  function handleCreatePost() {
    const createdPost = new FormData();
    const postBody = captionInput.current.value;
    const postImg = imgInput.current.value;
    postBody && createdPost.append("body", postBody);
    postImg && createdPost.append("image", imgInput.current.files[0]);
    return axios.post(`https://route-posts.routemisr.com/posts`, createdPost, {
      headers: { token: userToken },
    });
  }

  function invalidateAllPosts() {
    queryClient.invalidateQueries({ queryKey: ["allPosts"] });
  }

  return (
    <>
      <Card className="p-3">
        <div className="flex items-center gap-3">
          <div>
            <Avatar
              isBordered
              radius="full"
              size="md"
              src="https://i.pravatar.cc/150?u=a042581f4e29026704d"
            />
          </div>
          <div
            onClick={onOpen}
            className="w-full text-gray-500 text-medium bg-gray-100 border-gray-200 rounded-lg py-2.5 px-4"
          >
            What's on your mind, Ahmed?
          </div>
        </div>
      </Card>

      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Create Post
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
                      ref={captionInput}
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
                    onChange={handleImgChange}
                    ref={imgInput}
                    type="file"
                    hidden
                  />
                </label>
                <Button color="danger" variant="light" onPress={onClose}>
                  Cancel
                </Button>
                <Button
                  color="primary"
                  onPress={createPost}
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
                    "Create"
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
