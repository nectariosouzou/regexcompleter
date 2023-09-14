// Copyright: (c) 2023, Nectarios Ouzounidis
// GNU General Public License v3.0+ (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)

import fetch, { RequestInit } from "node-fetch";

const TIMEOUT = 17000;

interface GptIntereface {
    url: string;
    callGpt(userPrompt: string): Promise<string>;
}

 export default class GptHandler implements GptIntereface {
    url: string;

    constructor(url: string) {
        this.url = url;
    }

    async callGpt(userPrompt: string): Promise<string> {
        const bodyData = {
            prompt: userPrompt
        };
        const bodyJson = JSON.stringify(bodyData);
        const options: RequestInit = {
            method: 'POST',
            headers: {
                // eslint-disable-next-line @typescript-eslint/naming-convention
                'Content-Type': 'application/json',
                // eslint-disable-next-line @typescript-eslint/naming-convention
                'Content-Length': bodyJson.length.toString()
            },
            body: bodyJson
        };
        try {
            const response = await Promise.race([fetch(this.url, options), createTimeoutPromise()]);
            if (!response.ok) {
                throw new Error(`HTTP request failed with status: ${response.status}`);
            }
            const responseData = await response.text();
            return responseData;
        } catch (error) {
            if (error instanceof TimeoutError) {
                throw error;
            }
            throw new Error(`Request failed`);
        }
    }
}

function createTimeoutPromise(): Promise<never> {
    return new Promise<never>((_, reject) => {
        setTimeout(() => {
            reject(new TimeoutError('Request timed out'));
        }, TIMEOUT);
    });
}

class TimeoutError extends Error {
    constructor(message?: string) {
        super(message);
        this.name = 'TimeoutError';
        Object.setPrototypeOf(this, TimeoutError.prototype); // This line is needed for the instance of check to work correctly with custom errors in TypeScript
    }
}