"use client"

import Shimmer from "components/Shimmer"
import { toSentenceCase } from "lib/string"
import Image from "next/image"
import { FaMosque } from "react-icons/fa"
import { MasjidProfileResponse } from "types/masjid"

const Profile = ({
  theme,
  data,
  logoFilename,
  masjidId,
}: {
  theme: string
  data: MasjidProfileResponse
  logoFilename?: string
  masjidId?: string
}) => {
  return (
    <div
      className={`z-20 drop-shadow-xl absolute flex w-full max-w-2xl items-center gap-2 pl-3 pr-6 py-2 rounded-br-[50px] bg-gradient-to-r from-${theme}-light to-${theme}-lighter flex-nowrap`}
    >
      {logoFilename && masjidId ? (
        <Image
          src={`/api/masjid/${masjidId}/logo/${logoFilename}`}
          alt="Logo"
          width={96}
          height={96}
          className="object-contain w-24 h-24 bg-white rounded-lg p-1"
        />
      ) : (
        <FaMosque className="text-white text-4xl w-24" />
      )}
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
