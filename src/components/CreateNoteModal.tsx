import type { Dispatch, FC, SetStateAction } from 'react';
import { useState } from 'react';
import React from 'react'
import { trpc } from '../utils/trpc';
import { Button, Dialog, DialogBody, DialogFooter, DialogHeader, Input, Textarea } from '@material-tailwind/react';

interface CreateNoteProps {
    open: boolean
    setOpen: Dispatch<SetStateAction<boolean>>
    notes: ReturnType<typeof trpc.note.getItems.useQuery>
}

const CreateNote: FC<CreateNoteProps> = ({ open, setOpen, notes }) => {
    const [input, setInput] = useState('')
    const [body, setBody] = useState('')
    const item = trpc.note.addItem.useMutation()
    const openHandler = () => {
        setOpen(!open)
    }
    const handleAdd = () => {
        if (input === '') {
            alert('Please Enter A Valid Title')
            return
        }
        item.mutate({ text: input, body }, {
            onSuccess() {
                notes.refetch()
                setOpen(!open)
            },
        })
    }



    return (
        <Dialog open={open} handler={openHandler} size='lg' className='z-50 inset-0'>
            <DialogHeader className='flex justify-center items-center'>
                <h1 className='lg:text-4xl'>Add Note</h1>
            </DialogHeader>
            <DialogBody className='flex flex-col items-center justify-center space-y-2 lg:w-full'>
                <form action="" className='flex flex-col space-y-4 lg:text-4xl'>
                    <Input label='Title' className='text-white' value={input} onChange={e => setInput(e.target.value)} size='lg' />
                    <Textarea label='Body' onChange={(e) => setBody(e.target.value)} size='lg' />
                    <Button color="purple" size="md" ripple={true}
                        onClick={handleAdd}>Add</Button>
                </form>
                {item.isLoading ? (
                    <p>Adding...</p>
                ) : null}
            </DialogBody>
            <DialogFooter className='justify-start items-center'>
                <Button size='sm' variant='outlined' color='red' className='p-2' onClick={() => setOpen(false)}>Cancel</Button>
            </DialogFooter>
        </Dialog>
    )
}

export default CreateNote