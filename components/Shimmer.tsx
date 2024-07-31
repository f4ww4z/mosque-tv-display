const Shimmer = ({
  w,
  h,
  className,
}: {
  w?: number
  h: number
  className?: string
}) => (
  <div
    className={`rounded-xl animate-pulse bg-gray-light/50 ${w ? `w-${w}` : "w-full"} ${className}`}
    style={{
      height: `${h}px`,
    }}
  ></div>
)

export default Shimmer
