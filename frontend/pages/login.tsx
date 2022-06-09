import Head from "next/head"
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

// typescript interface for form input
interface Inputs {
    email: string
    password: string
}

function Login() {

    //react state to check whether signing up or not
    const [login, setLogin] = useState(false);

    //form hooks
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
      } = useForm<Inputs>()
    
    const onSubmit: SubmitHandler<Inputs> = async (data) => { console.log(data) }

    //HTML elements of the page
    //handleSubmit validates input, register gets data

    return (
        <div className="relative flex h-screen w-screen flex-col bg-black md:items-center md:justify-center md:bg-transparent">
            <Head>
                <title> Login Page</title>
                <link rel="icon" href="coffee-icon.png" />
            </Head>

            <form onSubmit={handleSubmit(onSubmit)}>
                <h1>Sign In Page</h1>
                <div>
                    <label>
                        <input type="email" 
                        placeholder="Email" 
                        className="input" 
                        {...register("email", {required: true})}/>
                    </label>
                    <label>
                        <input type="password"
                        placeholder="Password"
                        className="input"
                        {...register("password", {required: true})}/>
                    </label>
                </div>

                <button> Submit </button>

                <div>
                    <button type="submit"> Sign Up Here </button>
                </div>
            </form>
        </div>
    )
}

export default Login