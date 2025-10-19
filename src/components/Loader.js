import React from "react";
import {ClipLoader} from "react-spinners";

function Loader({message = "Loading..."}) {
    return (
        <div className="flex flex-col items-center justify-center h-64 text-gray-600">
            <ClipLoader size={40} color={"#2563eb"} />
            <p className="mt-3 text-sm">{message}</p>
        </div>
    );
}

export default Loader;