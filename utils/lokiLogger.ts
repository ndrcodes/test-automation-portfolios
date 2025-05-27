import axios from 'axios';
import { request, APIRequestContext, APIResponse } from '@playwright/test';

interface LokiLabels {
  [key: string]: string;
}

interface RequestData {
    method: string,
    url: string;
    headers: Record<string, string>;
    body?: any;
}

interface ResponseData {
    status: number;
    body?: any;
}

function removeAuthOnHeader(headers: Record<string, string>): Record<string, string> {
  const redactedKeys = ['authorization', 'api-key', 'token'];
  const sanitized: Record<string, string> = {};

  for (const key in headers) {
    sanitized[key] = redactedKeys.includes(key.toLowerCase())
      ? '[REDACTED]'
      : headers[key];
  }

  return sanitized;
}

function removeAuthOnBody(body: any): any {
  if (!body || typeof body !== 'object') return body;

  const redactedKeys = ['password', 'token', 'apikey', 'secret'];
  return Object.fromEntries(
    Object.entries(body).map(([key, value]) => [
      key,
      redactedKeys.includes(key.toLowerCase()) ? '[REDACTED]' : value
    ])
  );
}

export async function logApiCallToLoki(
  requestData: RequestData,
  responseData: ResponseData,
  tags: LokiLabels,
): Promise<void> {
  const lokiUrl = 'http://localhost:3100/loki/api/v1/push';
  const timestamp = Date.now() * 1_000_000;

  const logData = {
    request: {
      method: requestData.method,
      url: requestData.url,
      headers: removeAuthOnHeader(requestData.headers),
      body: removeAuthOnBody(requestData.body)
    },
    response: {
      status: responseData.status,
      body: removeAuthOnBody(responseData.body)
    }
  };

  const payload = {
    streams: [
      {
        stream: {
          job: process.env.JOB_NAME || 'local',
          environment: tags.environment ?? 'dev',
          ...tags
        },
        values: [
          [timestamp.toString(), JSON.stringify(logData)]
        ]
      }
    ]
  };

  try {
    await axios.post(lokiUrl, payload);
  } catch (err: any) {
    console.error('Loki logging error:', err.message);
  }
}

export async function createLoggedApiContext(): Promise<APIRequestContext> {
  const apiContext = await request.newContext();

  const originalFetch = apiContext.fetch;

  apiContext.fetch = async function (
    url: string,
    options?: Parameters<APIRequestContext['fetch']>[1]
  ): Promise<APIResponse> {
    const reqData = {
        method: options?.method || 'GET',
        url: url,
        headers: options?.headers,
        body: options?.data || {}
    }

    const response = await originalFetch.call(this, url, options);

    const responseData = {
        status: response.status(),
    }
    
    try {
        responseData['body'] = await response.json()
    } catch {
        responseData['body'] = {}
    }
    await logApiCallToLoki(reqData, responseData, {
      environment: process.env.ENV || 'local',
    })
    return response;
  };

  return apiContext;
}
