import * as React from "react"
import { Fragment } from "react"
import Navbar from "../../components/navbar"
import { useDispatch, useSelector } from "react-redux"
import { loginAsync } from "./clients/reducer";
import type { CredentialType } from "./clients/reducer"
import type { AppDispatch, RootState } from "../../store/index"

export default function LoginPage() {
    const dispatch = useDispatch<AppDispatch>();
    const { error: stateErr } = useSelector((state: RootState) => state.auth);
    const initForm = (): CredentialType => ({
        password: "",
        username: ""
    });

    const [forms, setForms] = React.useState<CredentialType>(initForm);
    const [errors, setErrors] = React.useState<CredentialType>(initForm)
    const handleInChange = (e: React.ChangeEvent<HTMLInputElement, HTMLInputElement>) => {
        const { value, name } = e.target;
        setForms((prev) => ({ ...prev, [name]: value }))
    }
    const validateForm = () => {
        let valid = true;
        const copyErros = { ...errors }
        Object.entries(forms).forEach(([key, val]) => {
            if (!val) {
                //@ts-ignore
                copyErros[key] = `${key} is required`;
                valid = false;
            } else {
                //@ts-ignore
                copyErros[key] = "";
            }
        });
        setErrors(copyErros);
        return valid
    }
    const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (validateForm()) {
            // Submit
            dispatch(loginAsync(forms))
        }
    }
    return (
        <Fragment>
            <Navbar />
            <section className="grid place-content-center" style={{ height: "calc(100dvh - 2rem)" }}>
                <div className="border rounded-lg p-2 min-w-[20dvw]">
                    <form onSubmit={handleSubmit} className="" method="post">
                        <div className="mb-2">
                            <h1 className="text-center text-2xl font-semibold">Sign In</h1>
                            <p className="text-center text-red-600 text-base">{stateErr}</p>
                        </div>
                        <div className="my-2 text-lg">
                            <label htmlFor="" className="block">Username</label>
                            <div className="border rounded-md p-2">
                                <input type="text" name="username" value={forms["username"]} placeholder="username" onChange={handleInChange} className="outline-none border-none w-full" />
                            </div>
                            <span className="text-sm text-red-600">{errors["username"]}</span>
                        </div>
                        <div className="my-2 text-lg">
                            <label htmlFor="" className="block">Password</label>
                            <div className="border rounded-md p-2">
                                <input type="password" name="password" value={forms["password"]} placeholder="*******" onChange={handleInChange} className="outline-none border-none w-full" />
                            </div>
                            <span className="text-sm text-red-600">{errors["password"]}</span>
                        </div>
                        <div className="mt-2 mb-4">
                            <p>Don't have account? <a href="/register" className="text-blue-600 hover:underline underline-offset-2">Register here</a></p>
                        </div>
                        <div>
                            <button className="w-full bg-sky-500 hover:bg-sky-600 transition-colors rounded-lg py-2 cursor-pointer">
                                <span className="text-white font-semibold">Sign In</span>
                            </button>
                        </div>
                    </form>
                </div>
            </section>
        </Fragment>
    )
}