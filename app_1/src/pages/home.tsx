/**
 * Copyright (c) 2021, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
 *
 * WSO2 Inc. licenses this file to you under the Apache License,
 * Version 2.0 (the "License"); you may not use this file except
 * in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

import { useAuthContext } from "@asgardeo/auth-react";
import React, { FunctionComponent, useEffect, useState } from "react";
import ReactJson from "react-json-view";
import { default as authConfig } from "../config.json";
import REACT_LOGO from "../images/react-logo.png";
import APPLICATION_1 from "../images/mdu.png";
import { DefaultLayout } from "../layouts/default";

export const HomePage: FunctionComponent<{}> = () => {

    const { state, signIn, signOut, getBasicUserInfo, getIDToken, getDecodedIDToken } = useAuthContext();
    const [authenticateState, setAuthenticateState] = useState(null);

    useEffect(() => {
        if (getIsInitLogin()) {
            signIn();
        }
    }, []);

    const getIsInitLogin = () => {
        if (sessionStorage.getItem("isInitLogin") === "true") {
            return true;
        }
        else {
            return false;
        }
    };

    const setIsInitLogin = (value: string) => {
        sessionStorage.setItem("isInitLogin", value)
    };

    const handleLogin = () => {
        setIsInitLogin("true");
        signIn();
    }

    const handleLogout = () => {
        signOut();
        setIsInitLogin("false");
    }

    useEffect(() => {
        if (state?.isAuthenticated) {
            const getData = async () => {
                const basicUserInfo = await getBasicUserInfo();
                const idToken = await getIDToken();
                const decodedIDToken = await getDecodedIDToken();

                const authState = {
                    authenticateResponse: basicUserInfo,
                    idToken: idToken.split("."),
                    decodedIdTokenHeader: JSON.parse(atob(idToken.split(".")[0])),
                    decodedIDTokenPayload: decodedIDToken
                };

                setAuthenticateState(authState);
            };
            getData();
        }
    }, [state.isAuthenticated]);

    return (
        <DefaultLayout>
            { authConfig.clientID === "" ?
                <div className="content">
                    <h2>You need to update the Client ID to proceed.</h2>
                    <p>Please open "src/config.json" file using an editor, and update the <code>clientID</code> value with the registered application's client ID.</p>
                    <p>Visit repo <a href="https://github.com/asgardeo/asgardeo-auth-react-sdk/tree/master/samples/asgardeo-react-app">README</a> for more details.</p>
                </div>
                :
                (state.isAuthenticated) ?
                    <>
                        <div className="header-title">
                            <h1>
                                MDU Quote and Application
                        </h1>
                        </div>
                        <div className="content">
                            <h2>The UK's leading medical defence organisation</h2>
                            <button
                                className="btn primary mt-4"
                                onClick={() => {
                                    handleLogout();
                                }}
                            >
                                Logout
                            </button>
                        </div>
                    </>
                    :
                    (getIsInitLogin()) ?
                        <>
                            <div className="header-title">
                                <h1>
                                    MDU Quote and Application
                                </h1>
                            </div>
                            <div className="content">Loading ...</div>
                        </>
                        :
                        <>
                            <div className="header-title">
                                <h1>
                                    MDU Quote and Application
                                </h1>
                            </div>
                            <div className="content">
                                <div className="home-image">
                                    <img src={APPLICATION_1} className="react-logo-image logo" />
                                </div>
                                <button
                                    className="btn primary"
                                    onClick={() => {
                                        handleLogin();
                                    }}
                                >
                                    Login
                                </button>
                            </div>
                        </>
            }
        </DefaultLayout >
    );
};
