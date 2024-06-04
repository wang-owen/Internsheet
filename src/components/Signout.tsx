import { supabase } from "../config/supabase.tsx";

const Signout = () => {
    const signOut = async () => {
        const { error } = await supabase.auth.signOut();
        if (error) console.log(error);
    };
    return (
        <button className="btn" onClick={signOut}>
            Signout
        </button>
    );
};

export default Signout;
