import { GetVideosApi } from "@/services/video_api";
import { useEffect, useState } from "react";

const entityToPathMap: Record<string, any> = {
    'video': GetVideosApi
};
export const useFetchList = (entity: string, query: any) => {
    const [data, setData] = useState<any[]>([]);
    const [totalPages, setTotalPages] = useState<number>(0);
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await entityToPathMap[entity](query);
                if (response.items) {
                    if(response.current_page_number === 1)
                        setData(response.items);
                    else
                        setData((prevData) => [...prevData, ...response.items]);

                    setTotalPages(response.total_pages || 0);
                } else {
                    console.error("Failed to fetch data");
                }
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };
        fetchData();
    }, [entity, query]);

    return {
        data,
        totalPages,
    };
}