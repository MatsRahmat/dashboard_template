import * as React from "react"
import type { RegisterCredential, RegisterReturn } from "./clients/reducer"
import { registerAsync } from "./clients/reducer"
import { useDispatch, useSelector } from "react-redux";
import { type AppDispatch, type RootState } from "../../store";
import { Link } from "react-router-dom";
// import { loading_icon } from "../../assets/icons

export default function RegisterPage() {
    const dispatch = useDispatch<AppDispatch>()
    const { loading } = useSelector((state: RootState) => state.auth);
    const initForm = (): RegisterCredential => ({
        username: "",
        email: "",
        password: "",
        password_confirm: ""
    });
    const [forms, setForms] = React.useState<RegisterCredential>(initForm);
    const [errors, setErrors] = React.useState<RegisterCredential>(initForm);
    const [regReturn, setRegReturn] = React.useState<RegisterReturn>({
        mesg: "",
        status: false
    });
    const formValidate = (): boolean => {
        let valid = true;
        const copyErr = { ...errors };
        Object.entries(forms).forEach(([key, val]) => {
            if (!val) {
                //* Set error required
                valid = false;
                //@ts-ignore
                copyErr[key] = `${key.replace("_", " ")} is required`;
            } else {
                //* Clear error value
                //@ts-ignore
                copyErr[key] = ""
            }
        });
        setErrors(copyErr);
        return valid
    }

    const sbmitRegister = async () => {
        const sanitizedPayload = { ...forms };
        Object.entries(sanitizedPayload).forEach(([key, val]) => {
            if (val == null) {
                val = "";
            }
            //@ts-ignore
            sanitizedPayload[key] = val;
        });

        //@ts-ignore
        dispatch(registerAsync(sanitizedPayload)).then((resp) => {
            console.log({ resp })
            let errMesg = "";
            if (typeof resp.mesg == "string") {
                errMesg = resp.mesg;
            } else if (Array.isArray(resp.mesg)) {
                errMesg = resp.mesg[0]
                //@ts-ignore
            } else if (resp.mesg.hasOwnProperty("username")) {
                errMesg = resp.mesg["username"][0]
            }
            setRegReturn({
                status: resp.status,
                mesg: errMesg
            })
            // setRegReturn(resp);
        }).catch((err) => {
            console.error(err);
        })

    }
    const handleInChange = (e: React.ChangeEvent<HTMLInputElement, HTMLInputElement>) => {
        const { name, value } = e.target;
        setForms((prev) => ({ ...prev, [name]: value }))
    }
    const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        setRegReturn({ status: false, mesg: "" })
        if (formValidate()) {
            sbmitRegister();
        }
    }

    return (
        <React.Fragment>
            <section className="grid place-content-center" style={{ height: "calc(100dvh - 5rem)" }}>
                <div className="border rounded-lg p-2 min-w-[20dvw]">
                    <form onSubmit={handleSubmit} className="" method="post">
                        <div className="mb-2">
                            <h1 className="text-center text-2xl font-semibold">Sign Up</h1>
                            <p className="text-center text-red-600 text-base">
                                {!regReturn.status && (
                                    <span>{regReturn.mesg}</span>
                                )}
                            </p>
                        </div>
                        <div className="my-2 text-base">
                            <label htmlFor="" className="block">Username</label>
                            <div className="border rounded-md p-2">
                                <input type="text" name="username" value={forms["username"]} placeholder="username" onChange={handleInChange} className="outline-none border-none w-full" />
                            </div>
                            <span className="text-sm text-red-600">{errors["username"]}</span>
                        </div>
                        <div className="my-2 text-base">
                            <label htmlFor="" className="block">Email</label>
                            <div className="border rounded-md p-2">
                                <input type="email" name="email" value={forms["email"]} placeholder="example@mail.com" onChange={handleInChange} className="outline-none border-none w-full" />
                            </div>
                            <span className="text-sm text-red-600">{errors["email"]}</span>
                        </div>
                        <div className="my-2 text-base">
                            <label htmlFor="" className="block">Password</label>
                            <div className="border rounded-md p-2">
                                <input type="password" name="password" value={forms["password"]} placeholder="*******" onChange={handleInChange} className="outline-none border-none w-full" />
                            </div>
                            <span className="text-sm text-red-600">{errors["password"]}</span>
                        </div>
                        <div className="my-2 text-base">
                            <label htmlFor="" className="block">Password Confirm</label>
                            <div className="border rounded-md p-2">
                                <input type="password" name="password_confirm" value={forms["password_confirm"]} placeholder="*******" onChange={handleInChange} className="outline-none border-none w-full" />
                            </div>
                            <span className="text-sm text-red-600">{errors["password_confirm"]}</span>
                        </div>
                        <div className="mt-2 mb-4 flex gap-1">
                            <p>Already have account?</p>
                            <Link to="/auth/login">
                                <span className="text-blue-600 hover:underline underline-offset-2">Sign In here</span>
                            </Link>
                        </div>
                        <div>
                            <button className="w-full bg-sky-500 hover:bg-sky-600 transition-colors rounded-lg py-2 cursor-pointer">
                                <span className="text-white font-semibold">Sign In</span>
                            </button>
                        </div>
                    </form>
                </div>
            </section>
        </React.Fragment>
    )
}