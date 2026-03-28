import {
  CircleCheckIcon,
  InfoIcon,
  Loader2Icon,
  OctagonXIcon,
  TriangleAlertIcon,
} from "lucide-react"
import { Toaster as Sonner, type ToasterProps } from "sonner"

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      theme="light"
      className="toaster group"
      icons={{
        success: <CircleCheckIcon className="size-4" />,
        info: <InfoIcon className="size-4" />,
        warning: <TriangleAlertIcon className="size-4" />,
        error: <OctagonXIcon className="size-4" />,
        loading: <Loader2Icon className="size-4 animate-spin" />,
      }}
      style={
        {
          "--success-bg": "#D4AF37",
          "--success-text": "#ffffff",
          "--success-border": "#B8941F",
          "--error-bg": "#DC2626",
          "--error-text": "#ffffff",
          "--error-border": "#991B1B",
          "--info-bg": "#2563EB",
          "--info-text": "#ffffff",
          "--info-border": "#1D4ED8",
          "--border-radius": "8px",
        } as React.CSSProperties
      }
      position="top-right"
      expand={false}
      richColors
      closeButton
      {...props}
    />
  )
}

export { Toaster }
