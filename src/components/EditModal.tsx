import type { Dispatch, SetStateAction } from 'react';
import { useState } from 'react';
import React from 'react'
import { trpc } from '../utils/trpc';
import { useRouter } from 'next/router';

interface EditModalProps {
    open: Dispatch<SetStateAction<boolean>>
    noteId: string
    oldBody: string | null
}



export default function EditModal({ open, noteId, oldBody }: EditModalProps) {
    const router = useRouter()
    const [newName, setNewName] = useState('')
    const [newBody, setNewBody] = useState('')
    const item = trpc.note.editItem.useMutation()
    const handleEdit = () => {
        item.mutate({ text: noteId, newName, newBody })
        open(false)
        router.reload()
    }

    return (
        <div className='flex absolute inset-0 bg-black/50 items-center justify-center lg:items-center lg:justify-start p-2'>
            <div className="flex flex-col space-y-4 p-2 bg-gray-700 rounded-lg text-white">
                <h3 className='text-xl font-medium'>Edit Item</h3>
                <form className='flex flex-col items-center space-y-4 p-2 justify-center'>
                    <label htmlFor="item_name">Note Name</label>
                    <input type="text" className='rounded-lg p-2 text-black' name='item_name' id='item_name'
                        onChange={(e) => setNewName(e.target.value)} />
                    <label htmlFor="body">Body</label>
                    <textarea name="" id="body" className='rounded-lg p-2 text-black' onChange={(e) => setNewBody(e.target.value)} />
                    <button className='bg-violet-500 text-sm p-2 rounded-md text-white transition hover:bg-violet-600'
                        onClick={handleEdit}>Change</button>
                </form>
                <div className='flex items-center justify-between'>

                    <button className='bg-violet-500 text-sm p-2 rounded-md text-white transition hover:bg-violet-600'
                        onClick={() => open(false)}>Cancel</button>
                </div>
            </div>

        </div>
    )
}
