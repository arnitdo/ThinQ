import "./Loader.css";

export default function Loader() {
    return (
        <div className="min-h-[50vh] h-full w-full flex justify-center items-center">
        <div className="container_lg ">
            <div className="cube_lg"><div className="cube_lg__inner"></div></div>
            <div className="cube_lg"><div className="cube_lg__inner"></div></div>
            <div className="cube_lg"><div className="cube_lg__inner"></div></div>
        </div>
        </div>
    )
}
