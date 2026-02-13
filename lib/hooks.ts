import useSWR from 'swr';
import { getConfessionsAction } from '@/app/actions/confessions';
import { getCommentsAction } from '@/app/actions/comments';
import { Confession, Comment } from '@/types';

// SWR keys
export const KEYS = {
    CONFESSIONS: 'confessions',
    COMMENTS: 'comments',
};

// Fetchers (wrapping server actions)
const confessionsFetcher = async () => {
    return await getConfessionsAction();
};

const commentsFetcher = async () => {
    return await getCommentsAction();
};

export function useConfessions() {
    const { data, error, mutate } = useSWR<Confession[]>(KEYS.CONFESSIONS, confessionsFetcher, {
        refreshInterval: 10000, // Poll every 10s (smart polling)
        revalidateOnFocus: true,
        revalidateOnReconnect: true,
        dedupingInterval: 5000,
    });

    return {
        confessions: data || [],
        isLoading: !error && !data,
        isError: error,
        mutate,
    };
}

export function useComments() {
    const { data, error, mutate } = useSWR<Comment[]>(KEYS.COMMENTS, commentsFetcher, {
        refreshInterval: 10000, // Poll every 10s
        revalidateOnFocus: true,
        revalidateOnReconnect: true,
        dedupingInterval: 5000,
    });

    return {
        comments: data || [],
        isLoading: !error && !data,
        isError: error,
        mutate,
    };
}
