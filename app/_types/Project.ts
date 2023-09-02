export type Project = {
    id?: number,
    name: string,
    user_id: number,
    description: string,
    deadline: string,
    completed: boolean | number,
    created_at?: string,
    updated_at?: string
}