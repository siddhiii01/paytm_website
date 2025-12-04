import { useState } from "react";
export const Signup: React.FC = () => {
    const [formData, setFormData] = useState();

    const handleFormChange = (e:any) =>{
        // console.log(e.target.name)
        // console.log(e.target.value)
        setFormData(e.target.value);
        
    }
    console.log(`Form Data: ${formData}`)

  return (
    <>
    <label htmlFor="name">Enter Name: </label>
    <input 
        type="text"
        name="name"
        id="name"
        onChange={handleFormChange}
    />

    <label htmlFor="email">Enter Email: </label>
    <input 
        type="text"
        name="email"
        id="email"
    />

    <label htmlFor="password">Enter Password: </label>
    <input 
        type="password"
        name="password"
        id="password"
    />

    <button>Sign Up</button>
    </>
  );
};
