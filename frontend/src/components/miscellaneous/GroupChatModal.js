import React, {useState} from "react";

import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,useToast,Input  
} from '@chakra-ui/react';
import {FormControl} from "@chakra-ui/form-control";
import {useDisclosure} from "@chakra-ui/hooks";
import {Button} from "@chakra-ui/button";
import {Box} from "@chakra-ui/react";

import {ChatState} from "../../Context/ChatProvider";
import UserListItem from "../UserAvatar/UserListItem";
import UserBadgeItem from "../UserAvatar/UserBadgeItem";


import axios from "axios";

const GroupChatModal = ({children}) => {

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [groupChatName, setGroupChatName] = useState();
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);

 const toast = useToast();


const {user, chats, setChats} = ChatState();

const handleSearch = async(query) => {
	setSearch(query);
	if(!query)
	{
		return;
	}

	try{
			setLoading(true);

			const config = {
				headers:{
					Authorization: `Bearer ${user.token}`,
				},
			};

			const {data} = await axios.get(`/api/user/?search=${search}`, config);
			/*console.log(data);*/
			setLoading(false);
			setSearchResult(data);
	}catch(error)
	{
		toast({
			title: "Error Occured",
			description:"Failed to load the search results",
			status:"error",
			duration:5000,
			isClosable:true,
			position:"bottom-left",
		});
	}


};

const handleSubmit = async() => {

	if(!groupChatName || !selectedUsers)
	{
		toast({
			title:"Please fill all the fields",
			status: "warning",
			duration:5000,
			isClosable:true,
			position:"top",
		});
		return;
	}

		try{
		const config = {
				headers:{
					Authorization: `Bearer ${user.token}`,
				},
			};

			const {data} = await axios.post("/api/chat/group", {
					name:groupChatName,
					users:JSON.stringify(selectedUsers.map((u) => u._id)),
			}, config);


			setChats([data, ...chats]);
			onClose();

			toast({
			title:"New Group Chat created",
			status: "Success",
			duration:5000,
			isClosable:true,
			position:"bottom",
		});


		}catch(error)
		{
			toast({
			title:"Failed to create Group Chat",
			status: "error",
			duration:5000,
			isClosable:true,
			position:"bottom",
		});

		}


};

 

const handleDelete = (deletedUser) => {
	setSelectedUsers(selectedUsers.filter((sel) => sel._id !==deletedUser._id));
};

const handleGroup = (userToAdd) => {

	if(selectedUsers.includes(userToAdd))
	{
		toast({
			title:"User already added",
			status:"warning",
			duration:5000,
			isClosable:true,
			position:"top",
		});
		return;
	}

	setSelectedUsers([...selectedUsers,userToAdd]);

};

  return (
    <>
    	<span onClick={onOpen}>{children}</span>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader fontSize="35px" fontFamily="Work sans" d="flex" justifyContent="center">Create Group Chat</ModalHeader>
          <ModalCloseButton />
         
          <ModalBody d="flex" flexDir="column" alignItems="center">
            	
          	<FormControl>
          		<Input placeholder="Chat Name" mb={3} onChange={(e) =>setGroupChatName(e.target.value)}/>

          	</FormControl>


          	<FormControl>
          		<Input placeholder="Add User" mb={1} onChange={(e) =>handleSearch(e.target.value)}/>

          	</FormControl>

          	<Box w="100%" d="flex" flexWrap="wrap">

          	{selectedUsers.map(u => ( 

          		<UserBadgeItem key={user._id} user={u} handleFunction={()=>handleDelete(u)}/>

          		))}

          		</Box>


          	{loading?<div>loading</div>: (

          			searchResult?.slice(0,4).map(user=>(
          				<UserListItem key={user._id} user={user}
          				 handleFunction	={() => handleGroup(user)}/>
 
          				))

          		)}

          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handleSubmit}>
              Create Group Chat
            </Button>
            
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );

};

export default GroupChatModal;
