import * as React from "react";
import { NavLink } from "react-router-dom";
import icons from "../../assets/react.svg"

interface CardLinkProps {
    link: string;
    name: string;
    icon?: string;
}
const CardLink = ({ link, name, icon }: CardLinkProps) => {
    return (
        <React.Fragment>
            <div className="transition-all">
                <NavLink to={link} className={({ isActive, isPending, isTransitioning }) => `${isActive ? 'text-black' :'text-white ' } " font-semibold"`}>
                    {({ isActive }) => (
                        <React.Fragment>
                            <div className={`flex gap-1.5 items-center pl-0.5 rounded-md ${isActive ? 'bg-slate-50' : ''}`}>
                                {icon && (
                                    <img src={icon} alt="Icon" className="size-7" />
                                )}
                                <p className="text-wrap truncate p-2  flex-auto">
                                    {name}
                                </p>
                            </div>
                        </React.Fragment>
                    )}
                </NavLink>
            </div>
        </React.Fragment>
    )
}

export default function Sidebar() {
    return (
        <React.Fragment>
            <div className="px-2 mt-1 space-y-1">
                <CardLink link="/dashboard" name="Dashboard" />
            </div>
        </React.Fragment>
    )
}