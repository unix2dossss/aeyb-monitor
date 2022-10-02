export interface PaginationQuery {
    limit?: string;
    page?: string;
}
export interface MeetingFilterQuery extends PaginationQuery {
    before?: string;
    after?: string;
    passed?: string;
    time?: string;
    creator?: string;
    location?: string;
    name?: string;
    type?: string;
}
