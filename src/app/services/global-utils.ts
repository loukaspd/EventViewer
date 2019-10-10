export class GlobalUtils {
    public static enumValuesToArray(a: any): string[] {
        if (!a) return [];
        return Object.keys(a).map(key => a[key]);
    }

    public static timeoutPromise(milli: number): Promise<any> {
        return new Promise((res) => {
            setTimeout(() => res(null), milli);
        });
    }
}