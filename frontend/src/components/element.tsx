import * as React from "react"
import { Link } from "react-router-dom"

type ButtonAnchorType = {
    title: string;
    link: string
}
export const ButtonAnchor = ({ title, link }: ButtonAnchorType) => {
    return (
        <React.Fragment>
            <Link to={link}>
                <p className="px-4 py-2 hover:underline transition-all transform rounded-lg text-blue-800">
                    <span>{title}</span>
                </p>
            </Link>
        </React.Fragment>
    )
}