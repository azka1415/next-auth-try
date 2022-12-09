import type { GetServerSideProps } from 'next';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import type { FormEvent } from 'react';
import React, { useState } from 'react'
import { getServerAuthSession } from '../../server/common/get-server-auth-session';
import { trpc } from '../../utils/trpc'

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


export default function MakeTeamPage() {
    const { data: session } = useSession()
    const [teamName, setTeamName] = useState('')
    const [teamDescription, setTeamDescription] = useState('')
    const createTeam = trpc.team.createTeam.useMutation()
    const router = useRouter()
    if (!session) return <>Loading...</>
    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (!session) return
        await createTeam.mutateAsync({ name: teamName, description: teamDescription }, {
            onSuccess(data) {
                console.log(data)
                router.push('/teams')
            },
        })

    }
    return (
        <div className='flex flex-col justify-center items-center h-screen'
        >
            <form className='flex flex-col space-y-4 m-1 justify-center items-center'
                onSubmit={handleSubmit}>
                <h1 className='text-4xl font-bold'>Make a Team</h1>
                <label htmlFor="team_name">Team Name</label>
                <input onChange={e => setTeamName(e.target.value)} className='bg-gray-400 rounded-lg p-1' type="text" name="team_name" id="team_name" />
                <label htmlFor="team_description">Team Description</label>
                <textarea onChange={e => setTeamDescription(e.target.value)} className='bg-gray-400 rounded-lg p-1' name="team_description" id="team_description" cols={30} rows={10} />
                <button className='bg-violet-500 text-sm p-2 rounded-md text-white transition hover:bg-violet-600'>Create Team</button>
            </form>

            <Link href={'/teams'}>
                <button className='text-violet-500'>Go Back</button>
            </Link>
        </div>
    )
}
