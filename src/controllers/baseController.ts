import express from 'express'

export abstract class BaseController {
    protected abstract processRequest(
      req: express.Request, res: express.Response
    ): Promise<void | any>;
  
    public async execute(
      req: express.Request, res: express.Response
    ): Promise<void> {
      try {
        await this.processRequest(req, res);
      } catch (err) {
        console.log(`[BaseController]: Uncaught controller error`);
        console.log(err);
        this.handleError(res, 'An unexpected error occurred');
      }
    }
  
    public jsonResponse (
        res: express.Response, code: number, data: any
      ) {
        res.type('application/json');
        return res.status(code).json(data)
      }
    
    public unauthorized (res: express.Response, message?: string) {
        return this.jsonResponse(res, 401, message ? message : 'Unauthorized');
    }

    protected handleError (res: express.Response, error: Error | string) {
        return res.status(500).json({
          message: error.toString()
        })
      }
  }