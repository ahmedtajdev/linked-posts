import {
  Button,
  CardHeader,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Image,
} from "@heroui/react";
import { TfiMoreAlt } from "react-icons/tfi";
import userPlaceholder from "../../assets/images/userPlaceholder.jpg";
import { useContext, useState } from "react";
import { authContext } from "../../Context/authContext";
import { Link } from "react-router-dom";

export default function MyCardHeader({
  userInfo,
  date,
  isPostCard = false,
  deleteCard,
  updateCard,
}) {
  const [isFollowed, setIsFollowed] = useState(false);
  const { loggedInUserId } = useContext(authContext);
  const { photo, name, _id: cardOwnerId } = userInfo;
  const isCardMine = loggedInUserId === cardOwnerId;
  return (
    <>
      <CardHeader className="flex justify-between items-center">
        <div className="flex gap-3 items-center">
          <Link to={`/userProfile/${cardOwnerId}`} className="flex gap-2">
            <Image
              alt={name}
              height={40}
              radius="sm"
              src={photo}
              width={40}
              onError={(e) => {
                e.target.src = userPlaceholder;
              }}
            />
            <div className="flex flex-col">
              <p className="text-md">{name}</p>
              <p className="text-small text-default-500">
                {date.split("T")[0]}
              </p>
            </div>
          </Link>
          {isPostCard && (
            <Button
              className={
                isFollowed
                  ? "bg-transparent text-foreground border-default-200"
                  : ""
              }
              color="primary"
              radius="full"
              size="sm"
              variant={isFollowed ? "bordered" : "solid"}
              onPress={() => setIsFollowed(!isFollowed)}
            >
              {isFollowed ? "Unfollow" : "Follow"}
            </Button>
          )}
        </div>

        {!isPostCard && !isCardMine ? null : (
          <Dropdown>
            <DropdownTrigger>
              <TfiMoreAlt cursor={"pointer"} />
            </DropdownTrigger>
            <DropdownMenu aria-label="Static Actions">
              {isPostCard && (
                <DropdownItem key="bookmark">Add to Bookmarks</DropdownItem>
              )}
              {isCardMine && (
                <>
                  <DropdownItem onClick={updateCard} key="edit">
                    Edit
                  </DropdownItem>
                  <DropdownItem
                    onClick={deleteCard}
                    key="delete"
                    className="text-danger"
                    color="danger"
                  >
                    Delete
                  </DropdownItem>
                </>
              )}
            </DropdownMenu>
          </Dropdown>
        )}
      </CardHeader>
    </>
  );
}
