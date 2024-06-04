import { useState } from "react";
import { supabase } from "./config/supabase.tsx";
import { Session } from "@supabase/supabase-js";
import Sidebar from "./components/Sidebar";
import Table from "./components/Table";
import Login from "./components/Login";
import Signout from "./components/Signout";
import { useEffect } from "react";

function App() {
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
                        <div className="text-right p-4 border-b-2 m-4">
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
