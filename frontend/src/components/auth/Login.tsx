import {useForm} from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { loginSchema, type LoginCredentials } from "shared_schemas";
import { api } from "../../utils/axios";
import { Link } from "react-router-dom";

export const Login = () => {
    const {
        register, 
        handleSubmit,
        formState: {isSubmitting, errors}
    } = useForm<LoginCredentials>({resolver: zodResolver(loginSchema)});

    const onSubmit = async (data: LoginCredentials) => {
        try{
            console.log("Data: ", data)
            const response = await api.post(`/login`, data);
            console.log("Login successful:", response.data);

        } catch(error){
            console.error("Login error:", error);
        } 
    }

    return (
       <form onSubmit={handleSubmit(onSubmit)} >
        <h2> Login with your PayX account</h2>
        <input 
            placeholder="Enter Email"
            {...register("email")}
        />
        {errors.email && <p>{errors.email.message}</p>}

        <input 
            placeholder="Enter PayX Password"
            {...register("password")}
        />
        {errors.password && <p>{errors.password.message}</p>}

        <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Signing in..." : "Sign in"}
        </button>

        <p>
           New to Paytm? <Link to="/signup">Create an Account</Link>
        </p>
       </form> 
    )
}