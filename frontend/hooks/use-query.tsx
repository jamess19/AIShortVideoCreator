import { useState } from "react";


export const useQuery = (initial: any) =>{
    const [query, setQuery] = useState<any>(initial);

    const updateQuery = (newQuery: any) => {
        setQuery((prevQuery: any) => ({
            ...prevQuery,
            ...newQuery,
        }));
    };

    const resetQuery = () => {
        setQuery(initial);
    };


    return [query, updateQuery, resetQuery];
}