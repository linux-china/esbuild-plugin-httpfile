declare module "*demo.http" {
    export function myIp(): Promise<Response>;

    export function postTest(params: { nick: string, host: string, uuid: string }): Promise<Response>;

    export function graphqlSimple(): Promise<Response>;

    export function graphqlDemo(variables: { id: string }): Promise<Response>;
}
