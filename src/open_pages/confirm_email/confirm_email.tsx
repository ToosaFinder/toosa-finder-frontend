import React from "react";
import {Redirect, useParams} from "react-router";
import usePromise from "react-promise";
import {confirmEmail} from "../../utils/auth";

export default function ConfirmEmail(): JSX.Element {
    const { emailToken } = useParams();

    const { value, loading } = usePromise<boolean>(confirmEmail(emailToken));
    if (loading) {
        return null;
    }
    return value ? <Redirect to="/sign-in" /> : <Redirect to="/error-page" />;
}