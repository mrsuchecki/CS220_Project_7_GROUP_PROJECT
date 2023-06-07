class FluentURL {
    searchURL: URL;
    constructor(baseURL: string) {
        this.searchURL = new URL(baseURL);
    }
    // fluently add parameters to URL
    addParam(key: string, value: string): FluentURL {
        this.searchURL.searchParams.append(key, value);
        return this;
    }
    // return string
    toString(): string {
        return this.searchURL.toString();
    }
}

export { FluentURL }