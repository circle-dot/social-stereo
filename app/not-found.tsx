import Link from 'next/link'
 
export default function NotFound() {
  return (
    <div className="min-h-screen bg-custom-purple flex items-center justify-center p-4">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4">Community Not Found</h2>
        <p>The community you&apos;re looking for doesn&apos;t exist.</p>
        <Link 
          href="/" 
          className="text-custom-lightGreen hover:underline"
        >
          Return Home
        </Link>
      </div>
    </div>
  )
}