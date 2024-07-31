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
      className={`z-10 drop-shadow-xl absolute flex w-full max-w-4xl items-center gap-4 pl-8 pr-16 py-4 rounded-br-[100px] bg-gradient-to-r from-${theme}-light to-${theme}-lighter flex-nowrap`}
    >
      <FaMosque className="text-white text-8xl w-52" />
      <div className="flex flex-col justify-start w-full gap-2">
        {!data ? (
          <>
            <Shimmer h={44} />
            <Shimmer h={32} />
          </>
        ) : (
          <>
            <p className="text-5xl font-bold">
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
