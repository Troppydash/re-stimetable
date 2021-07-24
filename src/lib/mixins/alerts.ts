export interface AlertOptions {
    text: string | {
        text: string,
        title: string
    };
    duration?: number;
}

export default {
    methods: {
        alert(text: string | {
            text: string,
            title: string
        }, duration: number = 5000): Promise<void> {
            return (this as any).$shadow.evoke('showAlert', text, duration);
        }
    }
}
