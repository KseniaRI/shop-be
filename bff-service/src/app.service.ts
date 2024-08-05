/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { Request } from 'express';
import * as dotenv from 'dotenv';
dotenv.config();

@Injectable()
export class AppService {
  getServiceURL(originalURL: string): string | undefined {
    const recipient = originalURL.split('/')[1];
    const recipirentUrl = process.env[recipient];
    if (!recipirentUrl) {
      throw { status: 502, data: { error: 'Cannot process request' } };
    }
    console.log('recipirentUrl', recipirentUrl);
    return recipirentUrl;
  }

  async forwardRequest(req: Request) {
    const { method, originalUrl, body, headers } = req;

    console.log('method', method);
    console.log('originalUrl', originalUrl);
    console.log('body', body);
    console.log('authorization', headers.authorization);
    const recipirentUrl = this.getServiceURL(originalUrl);
    const hasBody = Object.keys(req.body || {}).length > 0;

    if (recipirentUrl) {
      const axiosConfig = {
        headers: {
          authorization: headers.authorization,
        },
        method,
        url: `${recipirentUrl}${originalUrl}`,
        ...(hasBody && { data: body }),
      };

      console.log('axiosConfig', axiosConfig);

      return axios(axiosConfig)
        .then((response) => response.data)
        .catch((error) => {
          if (error.response) {
            const { status, data } = error.response;
            throw { status, data };
          } else {
            throw { status: 500, data: { error: error.message } };
          }
        });
    }
  }
}