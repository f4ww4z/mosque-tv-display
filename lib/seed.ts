import { PrismaClient } from "@prisma/client"
import bcrypt from "bcrypt"
import fs from "fs"
import path from "path"

const prisma = new PrismaClient()

async function main() {
  const pwd = await bcrypt.hash("Admin123", 10)

  const superadmin = await prisma.user.create({
    data: {
      email: "admin@admin.com",
      phoneNumber: "+60123456789",
      password: pwd,
      role: "SUPERADMIN",
      fullName: "Super Admin",
    },
  })

  console.log(`Created superadmin:`)
  console.log(superadmin)

  const cityData = [
    {
      state: "Johor",
      zones: [
        {
          zone: "JHR01",
          cities: ["Pulau Aur", "Pulau Pemanggil"],
        },
        {
          zone: "JHR02",
          cities: ["Johor Bahru", "Kota Tinggi", "Mersing", "Kulai"],
        },
        {
          zone: "JHR03",
          cities: ["Kluang", "Pontian"],
        },
        {
          zone: "JHR04",
          cities: ["Batu Pahat", "Muar", "Segamat", "Gemas Johor", "Tangkak"],
        },
      ],
    },
    {
      state: "Kedah",
      zones: [
        {
          zone: "KDH01",
          cities: ["Kota Setar", "Kubang Pasu", "Pokok Sena (Daerah Kecil)"],
        },
        {
          zone: "KDH02",
          cities: ["Kuala Muda", "Yan", "Pendang"],
        },
        {
          zone: "KDH03",
          cities: ["Padang Terap", "Sik"],
        },
        {
          zone: "KDH04",
          cities: ["Baling"],
        },
        {
          zone: "KDH05",
          cities: ["Bandar Baharu", "Kulim"],
        },
        {
          zone: "KDH06",
          cities: ["Langkawi"],
        },
        {
          zone: "KDH07",
          cities: ["Puncak Gunung Jerai"],
        },
      ],
    },
    {
      state: "Kelantan",
      zones: [
        {
          zone: "KTN01",
          cities: [
            "Bachok",
            "Kota Bharu",
            "Machang",
            "Pasir Mas",
            "Pasir Puteh",
            "Tanah Merah",
            "Tumpat",
            "Kuala Krai",
            "Mukim Chiku",
          ],
        },
        {
          zone: "KTN02",
          cities: [
            "Gua Musang (Daerah Galas Dan Bertam)",
            "Jeli",
            "Jajahan Kecil Lojing",
          ],
        },
      ],
    },
    {
      state: "Melaka",
      zones: [
        {
          zone: "MLK01",
          cities: ["SELURUH NEGERI MELAKA"],
        },
      ],
    },
    {
      state: "Negeri Sembilan",
      zones: [
        {
          zone: "NGS01",
          cities: ["Tampin", "Jempol"],
        },
        {
          zone: "NGS02",
          cities: ["Jelebu", "Kuala Pilah", "Rembau"],
        },
        {
          zone: "NGS03",
          cities: ["Port Dickson", "Seremban"],
        },
      ],
    },
    {
      state: "Pahang",
      zones: [
        {
          zone: "PHG01",
          cities: ["Pulau Tioman"],
        },
        {
          zone: "PHG02",
          cities: ["Kuantan", "Pekan", "Rompin", "Muadzam Shah"],
        },
        {
          zone: "PHG03",
          cities: ["Jerantut", "Temerloh", "Maran", "Bera", "Chenor", "Jengka"],
        },
        {
          zone: "PHG04",
          cities: ["Bentong", "Lipis", "Raub"],
        },
        {
          zone: "PHG05",
          cities: ["Genting Sempah", "Janda Baik", "Bukit Tinggi"],
        },
        {
          zone: "PHG06",
          cities: ["Cameron Highlands", "Genting Highlands", "Bukit Fraser"],
        },
      ],
    },
    {
      state: "Perlis",
      zones: [
        {
          zone: "PLS01",
          cities: ["Kangar", "Padang Besar", "Arau"],
        },
      ],
    },
    {
      state: "Pulau Pinang",
      zones: [
        {
          zone: "PNG01",
          cities: ["Seluruh Negeri Pulau Pinang"],
        },
      ],
    },
    {
      state: "Perak",
      zones: [
        {
          zone: "PRK01",
          cities: ["Tapah", "Slim River", "Tanjung Malim"],
        },
        {
          zone: "PRK02",
          cities: [
            "Kuala Kangsar",
            "Sg. Siput",
            "Ipoh",
            "Batu Gajah",
            "Kampar",
          ],
        },
        {
          zone: "PRK03",
          cities: ["Lenggong", "Pengkalan Hulu", "Grik"],
        },
        {
          zone: "PRK04",
          cities: ["Temengor", "Belum"],
        },
        {
          zone: "PRK05",
          cities: [
            "Kg Gajah",
            "Teluk Intan",
            "Bagan Datuk",
            "Seri Iskandar",
            "Beruas",
            "Parit",
            "Lumut",
            "Sitiawan",
            "Pulau Pangkor",
          ],
        },
        {
          zone: "PRK06",
          cities: ["Selama", "Taiping", "Bagan Serai", "Parit Buntar"],
        },
        {
          zone: "PRK07",
          cities: ["Bukit Larut"],
        },
      ],
    },
    {
      state: "Sabah",
      zones: [
        {
          zone: "SBH01",
          cities: [
            "Bahagian Sandakan (Timur)",
            "Bukit Garam",
            "Semawang",
            "Temanggong",
            "Tambisan",
            "Bandar Sandakan",
            "Sukau",
          ],
        },
        {
          zone: "SBH02",
          cities: [
            "Beluran",
            "Telupid",
            "Pinangah",
            "Terusan",
            "Kuamut",
            "Bahagian Sandakan (Barat)",
          ],
        },
        {
          zone: "SBH03",
          cities: [
            "Lahad Datu",
            "Silabukan",
            "Kunak",
            "Sahabat",
            "Semporna",
            "Tungku",
            "Bahagian Tawau (Timur)",
          ],
        },
        {
          zone: "SBH04",
          cities: [
            "Bandar Tawau",
            "Balong",
            "Merotai",
            "Kalabakan",
            "Bahagian Tawau (Barat)",
          ],
        },
        {
          zone: "SBH05",
          cities: [
            "Kudat",
            "Kota Marudu",
            "Pitas",
            "Pulau Banggi",
            "Bahagian Kudat",
          ],
        },
        {
          zone: "SBH06",
          cities: ["Gunung Kinabalu"],
        },
        {
          zone: "SBH07",
          cities: [
            "Kota Kinabalu",
            "Ranau",
            "Kota Belud",
            "Tuaran",
            "Penampang",
            "Papar",
            "Putatan",
            "Bahagian Pantai Barat",
          ],
        },
        {
          zone: "SBH08",
          cities: [
            "Pensiangan",
            "Keningau",
            "Tambunan",
            "Nabawan",
            "Bahagian Pendalaman (Atas)",
          ],
        },
        {
          zone: "SBH09",
          cities: [
            "Beaufort",
            "Kuala Penyu",
            "Sipitang",
            "Tenom",
            "Long Pasia",
            "Membakut",
            "Weston",
            "Bahagian Pendalaman (Bawah)",
          ],
        },
      ],
    },
    {
      state: "Selangor",
      zones: [
        {
          zone: "SGR01",
          cities: [
            "Gombak",
            "Petaling",
            "Sepang",
            "Hulu Langat",
            "Hulu Selangor",
            "S.Alam",
          ],
        },
        {
          zone: "SGR02",
          cities: ["Kuala Selangor", "Sabak Bernam"],
        },
        {
          zone: "SGR03",
          cities: ["Klang", "Kuala Langat"],
        },
      ],
    },
    {
      state: "Sarawak",
      zones: [
        {
          zone: "SWK01",
          cities: ["Limbang", "Lawas", "Sundar", "Trusan"],
        },
        {
          zone: "SWK02",
          cities: ["Miri", "Niah", "Bekenu", "Sibuti", "Marudi"],
        },
        {
          zone: "SWK03",
          cities: ["Pandan", "Belaga", "Suai", "Tatau", "Sebauh", "Bintulu"],
        },
        {
          zone: "SWK04",
          cities: [
            "Sibu",
            "Mukah",
            "Dalat",
            "Song",
            "Igan",
            "Oya",
            "Balingian",
            "Kanowit",
            "Kapit",
          ],
        },
        {
          zone: "SWK05",
          cities: [
            "Sarikei",
            "Matu",
            "Julau",
            "Rajang",
            "Daro",
            "Bintangor",
            "Belawai",
          ],
        },
        {
          zone: "SWK06",
          cities: [
            "Lubok Antu",
            "Sri Aman",
            "Roban",
            "Debak",
            "Kabong",
            "Lingga",
            "Engkelili",
            "Betong",
            "Spaoh",
            "Pusa",
            "Saratok",
          ],
        },
        {
          zone: "SWK07",
          cities: ["Serian", "Simunjan", "Samarahan", "Sebuyau", "Meludam"],
        },
        {
          zone: "SWK08",
          cities: ["Kuching", "Bau", "Lundu", "Sematan"],
        },
        {
          zone: "SWK09",
          cities: ["Zon Khas (Kampung Patarikan)"],
        },
      ],
    },
    {
      state: "Terengganu",
      zones: [
        {
          zone: "TRG01",
          cities: ["Kuala Terengganu", "Marang", "Kuala Nerus"],
        },
        {
          zone: "TRG02",
          cities: ["Besut", "Setiu"],
        },
        {
          zone: "TRG03",
          cities: ["Hulu Terengganu"],
        },
        {
          zone: "TRG04",
          cities: ["Dungun", "Kemaman"],
        },
      ],
    },
    {
      state: "Wilayah Persekutuan",
      zones: [
        {
          zone: "WLY01",
          cities: ["Kuala Lumpur", "Putrajaya"],
        },
        {
          zone: "WLY02",
          cities: ["Labuan"],
        },
      ],
    },
  ]

  // Malaysia city data for JAKIM prayer times
  for (const stateData of cityData) {
    const state = await prisma.state.create({
      data: {
        name: stateData.state,
        zones: {
          create: stateData.zones.map((zoneData) => ({
            code: zoneData.zone,
            cities: {
              create: zoneData.cities.map((city) => ({ name: city })),
            },
          })),
        },
      },
    })

    console.log(`Created JAKIM MY state: ${state.name}`)
  }

  // Create default admin settings
  await prisma.adminSettings.create({
    data: {
      monthlyFee: 250,
      yearlyFee: 2400,
      features: [
        "Paparan skrin digital untuk TV",
        "Kemaskini skrin digital melalui peranti mudah alih",
        "Peringatan iqamah dan mod khusyuk solat",
        "Tetapan dan pengurusan maklumat masjid",
        "Pemberitahuan dan pengurusan aktiviti-aktiviti masjid",
        "Tempahan dan pengurusan fasiliti",
        "Paparan barang hilang dan jumpa",
        "Pengurusan dan rekod derma",
        "Pengurusan admin pihak masjid",
        "Keserasian peranti mudah alih dan laman web",
        "Pemberitahuan azan automatik secara audio",
      ],
    },
  })

  // Create one masjid with masjid admin
  const kl = await prisma.city.findFirst({
    where: {
      name: "Kuala Lumpur",
    },
    select: {
      id: true,
    },
  })

  const newsTexts = [
    "Selamat datang ke Surau Al-Mustaqim",
    "Sila matikan telefon anda semasa solat",
    "Sila jaga kebersihan masjid",
    "Sila derma dengan murah hati",
    "Sila ikuti SOP",
    "Jom bersama-sama kita tingkatkan semangat muslim community MSQ!",
    "Ingatlah, solat adalah tiang agama",
    "Sila patuhi arahan petugas masjid",
    "Jaga solat, jaga diri, jaga keluarga",
  ]

  const worldTimezones = [
    {
      city: "Makkah",
      timezone: "Asia/Riyadh",
    },
    {
      city: "Madinah",
      timezone: "Asia/Riyadh",
    },
    {
      city: "Baitul Maqdis",
      timezone: "Asia/Jerusalem",
    },
    {
      city: "Jakarta",
      timezone: "Asia/Jakarta",
    },
    {
      city: "Dubai",
      timezone: "Asia/Dubai",
    },
    {
      city: "Istanbul",
      timezone: "Europe/Istanbul",
    },
    {
      city: "London",
      timezone: "Europe/London",
    },
  ]

  const masjidAdmin = await prisma.user.create({
    data: {
      email: "sam@gmail.com",
      phoneNumber: "+60123456789",
      password: pwd,
      role: "MASJID_ADMIN",
      fullName: "Fawwaz Yusran",
      masjid: {
        create: {
          type: "SURAU",
          registrationNumber: "A-11-2017-0126",
          name: "Al-Mustaqim",
          address:
            "Level 2P, Metropolitan Square Condominium, Jalan PJU 8/1, Damansara Perdana, Petaling Jaya, Selangor",
          cityId: kl.id,
          postalCode: "47820",
          country: "Malaysia",
          phone: "+60123456789",
          email: "almustaqim.msqpj@gmail.com",
          settings: {
            create: {
              newsTexts,
              worldClocks: {
                createMany: {
                  data: worldTimezones,
                },
              },
            },
          },
          carouselItems: {
            createMany: {
              data: [
                {
                  title: "bacaan subuh",
                  filename: "bacaan_subuh.png",
                  order: 1,
                },
                {
                  title: "bacaan maghrib",
                  filename: "bacaan_maghrib.png",
                  order: 2,
                },
                {
                  title: "AJK",
                  filename: "ajk.png",
                  order: 3,
                },
                {
                  title: "Kuliah",
                  filename: "kuliah bulanan.png",
                  order: 4,
                },
                {
                  title: "Tahlil",
                  filename: "tahlil.png",
                  order: 5,
                },
                {
                  title: "Aktiviti",
                  filename: "aktiviti.png",
                  order: 6,
                },
                {
                  title: "Aktiviti2",
                  filename: "aktiviti2.mp4",
                  order: 7,
                },
                {
                  title: "iktikaf",
                  filename: "iktikaf.png",
                  order: 8,
                },
                {
                  title: "doapalestin",
                  filename: "doapalestin.png",
                  order: 9,
                },
                {
                  title: "boikot",
                  filename: "boikot.png",
                  order: 10,
                },
              ],
            },
          },
          events: {
            createMany: {
              data: [
                {
                  title: "Kuliah Maghrib",
                  description: "Kuliah Maghrib oleh Ustaz Ahmad",
                  location: "Block A, Surau Al-Mustaqim, MSQ",
                  startDateTime: new Date(),
                  endDateTime: new Date(),
                },
                {
                  title: "Kuliah Subuh",
                  description: "Kuliah Subuh oleh Ustaz Ali",
                  location: "Podium, Surau Al-Mustaqim, MSQ",
                  startDateTime: new Date(),
                  endDateTime: new Date(),
                },
                {
                  title: "Majlis Khatam Al-Quran",
                  description: "Majlis Khatam Al-Quran oleh anak-anak yatim",
                  location: "Block A, Surau Al-Mustaqim, MSQ",
                  startDateTime: new Date(),
                  endDateTime: new Date(),
                },
              ],
            },
          },
          facilities: {
            createMany: {
              data: [
                {
                  name: "Dewan Serbaguna",
                  description: "Dewan Serbaguna untuk pelbagai aktiviti",
                  maxCapacity: 100,
                  rentPrice: 100,
                  rentUnit: "PER_DAY",
                  picName: "Ali",
                  picPhone: "+60123456789",
                },
                {
                  name: "Bilik Solat",
                  description: "Bilik Solat untuk solat fardhu",
                  maxCapacity: 20,
                  rentPrice: 50,
                  rentUnit: "PER_HOUR",
                  picName: "Abu",
                  picPhone: "+60123456789",
                },
                {
                  name: "Bilik Seminar",
                  description: "Bilik Seminar untuk kursus dan latihan",
                  maxCapacity: 50,
                  rentPrice: 80,
                  rentUnit: "PER_HOUR",
                  picName: "Ahmad",
                  picPhone: "+60123456789",
                },
              ],
            },
          },
        },
      },
    },
  })

  console.log(`Created masjid admin:`)
  console.log(masjidAdmin)

  // Set up root file directory for masjid
  const rootDir = process.env.ROOT_FILES_PATH

  if (!fs.existsSync(rootDir)) {
    fs.mkdirSync(rootDir)
  }

  const masjidDir = path.join(rootDir, "masjid")

  if (fs.existsSync(masjidDir)) {
    fs.rmSync(masjidDir, { recursive: true })
  }

  fs.mkdirSync(masjidDir)

  const masjidIdDir = path.join(masjidDir, masjidAdmin.masjidId)

  if (!fs.existsSync(masjidIdDir)) {
    fs.mkdirSync(masjidIdDir)
  }

  const carouselDir = path.join(masjidIdDir, "carousels")

  if (!fs.existsSync(carouselDir)) {
    fs.mkdirSync(carouselDir)
  }

  console.log(`Created masjid file directory: ${masjidIdDir}`)

  const appDir = "../app"

  const demoCarouselsDir = path.join(__dirname, appDir, "_demo", "carousels")

  // copy demo carousels to masjid carousel directory
  fs.readdirSync(demoCarouselsDir).forEach((file) => {
    fs.copyFileSync(
      path.join(demoCarouselsDir, file),
      path.join(carouselDir, file)
    )
  })

  console.log(
    `Copied demo carousels to masjid carousel directory: ${carouselDir}`
  )

  const demoWorldClocksDir = path.join(
    __dirname,
    appDir,
    "_demo",
    "worldClocks"
  )

  const worldClocksDir = path.join(masjidIdDir, "worldClocks")

  if (!fs.existsSync(worldClocksDir)) {
    fs.mkdirSync(worldClocksDir)
  }

  // copy demo world clocks to masjid world clocks directory
  fs.readdirSync(demoWorldClocksDir).forEach((file) => {
    fs.copyFileSync(
      path.join(demoWorldClocksDir, file),
      path.join(worldClocksDir, file)
    )
  })

  console.log(
    `Copied demo world clocks to masjid world clocks directory: ${worldClocksDir}`
  )
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
