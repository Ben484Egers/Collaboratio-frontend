export type Task = {
    id?: number,
    name: string,
    project_id: number,
    user_id: number,
    assigned_by_id: number,
    description: string,
    deadline: string,
    completed: boolean,
    created_at?: string,
    updated_at?: string
}