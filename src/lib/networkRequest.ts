
export interface RequestResponse {
    ok: boolean;
    code: number;
    text: string;
}

export class NetworkRequest {
    constructor(private type: string, private url: string, private data: object | null) {
    }

    static get(url: string) {
        return new NetworkRequest("GET", url, null);
    }

    static post(url: string, data: object) {
        return new NetworkRequest("POST", url, data);
    }

    public async send(): Promise<RequestResponse> {
        const result = await fetch(this.url, {
            method: this.type,
            headers: {
                'Content-Type': 'application/json'
            },
            body: this.data === null ? '' : JSON.stringify(this.data)
        });
        const text = await result.text();

        return {
            ok: result.ok,
            code: result.status,
            text,
        }
    }
}
