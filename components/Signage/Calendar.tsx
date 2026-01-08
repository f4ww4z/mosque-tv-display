import Shimmer from "components/Shimmer"

const Calendar = ({
  theme,
  gregorian,
  hijri,
}: {
  theme: string
  gregorian?: string
  hijri?: string
}) => {
  return (
    <div
      className={`flex flex-col items-end justify-center w-full min-h-20 gap-1 pr-8 py-2 bg-${theme}/80`}
    >
      {!gregorian || !hijri ? (
        <>
          <Shimmer
            h={36}
            w={80}
          />
          <Shimmer
            h={36}
            w={80}
          />
        </>
      ) : (
        <>
          <span className="text-3xl font-bold leading-tight text-[#FFCD6C]">
            {gregorian}
          </span>
          <span className="text-3xl font-medium leading-tight">{hijri}</span>
        </>
      )}
    </div>
  )
}

export default Calendar
