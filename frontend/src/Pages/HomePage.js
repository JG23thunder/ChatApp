import React from  'react';
import axios from 'axios';
import { Container, Box, Text,  Tabs, TabList, TabPanels, Tab, TabPanel} from "@chakra-ui/react";
import {useState, useEffect} from "react";
import {useHistory} from "react-router";
import Login from "../components/Authentication/Login";
import Signup from "../components/Authentication/Signup";





const HomePage = () => {


const history = useHistory();
			

	useEffect(() => {
		
		const user = JSON.parse(localStorage.getItem("userInfo"));
			if(user)
			{
				history.push("/chats");
			}

	}, [history]);






	return <Container maxW='xl' centerContent>

				<Box d="flex" justifyContent="center" p={3} bg={"white"} w="100%" borderRadius="lg" borderWidth="1px">
					<Text fontSize="4xl" fontFamily="Work sans" color="black"> Chat Application</Text>

				</Box>

				<Box bg="white" w="100%" p={4} borderRadius="lg" borderWidth="1px" mt="2em"> 


							<Tabs variant='soft-rounded'>
								  <TabList mb="1em">
								    <Tab width="50%">Login </Tab>
								    <Tab width="50%" >Sign Up</Tab>
								  </TabList>
								  <TabPanels>
								    <TabPanel>
								      <Login/>
								    </TabPanel>
								    <TabPanel>
								      <Signup/>
								    </TabPanel>
								  </TabPanels>
							
							</Tabs>

				</Box>



	      </Container>;
};

export default HomePage;