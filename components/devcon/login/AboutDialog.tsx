import React from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'

interface AboutDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AboutDialog({ open, onOpenChange }: AboutDialogProps) {
  const [dontShowAgain, setDontShowAgain] = React.useState(false)

  const handleClose = () => {
    if (dontShowAgain) {
      localStorage.setItem('hideAboutDialog', 'true')
    }
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-custom-purple max-w-[calc(100%-2rem)] sm:max-w-[500px] lg:max-w-[66%] rounded-lg">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-custom-lightGreen">Welcome to Social Stereo!</DialogTitle>
          <div className="text-white/80 pt-4">
            <div className="grid gap-4">
              <div className="bg-custom-purple/30 p-4 rounded-lg border border-custom-lightGreen/20">
                <h3 className="font-semibold text-custom-lightGreen mb-2">Quick Access 🔑</h3>
                <div className="text-sm">Connect instantly using your crypto wallet or email — your choice!</div>
              </div>
              
              <div className="bg-custom-purple/30 p-4 rounded-lg border border-custom-lightGreen/20">
                <h3 className="font-semibold text-custom-lightGreen mb-2">Verify Your Pass 🎟️</h3>
                <div className="text-sm">Link your DevCon ticket through Zupass to unlock voting power</div>
              </div>
              
              <div className="bg-custom-purple/30 p-4 rounded-lg border border-custom-lightGreen/20">
                <h3 className="font-semibold text-custom-lightGreen mb-2">Shape the Playlist 🎵</h3>
                <div className="text-sm">Use your 25 votes strategically to curate DevCon's soundtrack</div>
              </div>
            </div>
          </div>
        </DialogHeader>
        
        <div className="flex items-center space-x-2 pt-4">
          <Checkbox
            className='!bg-custom-white !text-custom-black font-bold'
            id="dontShow"
            checked={dontShowAgain}
            onCheckedChange={(checked) => setDontShowAgain(checked as boolean)}
          />
          <Label htmlFor="dontShow" className="text-white">Don't show this again</Label>
        </div>

        <DialogFooter className="mt-6">
          <Button
            onClick={handleClose}
            className="w-full bg-custom-lightGreen text-black hover:bg-custom-lightGreen/90 
              font-semibold py-2 px-8 rounded-full text-base md:text-lg"
          >
            Understood!
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}