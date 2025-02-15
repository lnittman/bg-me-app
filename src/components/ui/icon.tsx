import { useTheme } from "next-themes"
import * as PhosphorIcons from "@phosphor-icons/react"
import { type Icon as PhosphorIcon } from "@phosphor-icons/react"

type IconName = keyof typeof PhosphorIcons
type IconWeight = "thin" | "light" | "regular" | "bold" | "fill" | "duotone"

interface IconProps extends React.ComponentProps<PhosphorIcon> {
  name: IconName
  weight?: IconWeight
}

export function Icon({ name, weight = "duotone", ...props }: IconProps) {
  const { theme } = useTheme()
  const IconComponent = PhosphorIcons[name] as PhosphorIcon

  return (
    <IconComponent
      weight={weight}
      color={theme === "dark" ? "white" : "black"}
      {...props}
    />
  )
} 