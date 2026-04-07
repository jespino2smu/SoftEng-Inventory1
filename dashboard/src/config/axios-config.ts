import axios from 'axios';

const api = axios.create({
  baseURL: 'https://irksomely-unconditional-glenna.ngrok-free.dev/api'
});

export const axPost = async (url: string, input: any) => {
    localStorage.setItem("userID", JSON.stringify(2));
    const userId = localStorage.getItem("userID");

    const response: any = await api.post(
        url,
        {
            ...input,
            userId: userId,
        }
    );

    // let printString = "";
    // Object.keys(response.data).forEach(key1 => {
    //     //console.log(`    ${key1}: ${result[key1]}`);
    //     printString +=`{\n`;

    //     Object.keys(response.data[key1]).forEach(key2 => {
    //         printString +=`    [${key2}]: ${response.data[key1][key2]}\n`;
    //     })
    //     printString +=`}\n`;
    // });
    // alert(printString);

    return response.data;
}