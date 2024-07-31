'use client'

import React, {useEffect, useState} from "react";
import {NextPage} from "next";
import HttpServices from "../../lib/HttpServices";
import {useRouter} from "next/navigation";
import LoginQueryDto from "../../lib/models/LoginQueryDto";
import {useAuth} from "../AuthContext";
import UserDto from "../../lib/models/user/UserDto";
import {Image} from "@nextui-org/image";


const LoginComponent: NextPage = () => {
    const router = useRouter();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [hidden, setHidden] = useState(true);
    const api = new HttpServices();
    const {
        token,
        user,
        login
    } = useAuth();

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        api.callAPI("/user/login", new LoginQueryDto(username, password), "POST").then(r => {
            if (r.status === 200) {
                r.json().then(res => {
                    login(res.value.token, (res as LoginDto<UserDto>).value.resultDto[0]);
                    router.push("/dashboard");
                });

            } else {
                setHidden(false);
            }
        });
    }

    useEffect(() => {
        if (token && user && user.role.includes("Manager")) {
            router.push("/dashboard/user");
        } else if (token && user && !user.role.includes("Manager")) {
            router.push("/dashboard/menu");
        }
    }, [router, token]);


    return (
        <div className={"flex flex-col items-center h-screen"}>
            <div className={"size-full flex flex-col justify-center items-center"}>
                <Image src={"/MenuMaster.png"}
                       width={"60px"}
                       height={"60px"}
                />
                <h2 className={"mt-4"}>Restaurant Food Planning System</h2>
                <div className={"flex flex-col justify-center items-center size-full"}>
                    <h2 className={"text-center mb-4 w-[125px] h-[58px] text-[48px]"}>Login</h2>
                    <input type={"text"}
                           placeholder={"Enter your username"}
                           value={username}
                           onChange={(e) => setUsername(e.target.value)}
                           className={"mb-4 border-2 w-full"}
                           required={true}
                    />
                    <input type={"password"}
                           placeholder={"Enter your password"}
                           value={password}
                           onChange={(e) => setPassword(e.target.value)}
                           className={"mb-4 border-2 w-full"}
                           required={true}
                    />
                    <button type={"submit"}
                            color={"primary"}
                            className={"w-full border-2"}
                            onClick={handleLogin}
                    >Submit
                    </button>
                    <p hidden={hidden}>Invalid Username and password.</p>
                </div>
            </div>
        </div>);
}

export default LoginComponent;