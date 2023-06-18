
import {authServices} from '../services/authServices';
import {IAuthResponse} from "../types/auth";
import helloWorldValidators from "../validators/helloWorldValidators";

afterEach(() => {
    jest.clearAllMocks();
  });
  
describe('Fetch', () => {
    it('Fetch Sucess', async () => {
        const mockResponse = {
            message: 'Hello World !',
          };

        authServices.getToken = jest.fn().mockResolvedValueOnce("main_token");
        authServices.callApiAuth = jest.fn().mockResolvedValueOnce(mockResponse);
        const result = await authServices.fetch<string>('path', {method: 'POST', data: JSON.stringify({ message: 'Hello' })}, helloWorldValidators);
        expect(result).toEqual({ message: 'Hello World !' });
    });

    it('Fetch refrehs token', async () => {
        const mockError = {
            response: {
              status: 401,
            },
          };

        authServices.callApiAuth = jest.fn().mockRejectedValueOnce(mockError);

        const mockResponse = {
            message: 'Hello World !',
          };

        authServices.callApiAuth = jest.fn().mockResolvedValueOnce(mockResponse);
        authServices.getToken = jest.fn().mockResolvedValueOnce("main_token");

        const result = await authServices.fetch<string>('path', {method: 'POST', data: JSON.stringify({ message: 'Hello' })}, helloWorldValidators);
        expect(result).toEqual({ message: 'Hello World !' });
    });

    it('All answers are Unauthorized', async () => {
        const mockError = {
            response: {
              status: 401,
            },
          };

        authServices.callApiAuth = jest.fn().mockRejectedValue(mockError);
        authServices.getToken = jest.fn().mockResolvedValueOnce("main_token");
        await expect(async () => {
            await authServices.fetch<string>('path', { method: 'POST', data: JSON.stringify({ message: 'Hello' }) }, helloWorldValidators);
          }).rejects.toMatchObject({
            response: {
              status: 401
            }
          });
    });
})

describe('ValidateToken', () => {
    it('Token Expired', () => {
        expect(authServices.validateToken('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyLCJleHAiOjE2MjM5MzQ5ODB9.xqFfLSt-jU_SYXbB6z54U0plOzADwfV6tDs513FGHtE')).toEqual(false)
    })

    it('Token Valid', () => {
        expect(authServices.validateToken('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyLCJleHAiOjE5MDc5MzE3ODB9.aR4WUfuQWw4-f4HYTYAlqVTp7o2ox16LLTgrdh6MR5o')).toEqual(true)
    })
})

describe('Login', () => {
    it('Login return the auth token', async () => {
        const mockResponse: IAuthResponse = {
            main_token: 'mocked_token',
            refresh_token: 'mocked_refresh_token'
          };

        authServices.callApiAuth = jest.fn().mockResolvedValueOnce(mockResponse);
        const token = await authServices.login();
        expect(token).toEqual('mocked_token');
    });
})

describe('Refresh', () => {
    it('Refresh return the auth token', async () => {
        let mockResponse: IAuthResponse = {
            main_token: 'mocked_token',
            refresh_token: 'mocked_refresh_token'
          };

        authServices.callApiAuth = jest.fn().mockResolvedValueOnce(mockResponse);
        await authServices.login();

        mockResponse = {
            main_token: 'mocked_token2',
            refresh_token: 'mocked_refresh_token2'
          };
        authServices.callApiAuth = jest.fn().mockResolvedValueOnce(mockResponse);

        const token = await authServices.refresh();
        expect(token).toEqual('mocked_token2');
    });
})