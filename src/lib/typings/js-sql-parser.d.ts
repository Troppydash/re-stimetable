declare module 'js-sql-parser' {
    class SqlParser implements Parser {
        parse: (query: string) => ParserResult;
    }

    interface Parser {
    }

    export interface ParserResult {
        nodeType: string;
        value: {
            type: string;
            selectedItems: any,
            from: any,
            where: any,
            having: any,
            limit: null | number,
        }
    }

    const instance = new SqlParser();
    export default instance;
}
