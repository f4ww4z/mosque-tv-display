"use client"

import Shimmer from "components/Shimmer"
import { toSentenceCase } from "lib/string"
import { FaMosque } from "react-icons/fa"
import { MasjidProfileResponse } from "types/masjid"

const Profile = ({
  theme,
  data,
}: {
  theme: string
  data: MasjidProfileResponse
}) => {
  return (
    <div
      className={`z-10 drop-shadow-xl absolute flex w-full max-w-2xl items-center gap-2 pl-3 pr-6 py-2 rounded-br-[50px] bg-gradient-to-r from-${theme}-light to-${theme}-lighter flex-nowrap`}
    >
      <FaMosque className="text-white text-4xl w-24" />
      <div className="flex flex-col justify-start w-full gap-1">
        {!data ? (
          <>
            <Shimmer h={36} />
            <Shimmer h={24} />
          </>
        ) : (
          <>
            <p className="text-5xl font-bold leading-tight">
              <span className={theme !== "gold" && `text-[#FFCD6C]`}>
                {toSentenceCase(data?.type)}
              </span>
              &nbsp;{data?.name}
            </p>
            <p className="text-lg font-normal leading-tight">{data?.address}</p>
          </>
        )}
      </div>
    </div>
  )
}

export default Profile
