    import React, {useState} from "react";
    import type { ChangeEvent, FormEvent} from "react";
    import type { SignupCredentials } from "../../types/auth.types";
    import SignupRoute from "../../services/SignupService";


    export const Signup: React.FC = () => {
        const [formData, setFormData] = useState<SignupCredentials>({
            name: '',
            email: '',
            password: '',
            number : ''
        }) //adding states for the input fields

        const [loading, setLoading] = useState<boolean>(false);
        const [error, setError] = useState<string | null>(null); //null represents no error and a string represents an error

    
        const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
            // const {name, value} = e.target;
            const name = e.target.name as keyof SignupCredentials;
            const value = e.target.value;
            setFormData((prev) => ({
                ...prev,
                [name]: value
            }))
        };

        
        const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
            e.preventDefault(); //stops page refreshing
            setLoading(true);
            setError(null);

            //inside the function bcoz here things can go wrong -> n/w fail -> sever issue 
            try{
                //on this line the code can fail so it will jump to catch block 
                await SignupRoute(formData); //calling to Signup Route with current formdata

                //if the code reaches here i.e no error so on sucess clear the form
                setFormData({name: '', number:'', email: '', password: ''});

            }catch(error){
                setError("Signup failed, Please try again later")
            }finally{
                setLoading(false)
            }
            
        }
        

        return (
            <>
            <form onSubmit={handleSubmit}>
                <label htmlFor="name">Name:</label>
                <input 
                    type="text"
                    id="name"
                    value={formData.name} // Ties the input to state
                    name="name"
                    placeholder="Enter your full name"
                    onChange={handleChange} // Handle changes
                />

                <label htmlFor="email">Email: </label>
                <input 
                    type="email"
                    id="email"
                    value={formData.email}
                    name="email"
                    placeholder="example@domain.com"
                    onChange={handleChange}
                />

                <label htmlFor="number">Phone Number:</label>
                <input 
                    type="text"
                    id="number"
                    value={formData.number}
                    name="number"
                    placeholder="+1 (555) 123-4567"
                    onChange={handleChange}
                />

                <label htmlFor="password">Password:</label>
                <input 
                    type="password"
                    name="password"
                    id="password"
                    value={formData.password}
                    onChange={handleChange}
                />
                <button type="submit" disabled={loading}>
                    {loading ? "Signing up...": "Signup"}
                </button>

                
            </form>
            {/* if there is error so diasplay the error */}
            {error && <p>{error}</p>}
            </>
        );
    }