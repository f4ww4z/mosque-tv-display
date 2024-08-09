"use client"

import { ZoomAndFade } from "components/Animations"
import Asterisk from "components/Asterisk"
import LoadingIndicator from "components/LoadingIndicator"
import fetchJson from "lib/fetchJson"
import { toSentenceCase } from "lib/string"
import { FormEvent, useEffect, useState } from "react"
import PhoneInput, { isValidPhoneNumber } from "react-phone-number-input"
import Select from "react-select"
import { toast } from "react-toastify"
import { MasjidProfileResponse, MasjidProfileUpdateRequest } from "types/masjid"

const MasjidProfile = ({ id }: { id: string }) => {
  const [loading, setLoading] = useState<boolean>(true)
  const [loadingSubmit, setLoadingSubmit] = useState<boolean>(false)
  const [errorMessage, setErrorMessage] = useState<string>("")
  const [loadedProfile, setLoadedProfile] = useState<MasjidProfileResponse>()
  const [profile, setProfile] =
    useState<MasjidProfileUpdateRequest>(loadedProfile)

  const fetchData = async () => {
    setLoading(true)

    if (!id) {
      return
    }

    try {
      const data = await fetchJson<MasjidProfileResponse>(
        `/api/masjid/${id}/profile`
      )

      setLoadedProfile(data)
      setProfile(data)
    } catch (error) {
      toast.error(
        error.message ?? "Error berlaku semasa mengakses profil masjid."
      )
    }

    setLoading(false)
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setErrorMessage("")
    setLoadingSubmit(true)

    try {
      if (!isValidPhoneNumber(profile?.phone)) {
        throw new Error("Sila masukkan no. telefon yang sah.")
      }

      await fetchJson(`/api/masjid/${id}/profile`, {
        method: "PUT",
        body: JSON.stringify(profile),
      })

      toast.success("Profil masjid berjaya dikemaskini.")
      await fetchData()
    } catch (error) {
      toast.error(
        error.message ?? "Error berlaku semasa mengemaskini profil masjid."
      )
      setErrorMessage(
        error.message ?? "Error berlaku semasa mengemaskini profil masjid."
      )
    }

    setLoadingSubmit(false)
  }

  useEffect(() => {
    fetchData()
  }, [])

  const groupedCityOptions = () =>
    !loadedProfile
      ? []
      : loadedProfile.zones.map((zone) => ({
          label: `${zone.stateName} (${zone.code})`,
          options: zone.cities.map((city) => ({
            value: city.id,
            label: city.name,
          })),
        }))

  return (
    <div className="flex flex-col w-full lg:max-w-xl">
      {loading ? (
        <div className="w-full h-screen">
          <LoadingIndicator />
        </div>
      ) : (
        <>
          <ZoomAndFade
            triggerOnce
            className="w-full"
          >
            <p className="mb-6 text-4xl font-bold">
              Profil&nbsp;
              {toSentenceCase(`${loadedProfile?.type}`)}
              &nbsp;{loadedProfile?.name}
            </p>
          </ZoomAndFade>
          <ZoomAndFade
            triggerOnce
            className="w-full lg:max-w-xl"
          >
            <form
              onSubmit={handleSubmit}
              className="flex flex-col w-full gap-3 py-4 border-white rounded-lg drop-shadow-lg"
            >
              {errorMessage && (
                <div className="w-full my-4 text-lg font-bold text-center text-error-light rounded-xl">
                  {errorMessage}
                </div>
              )}

              <div className="flex flex-col w-full gap-1">
                <label
                  htmlFor="masjidType"
                  className="text-lg font-semibold"
                >
                  Jenis&nbsp;
                  <Asterisk />
                </label>

                <div className="flex flex-wrap w-full gap-4">
                  <div className="flex items-center gap-2 flex-nowrap">
                    <input
                      type="radio"
                      className="w-5 h-5"
                      name="masjidType"
                      id="bSurau"
                      checked={profile?.type === "SURAU"}
                      onChange={() =>
                        setProfile({
                          ...profile,
                          type: "SURAU",
                        })
                      }
                    />
                    <label htmlFor="bSurau">Surau</label>
                  </div>
                  <div className="flex items-center gap-2 flex-nowrap">
                    <input
                      type="radio"
                      className="w-5 h-5"
                      name="masjidType"
                      id="bMasjid"
                      checked={profile?.type === "MASJID"}
                      onChange={() =>
                        setProfile({
                          ...profile,
                          type: "MASJID",
                        })
                      }
                    />
                    <label htmlFor="bMasjid">Masjid</label>
                  </div>
                </div>
              </div>

              <div className="flex flex-col w-full gap-1">
                <label
                  htmlFor="masjidName"
                  className="text-lg font-semibold"
                >
                  Nama Masjid&nbsp;
                  <Asterisk />
                </label>

                <input
                  id="masjidName"
                  type="text"
                  placeholder="Masukkan nama masjid..."
                  className="w-full px-4 py-2 text-lg bg-primary-light rounded-xl"
                  value={profile?.name}
                  onChange={(e) =>
                    setProfile({
                      ...profile,
                      name: e.target.value,
                    })
                  }
                />
              </div>

              <div className="flex flex-col w-full gap-1">
                <label
                  htmlFor="registrationNo"
                  className="text-lg font-semibold"
                >
                  No. Pendaftaran / Kod Masjid
                </label>

                <input
                  id="registrationNo"
                  type="text"
                  placeholder="Masukkan no. pendaftaran / kod masjid..."
                  className="w-full px-4 py-2 text-lg bg-primary-light rounded-xl"
                  value={profile?.registrationNumber}
                  onChange={(e) =>
                    setProfile({
                      ...profile,
                      registrationNumber: e.target.value,
                    })
                  }
                />
              </div>

              <div className="flex flex-col w-full gap-1">
                <label
                  htmlFor="email"
                  className="text-lg font-semibold"
                >
                  E-mel
                </label>

                <input
                  id="email"
                  type="email"
                  placeholder="Masukkan e-mel masjid..."
                  className="w-full px-4 py-2 text-lg bg-primary-light rounded-xl"
                  value={profile?.email}
                  onChange={(e) =>
                    setProfile({
                      ...profile,
                      email: e.target.value,
                    })
                  }
                />
              </div>

              <div className="flex flex-col w-full gap-1">
                <label
                  htmlFor="phone"
                  className="text-lg font-semibold"
                >
                  No. Telefon
                </label>

                <PhoneInput
                  id="phone"
                  defaultCountry="MY"
                  international
                  countryCallingCodeEditable={false}
                  className="w-full px-4 py-2 text-lg bg-primary-light rounded-xl"
                  placeholder="Masukkan no. telefon masjid..."
                  value={profile?.phone}
                  onChange={(value) =>
                    setProfile({
                      ...profile,
                      phone: value,
                    })
                  }
                />
              </div>

              <div className="flex flex-col w-full gap-1">
                <label
                  htmlFor="address"
                  className="text-lg font-semibold"
                >
                  Alamat&nbsp;
                  <Asterisk />
                </label>

                <textarea
                  id="address"
                  placeholder="Masukkan alamat masjid..."
                  className="w-full px-4 py-2 text-lg bg-primary-light rounded-xl"
                  value={profile?.address}
                  onChange={(e) =>
                    setProfile({
                      ...profile,
                      address: e.target.value,
                    })
                  }
                />
              </div>

              <div className="flex flex-col w-full max-w-md gap-1">
                <label
                  htmlFor="city"
                  className="text-lg font-semibold"
                >
                  Kawasan&nbsp;
                  <Asterisk />
                </label>

                <Select
                  id="city"
                  className="w-full text-lg text-white border-none bg-primary-light rounded-xl"
                  options={groupedCityOptions()}
                  isClearable
                  placeholder="Pilih kawasan..."
                  styles={{
                    control: (base, state) => ({
                      ...base,
                      backgroundColor: "#1C5153",
                      borderRadius: "0.75rem",
                      borderColor: state.isFocused ? "#188D92" : "#1C5153",
                      height: "3rem",
                    }),
                    input: (base) => ({
                      ...base,
                      color: "white",
                    }),
                    singleValue: (base) => ({
                      ...base,
                      color: "white",
                    }),
                    placeholder: (base) => ({
                      ...base,
                      color: "#c7c7c7",
                    }),
                    menu: (base) => ({
                      ...base,
                      backgroundColor: "#133D3E",
                    }),
                    groupHeading: (base) => ({
                      ...base,
                      backgroundColor: "#133D3E",
                      color: "white",
                      fontSize: "1.25rem",
                      padding: "0 0.5rem 0.5rem 0.5rem",
                    }),
                    option: (base, state) => ({
                      ...base,
                      backgroundColor: state.isFocused ? "#188D92" : "#1C5153",
                      color: "white",
                    }),
                  }}
                  value={
                    !profile?.city
                      ? null
                      : {
                          value: profile?.city.id,
                          label: profile?.city.name,
                        }
                  }
                  onChange={(selected) => {
                    if (!selected?.value) {
                      setProfile({
                        ...profile,
                        city: null,
                      })
                      return
                    }

                    setProfile({
                      ...profile,
                      city: {
                        id: selected.value,
                        name: selected.label,
                      },
                    })
                  }}
                />
              </div>

              <div className="flex flex-col w-full gap-1">
                <label
                  htmlFor="postalCode"
                  className="text-lg font-semibold"
                >
                  Poskod
                </label>

                <input
                  id="postalCode"
                  type="text"
                  placeholder="Masukkan poskod..."
                  className="w-full px-4 py-2 text-lg bg-primary-light rounded-xl"
                  value={profile?.postalCode}
                  onChange={(e) =>
                    setProfile({
                      ...profile,
                      postalCode: e.target.value,
                    })
                  }
                  maxLength={5}
                />
              </div>

              <div className="flex gap-2 flex-nowrap">
                <button
                  type="button"
                  onClick={() => fetchData()}
                  className="flex items-center justify-center w-full py-2 text-lg font-semibold text-white transition bg-gray/20 hover:bg-gray/50 rounded-xl"
                  disabled={loadingSubmit}
                >
                  Reset Profil
                </button>
                <button
                  type="submit"
                  className="flex items-center justify-center w-full py-2 text-lg font-semibold text-white transition bg-accent-dark hover:bg-accent-dark/80 rounded-xl disabled:bg-gray"
                  disabled={loadingSubmit}
                >
                  {loadingSubmit ? <LoadingIndicator /> : "Kemaskini Profil"}
                </button>
              </div>
            </form>
          </ZoomAndFade>
        </>
      )}
    </div>
  )
}

export default MasjidProfile
