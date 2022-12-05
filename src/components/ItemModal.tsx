import type { Dispatch, FC, SetStateAction } from 'react';
import { useState } from 'react';
import React from 'react'
import { trpc } from '../utils/trpc';
import type { Note } from '@prisma/client';
import type { Session } from 'next-auth';

interface ItemModalProps {
    open: Dispatch<SetStateAction<boolean>>
    setItems: Dispatch<SetStateAction<Note[]>>
    session: Session | null
}

const ItemModal: FC<ItemModalProps> = ({ open, setItems, session }) => {

    const [input, setInput] = useState('')
    const item = trpc.note.addItem.useMutation()

    const handleAdd = () => {
        if (input === '') {
            alert('Please Enter A Valid Title')
            open(false)
            return
        }
        item.mutate({ text: input }, {
            onSuccess(data) {
                setItems(prev => [...prev, data])
            },
        })
        open(false)
    }



    return (
        <div className='absolute inset-0 bg-black/50 flex items-center justify-center'>
            <div className="space-y-4 p-3 bg-gray-700 rounded-lg text-white">
                <h3 className='text-xl font-medium'>Name of Note</h3>
                <form action="" className='flex flex-col space-y-4'>
                    <input type="text" className='rounded-lg p-2 text-black' value={input} onChange={e => setInput(e.target.value)} />
                    <label htmlFor="body">Body</label>
                    <textarea name="" id='body' className='rounded-lg p-2 text-black' />
                    <button className='bg-violet-500 text-sm p-2 rounded-md text-white transition hover:bg-violet-600'
                        onClick={handleAdd}>Add</button>
                </form>
                <button className='bg-violet-500 text-sm p-2 rounded-md text-white transition hover:bg-violet-600' onClick={() => open(false)}>Cancel</button>
            </div>

        </div>
    )
}

export default ItemModal