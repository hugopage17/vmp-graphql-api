
const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Credentials': true,
    'Access-Control-Allow-Methods': 'POST, GET, OPTIONS, PUT, DELETE',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization'
}

export class Response {
    static ok<T>(body: T) {
        return {
            statusCode: 200,
            body: JSON.stringify(body),
            headers
        }
    }

    static created<T>(body: T) {
        return {
            statusCode: 201,
            body: JSON.stringify(body),
            headers
        }
    }

    static okNotContent() {
        return {
            statusCode: 204,
            body: JSON.stringify({}),
            headers
        }
    }

    static badRequest(error: Error) {
        return {
            statusCode: 400,
            body: JSON.stringify({ error: error.message  }),
            headers
        }
    }

    static forbidden() {
        return {
            statusCode: 403,
            body: JSON.stringify({ error: "Forbidden"  }),
            headers
        }
    }

    static notFound(error: Error) {
        return {
            statusCode: 404,
            body: JSON.stringify({ error: error.message  }),
            headers
        }
    }
}