import Head from "next/head"
import { useState } from "react";

function Login() {

    const [login, setLogin] = useState(false);

    return (
        <div>
            <Head>
                <title> Login Page</title>
                <link rel="icon" href="coffee-icon.png" />
            </Head>


            <form>
                <h1>Sign In Page</h1>
                <div>
                    <label>
                        <input type="email" placeholder="Email" className="input" />
                    </label>
                    <label>
                        <input type="password" placeholder="Password" className="input" />
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