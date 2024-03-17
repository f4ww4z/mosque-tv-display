import Clock from "components/Clock"
import DateAndHijri from "components/DateAndHijri"
import Timetable from "components/Timetable"

export default function Home() {
  return (
    <main
      className="flex justify-start h-screen pt-10"
      style={{
        backgroundImage: "url('/background.jpg')",
        backgroundSize: "cover",
      }}
    >
      <div className="flex flex-col items-center w-full gap-6 text-white max-w-[300px]">
        <Clock />
        <Timetable />
      </div>

      <div className="flex flex-col justify-end w-full gap-10">
        <DateAndHijri />

        <video
          className="w-full"
          width="1920"
          height="1080"
          autoPlay
          loop
          controls
          muted
        >
          <source
            src="/api/video"
            type="video/mp4"
          />
          Your browser does not support the video tag.
        </video>
      </div>
    </main>
  )
}
