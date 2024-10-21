import React from 'react'
import Image from 'next/image'

function PalmTreeBackground() {
    return (
        <div className='absolute top-0 left-0 w-full h-full'>
            <Image src='/leaf-1.png' alt='palm-tree' width={250} height={250} className='absolute top-0 right-0' />
            <Image src='/leaf-2.png' alt='palm-tree' width={90} height={90} className='absolute bottom-0 left-0' />
            <Image src='/central-bg.png' alt='temple' width={400} height={400} className='absolute bottom-0 right-0' />
        </div>
    )
}

export default PalmTreeBackground
