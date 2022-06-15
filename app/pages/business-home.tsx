import { useRouter } from "next/router"
import useAuth from "../hooks/useAuth"

export default function BusinessHome() {
    //states for logged in from useAuth hook
    const { logout, loading } = useAuth()
    const router = useRouter()

    //blocks if loading
    if (loading) {
        return null
    }

    return (
        <div>
            <h1>Hello Business!</h1>
            <div>
                <button onClick={logout}>Logout</button>
            </div>
            <div>
                <button onClick={() => router.push("/qr-scanner")}>Scan Discount Code</button>
            </div>
        </div>
    )
}