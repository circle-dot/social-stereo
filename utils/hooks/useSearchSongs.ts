import { useInfiniteQuery } from '@tanstack/react-query';

const fetchMusic = async ({ pageParam = 1, queryKey }: any) => {
    const [, sortOrder, searchQuery] = queryKey;
    const queryString = new URLSearchParams({ page: String(pageParam), limit: '20', sortOrder, searchQuery }).toString();
    const response = await fetch(`/api/musicRanking?${queryString}`);
    return response.json();
};

const useMusic = (sortOrder: 'asc' | 'desc', searchQuery: string) => {
    return useInfiniteQuery({
        queryKey: ['musicRanking', sortOrder, searchQuery],
        queryFn: fetchMusic,
        initialPageParam: 1,
        getNextPageParam: (lastPage) => {
            return lastPage.hasMore ? lastPage.nextPage : undefined;
        },
    });
};

export default useMusic;
