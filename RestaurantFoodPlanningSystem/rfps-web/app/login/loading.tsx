import {Spinner} from "@nextui-org/react";
import React from "react";

export default function Loading(){
    return (
        <>
            <div className={"w-dvw h-dvh flex flex-col items-center justify-center"}>
                <Spinner/>
            </div>
        </>
    )
}