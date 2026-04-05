import axios from 'axios';

const baseUrl = 'http://localhost:1337';

export async function post<TRequest = any, TResponse = any>(
    url: string,
    data: TRequest
): Promise<TResponse> {

    localStorage.setItem("userID", JSON.stringify(2));

    const userId = localStorage.getItem("userID");

    const response = await axios.post<TResponse>(baseUrl + url, {
        ...data,
        userId: userId
    });
    return response.data;
}