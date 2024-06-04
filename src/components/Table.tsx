import { useState, useEffect } from "react";
import { supabase } from "../config/supabase.tsx";
import Job from "../interfaces/Job";
import { BsThreeDotsVertical } from "react-icons/bs";
import { FaExternalLinkAlt, FaTrash, FaEdit } from "react-icons/fa";

const Table = () => {
    const [jobs, setJobs] = useState<Job[]>([]);
    async function getJobs() {
        const { data } = await supabase
            .from("jobs")
            .select()
            .limit(50)
            .order("createdAt", { ascending: false });
        setJobs(data || []);
    }

    // Listen for changes to jobs
    supabase
        .channel("jobs-changes")
        .on(
            // @ts-ignore
            "postgres_changes",
            {
                event: "*",
                schema: "public",
                table: "jobs",
            },
            getJobs()
        )
        .subscribe();

    const [tableStyle, setTableStyle] = useState("xs");
    const handleTableSize = async (increase: boolean) => {
        if (increase) {
            setTableStyle("sm");
            localStorage.setItem("tableStyle", "sm");
        } else {
            setTableStyle("xs");
            localStorage.setItem("tableStyle", "xs");
        }
    };

    useEffect(() => {
        getJobs();
        setTableStyle(localStorage.getItem("tableStyle") || "xs");
    }, []);

    const [editJobId, setEditJobId] = useState("");
    const [editJobUrl, setEditJobUrl] = useState("");
    const [editJobTitle, setEditJobTitle] = useState("");
    const [editJobCompany, setEditJobCompany] = useState("");
    const [editJobRemote, setEditJobRemote] = useState("");
    const [editJobSeason, setEditJobSeason] = useState("");
    const [editJobLocation, setEditJobLocation] = useState("");

    const showEditModal = ({
        id,
        url,
        title,
        company,
        remote,
        season,
        location,
    }: {
        id: string;
        url: string;
        title: string;
        company: string;
        remote: string;
        season: string;
        location: string;
    }) => {
        setEditJobId(id);
        setEditJobUrl(url);
        setEditJobTitle(title);
        setEditJobCompany(company);
        setEditJobRemote(remote);
        setEditJobSeason(season);
        setEditJobLocation(location);

        const editModal = document.getElementById(
            "editModal"
        ) as HTMLDialogElement;
        if (editModal) {
            editModal.showModal();
        }
    };

    const handleEdit = async () => {
        const { error } = await supabase
            .from("jobs")
            .update({
                url: editJobUrl,
                title: editJobTitle,
                company: editJobCompany,
                remote: editJobRemote,
                season: editJobSeason,
                location: editJobLocation,
            })
            .match({ id: editJobId });
        if (error) console.log(error);
    };

    const editModal = (
        <dialog id="editModal" className="modal">
            <div className="modal-box w-min">
                <form method="dialog">
                    <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
                        ✕
                    </button>
                </form>
                <h3 className="font-bold text-lg">Edit Job</h3>
                <div className="py-4">
                    <input
                        type="text"
                        placeholder="Link to job posting"
                        className="input input-bordered w-full max-w-xs my-2"
                        value={editJobUrl}
                        onChange={(event) => setEditJobUrl(event.target.value)}
                    />
                    <input
                        type="text"
                        placeholder="Job Title"
                        className="input input-bordered w-full max-w-xs my-2"
                        value={editJobTitle}
                        onChange={(event) =>
                            setEditJobTitle(event.target.value)
                        }
                    />
                    <input
                        type="text"
                        placeholder="Company"
                        className="input input-bordered w-full max-w-xs my-2"
                        value={editJobCompany}
                        onChange={(event) =>
                            setEditJobCompany(event.target.value)
                        }
                    />
                    <div className="join my-2">
                        <input
                            className="join-item btn"
                            type="radio"
                            name="remote"
                            aria-label="Office"
                            checked={editJobRemote === "Office"}
                            onChange={() => setEditJobRemote("Office")}
                        />
                        <input
                            className="join-item btn"
                            type="radio"
                            name="remote"
                            aria-label="Hybrid"
                            checked={editJobRemote === "Hybrid"}
                            onChange={() => setEditJobRemote("Hybrid")}
                        />
                        <input
                            className="join-item btn"
                            type="radio"
                            name="remote"
                            aria-label="Remote"
                            checked={editJobRemote === "Remote"}
                            onChange={() => setEditJobRemote("Remote")}
                        />
                    </div>
                    <br></br>
                    <div className="join my-2">
                        <input
                            className="join-item btn"
                            type="radio"
                            name="season"
                            aria-label="Summer"
                            checked={editJobSeason === "Summer"}
                            onChange={() => setEditJobSeason("Summer")}
                        />
                        <input
                            className="join-item btn"
                            type="radio"
                            name="season"
                            aria-label="Fall"
                            checked={editJobSeason === "Fall"}
                            onChange={() => setEditJobSeason("Fall")}
                        />
                        <input
                            className="join-item btn"
                            type="radio"
                            name="season"
                            aria-label="Winter"
                            checked={editJobSeason === "Winter"}
                            onChange={() => setEditJobSeason("Winter")}
                        />
                    </div>
                    <input
                        type="text"
                        placeholder="Location"
                        className="input input-bordered w-full max-w-xs my-2"
                        value={editJobLocation}
                        onChange={(event) =>
                            setEditJobLocation(event.target.value)
                        }
                    />
                </div>
                <div className="w-full flex justify-end">
                    <button
                        className="btn w-1/3"
                        onClick={() => {
                            handleEdit();
                            // Close modal
                            const editModal = document.getElementById(
                                "editModal"
                            ) as HTMLDialogElement;
                            if (editModal) {
                                editModal.close();
                            }
                        }}
                    >
                        Save
                    </button>
                </div>
            </div>
        </dialog>
    );

    const handleRemove = (id: string) => async () => {
        const { error } = await supabase.from("jobs").delete().match({ id });
        if (error) console.log(error);
    };

    return (
        <>
            {editModal}
            <div className="flex justify-end px-4 h-4">
                <div className="join mb-4">
                    <button
                        className="join-item btn w-12"
                        onClick={() => handleTableSize(false)}
                    >
                        -
                    </button>
                    <button
                        className="join-item btn w-12"
                        onClick={() => handleTableSize(true)}
                    >
                        +
                    </button>
                </div>
            </div>
            <div className="overflow-x-auto pt-8">
                <table className={`table table-${tableStyle}`}>
                    <thead>
                        <tr>
                            <th></th>
                            <th>Title</th>
                            <th>Company</th>
                            <th>Remote</th>
                            <th>Season</th>
                            <th>Location</th>
                            <th>Date Applied</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {jobs.map((job: Job, i: number) => {
                            const r = jobs.length - i;
                            return (
                                <tr key={job.id}>
                                    <td>{r}</td>
                                    <td>{job.title}</td>
                                    <td>{job.company}</td>
                                    <td>{job.remote}</td>
                                    <td>{job.season}</td>
                                    <td>{job.location}</td>
                                    <td>{job.createdAt}</td>
                                    <td>
                                        <div className="dropdown dropdown-left dropdown-end">
                                            <div
                                                tabIndex={0}
                                                role="button"
                                                className="btn m-1"
                                            >
                                                <BsThreeDotsVertical />
                                            </div>
                                            <ul
                                                tabIndex={0}
                                                className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-16"
                                            >
                                                <li>
                                                    <a
                                                        href={job.url}
                                                        target="_blank"
                                                    >
                                                        <FaExternalLinkAlt />
                                                    </a>
                                                </li>
                                                <li>
                                                    <a
                                                        onClick={() =>
                                                            showEditModal({
                                                                id: job.id,
                                                                url: job.url,
                                                                title: job.title,
                                                                company:
                                                                    job.company,
                                                                remote: job.remote,
                                                                season: job.season,
                                                                location:
                                                                    job.location,
                                                            })
                                                        }
                                                    >
                                                        <FaEdit />
                                                    </a>
                                                </li>
                                                <li>
                                                    <a
                                                        onClick={handleRemove(
                                                            job.id
                                                        )}
                                                    >
                                                        <FaTrash />
                                                    </a>
                                                </li>
                                            </ul>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </>
    );
};

export default Table;
