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
      className={`flex items-center justify-end w-full h-14 gap-2 pr-8 bg-${theme}/80 flex-nowrap`}
    >
      {!gregorian || !hijri ? (
        <>
          <Shimmer
            h={36}
            w={80}
          />
          <span className="text-2xl font-bold">/</span>
          <Shimmer
            h={36}
            w={80}
          />
        </>
      ) : (
        <>
          <span className="text-2xl font-bold">{gregorian}</span>
          <span className="text-2xl font-bold">/</span>
          <span className="text-2xl font-medium">{hijri}</span>
        </>
      )}
    </div>
  )
}

export default Calendar
