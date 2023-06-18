export interface ILoginParams {
    client_id: string,
    client_secret: string
}

export interface IAuthResponse {
    main_token: string,
    refresh_token: string
}

export interface IRefreshParams {
    refresh_token: string
}