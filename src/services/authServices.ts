import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import jwt from 'jsonwebtoken'
import Joi from 'joi'
import {IAuthResponse, ILoginParams, IRefreshParams} from "../types/auth";
import authValidators from "../validators/authValidators";

export let authToken: string;
export let refreshToken: string;

async function fetch<T>(path: string, options: AxiosRequestConfig, validator: Joi.ObjectSchema<any>): Promise<T> {
    try {
      const token = await authServices.getToken();
      options.headers = { Authorization: `Bearer ${token}` };

      return await authServices.callApiAuth<T>(path, options, validator);
    } catch (error: any) {
      if (error.response && error.response.status === 401) {
        const token = await authServices.getToken();
        options.headers = { Authorization: `Bearer ${token}` };
        return await authServices.callApiAuth<T>(path, options, validator);
      }
      throw error;
    }
}

async function callApiAuth<T>(path: string, options: AxiosRequestConfig, validator: Joi.ObjectSchema<any>) {
    try {
      const response: AxiosResponse<T> = await axios(path, options);
      const validationResult = validator.validate(response.data);

      if (validationResult.error) {
        throw validationResult.error;
      }
      return validationResult.value;
    } catch (error: any) {
        throw error;
    }
}

async function getToken(): Promise<string> {
    if (authToken != undefined) {
      if (!authServices.validateToken(authToken)) {
        return await authServices.refresh();
      }
      return authToken;
    } else {
      return await authServices.login();
    }
}

async function login(): Promise<string> {
    try {
        const loginParams: ILoginParams = {
          client_id: 'your_username',
          client_secret: 'your_password'
        };

        const value = await authServices.callApiAuth<IAuthResponse>('https://localhost:8080/baseUrl/login', { method: 'GET', data: JSON.stringify(loginParams)}, authValidators);
        authToken = value.main_token;
        refreshToken = value.refresh_token;
        return authToken;
    } catch (error: any) {
      throw error;
    }
}

async function refresh(): Promise<string> {
    try {
      if (refreshToken != undefined) {
        const refreshParams: IRefreshParams = {
          refresh_token: refreshToken,
        };
        
        const value = await authServices.callApiAuth<IAuthResponse>('https://localhost:8080/baseUrl/refresh', { method: 'GET', data: JSON.stringify(refreshParams)}, authValidators);
        authToken = value.main_token;
        refreshToken = value.refresh_token;
        return authToken;
      }
      throw "Error: refresh token is undefined";
    } catch (error: any) {
      throw error;
    }
}

function validateToken (token: string) {
    const header = jwt.decode(token)
    const now = Math.floor(Date.now() / 1000)
    return header && header.exp > now
 }

const authServices = {fetch, validateToken, login, getToken, refresh, callApiAuth}
export { authServices };