export interface ListingResponse<type>
 {
    results: number;
    metadata: MetaData;
    data: type[];
}



interface MetaData {
    currentPage: number;
    numberOfPages: number;
    limit: number;
}

