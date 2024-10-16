/* eslint-disable @typescript-eslint/no-explicit-any */

"use client"
import React, { useEffect, useId, useRef, useState } from 'react'
import Image from "next/image"
import { AnimatePresence, motion } from "framer-motion"
import { useOutsideClick } from '@/utils/hooks/use-outside-click'
import { CircleX } from 'lucide-react';
import { handleMusicVote } from './logic/handleMusicVote'
import { usePrivy } from '@privy-io/react-auth'
import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogFooter, DialogOverlay } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'

const mockTracks: any = {
    "tracks": [
        {
            "id": "7ouMYWpwJ422jRcDASZB7P",
            "name": "Knights of Cydonia",
            "rank": 1,
            "artists": [{ "name": "Muse" }],
            "album": {
                "name": "Black Holes and Revelations",
                "images": [
                    {
                        "url": "https://i.scdn.co/image/ab67616d0000b27328933b808bfb4cbbd0385400",
                        "height": 640,
                        "width": 640
                    }
                ]
            }
        },
        {
            "id": "4VqPOruhp5EdPBeR92t6lQ",
            "name": "Uprising",
            "rank": 2,
            "artists": [{ "name": "Muse" }],
            "album": {
                "name": "The Resistance",
                "images": [
                    {
                        "url": "https://i.scdn.co/image/ab67616d0000b273b6d4566db0d12894a1a3b7a2",
                        "height": 640,
                        "width": 640
                    }
                ]
            }
        },
        {
            "id": "2takcwOaAZWiXQijPHIx7B",
            "name": "Time is Running Out",
            "rank": 3,
            "artists": [{ "name": "Muse" }],
            "album": {
                "name": "Absolution",
                "images": [
                    {
                        "url": "https://i.scdn.co/image/ab67616d0000b2738cb690f962092fd44bbe2bf4",
                        "height": 640,
                        "width": 640
                    }
                ]
            }
        },
        {
            "id": "3WMj8moIAXJhHsyLaqIIHI",
            "name": "Starlight",
            "rank": 4,
            "artists": [{ "name": "Muse" }],
            "album": {
                "name": "Black Holes and Revelations",
                "images": [
                    {
                        "url": "https://i.scdn.co/image/ab67616d0000b27328933b808bfb4cbbd0385400",
                        "height": 640,
                        "width": 640
                    }
                ]
            }
        },
        {
            "id": "3skn2lauGk7Dx6bVIt5DVj",
            "name": "Supermassive Black Hole",
            "rank": 5,
            "artists": [{ "name": "Muse" }],
            "album": {
                "name": "Black Holes and Revelations",
                "images": [
                    {
                        "url": "https://i.scdn.co/image/ab67616d0000b27328933b808bfb4cbbd0385400",
                        "height": 640,
                        "width": 640
                    }
                ]
            }
        },
        {
            "id": "7xyYsOvq5Ec3P4fr6mM9fD",
            "name": "Hysteria",
            "rank": 6,
            "artists": [{ "name": "Muse" }],
            "album": {
                "name": "Absolution",
                "images": [
                    {
                        "url": "https://i.scdn.co/image/ab67616d0000b2738cb690f962092fd44bbe2bf4",
                        "height": 640,
                        "width": 640
                    }
                ]
            }
        },
        {
            "id": "0c4IEciLCDdXEhhKxj4ThA",
            "name": "Madness",
            "rank": 7,
            "artists": [{ "name": "Muse" }],
            "album": {
                "name": "The 2nd Law",
                "images": [
                    {
                        "url": "https://i.scdn.co/image/ab67616d0000b2738cb690f962092fd44bbe2bf4",
                        "height": 640,
                        "width": 640
                    }
                ]
            }
        },
        {
            "id": "4rPkN1FMzQyFNP9cLUGIIB",
            "name": "Resistance",
            "rank": 8,
            "artists": [{ "name": "Muse" }],
            "album": {
                "name": "The Resistance",
                "images": [
                    {
                        "url": "https://i.scdn.co/image/ab67616d0000b273b6d4566db0d12894a1a3b7a2",
                        "height": 640,
                        "width": 640
                    }
                ]
            }
        },
        {
            "id": "1Q8e1lf1uYV6HEZ911ZMbq",
            "name": "Plug In Baby",
            "rank": 9,
            "artists": [{ "name": "Muse" }],
            "album": {
                "name": "Origin of Symmetry",
                "images": [
                    {
                        "url": "https://i.scdn.co/image/ab67616d0000b2738cb690f962092fd44bbe2bf4",
                        "height": 640,
                        "width": 640
                    }
                ]
            }
        },
        {
            "id": "2UqGLVPYUxWkIzQatBKLJG",
            "name": "Psycho",
            "rank": 10,
            "artists": [{ "name": "Muse" }],
            "album": {
                "name": "Drones",
                "images": [
                    {
                        "url": "https://i.scdn.co/image/ab67616d0000b2738cb690f962092fd44bbe2bf4",
                        "height": 640,
                        "width": 640
                    }
                ]
            }
        },
        {
            "id": "383QXk8nb2YrARMUwDdjQS",
            "name": "Pressure",
            "rank": 11,
            "artists": [{ "name": "Muse" }],
            "album": {
                "name": "Simulation Theory",
                "images": [
                    {
                        "url": "https://i.scdn.co/image/ab67616d0000b2738cb690f962092fd44bbe2bf4",
                        "height": 640,
                        "width": 640
                    }
                ]
            }
        },
        {
            "id": "3lPr8ghNDBLc2uZovNyLs9",
            "name": "Supermassive Black Hole",
            "rank": 12,
            "artists": [{ "name": "Muse" }],
            "album": {
                "name": "Black Holes and Revelations",
                "images": [
                    {
                        "url": "https://i.scdn.co/image/ab67616d0000b27328933b808bfb4cbbd0385400",
                        "height": 640,
                        "width": 640
                    }
                ]
            }
        },
        {
            "id": "5YtypBTQCjbujLqDV8SZd3",
            "name": "Won't Stand Down",
            "rank": 13,
            "artists": [{ "name": "Muse" }],
            "album": {
                "name": "Will of the People",
                "images": [
                    {
                        "url": "https://i.scdn.co/image/ab67616d0000b27328933b808bfb4cbbd0385400",
                        "height": 640,
                        "width": 640
                    }
                ]
            }
        }
    ]
}

