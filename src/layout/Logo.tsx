import React from "react";
import LogoDarkIcon from "./LogoDarkIcon";
import LogoIcon from "./LogoIcon";
import { useAppSelector } from "../hooks";

export default function Logo() {
    const mode = useAppSelector((state) => state.theme.mode);
    if (mode === 'dark') {
        return <LogoDarkIcon />;
    }
    return <LogoIcon />;
}