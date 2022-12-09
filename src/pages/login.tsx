import type { GetServerSideProps } from 'next'
import { signIn, signOut, useSession } from 'next-auth/react'
import Link from 'next/link'
import React, { useState } from 'react'
import { getServerAuthSession } from '../server/common/get-server-auth-session'

export const getServerSideProps: GetServerSideProps = async (context) => {
    const session = await getServerAuthSession(context)
    if (!session) {
        return {
            redirect: {
                destination: '/login',
                permanent: false
            }
        }
    }

    return {
        props: {
            session
        }
    }

}

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
            <div className='flex flex-col p-2 w-auto space-y-4'>
                <button onClick={session ? () => handleSignOut() : () => handleSignIn()} className='p-2 bg-gray-600 rounded-lg text-white transition-all hover:bg-gray-700'>
                    {session ? loading ? 'Loading...' : 'Sign Out' : loading ? 'Loading...' : 'Sign In'}
                </button>
                {session ? (
                    <div className='flex flex-col space-y-2 justify-center items-center'>
                        <p>
                            Welcome! {session?.user?.name}
                        </p>
                        <Link href={'/'}>
                            <button className='p-2 bg-gray-600 rounded-lg text-white transition-all hover:bg-gray-700'>
                                Home
                            </button>
                        </Link>
                    </div >

                )
                    : null
                }

            </div>
        </div>
    )
}
