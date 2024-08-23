import { APIResponse } from "@/services/api/types";
import { User } from "../entitites";
import { AxiosResponse } from "axios";

export interface APIErrorResponse {
  error: string;
  message: string;
}

export interface APISuccessfulResponse<Data> {
  message: string;
  data: Data;
}

/** ******** =========== API Response types ========== ********** */
export namespace NextAPIResponse {
  export interface Pagination {
    hasNext: boolean;
    limit: number;
    page: number;
  }

  export interface PaginationCursor {
    limit: number;
    lastCursor: string;
  }

  export type GetUserProfile = AxiosResponse<APISuccessfulResponse<User>>;
  export type GetCollectionDetails = AxiosResponse<
    APISuccessfulResponse<APIResponse.CollectionDetails>
  >;
}
