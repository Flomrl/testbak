import * as express from 'express'
import { BaseController } from './baseController'
import { authServices } from '../services/authServices';
import authValidators from "../validators/authValidators";

export class HelloWorldController extends BaseController {
  protected async processRequest (req: express.Request, res: express.Response): Promise<void | any> {
   try {
    const result = await authServices.fetch<string>('http://localhost:8080/baseUrl/clients', {
      method: 'GET',
      data: JSON.stringify({ id: 65, name: 'John Doe' })
    }, authValidators)
    
    return this.jsonResponse(res, 200, result);
    } catch (err: any) {
      return this.handleError(res, err.toString())
    }
  }
}