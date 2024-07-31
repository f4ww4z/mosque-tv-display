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
      className={`flex items-center justify-end w-full h-20 gap-4 pr-16 bg-${theme}/80 flex-nowrap`}
    >
      {!gregorian || !hijri ? (
        <>
          <Shimmer
            h={60}
            w={120}
          />
          <span className="text-4xl font-bold">/</span>
          <Shimmer
            h={60}
            w={120}
          />
        </>
      ) : (
        <>
          <span className="text-4xl font-bold">{gregorian}</span>
          <span className="text-4xl font-bold">/</span>
          <span className="text-4xl font-medium">{hijri}</span>
        </>
      )}
    </div>
  )
}

export default Calendar
