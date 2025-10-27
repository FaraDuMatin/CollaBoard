import { Hint } from "@/app/(dashboard)/_components/hint";
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar";


interface UserAvatarProps {
    src?: string;
    name?: string;
    fallback?: string;
    borderColor?: string;
};


export const UserAvatar = ({
  src,
  name,
    fallback,
    borderColor = "border-white",
}: UserAvatarProps) => {
  return (
    <Hint label={name || "Teammate"} side="bottom" sideOffset={10}>
      <Avatar className={`w-8 h-8 border-2`} style={{ borderColor }}>
        <AvatarImage src={src} alt={name} />
        <AvatarFallback className="text-xs font-semibold">{fallback || "U"}</AvatarFallback>
      </Avatar>
    </Hint>
  );
}