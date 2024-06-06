import { useState } from "react";
import { supabase } from "../config/supabase.tsx";

const Sidebar = () => {
    const [url, setUrl] = useState("");
    const [title, setTitle] = useState("");
    const [company, setCompany] = useState("");
    const [remote, setRemote] = useState("");
    const [season, setSeason] = useState("");
    const [location, setLocation] = useState("");

    const jobSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        const user = await supabase.auth.getUser();

        const { error } = await supabase.from("jobs").insert({
            user_id: user.data.user?.id,
            url: url,
            title: title,
            company: company,
            remote: remote,
            season: season,
            location: location,
        });
        if (error) console.log(error);

        // Clear input fields
        [...document.getElementsByClassName("jobInput")].forEach(
            (input: Element) => ((input as HTMLInputElement).value = "")
        );
        [...document.getElementsByClassName("jobRadio")].forEach(
            (input: Element) => ((input as HTMLInputElement).checked = false)
        );
        // Clear states
        setUrl("");
        setTitle("");
        setCompany("");
        setRemote("");
        setSeason("");
        setLocation("");
    };

    return (
        <div>
            <div
                id="job-form"
                className="flex flex-col items-center p-2 border rounded-2xl w-min"
            >
                <label>Add Job</label>
                <form
                    onSubmit={jobSubmit}
                    className="flex flex-col items-center"
                >
                    <input
                        type="text"
                        placeholder="Link to job posting"
                        className="jobInput input input-bordered w-full max-w-xs my-2"
                        onChange={(event) => setUrl(event.target.value)}
                    />
                    <input
                        type="text"
                        placeholder="Job Title"
                        className="jobInput input input-bordered w-full max-w-xs my-2"
                        onChange={(event) => setTitle(event.target.value)}
                    />
                    <input
                        type="text"
                        placeholder="Company"
                        className="jobInput input input-bordered w-full max-w-xs my-2"
                        onChange={(event) => setCompany(event.target.value)}
                    />
                    <div className="join my-2">
                        <input
                            className="join-item btn jobRadio"
                            type="radio"
                            name="remote"
                            aria-label="Office"
                            onClick={() => setRemote("Office")}
                        />
                        <input
                            className="join-item btn jobRadio"
                            type="radio"
                            name="remote"
                            aria-label="Hybrid"
                            onClick={() => setRemote("Hybrid")}
                        />
                        <input
                            className="join-item btn jobRadio"
                            type="radio"
                            name="remote"
                            aria-label="Remote"
                            onClick={() => setRemote("Remote")}
                        />
                    </div>
                    <div className="join my-2">
                        <input
                            className="join-item btn jobRadio"
                            type="radio"
                            name="season"
                            aria-label="Summer"
                            onClick={() => setSeason("Summer")}
                        />
                        <input
                            className="join-item btn jobRadio"
                            type="radio"
                            name="season"
                            aria-label="Fall"
                            onClick={() => setSeason("Fall")}
                        />
                        <input
                            className="join-item btn jobRadio"
                            type="radio"
                            name="season"
                            aria-label="Winter"
                            onClick={() => setSeason("Winter")}
                        />
                    </div>
                    <input
                        type="text"
                        placeholder="Location"
                        className="jobInput input input-bordered w-full max-w-xs my-2"
                        onChange={(event) => setLocation(event.target.value)}
                    />
                    <input
                        type="submit"
                        value="Add"
                        className="btn btn-outline self-end"
                    />
                </form>
            </div>
        </div>
    );
};

export default Sidebar;
