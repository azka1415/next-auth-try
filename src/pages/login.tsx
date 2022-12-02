import { signIn, signOut, useSession } from 'next-auth/react'
import Link from 'next/link'
import React, { useState } from 'react'

export default function Login() {

    const { data: session } = useSession()
    const [loading, setLoading] = useState(false)


    const handleSignOut = () => {
        setLoading(true)
        signOut()

        if (!session) setLoading(false)
    }

    const handleSignIn = () => {
        setLoading(true)
        signIn("google")

        if (session) setLoading(false)
    }

    return (
        <div className='flex justify-center items-center m-auto h-screen'>
            <div className='flex flex-col p-2 w-auto'>
                <button onClick={session ? () => handleSignOut() : () => handleSignIn()} className='p-2 bg-gray-600 rounded-lg text-white transition-all hover:bg-gray-700'>
                    {session ? loading ? 'Loading...' : 'Sign Out' : loading ? 'Loading...' : 'Sign In'}
                </button>
                <p>
                    {session ? (
                        <>
                            <p>
                                Welcome! ${session?.user?.name}
                            </p>
                            <Link href={'/'}>
                                <button className='p-2 bg-gray-600 rounded-lg text-white transition-all hover:bg-gray-700'>
                                    Home
                                </button>
                            </Link>
                        </>

                    )
                        : null
                    }
                </p>
                { }

            </div>
        </div>
    )
}
