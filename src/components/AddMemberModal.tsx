import type { Dispatch, SetStateAction } from 'react';
import { useState } from 'react';
import React from 'react'
import { trpc } from '../utils/trpc';
import { Button, Dialog, DialogBody, DialogFooter, DialogHeader, Input, Typography } from '@material-tailwind/react';

interface Props {
    showModal: boolean
    setShowModal: Dispatch<SetStateAction<boolean>>
    teamId: string | undefined | string[]
    getTeam: ReturnType<typeof trpc.team.getSpecificTeam.useQuery>
}

export default function AddMember({ getTeam, teamId, showModal, setShowModal }: Props) {
    const [memberEmail, setMemberEmail] = useState('')
    const addMember = trpc.team.addMember.useMutation()
    const modalHandler = () => {
        setShowModal(!showModal)
    }

    const handleSubmit = () => {
        addMember.mutate({
            teamId: teamId as string,
            newMemberEmail: memberEmail
        }, {
            onSuccess() {
                getTeam.refetch()
                setShowModal(!showModal)
            },
        })
        setMemberEmail('')
    }
    return (
        <Dialog open={showModal} handler={modalHandler} size='lg'>
            <DialogHeader className='flex'>
                <h2 className='text-2xl font-bold'>Add Member</h2>
            </DialogHeader>
            <DialogBody divider className='flex flex-col items-center justify-center'>

                <form className='rounded-lg space-y-2 flex flex-col p-2 text-center'>
                    <Input label='New Member Email' value={memberEmail} onChange={(e) => setMemberEmail(e.target.value)} />

                    <Button onClick={handleSubmit}>Add Member</Button>
                    {addMember.isLoading && <Typography>Adding Member...</Typography>}
                </form>

            </DialogBody>
            <DialogFooter className='flex justify-start items-center'>
                <Button color='red' onClick={modalHandler} ripple>
                    Close
                </Button>
            </DialogFooter>
        </Dialog >
    )
}
