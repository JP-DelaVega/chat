import style from "./WindowsXpLoading.module.css";

function WindowsXpLoading() {
    return (
        <div className={style.window}>
            <div className={style.logo}>
                <p className={style.top}>Microsoft</p>
                <p className={style.mid}>Windows<span>XP</span></p>
                <p className={style.bottom}>Professional</p>
            </div>
            {/* FIXED: Added style.container */}
            <div className={style.container}>
                <div className={style.box} style={{ animationDelay: "0s" }}></div>
                <div className={style.box} style={{ animationDelay: "0.2s" }}></div>
                <div className={style.box} style={{ animationDelay: "0.4s" }}></div>
            </div>
        </div>
    );
}

export default WindowsXpLoading;