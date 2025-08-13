export const volcanoes = [
    {
        title: "Tongariro",
        id: "tongariro",
        cameraSites: [
            {
                imageServerKey: "KAKA",
                siteId: "01",
                label: "Tongariro"
            },
            {
                imageServerKey: "TOKR",
                siteId: "01",
                label: "Tongariro Te Maari Crater" 
            }
        ],
        graphImageIds: ["tmvz"],
        tildeInformation: {
            id: "TO003",
            metrics: [
                {
                    name: "air-CO2-conc",
                    sensorCode: "12"
                },
                {
                    name: "air-SO2-conc",
                    sensorCode: "13"
                },
                {
                    name: "air-H2S-conc",
                    sensorCode: "14"
                }
            ]
        }
    },
    {
        title: "Ruapehu",
        id: "ruapehu",
        cameraSites: [
            {
                imageServerKey: "DISC",
                siteId: "01",
                label: "Ruapehu North"
            },
            {
                imageServerKey: "MTSR",
                siteId: "01",
                label: "Ruapehu South"
            }
        ],
        graphImageIds: ["mavz", "wnvz"],
        tildeInformation: {
            id: "RU001",
            metrics: [
                {
                    name: "air-SO2-conc",
                    sensorCode: "10"
                },
                {
                    name: "air-H2S-conc",
                    sensorCode: "11"
                },
                {
                    name: "air-CO2-conc",
                    sensorCode: "09"
                }
            ]
        }
    },
    {
        title: "Ngauruhoe",
        id: "ngauruhoe",
        cameraSites: [
            {
                imageServerKey: "KMTP",
                siteId: "01",
                label: "Ruapehu & Ngauruhoe"
            },
            {
                imageServerKey: "DISC",
                siteId: "02",
                label: "Ngauruhoe"
            }
        ],
        graphImageIds: ["otvz"],
        tildeInformation: {
            id: "NA002",
            metrics: [
                {
                    name: "air-CO2-conc",
                    sensorCode: "04"
                },
                {
                    name: "air-SO2-conc",
                    sensorCode: "05"
                },
                {
                    name: "air-H2S-conc",
                    sensorCode: "06"
                }
            ]
        }
    },
    {
        title: "Whakaari / White Island",
        id: "whiteisland",
        cameraSites: [
            {
                imageServerKey: "TKAH",
                siteId: "01",
                label: "Te Kaha"
            },
            {
                imageServerKey: "WHOH",
                siteId: "02",
                label: "Whakatāne"
            }
        ],
        graphImageIds: []
    },
    {
        title: "Raoul Island",
        id: "kermadecislands",
        cameraSites: [
            {
                imageServerKey: "RIMK",
                siteId: "01",
                label: "Raoul Island",
            },
        ],
        graphImageIds: ["rar", "riz"],
        tildeInformation: {
            id: "RLGLK",
            metrics: [
                {
                    name: "lake-height",
                    sensorCode: "04",
                    aspect: "green-lake"
                },
                {
                    name: "lake-temperature",
                    sensorCode: "04",
                    aspect: "green-lake"
                }
            ]
        }
    },
    {
        title: "Taranaki",
        id: "taranakiegmont",
        cameraSites: [
            {
                imageServerKey: "TEMO",
                siteId: "02",
                label: "Taranaki Maunga"
            }
        ],
        graphImageIds: ["khez", "pke"],
        tildeInformation: {
            id: "TRAR1",
            metrics: [
                {
                    name: "air-temperature",
                    sensorCode: "01"
                },
                {
                    name: "spring-temperature",
                    sensorCode: "02"
                },
                // {
                //     name: "total-rainfall",
                //     sensorCode: "05"
                // }
            ]
        }
    }
];
