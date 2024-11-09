import React from 'react'
import Image from 'next/image'

function PalmTreeBackground({ children, bgOpacity = 1 }: { children: React.ReactNode, bgOpacity?: number }) {
    return (
        <div className='relative min-h-screen bg-custom-purple'>
            <div className='absolute inset-0 min-h-full pointer-events-none'>
                <Image src='/leaf-1.png' alt='palm-tree' width={250} height={250} className='absolute top-0 right-0' />
                <Image src='/leaf-2.png' alt='palm-tree' width={90} height={90} className='absolute bottom-0 left-0' />
                <Image src='/central-bg.png' alt='temple' width={400} height={400} className='absolute bottom-0 right-0' style={{ opacity: bgOpacity }} />
            </div>
            <div className='relative min-h-screen z-10'>
                {children}
            </div>
        </div>
    )
}

export default PalmTreeBackground