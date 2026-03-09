import axios from "axios";
import React, { useContext, useEffect } from "react";
import { authContext } from "../../Context/authContext";
import { useQuery } from "@tanstack/react-query";
import LoadingPage from "../LoadingPage/LoadingPage";
import {
	Avatar,
	Button,
	Card,
	CardBody,
	CardFooter,
	CardHeader,
} from "@heroui/react";
import MyPosts from "../MyPosts/MyPosts";
import { IoCamera } from "react-icons/io5";
import { useParams } from "react-router-dom";
import UserPosts from "../UserPosts/UserPosts";

export default function UserProfile() {
	const { userToken } = useContext(authContext);
	const {userId} = useParams();

	function getUserProfile() {
		return axios.get(`https://route-posts.routemisr.com/users/${userId}/profile`, {
			headers: { token: userToken },
		});
	}

	const { isLoading, isSuccess, isError, error, data } = useQuery({
		queryKey: ["getUserProfile", userId],
		queryFn: getUserProfile,
	});

	const myProfileData = data?.data.data.user;

	useEffect(() => {
		window.scrollTo(0, 0)
	}, [])
	return (
		<>
			{isLoading && <LoadingPage />}
			{isSuccess && (
				<div>
					<Card className="shadow-none py-3">
						<CardHeader className="justify-between">
							<div className="flex gap-5">
								<div className="relative w-25 h-25 lg:w-37.5 lg:h-37.5">
									<Avatar className="w-full h-full"
										isBordered
										radius="full"
										// size="lg"
										src={myProfileData.photo}
									/>
									<label className="text-white cursor-pointer">
										<span className="flex justify-center items-center rounded-full bg-gray-500 absolute bottom-0 -left-1 lg:left-2 w-7.5 h-7.5">

										<IoCamera size={25} />
										</span>
										<input
											type="file"
											hidden
										/>
									</label>
									
								</div>
								<div className="flex flex-col gap-1 items-start justify-center">
									<h4 className="text-4xl font-semibold leading-none text-default-600 mb-3">
										{myProfileData.name}
									</h4>
									<h5 className="text-medium tracking-tight text-default-400">
										{myProfileData.username}
									</h5>
								</div>
							</div>
						</CardHeader>
						<CardFooter className="gap-3">
							<div className="flex gap-1">
								<p className="font-semibold text-default-400 text-small">
									{myProfileData.followingCount}
								</p>
								<p className=" text-default-400 text-small">Following</p>
							</div>
							<div className="flex gap-1">
								<p className="font-semibold text-default-400 text-small">
									{myProfileData.followersCount}
								</p>
								<p className="text-default-400 text-small">Followers</p>
							</div>
						</CardFooter>
					</Card>
					<hr className="text-gray-300" />
					<UserPosts userId={userId} />
					<hr className="text-gray-300" />
				</div>
			)}
		</>
	);
}
