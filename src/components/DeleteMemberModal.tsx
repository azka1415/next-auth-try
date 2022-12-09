import { Button, Dialog, DialogBody, DialogFooter, DialogHeader, Option, Select } from '@material-tailwind/react'
import type { Dispatch, FormEvent, MouseEventHandler, SetStateAction } from 'react';
import { useState } from 'react';
import React from 'react'
import { trpc } from '../utils/trpc';
import type { Role } from '@prisma/client';

interface Props {
    showModal: boolean
    setShowModal: Dispatch<SetStateAction<boolean>>
    getTeam: ReturnType<typeof trpc.team.getSpecificTeam.useQuery>
    teamId: string | undefined | string[]
    data: {
        members: {
            user: {
                id: string;
                name: string | null;
                email: string;
            };
            role: Role;
        }[];
        id: string;
        name: string;
        description: string | null;
    }
}

export default function DeleteMember({ getTeam, teamId, showModal, setShowModal, data }: Props) {
    const memberDelete = trpc.team.deleteMember.useMutation()
    const [deleteMember, setDeleteMember] = useState('')
    const modalHandler = () => {
        setShowModal(!showModal)
    }

    const handleDelete = () => {
        memberDelete.mutate({
            teamId: teamId as string,
            deletedUserEmail: deleteMember
        }, {
            onSuccess() {
                getTeam.refetch()
                setShowModal(!showModal)
            },
        })
        setDeleteMember('')
    }

    console.log(deleteMember)


    return (
        <Dialog open={showModal} handler={modalHandler} size='xl' className='overflow-auto mb-20'>
            <DialogHeader>
                <h2 className='text-2xl font-bold'>Delete Member</h2>
            </DialogHeader>
            <DialogBody className='flex'>

                {/* <form onSubmit={handleDelete} className='flex flex-col rounded-lg space-y-2 p-2 justify-center items-center'>
                    <input className='bg-gray-500 rounded-lg p-1' type="text" value={deleteMember} onChange={(e) => setDeleteMember(e.target.value)} />
                    <Button color='red'>Delete Member</Button>
                    {memberDelete.isLoading && <p>Deleting Member...</p>}
                </form> */}

                <Select label='Select Member' size='lg' className='flex overflow-auto'>
                    {data?.members.map(member => (
                        <Option key={member.user.id} onClick={(e) => setDeleteMember(member.user.email)}>
                            {member.user.name} ({member.user.email})
                        </Option>
                    ))}
                </Select>
            </DialogBody>
            <DialogFooter className='flex justify-start items-center space-x-2'>

                <Button color='red' onClick={modalHandler} ripple>
                    Close
                </Button>
                <Button color='red' onClick={() => handleDelete()} ripple>
                    Delete
                </Button>
                {memberDelete.isLoading && <p>Deleting Member...</p>}
            </DialogFooter>

        </Dialog>
    )
}
