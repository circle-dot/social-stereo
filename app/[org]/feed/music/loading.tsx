import Image from 'next/image';

export default function Loading() {
  return (
    <div className="fixed inset-0 flex justify-center items-center bg-[#3E1F48] z-50">
      <Image
        src="/stamps/goldcurator.png"
        alt="Loading"
        width={200}
        height={200}
        className="animate-pulse rounded-full"
      />
    </div>
  );
}