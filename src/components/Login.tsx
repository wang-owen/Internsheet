import { supabase } from "../config/supabase.tsx";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";

const Login = () => {
    const theme = localStorage.getItem("theme") || "light";

    return (
        <>
            <div className="hero bg-base-200 h-full w-full lg:h-2/3 lg:w-2/3 rounded-3xl">
                <div className="hero-content flex-col lg:flex-row-reverse">
                    <div className="text-center lg:text-left lg:ml-8 w-min">
                        <h1 className="text-5xl font-bold">Internsheet</h1>
                        <p className="py-6">
                            Track your job applications and race your friends to
                            see who can send the most!
                        </p>
                    </div>
                    <div className="card shrink-0 w-full max-w-sm shadow-2xl bg-base-100 p-8">
                        <Auth
                            supabaseClient={supabase}
                            appearance={{
                                extend: true,
                                theme: ThemeSupa,
                                style: {
                                    input: {
                                        color:
                                            theme === "dark"
                                                ? "white"
                                                : "black",
                                    },
                                },
                            }}
                            providers={[]}
                        />
                    </div>
                </div>
            </div>
        </>
    );
};

export default Login;
