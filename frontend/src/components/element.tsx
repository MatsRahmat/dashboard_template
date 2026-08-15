import * as React from "react"
import { Fragment } from "react"

type ButtonAnchorType = {
    title: string;
    link: string
}
export const ButtonAnchor = ({ title, link }: ButtonAnchorType) => {
    return (
        <Fragment>
            <a href={link} className="inline-block px-4 py-2 hover:underline transition-all transform rounded-lg">
                <span>{title}</span>
            </a>
        </Fragment>
    )
}