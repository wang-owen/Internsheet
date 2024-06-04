import { useState, useEffect } from "react";
import { supabase } from "./config/supabase.tsx";
import { Session } from "@supabase/supabase-js";
import { MdOutlineLightMode, MdOutlineDarkMode } from "react-icons/md";
import Sidebar from "./components/Sidebar";
import Table from "./components/Table";
import Login from "./components/Login";
import Signout from "./components/Signout";

function App() {
    const page = document.querySelector("html");
    const [theme, setTheme] = useState(
        localStorage.getItem("theme") || "light"
    );
    const toggleTheme = () => {
        localStorage.setItem("theme", theme === "light" ? "dark" : "light");
        setTheme(theme === "light" ? "dark" : "light");
    };
    useEffect(() => {
        if (page) {
            page.setAttribute(
                "data-theme",
                localStorage.getItem("theme") || theme
            );
        }
    }, [theme]);

    const [session, setSession] = useState<Session | null>(null);

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
        });

        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
        });

        return () => subscription.unsubscribe();
    }, []);

    return (
        <main>
            <div className="flex justify-center h-screen items-center">
                {!session ? (
                    <Login />
                ) : (
                    <div className="h-full w-11/12">
                        <div className="flex justify-between h-min items-center m-4 border-b-2 pb-2">
                            <label className="flex cursor-pointer gap-2 p-2">
                                <MdOutlineLightMode size={25} />
                                <input
                                    type="checkbox"
                                    className="toggle theme-controller"
                                    onChange={toggleTheme}
                                    checked={theme === "dark"}
                                />
                                <MdOutlineDarkMode size={25} />
                            </label>
                            <Signout />
                        </div>
                        <div className="flex">
                            <div className="w-1/5 m-2">
                                <Sidebar />
                            </div>
                            <div className="w-full m-2">
                                <Table />
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </main>
    );
}

export default App;
