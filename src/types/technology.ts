export type Technology = {
    id: string;
    name: string;
    version: string;
    category: string;
    color: string;
  };
  
  export type CreateTechnologyPayload = {
    name: string;
    version?: string;
    category: string;
    color?: string;
  };
  
  export type UpdateTechnologyPayload = Partial<{
    name: string;
    version: string | null;
    category: string;
    color: string | null;
  }>;
  
  export type TechnologyQuery = {
    page?: number;
    pageSize?: number;
    category?: string;
    search?: string;
    shape?: "array" | "map";
  };
  
  export type PaginatedResponse<T> = {
    data: T[];
    page: number;
    pageSize: number;
    total: number;
  };
  