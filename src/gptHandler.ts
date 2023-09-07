import fetch, { RequestInit } from "node-fetch";

const TIMEOUT = 11000;

interface GptRequest {
    url: string;
    callGpt(userPrompt: string): Promise<string>;
}

 export default class GptHandler implements GptRequest {
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
            const response = await Promise.race([fetch(this.url, options), this.createTimeoutPromise()]);
            if (!response.ok) {
                throw new Error(`HTTP request failed with status: ${response.status}`);
            }
            const responseData = await response.text();
            return responseData;
        } catch (error) {
            throw error;
        }
    }

    createTimeoutPromise(): Promise<never> {
        return new Promise<never>((_, reject) => {
            setTimeout(() => {
                reject(new Error('Request timed out'));
            }, TIMEOUT);
        });
    }
}
