
import { useState } from "react";
import { Link } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import { supabase } from "../api/supabaseClient";
import style from "./ResumePage.module.css";

export default function ResumePage() {
    const { user } = useUser();
    let [fileSize, setFileSize] = useState(0)

    const BUCKET_NAME = "Resume";
    const FILE_PATH = "John Philip Dela Vega.pdf";
    const now = new Date();
    const handleResumeClick = async () => {
        const { data, error } = await supabase.storage
            .from(BUCKET_NAME)
            .getPublicUrl(FILE_PATH, { download: true });

        if (error || !data) {
            console.error("File data not found");
            return;
        }

        const bytes = data.size || 0;
        setFileSize(bytes / (1024 * 1024));

        window.location.href = data.publicUrl;
    };

    return (
        <div className="relative flex min-h-screen w-full flex-col items-center justify-center p-6 [font-family:'Courier_New',monospace] text-zinc-100 select-none">

            <Link
                to="/"
                className="absolute left-6 top-6 flex items-center gap-2 border-2 border-t-white border-l-white border-b-black border-r-black bg-[#c0c0c0] px-4 py-2 text-xs font-bold uppercase tracking-widest text-black active:border-t-black active:border-l-black active:border-b-white active:border-r-white"
            >
                &lt; BACK TO MAIN_MENU
            </Link>

            <div className="mb-12 text-center">
                <div className="mb-2 text-[10px] font-black uppercase tracking-[0.3em] text-emerald-500">
                    // EXPORT RESUME
                </div>
            </div>

            <div className={style.wrapper}>
                <div className={style.printer}></div>

                <div className={style['printer-display']}>
                    <span className={style['printer-message']}> Click to print</span>
                    <div className={style['letter-wrapper']}>
                        <span className={style.letter}>P</span><span className={style.letter}>r</span><span className={style.letter}>i</span>
                        <span className={style.letter}>n</span><span className={style.letter}>t</span><span className={style.letter}>i</span>
                        <span className={style.letter}>n</span><span className={style.letter}>g</span><span className={style.letter}>.</span>
                        <span className={style.letter}>.</span><span className={style.letter}>.</span>
                    </div>
                </div>

                <button className={style['print-button']} onClick={handleResumeClick}>🖨 </button>

                <div className={style['receipt-wrapper']}>
                    <div className={style.receipt}>
                        <div className={style['receipt-header']}>

                            CV_FILE <br />
                            <div className={style.logo}>{user?.imageUrl && (
                                <img
                                    src={user.imageUrl}
                                    alt="User"

                                />
                            )}</div>
                        </div>
                        <div className={style['receipt-subheader']}>
                            User: {user?.firstName || "Guest"} <br />
                            Action: Download <br />
                            Status: Ready
                        </div>
                        <table className={style['receipt-table']}>
                            <tbody>
                                <tr>
                                    <th>Field</th>
                                    <th>Data</th>
                                </tr>
                                <tr>
                                    <td>CV_PDF</td>
                                    <td>Ready</td>
                                </tr>
                                <tr>
                                    <td>Owner</td>
                                    <td>{user?.firstName || "Guest"}</td>
                                </tr>
                                <tr>
                                    <td>Size</td>
                                    <td>{fileSize > 0 ? `${fileSize.toFixed(2)} MB` : "computing..."}</td>
                                </tr>
                                <tr>
                                    <td>Created</td>
                                    <td>{now.toLocaleDateString()}</td>
                                </tr>
                                <tr>
                                    <td>Protocol</td>
                                    <td>HTTPS_V2</td>
                                </tr>
                                <tr>
                                    <td>Integrity</td>
                                    <td>SHA-256</td>
                                </tr>
                                <tr className={style['receipt-total']}>
                                    <td colSpan="2">Export Ready</td>
                                </tr>
                            </tbody>
                        </table>
                        <div className={style['receipt-message']}>Thank you!</div>
                    </div>
                </div>
            </div>
        </div>
    );
}