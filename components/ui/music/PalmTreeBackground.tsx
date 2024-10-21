import React from 'react'
import Image from 'next/image'

function PalmTreeBackground({ children }: { children: React.ReactNode }) {
    return (
        <div className='relative min-h-screen bg-custom-purple'>
            <div className='absolute inset-0 h-screen pointer-events-none'>
                <Image src='/leaf-1.png' alt='palm-tree' width={250} height={250} className='absolute top-0 right-0' />
                <Image src='/leaf-2.png' alt='palm-tree' width={90} height={90} className='absolute bottom-0 left-0' />
                <Image src='/central-bg.png' alt='temple' width={400} height={400} className='absolute bottom-0 right-0' />
            </div>
            <div className='relative min-h-screen z-10'>
                {children}
            </div>
        </div>
    )
}

export default PalmTreeBackground