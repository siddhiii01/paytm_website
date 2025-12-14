import axios from "axios";

export const HomeRoute = async (name: any) => {
    try {
        const response = await axios.post(`${(import.meta as any).env.VITE_API_URL}/`, name)
        console.log(response)
    } catch(error){
        console.log(error);
    }
}