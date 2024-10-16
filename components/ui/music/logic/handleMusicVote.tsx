export const handleMusicVote = (trackId: string, isAuthenticated: boolean) => {
  if (!isAuthenticated) {
      console.log('Attempted to vote while not authenticated');
      return;
  }
  // Existing vote logic
  console.log('Voted for track with ID:', trackId);
};