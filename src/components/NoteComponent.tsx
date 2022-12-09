import { Button, Card, CardBody, CardFooter, CardHeader, Checkbox, Typography } from '@material-tailwind/react'
import type { Note } from '@prisma/client'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import React from 'react'
import { trpc } from '../utils/trpc'

interface Props {
    item: Note
    notes: ReturnType<typeof trpc.note.getItems.useQuery>
}

export default function Note({ item, notes: notes }: Props) {
    const itemDelete = trpc.note.deleteItem.useMutation()
    const updateCheck = trpc.note.checkItem.useMutation()
    const { data: session } = useSession()

    const handleDelete = (id: string) => {
        itemDelete.mutate({ text: id }, {
            onSuccess() {
                notes.refetch()
            },
        })
    }

    const handleChecked = (id: string, check: boolean) => {
        updateCheck.mutate({ text: id, check }, {
            onSuccess() {
                notes.refetch()
            },
        })
    }
    return (
        <Card className='p-4 shadow-2xl'>

            <CardHeader color="blue" className="p-2 w-fit flex items-center justify-start space-x-2">
                {item.name}
                {item.checked === true ? (
                    <Checkbox checked={true} color='green' size={2} />
                ) : null}
            </CardHeader>

            <CardBody className="text-center bg-yellow-400 rounded-lg w-full h-full"  >
                {item.body}
            </CardBody>

            <CardFooter className="flex items-center justify-between space-x-2">
                <p>
                    {new Date(item.createdAt).toLocaleString()}
                </p>
                <p>
                    {session?.user?.id === item.userId ? (
                        <Typography className='opacity-60'>You</Typography>
                    ) : (
                        <Typography className='opacity-60'>{item.userId}</Typography>
                    )}
                </p>

                <div className='flex items-center justify-end space-x-2'>

                    {item.checked === false ?
                        (<Button onClick={() => handleChecked(item.id, true)} size='sm' color='green' className='p-2' >Check</Button>) :
                        (<Button onClick={() => handleChecked(item.id, false)} size='sm' color='green' className='p-2' >Uncheck</Button>)}
                    {updateCheck.isLoading ? (
                        <Typography color='green' className='relative'>Updating...</Typography>
                    ) : null}
                    <Button
                        onClick={() => handleDelete(item.id)}
                        size='sm'
                        color='red'
                        className='p-2'>Delete
                    </Button>
                    {itemDelete.isLoading ? (
                        <Typography color='red' className='relative'>Deleting...</Typography>
                    ) : null}


                </div>
            </CardFooter>

        </Card >
    )
}
