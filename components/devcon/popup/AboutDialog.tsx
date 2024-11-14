import React from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { User as UserIcon, Headphones as HeadphonesIcon, Check as CheckIcon } from 'lucide-react'
import { Switch } from '@/components/ui/switch'
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
      <DialogContent className="bg-custom-purple max-w-[380px] rounded-[32px] px-6 py-8 text-center">
        <DialogHeader className="space-y-8">
          <DialogTitle className="text-3xl font-bold text-white">
            Welcome to<br />Social Stereo!
          </DialogTitle>

          <div className="space-y-8">
            <div>
              <div className="bg-custom-lightGreen w-10 h-10 rounded-full mx-auto mb-3">
                <UserIcon className="w-full h-full p-2.5 text-custom-purple" />
              </div>
              <h3 className="text-xl font-bold text-white mb-1">Quick Access</h3>
              <div className="text-white/80 text-base">
                Connect instantly using your crypto wallet or email — your choice!
              </div>
            </div>
            
            <div>
              <div className="bg-custom-lightGreen w-10 h-10 rounded-full mx-auto mb-3 flex items-center justify-center">
                <div className="bg-custom-lightGreen w-7 h-7 rounded-lg flex items-center justify-center">
                  <CheckIcon className="w-4 h-4 text-custom-purple" />
                </div>
              </div>
              <h3 className="text-xl font-bold text-white mb-1">Verify Your Pass</h3>
              <div className="text-white/80 text-base">
                Link your DevCon ticket through Zupass to unlock voting power
              </div>
            </div>
            
            <div>
              <div className="bg-custom-lightGreen w-10 h-10 rounded-full mx-auto mb-3">
                <HeadphonesIcon className="w-full h-full p-2.5 text-custom-purple" />
              </div>
              <h3 className="text-xl font-bold text-white mb-1">Shape the Playlist</h3>
              <div className="text-white/80 text-base">
                Use your 25 votes strategically to curate DevCon&apos;s soundtrack
              </div>
            </div>
          </div>
        </DialogHeader>
        
        <div className="flex items-center justify-between mt-8 mb-6">
          <span className="text-white text-base">Don&apos;t show this again</span>
          <Switch
            checked={dontShowAgain}
            onCheckedChange={(checked) => setDontShowAgain(checked)}
            className="bg-custom-darkPurple data-[state=checked]:bg-custom-lightGreen"
          />
        </div>

        <Button
          onClick={handleClose}
          className="w-full bg-custom-lightGreen text-custom-purple hover:bg-custom-lightGreen/90 
            font-bold py-3 px-6 rounded-full text-lg"
        >
          Understood
        </Button>
      </DialogContent>
    </Dialog>
  )
}