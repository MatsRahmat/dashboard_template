import * as React from "react";
import BaseModal from "./BaseModal";

export type NotificationProps = {
    mesg: string;
    title: string;
    icon?: string;
    onClose: (event: React.MouseEvent<HTMLButtonElement>) => void;
    onConfirm?: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

export default function Notification(props: NotificationProps) {
    const { mesg, icon, title, onClose, onConfirm } = props;
    return (
        <BaseModal>
            <React.Fragment>
                <div className="p-2 min-w-md max-w-2xl max-h-96 bg-white rounded-md flex flex-col">
                    <div className="flex justify-between items-center flex-none">
                        <div className="flex gap-2 items-center">
                            {icon && (
                                <img src={icon} alt="Icon" className="size-10" />
                            )}
                            <h1 className="text-xl truncate font-semibold">{title}</h1>
                        </div>
                        <div>
                            <button onClick={onClose} className="hover:scale-3d hover:scale-[1.1] transition-all cursor-pointer">
                                <span className="text-3xl">&times;</span>
                            </button>
                        </div>
                    </div>
                    <div className="flex-auto h-full overflow-y-auto">
                        <p className="text-justify">{mesg}</p>
                    </div>
                    {onConfirm && (
                        <div className="flex mt-2 justify-between gap-2 flex-none">
                            <button onClick={onConfirm} className=" w-full rounded py-1.5 cursor-pointer transition-transform hover:scale-[1.019] bg-fuchsia-500"><span className="text-white font-semibold">Confirm</span></button>
                            <button onClick={onClose} className=" w-full rounded py-1.5 cursor-pointer transition-transform hover:scale-[1.019] bg-slate-50 border border-black"><span className="font-semibold">Cancel</span></button>
                        </div>
                    )}
                </div>
            </React.Fragment>
        </BaseModal>
    )
}