"use client";

import { useEffect, useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ArrowLeft, Search, UserPlus, UserCheck } from "lucide-react"
import Link from "next/link"
import axios from "axios"

const getAllUserUrl = "http://localhost:4000/api/user/getallusers"
const getUserChatsUrl = "http://localhost:4000/api/chat/getuserchats";
const connectUsers = "http://localhost:4000/api/chat/createchat";


export default function UserConnectionPage() {

//   const [connectedUsers, setConnectedUsers] = useState([])
  const [searchQuery, setSearchQuery] = useState("")
  const [users, setUsers] = useState([])
  const [currentUsername, setCurrentUsername] = useState("");
  const [currentUserId, setCurrentUserId] = useState("");

  async function getAllUsers(){
    try {
        await axios.get(getAllUserUrl)
        .then((res) => {
            // console.log(res.data);
            const allUsers = res.data.allUsers;
            // let formatedUsers = {};
            // console.log(allUsers)
            const x = allUsers.map((user) => {
              let isConnected;
              if(user.connectedUsers.includes(currentUserId)){
                isConnected = true;
              }else{
                isConnected = false;
              }
              const newUserObj = {...user, isConnected:isConnected}
              // formatedUsers = [...formatedUsers, newUserObj];
              // setUsers(formatedUsers);
              // console.log(users)
              // console.log(formatedUsers)
              return newUserObj;
            })
            console.log(x);
            setUsers(x);
        })
        .catch((err) => {
            console.log(err)
        })
    } catch (error) {
        console.error(error)
    }
  }

  const handleConnect = async (username) => {
    setUsers(users.map(user => 
      user.username === username ? ({ ...user, isConnected: !user.isConnected }) : (user)
    ))
    try {
        await axios.post(connectUsers , {username1:currentUsername, username2:username})
        .then((res) => {
            console.log(res.data)
        })
        .catch((err) => {
            console.log(err)
        })
    } catch (error) {
        console.log(error)
    }
  }

  const filteredUsers = users?.filter(user => 
    user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.username.toLowerCase().includes(searchQuery.toLowerCase())
  )

  useEffect(() => {
    if(typeof window !== "undefined"){
        setCurrentUsername(localStorage.getItem("username"));
        setCurrentUserId(localStorage.getItem("userId"));
    }
    // console.log()
    // const username = "one";
    console.log(currentUsername, currentUserId)
    // console.log()
    getAllUsers();
    // console.log(users)
  },[currentUsername])

  if(!users){
    return (
        <></>
    )
  }

  return (
    <div className="min-h-screen bg-indigo-900 text-white">
      <header className="bg-indigo-800 p-4 flex items-center">
        <Link href="/home" className="mr-4">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-6 w-6" />
          </Button>
        </Link>
        <h1 className="text-xl font-bold">Connect with Users</h1>
      </header>

      <main className="container mx-auto px-4 py-6">
        <div className="mb-6 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input
            className="pl-10 bg-indigo-800 text-white placeholder-indigo-300 border-indigo-700"
            placeholder="Search users"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <ScrollArea className="h-[calc(100vh-200px)]">
          <div className="space-y-4">
            {filteredUsers?.map((user) => (
              <Card key={user._id} className="bg-indigo-800">
                <CardContent className="p-4 flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <Avatar>
                      <AvatarImage src={user?.avatar} alt={user?.username} />
                      <AvatarFallback>{user?.username[0]?.toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h2 className="font-semibold">{user?.username}</h2>
                      <p className="text-sm text-indigo-300">{user?.username}</p>
                    </div>
                  </div>
                  <Button
                    variant={user?.isConnected ? "secondary" : "default"}
                    disabled={user?.isConnected ? true : false}
                    size="sm"
                    onClick={() => handleConnect(user?.username)}
                    className={user?.isConnected ? "bg-green-500 hover:bg-green-600" : "bg-indigo-600 hover:bg-indigo-700"}
                  >
                    {user?.isConnected ? (
                      <>
                        <UserCheck className="mr-2 h-4 w-4" />
                        Connected
                      </>
                    ) : (
                      <>
                        <UserPlus className="mr-2 h-4 w-4" />
                        Connect
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </ScrollArea>
      </main>
    </div>
  )
}