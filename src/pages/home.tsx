import type { GetServerSideProps } from 'next'
import { useSession } from 'next-auth/react'
import React from 'react'
import Note from '../components/NoteComponent'
import { getServerAuthSession } from '../server/common/get-server-auth-session'

export default function Home() {
    const { data: session } = useSession()
    return (
        <div className='flex m-auto justify-center items-center h-screen'>
            <div className='text-xl p-2 font-bold'>
                Welcome! {session?.user?.name}
            </div>

        </div>
    )
}

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