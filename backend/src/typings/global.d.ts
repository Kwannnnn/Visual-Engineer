declare global {
    namespace NodeJS {
        interface ProcessEnv {
            DATABASE_USR: string;
            DATABASE_USR_PW: string;
            DATABASE_NAME: string;
        }
    }
}

export { };