export interface TagResponse {
  id: string;
  name: string;
}

export interface TagsListResponse {
  tags: TagResponse[]
}

export interface TagCreateRequest {
  name: string
}