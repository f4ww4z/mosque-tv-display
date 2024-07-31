"use client"

import fetchJson from "lib/fetchJson"
import { FormEvent, useEffect, useState } from "react"
import { FaCheck } from "react-icons/fa"
import PhoneInput, { isValidPhoneNumber } from "react-phone-number-input"
import Select from "react-select"
import { toast } from "react-toastify"
import {
  ChoosePlanResponse,
  NewSubscriptionRequest,
  NewSubscriptionResponse,
} from "types/plan"
import { ZoomAndFade } from "./Animations"
import Asterisk from "./Asterisk"
import LoadingIndicator from "./LoadingIndicator"
import Shimmer from "./Shimmer"
import Switch from "./Switch"
import { saveJWTToken } from "lib/auth"
import { useRouter } from "next/navigation"

const SubscriptionTable = () => {
  const router = useRouter()
  const [settings, setSettings] = useState<ChoosePlanResponse>()
  const [isLoadingData, setIsLoadingData] = useState(true)
  const [isNextPressed, setIsNextPressed] = useState(false)
  const [subscription, setSubscription] = useState<NewSubscriptionRequest>({
    type: "monthly",
    masjid: {
      name: "",
      email: "",
      registrationNumber: "",
      address: "",
      city: {
        id: 0,
        name: "",
      },
      postalCode: "",
      country: "Malaysia",
    },
    admins: [
      {
        name: "",
        phoneNumber: "",
        email: "",
        password: "",
      },
      {
        name: "",
        phoneNumber: "",
        email: "",
        password: "",
      },
    ],
  })
  const [errorMessage, setErrorMessage] = useState("")
  const [loadingMasjidSubmit, setLoadingMasjidSubmit] = useState(false)

  const fetchData = async () => {
    setIsLoadingData(true)

    try {
      const data = await fetchJson<ChoosePlanResponse>("/api/plan")

      setSettings(data)
    } catch (error) {
      toast.error("Gagal memuatkan tetapan pelan. Sila cuba sebentar lagi.")
    }

    setIsLoadingData(false)
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()

    setErrorMessage("")
    setLoadingMasjidSubmit(true)

    try {
      if (!isValidPhoneNumber(subscription.admins[0].phoneNumber)) {
        throw new Error("Sila masukkan no. telefon pentadbir 1 yang sah.")
      }

      if (!isValidPhoneNumber(subscription.admins[1].phoneNumber)) {
        throw new Error("Sila masukkan no. telefon pentadbir 2 yang sah.")
      }

      const res = await fetchJson<NewSubscriptionResponse>("/api/plan", {
        method: "POST",
        body: JSON.stringify(subscription),
      })

      const loginRes = await fetchJson<{ token: string }>("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({
          email: subscription.admins[0].email,
          password: subscription.admins[0].password,
        }),
      })

      saveJWTToken(loginRes.token)

      router.push(`/masjid/${res.id}/dashboard`)

      toast.success("Anda telah berjaya mendaftarkan masjid anda.")
    } catch (error) {
      setErrorMessage(error.message)
      toast.error(error.message)

      document.getElementById("anchor-next-pressed")?.scrollIntoView({
        behavior: "smooth",
      })

      setLoadingMasjidSubmit(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  // useEffect(() => {
  //   console.log(subscription)
  // }, [subscription])

  const getYearlyDiscount = () => {
    if (!settings) return 0

    return Math.round(
      ((settings.monthlyFee * 12 - settings.yearlyFee) /
        (settings.monthlyFee * 12)) *
        100
    )
  }

  const getDiscountedPricePerMonth = () => {
    if (!settings) return 0

    return settings.yearlyFee / 12
  }

  const groupedCityOptions = () =>
    !settings
      ? []
      : settings.zones.map((zone) => ({
          label: `${zone.stateName} (${zone.code})`,
          options: zone.cities.map((city) => ({
            value: city.id,
            label: city.name,
          })),
        }))

  return (
    <>
      <ZoomAndFade
        triggerOnce
        className="flex items-center justify-center gap-3 text-2xl flex-nowrap"
      >
        <p>Bulanan</p>
        <Switch
          onChange={(on) => {
            setSubscription({
              ...subscription,
              type: on ? "yearly" : "monthly",
            })
          }}
        />
        <p>Tahunan</p>
      </ZoomAndFade>
      <ZoomAndFade
        triggerOnce
        className="flex flex-col items-center justify-center w-full max-w-2xl p-6 border-2 border-white bg-primary-darker rounded-3xl drop-shadow-2xl"
      >
        <div className="flex items-center gap-2 lg:gap-3 flex-nowrap">
          {isLoadingData ? (
            <Shimmer
              w={400}
              h={140}
            />
          ) : (
            <>
              <span
                className={`transition duration-500 font-bold text-6xl lg:text-8xl ${subscription?.type === "monthly" ? "text-white" : "text-accent"}`}
              >
                RM&nbsp;
                {subscription?.type === "monthly"
                  ? settings?.monthlyFee
                  : getDiscountedPricePerMonth()}
              </span>
              <span
                className={`lg:pt-3 text-lg lg:text-2xl ${subscription?.type === "monthly" ? "text-white" : "text-accent"}`}
              >
                /&nbsp;bulan
              </span>
            </>
          )}
        </div>
        {subscription?.type === "yearly" && (
          <div className="flex flex-col items-center gap-4">
            <div className="flex items-center gap-2 lg:gap-3 flex-nowrap text-accent">
              <span className="text-2xl">atau</span>
              <span className="text-3xl font-bold">
                RM&nbsp;{settings?.yearlyFee}
              </span>
              <span className="text-2xl">/&nbsp;tahun</span>
            </div>
            <div className="flex items-center justify-center px-4 py-1 rounded-lg flex-nowrap w-fit bg-gradient-to-r from-orange to-red">
              <span className="text-2xl font-semibold text-center text-white">
                {getYearlyDiscount()}% OFF!
              </span>
            </div>
          </div>
        )}
        <p className="my-8 text-lg text-center">
          Sistem Pengurusan Masjid kami menyediakan paparan digital, pengurusan
          acara, fasiliti, dan derma yang canggih, memudahkan pentadbiran masjid
          serta interaksi dengan jemaah melalui aplikasi mudah alih dan laman
          web.
        </p>
        <div className="flex flex-col gap-3 mb-4 rounded-xl">
          {isLoadingData ? (
            <Shimmer h={800} />
          ) : (
            settings?.features?.map((f, idx) => (
              <div
                key={idx}
                className="flex items-center gap-2"
              >
                <p className="text-md lg:text-lg text-primary-lighter">
                  <FaCheck />
                </p>
                <p className="leading-tight text-white text-md lg:text-lg">
                  {f}
                </p>
              </div>
            ))
          )}
        </div>

        <button
          className="px-5 py-3 mt-4 text-lg font-semibold transition rounded-lg bg-accent-dark hover:bg-accent"
          onClick={async () => {
            setIsNextPressed(true)

            await new Promise((resolve) => setTimeout(resolve, 100))

            document.getElementById("anchor-next-pressed")?.scrollIntoView({
              behavior: "smooth",
            })
          }}
        >
          Teruskan Pelan{" "}
          {subscription?.type === "monthly" ? "Bulanan" : "Tahunan"}
        </button>

        <p className="mt-8 text-center text-white text-md">
          *Harga termasuk SST. Tiada yuran tersembunyi.
        </p>
      </ZoomAndFade>

      <div
        id="anchor-next-pressed"
        className="w-full h-8"
      ></div>

      {isNextPressed && (
        <ZoomAndFade
          className="flex justify-center w-full lg:max-w-4xl"
          triggerOnce
        >
          <form
            id="form-purchase"
            className="flex flex-col items-center justify-center w-full gap-3 p-6 border-2 border-white bg-primary-darker rounded-3xl drop-shadow-2xl"
            onSubmit={handleSubmit}
          >
            <p className="w-full mb-2 text-3xl font-bold text-center">
              Isi Maklumat Masjid
            </p>

            {errorMessage && (
              <div className="w-full my-4 text-lg font-bold text-center text-error-light rounded-xl">
                {errorMessage}
              </div>
            )}

            <div className="flex flex-col w-full max-w-md gap-1">
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
                    checked={subscription.masjid.type === "SURAU"}
                    onChange={() =>
                      setSubscription({
                        ...subscription,
                        masjid: {
                          ...subscription.masjid,
                          type: "SURAU",
                        },
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
                    checked={subscription.masjid.type === "MASJID"}
                    onChange={() =>
                      setSubscription({
                        ...subscription,
                        masjid: {
                          ...subscription.masjid,
                          type: "MASJID",
                        },
                      })
                    }
                  />
                  <label htmlFor="bMasjid">Masjid</label>
                </div>
              </div>
            </div>

            <div className="flex flex-col w-full max-w-md gap-1">
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
                className="w-full p-2 text-lg bg-primary-light rounded-xl"
                value={subscription.masjid.name}
                onChange={(e) =>
                  setSubscription({
                    ...subscription,
                    masjid: {
                      ...subscription.masjid,
                      name: e.target.value,
                    },
                  })
                }
              />
            </div>
            <div className="flex flex-col w-full max-w-md gap-1">
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
                className="w-full p-2 text-lg bg-primary-light rounded-xl"
                value={subscription.masjid.registrationNumber}
                onChange={(e) =>
                  setSubscription({
                    ...subscription,
                    masjid: {
                      ...subscription.masjid,
                      registrationNumber: e.target.value,
                    },
                  })
                }
              />
            </div>
            <div className="flex flex-col w-full max-w-md gap-1">
              <label
                htmlFor="masjidEmail"
                className="text-lg font-semibold"
              >
                E-mel Masjid&nbsp;
                <Asterisk />
              </label>

              <input
                id="masjidEmail"
                type="email"
                placeholder="Masukkan e-mel masjid..."
                className="w-full p-2 text-lg bg-primary-light rounded-xl"
                value={subscription.masjid.email}
                onChange={(e) =>
                  setSubscription({
                    ...subscription,
                    masjid: {
                      ...subscription.masjid,
                      email: e.target.value,
                    },
                  })
                }
              />
            </div>
            <div className="flex flex-col w-full max-w-md gap-1">
              <label
                htmlFor="address"
                className="text-lg font-semibold"
              >
                Alamat Masjid&nbsp;
                <Asterisk />
              </label>

              <input
                id="address"
                type="text"
                placeholder="Masukkan alamat penuh..."
                className="w-full p-2 text-lg bg-primary-light rounded-xl"
                value={subscription.masjid.address}
                onChange={(e) =>
                  setSubscription({
                    ...subscription,
                    masjid: {
                      ...subscription.masjid,
                      address: e.target.value,
                    },
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

              {!settings || !subscription?.masjid?.city ? (
                <LoadingIndicator />
              ) : (
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
                    !subscription.masjid.city.id
                      ? null
                      : {
                          value: subscription.masjid.city.id,
                          label: subscription.masjid.city.name,
                        }
                  }
                  onChange={(selected) => {
                    if (!selected?.value) {
                      setSubscription({
                        ...subscription,
                        masjid: {
                          ...subscription.masjid,
                          city: {
                            id: 0,
                            name: "",
                          },
                        },
                      })
                    }

                    setSubscription({
                      ...subscription,
                      masjid: {
                        ...subscription.masjid,
                        city: {
                          id: selected.value,
                          name: selected.label,
                        },
                      },
                    })
                  }}
                />
              )}
            </div>

            <div className="flex flex-col w-full max-w-md gap-1">
              <label
                htmlFor="postalCode"
                className="text-lg font-semibold"
              >
                Kod Pos Masjid&nbsp;
                <Asterisk />
              </label>

              <input
                id="postalCode"
                type="text"
                placeholder="Masukkan kod pos penuh..."
                className="w-full p-2 text-lg bg-primary-light rounded-xl"
                value={subscription.masjid.postalCode}
                onChange={(e) =>
                  setSubscription({
                    ...subscription,
                    masjid: {
                      ...subscription.masjid,
                      postalCode: e.target.value,
                    },
                  })
                }
                maxLength={5}
              />
            </div>

            <p className="mt-6 mb-2 text-xl font-bold">Akaun-akaun pentadbir</p>

            <div className="flex flex-wrap w-full gap-6 md:gap-0 md:flex-nowrap">
              <div className="flex flex-col w-full gap-2 px-2 md:w-1/2">
                <div className="flex flex-col w-full">
                  <label
                    htmlFor="adminName"
                    className="text-lg font-semibold"
                  >
                    Nama Penuh Pentadbir 1&nbsp;
                    <Asterisk />
                  </label>

                  <input
                    id="adminName"
                    type="text"
                    placeholder="Masukkan nama penuh..."
                    className="w-full p-2 text-lg bg-primary-light rounded-xl"
                    value={subscription.admins[0].name}
                    onChange={(e) =>
                      setSubscription({
                        ...subscription,
                        admins: [
                          {
                            ...subscription.admins[0],
                            name: e.target.value,
                          },
                          subscription.admins[1],
                        ],
                      })
                    }
                  />
                </div>

                <div className="flex flex-col w-full gap-1">
                  <label
                    htmlFor="adminPhone"
                    className="text-lg font-semibold"
                  >
                    Nombor Telefon Pentadbir 1&nbsp;
                    <Asterisk />
                  </label>

                  <PhoneInput
                    id="adminPhone"
                    defaultCountry="MY"
                    international
                    countryCallingCodeEditable={false}
                    className="w-full p-2 text-lg bg-primary-light rounded-xl"
                    placeholder="Masukkan nombor telefon..."
                    value={subscription.admins[0].phoneNumber}
                    onChange={(value) =>
                      setSubscription({
                        ...subscription,
                        admins: [
                          {
                            ...subscription.admins[0],
                            phoneNumber: value,
                          },
                          subscription.admins[1],
                        ],
                      })
                    }
                  />
                </div>

                <div className="flex flex-col w-full gap-1">
                  <label
                    htmlFor="adminEmail"
                    className="text-lg font-semibold"
                  >
                    Email Pentadbir 1&nbsp;
                    <Asterisk />
                  </label>

                  <input
                    id="adminEmail"
                    type="email"
                    placeholder="Masukkan email..."
                    className="w-full p-2 text-lg bg-primary-light rounded-xl"
                    value={subscription.admins[0].email}
                    onChange={(e) =>
                      setSubscription({
                        ...subscription,
                        admins: [
                          {
                            ...subscription.admins[0],
                            email: e.target.value,
                          },
                          subscription.admins[1],
                        ],
                      })
                    }
                  />
                </div>

                <div className="flex flex-col w-full gap-1">
                  <label
                    htmlFor="adminPassword"
                    className="text-lg font-semibold"
                  >
                    Kata Laluan Pentadbir 1&nbsp;
                    <Asterisk />
                  </label>

                  <input
                    id="adminPassword"
                    type="password"
                    placeholder="Masukkan kata laluan..."
                    className="w-full p-2 text-lg bg-primary-light rounded-xl"
                    value={subscription.admins[0].password}
                    onChange={(e) =>
                      setSubscription({
                        ...subscription,
                        admins: [
                          {
                            ...subscription.admins[0],
                            password: e.target.value,
                          },
                          subscription.admins[1],
                        ],
                      })
                    }
                  />
                </div>
              </div>
              <div className="flex flex-col w-full gap-2 px-2 md:w-1/2">
                <div className="flex flex-col w-full">
                  <label
                    htmlFor="adminName"
                    className="text-lg font-semibold"
                  >
                    Nama Penuh Pentadbir 2&nbsp;
                    <Asterisk />
                  </label>

                  <input
                    id="adminName"
                    type="text"
                    placeholder="Masukkan nama penuh..."
                    className="w-full p-2 text-lg bg-primary-light rounded-xl"
                    value={subscription.admins[1].name}
                    onChange={(e) =>
                      setSubscription({
                        ...subscription,
                        admins: [
                          subscription.admins[0],
                          {
                            ...subscription.admins[1],
                            name: e.target.value,
                          },
                        ],
                      })
                    }
                  />
                </div>

                <div className="flex flex-col w-full gap-1">
                  <label
                    htmlFor="adminPhone"
                    className="text-lg font-semibold"
                  >
                    Nombor Telefon Pentadbir 2&nbsp;
                    <Asterisk />
                  </label>

                  <PhoneInput
                    id="adminPhone"
                    defaultCountry="MY"
                    international
                    countryCallingCodeEditable={false}
                    className="w-full p-2 text-lg bg-primary-light rounded-xl"
                    placeholder="Masukkan nombor telefon..."
                    value={subscription.admins[1].phoneNumber}
                    onChange={(value) =>
                      setSubscription({
                        ...subscription,
                        admins: [
                          subscription.admins[0],
                          {
                            ...subscription.admins[1],
                            phoneNumber: value,
                          },
                        ],
                      })
                    }
                  />
                </div>

                <div className="flex flex-col w-full gap-1">
                  <label
                    htmlFor="adminEmail"
                    className="text-lg font-semibold"
                  >
                    Email Pentadbir 2&nbsp;
                    <Asterisk />
                  </label>

                  <input
                    id="adminEmail"
                    type="email"
                    placeholder="Masukkan email..."
                    className="w-full p-2 text-lg bg-primary-light rounded-xl"
                    value={subscription.admins[1].email}
                    onChange={(e) =>
                      setSubscription({
                        ...subscription,
                        admins: [
                          subscription.admins[0],
                          {
                            ...subscription.admins[1],
                            email: e.target.value,
                          },
                        ],
                      })
                    }
                  />
                </div>

                <div className="flex flex-col w-full gap-1">
                  <label
                    htmlFor="adminPassword"
                    className="text-lg font-semibold"
                  >
                    Kata Laluan Pentadbir 2&nbsp;
                    <Asterisk />
                  </label>

                  <input
                    id="adminPassword"
                    type="password"
                    placeholder="Masukkan kata laluan..."
                    className="w-full p-2 text-lg bg-primary-light rounded-xl"
                    value={subscription.admins[1].password}
                    onChange={(e) =>
                      setSubscription({
                        ...subscription,
                        admins: [
                          subscription.admins[0],
                          {
                            ...subscription.admins[1],
                            password: e.target.value,
                          },
                        ],
                      })
                    }
                  />
                </div>
              </div>
            </div>

            {loadingMasjidSubmit ? (
              <div className="flex justify-center w-full h-8 my-4">
                <LoadingIndicator />
              </div>
            ) : (
              <button
                type="submit"
                className="px-5 py-3 mt-4 text-lg font-semibold transition rounded-lg bg-accent-dark hover:bg-accent disabled:bg-gray"
                disabled={loadingMasjidSubmit}
              >
                Daftar Masjid Baru
              </button>
            )}
          </form>
        </ZoomAndFade>
      )}
    </>
  )
}

export default SubscriptionTable
