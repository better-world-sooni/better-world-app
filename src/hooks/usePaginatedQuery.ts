import { useState } from "react";
import { useInfiniteQuery, useQueryClient } from "react-query";
import { getKeyByApi, useApiSelector, useGetPromiseFnWithToken } from "src/redux/asyncReducer";

export default function usePaginatedQuery({pageableApiKeyFn, listKey,}) {
    const [page, setPage] = useState(0);
    const getPromiseFnWithToken = useGetPromiseFnWithToken();
    const {data: feedRes} = useApiSelector(pageableApiKeyFn());
    const queryClient = useQueryClient();
    const fetchFn = async ({pageParam = 0}) => {
        const res = await getPromiseFnWithToken({
            url: pageableApiKeyFn(pageParam + 1).url,
        });
        setPage(pageParam + 1);
        return res.data?.[listKey];
    };
    const {
        isLoading,
        isError,
        error,
        data,
        isFetchingNextPage,
        hasNextPage,
        fetchNextPage,
        refetch,
      } = useInfiniteQuery(getKeyByApi(pageableApiKeyFn()), fetchFn, {
          staleTime: 30 * 1000,
          initialData: {pages: [feedRes?.[listKey]], pageParams: [1]},
        getNextPageParam: (lastPage, pages) =>
          lastPage.length > 0 ? page : undefined,
      });
    const handleRefresh = () => {
        if (isLoading) return;
        queryClient.invalidateQueries(getKeyByApi(pageableApiKeyFn()));
        refetch({refetchPage: (page, index) => index === 0});
        setPage(1);
      };
    const handleLoadMore = () => {
        if (isFetchingNextPage || !hasNextPage) return;
        fetchNextPage();
    };
    return {
        isLoading,
        isError,
        error,
        data,
        isFetchingNextPage,
        hasNextPage,
        handleRefresh,
        handleLoadMore
    }
}