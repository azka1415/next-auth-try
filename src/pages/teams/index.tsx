import { Button } from '@material-tailwind/react'
import type { GetServerSideProps } from 'next'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import React from 'react'
import { getServerAuthSession } from '../../server/common/get-server-auth-session'
import { trpc } from '../../utils/trpc'




export default function TeamPage() {
    const { data: session } = useSession()
    const getTeam = trpc.team.getTeams.useQuery()
    const { data } = getTeam
    if (!data) return <>Loading...</>
    console.log(data)
    return (
        <div className='flex flex-col h-screen w-screen lg:grid lg:grid-cols-4'>
            {data.teams.length === 0 && <p>You are not in any teams</p>}
            <div className='flex p-2 text-blue-500 font-bold justify-start items-center'>
                <h1 className='p-2 rounded-lg text-4xl '>Teams</h1>
                <Link href='/'>
                    <Button variant='filled' size='sm'>
                        Home
                    </Button>
                </Link>

            </div>
            <div className='grid grid-cols-4 space-y-2 p-2'>

                {data.teams.map((v) => (
                    <Link key={v.id} href={`/teams/${v.id}`}>
                        <Button className='text-2xl' >
                            <p>{v.name}</p>
                        </Button>
                    </Link>
                ))}
            </div>
        </div>
    )
}
