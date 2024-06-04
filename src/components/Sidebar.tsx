import { useState, useEffect } from "react";
import { supabase } from "../config/supabase.tsx";
import { MdOutlineLightMode, MdOutlineDarkMode } from "react-icons/md";

const Sidebar = ({}: {}) => {
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

    const [url, setUrl] = useState("");
    const [title, setTitle] = useState("");
    const [company, setCompany] = useState("");
    const [remote, setRemote] = useState("");
    const [season, setSeason] = useState("");
    const [location, setLocation] = useState("");

    const addJob = async () => {
        const { error } = await supabase.from("jobs").insert({
            url: url,
            title: title,
            company: company,
            remote: remote,
            season: season,
            location: location,
        });
        if (error) console.log(error);
    };

    return (
        <div className="flex flex-col items-center p-2 border rounded-2xl w-min">
            <label>Add Job</label>
            <input
                type="text"
                placeholder="Link to job posting"
                className="input input-bordered w-full max-w-xs my-2"
                onChange={(event) => setUrl(event.target.value)}
            />
            <input
                type="text"
                placeholder="Job Title"
                className="input input-bordered w-full max-w-xs my-2"
                onChange={(event) => setTitle(event.target.value)}
            />
            <input
                type="text"
                placeholder="Company"
                className="input input-bordered w-full max-w-xs my-2"
                onChange={(event) => setCompany(event.target.value)}
            />
            <div className="join my-2">
                <input
                    className="join-item btn"
                    type="radio"
                    name="remote"
                    aria-label="Office"
                    onClick={() => setRemote("Office")}
                />
                <input
                    className="join-item btn"
                    type="radio"
                    name="remote"
                    aria-label="Hybrid"
                    onClick={() => setRemote("Hybrid")}
                />
                <input
                    className="join-item btn"
                    type="radio"
                    name="remote"
                    aria-label="Remote"
                    onClick={() => setRemote("Remote")}
                />
            </div>
            <div className="join my-2">
                <input
                    className="join-item btn"
                    type="radio"
                    name="season"
                    aria-label="Summer"
                    onClick={() => setSeason("Summer")}
                />
                <input
                    className="join-item btn"
                    type="radio"
                    name="season"
                    aria-label="Fall"
                    onClick={() => setSeason("Fall")}
                />
                <input
                    className="join-item btn"
                    type="radio"
                    name="season"
                    aria-label="Winter"
                    onClick={() => setSeason("Winter")}
                />
            </div>
            <input
                type="text"
                placeholder="Location"
                className="input input-bordered w-full max-w-xs my-2"
                onChange={(event) => setLocation(event.target.value)}
            />
            <button
                onClick={addJob}
                className="bg-white text-black px-4 py-1 border rounded-lg m-4"
            >
                Add
            </button>
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
        </div>
    );
};

export default Sidebar;
