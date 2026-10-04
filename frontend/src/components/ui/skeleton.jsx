import { cn } from "@/lib/utils"

function Skeleton({
  className,
  ...props
}) {
  return (
<<<<<<< HEAD
    <div
      className={cn("animate-pulse rounded-md bg-primary/10", className)}
      {...props} />
=======
    (<div
      className={cn("animate-pulse rounded-md bg-primary/10", className)}
      {...props} />)
>>>>>>> e34899ed48ff1abdba7580f004c4122e59c0db59
  );
}

export { Skeleton }