function MusicGrid({ tracks = mockTracks.tracks }: { tracks?: any[] }) {
    const { login, authenticated, ready } = usePrivy();
    const [active, setActive] = useState<any | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [authStatus, setAuthStatus] = useState(false);

    const ref = useRef<HTMLDivElement>(null);
    const id = useId();

    useEffect(() => {
        if (ready) {
          setAuthStatus(authenticated);
        }
      }, [ready, authenticated]);

    useEffect(() => {
        function onKeyDown(event: KeyboardEvent) {
            if (event.key === "Escape") {
                setActive(null);
            }
        }

        if (active) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "auto";
        }

        window.addEventListener("keydown", onKeyDown);
        return () => window.removeEventListener("keydown", onKeyDown);
    }, [active]);

    useOutsideClick(ref, () => {
        if (!isDialogOpen) {
            setActive(null);
        }
    });

    const handlePlayClick = (e: React.MouseEvent, track: any) => {
        e.stopPropagation();
        if (track !== active) {
            setActive(track);
        } else if (authStatus) {
            handleMusicVote(track.id, authStatus);
        } else {
            setIsDialogOpen(true);
        }
    };
    return (
        <>
            <AnimatePresence>
                {active && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/20 h-full w-full z-10"
                    />
                )}
            </AnimatePresence>
            <AnimatePresence>
                {active && (
                    <div className="fixed inset-0 grid place-items-center z-[100]">
                        <motion.button
                            key={`button-${active.id}-${id}`}
                            layout
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0, transition: { duration: 0.05 } }}
                            className="flex absolute top-2 right-2 lg:hidden items-center justify-center bg-white rounded-full h-6 w-6"
                            onClick={() => setActive(null)}
                        >
                            <CircleX />
                        </motion.button>
                        <motion.div
                            layoutId={`card-${active.id}-${id}`}
                            ref={ref}
                            className="w-full max-w-[500px] h-full md:h-fit md:max-h-[90%] flex flex-col bg-white dark:bg-neutral-900 sm:rounded-3xl overflow-hidden"
                        >
                            <motion.div layoutId={`image-${active.id}-${id}`}>
                                <Image
                                    priority
                                    width={200}
                                    height={200}
                                    src={active.album.images[0].url}
                                    alt={active.name}
                                    className="w-full h-80 lg:h-80 sm:rounded-tr-lg sm:rounded-tl-lg object-cover object-top"
                                />
                            </motion.div>

                            <div>
                                <div className="flex justify-between items-start p-4">
                                    <div>
                                        <motion.h3
                                            layoutId={`title-${active.id}-${id}`}
                                            className="font-bold text-neutral-700 dark:text-neutral-200"
                                        >
                                            {active.name}
                                        </motion.h3>
                                        <motion.p
                                            layoutId={`description-${active.id}-${id}`}
                                            className="text-neutral-600 dark:text-neutral-400"
                                        >
                                            {active.artists[0].name}
                                        </motion.p>
                                    </div>

                                    <motion.button
                                        onClick={(e) => handlePlayClick(e, active)}
                                        layoutId={`button-${active.id}-${id}`}
                                        className="px-4 py-3 text-sm rounded-full font-bold bg-green-500 text-white"
                                    >
                                        Vote
                                    </motion.button>
                                </div>
                                <div className="pt-4 relative px-4">
                                    <motion.div
                                        layout
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="text-neutral-600 text-xs md:text-sm lg:text-base h-40 md:h-fit pb-10 flex flex-col items-start gap-4 overflow-auto dark:text-neutral-400 [mask:linear-gradient(to_bottom,white,white,transparent)]"
                                    >
                                        <p>Album: {active.album.name}</p>
                                        {/* Add more details here if needed */}
                                    </motion.div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogOverlay className="fixed inset-0 bg-black/50 z-[100]" />
                <DialogContent className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-[110] bg-white dark:bg-neutral-800 p-6 rounded-lg shadow-xl" onPointerDownOutside={(e) => e.preventDefault()}>
                    <DialogTitle>Login Required</DialogTitle>
                    <DialogDescription>
                        You need to be logged in to vote for a track.
                    </DialogDescription>
                    <DialogFooter>
                        <Button onClick={() => { login(); setIsDialogOpen(false); }}>
                            Log In
                        </Button>
                        <Button variant="secondary" onClick={() => setIsDialogOpen(false)}>
                            Cancel
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
            <ul className="max-w-2xl mx-auto w-full gap-4">
                {tracks.map((track: any) => (
                    <motion.div
                        layoutId={`card-${track.id}-${id}`}
                        key={`card-${track.id}-${id}`}
                        onClick={() => setActive(track)}
                        className="p-4 flex flex-col md:flex-row justify-between items-center hover:bg-neutral-50 dark:hover:bg-neutral-800 rounded-xl cursor-pointer"
                    >
                        <div className="flex gap-4 flex-col md:flex-row items-center md:items-start">
                            {track.rank && (
                                <span className="text-lg font-bold text-neutral-500 dark:text-neutral-400 md:w-8 text-center">
                                    #{track.rank}
                                </span>
                            )}
                            <motion.div layoutId={`image-${track.id}-${id}`}>
                                <Image
                                    width={100}
                                    height={100}
                                    src={track.album.images[0].url}
                                    alt={track.name}
                                    className="h-40 w-40 md:h-14 md:w-14 rounded-lg object-cover object-top"
                                />
                            </motion.div>
                            <div>
                                <motion.h3
                                    layoutId={`title-${track.id}-${id}`}
                                    className="font-medium text-neutral-800 dark:text-neutral-200 text-center md:text-left"
                                >
                                    {track.name}
                                </motion.h3>
                                <motion.p
                                    layoutId={`description-${track.id}-${id}`}
                                    className="text-neutral-600 dark:text-neutral-400 text-center md:text-left"
                                >
                                    {track.artists[0].name}
                                </motion.p>
                            </div>
                        </div>
                        <motion.button
                            layoutId={`button-${track.id}-${id}`}
                            onClick={(e) => handlePlayClick(e, track)}
                            className="px-4 py-2 text-sm rounded-full font-bold bg-gray-100 hover:bg-green-500 hover:text-white text-black mt-4 md:mt-0"
                        >
                            Vote
                        </motion.button>
                    </motion.div>
                ))}
            </ul>
        </>
    );
}

export default MusicGrid;
