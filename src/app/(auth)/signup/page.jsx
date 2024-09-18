"use client";

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { useRouter } from "next/navigation";
import axios from "axios";

const registerUserUrl = "http://localhost:4000/api/user/register"

export default function SignupPage() {

    const router  = useRouter();

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e ) => {
    e.preventDefault()
    setError("");
    if (!name || !email || !password ) {
      setError("All filds are required!");
      return; 
    }

    try {
      await axios.post(registerUserUrl , {
        username: name,
        email: email,
        password: password,       
      })
      .then((res) => {
        console.log(res.data.username);
        if(typeof window !== undefined){
          localStorage.setItem("username" , res.data.username)
          localStorage.setItem("userId" , res.data.userId)
        }
        router.push('/message1')
      })
      .catch((err) => {
        console.log(err);
      //   setError(err.response.data.msg);
      })

    } catch (error) {
      console.error(error);
      // setError(error.message);
    }
    // console.log("Signup attempt with:", { name, email, password })
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-indigo-900 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Create an account</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Full Name
                </label>
                <Input
                  id="name"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Email
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Password
                </label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <Button className="w-full bg-indigo-600 text-white hover:bg-indigo-700" type="submit">
                Create Account
              </Button>
            </div>
          </form>
        </CardContent>
        <CardFooter>
          <p className="text-sm text-center w-full">
            Already have an account?{" "}
            <Link href="/login" className="text-indigo-600 hover:underline">
              Sign in
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}