import { Button } from '@material-tailwind/react';
import type { GetServerSideProps } from 'next'
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router'
import type { FormEvent } from 'react';
import React, { useState } from 'react'
import AddMember from '../../components/AddMemberModal';
import DeleteMember from '../../components/DeleteMemberModal';
import { getServerAuthSession } from '../../server/common/get-server-auth-session'
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

export default function Team() {
    const { data: session } = useSession()
    const router = useRouter()
    const { teamId } = router.query
    const [addMember, setAddMember] = useState(false)
    const [deleteMember, setDeleteMember] = useState(false)
    const getTeam = trpc.team.getSpecificTeam.useQuery({ text: teamId as string })
    const isAdmin = trpc.team.checkAdmin.useQuery({ teamId: teamId as string })

    if (getTeam.error) {
        console.log(getTeam.error)
        return <div>Team does not exist</div>
    }


    const { data } = getTeam
    if (!data) return <>Loading...</>
    return (
        <div className='flex flex-col h-screen w-screen'>
            <div className='flex flex-col space-y-2 p-2 justify-center items-start'>
                {data?.members.map(v => (
                    <div key={v.user.email} className='flex space-x-2 w-auto bg-blue-500 p-2 rounded-lg text-white'>
                        <p>{v.user.name}</p>

                    </div>
                ))}
                <div className='flex space-x-2'>
                    <Button color='indigo' size='sm' onClick={() => setAddMember(true)}>
                        Add Member
                    </Button>
                    <Button color='red' size='sm' onClick={() => setDeleteMember(true)}>
                        Delete Member
                    </Button>
                    {addMember && isAdmin.data?.includes(String(session?.user?.id)) && <AddMember showModal={addMember} setShowModal={setAddMember} getTeam={getTeam} teamId={teamId} />}
                    {isAdmin.data?.includes(String(session?.user?.id)) && <DeleteMember data={data} setShowModal={setDeleteMember} showModal={deleteMember} getTeam={getTeam} teamId={teamId} />}

                    {data.creator?.userId === session?.user?.id &&
                        <Button color='amber' size='sm'>Delete Team</Button>}
                </div>
            </div>
        </div>
    )
}
