import React from 'react';
import { createAvatar } from '@dicebear/core';
import { thumbs } from '@dicebear/collection';
import { Avatar, AvatarImage, AvatarFallback } from './avatar';
import { Share2 } from 'lucide-react';
export default function ProfileAvatar(wallet: string, className?: string): React.ReactElement {
    const seed = wallet ? wallet.toLowerCase() : 'default';
    const avatarSvg = createAvatar(thumbs, {
        seed: seed,
        size: 100,
        radius: 50,
    }).toString();
    return (

     <div className="flex items-center justify-center gap-x-4 flex-row">
     <Avatar className="w-10 h-10 cursor-pointer hover:opacity-80 transition-opacity flex items-center justify-center bg-custom-darkGreen text-custom-lightGreen">
     <Share2 />
     </Avatar>
        <Avatar className={`cursor-pointer hover:opacity-80 transition-opacity ${className}`}>
            <AvatarImage src={`data:image/svg+xml;utf8,${encodeURIComponent(avatarSvg)}`} alt={`Avatar for ${wallet}`} />
            <AvatarFallback>{wallet.slice(0, 2).toUpperCase()}</AvatarFallback>
        </Avatar>
     </div>
    );
}