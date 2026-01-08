import Shimmer from "components/Shimmer"
import Marquee from "react-fast-marquee"

const NewsBanner = ({ news }: { news?: string[] }) => (
  <div className="absolute bottom-0 flex items-center w-full h-12 overflow-hidden flex-nowrap bg-dark">
    {news ? (
      <Marquee className="h-12">
        {news.map((item, index) => (
          <p
            key={index}
            className="px-4 text-2xl text-white"
          >
            {item}
            <span className="ml-8">|</span>
          </p>
        ))}
      </Marquee>
    ) : (
      <Shimmer h={12} />
    )}
  </div>
)

export default NewsBanner
