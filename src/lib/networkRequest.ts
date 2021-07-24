
export interface RequestResponse {
    ok: boolean;
    code: number;
    text: string;
}

type OnCompleteCallback = (data: RequestResponse) => void;

export class NetworkRequest {
    public onComplete: OnCompleteCallback;

    constructor(private type: string,
                private url: string,
                private data: object | null,
                public readonly alias?: string) {
        this.onComplete = () => {};
    }

    public setOnComplete(callback: (data: RequestResponse) => void): OnCompleteCallback {
        this.onComplete = callback;
        return callback;
    }

    static get({url, alias}: {url: string, alias?: string}) {
        return new NetworkRequest("GET", url, null, alias);
    }

    static post({url, data, alias}: {url: string, data: object, alias?: string}) {
        return new NetworkRequest("POST", url, data, alias);
    }

    public async send(): Promise<RequestResponse> {
        try {
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
        } catch (e) {
            return {
                ok: false,
                code: 404,
                text: e.message
            };
        }

    }
}
