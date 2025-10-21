"use client";

import Image from "next/image";
import{
    useOrganization,
    useOrganizationList,
} from "@clerk/nextjs";

import {cn} from "@/lib/utils";
import { Hint } from "../hint";

interface ItemProps {
    id: string;
    name: string;
    imageUrl: string;

};

export const Item = ({ id, name, imageUrl }: ItemProps) => {
    const { organization } = useOrganization();
    const {setActive} = useOrganizationList();
    const isActive = organization?.id === id;
    const onClick = () => {
        if (!setActive) {return;}
        setActive({ organization: id });
    }

    return (
        <Hint
            label={name}
            side="right"
            align="start"
            sideOffset={4}
        >
            <div className="aspect-square relative">
                <Image
                    fill
                    alt={name}
                    src={imageUrl}
                onClick={onClick}
                className={cn("rounded-md cursor-pointer",
                     "hover:opacity-100 opacity-50 transition",
                     isActive && "opacity-100 shadow-[0_2px_8px_0_rgba(255,255,255,0.7)]" )}
            />
        </div>
        </Hint>
    )
}
