export type DefaultAdministrationSection = {
  title: string;
  sortOrder: number;
  items: { text: string; sortOrder: number }[];
};

export const defaultAdministrationSections: DefaultAdministrationSection[] = [
  {
    title: "IIT (BHU) Varanasi (2023–Present)",
    sortOrder: 1,
    items: [
      { text: "Member, Faculty Forum 2026-2027", sortOrder: 1 },
      {
        text: "Deputy Chief Election Officer, Student Parliament Elections, 2024-25, 2025-2026",
        sortOrder: 2,
      },
      { text: "Chairman, Technex-26, IIT (BHU) Varanasi", sortOrder: 3 },
      {
        text: "Member, Time Table Committee, Department of Civil Engineering (2023–25)",
        sortOrder: 4,
      },
      { text: "Proctor, IIT (BHU) (2024–)", sortOrder: 5 },
      { text: "Warden, A. S. N. Bose Hostel (2024–)", sortOrder: 6 },
      {
        text: "PI, Ganga Laboratory, Department of Civil Engineering (2023–)",
        sortOrder: 7,
      },
    ],
  },
  {
    title: "MNNIT Allahabad (2019-2022)",
    sortOrder: 2,
    items: [
      { text: "O.C. CAD Lab, WRE Lab, SURVEY Lab, Civil Engineering", sortOrder: 1 },
      { text: "Faculty Coordinator, Tennis", sortOrder: 2 },
      { text: "Member, Time Table Committee", sortOrder: 3 },
      { text: "B.Tech Project Evaluation Committee", sortOrder: 4 },
      { text: "Member, DUGC", sortOrder: 5 },
      { text: "Member, NIRF", sortOrder: 6 },
      { text: "Member, TEQIP Committee", sortOrder: 7 },
      { text: "Member, NBA Committee", sortOrder: 8 },
      {
        text: "Startup Activity Coordinator, Institution Innovation Council",
        sortOrder: 9,
      },
    ],
  },
  {
    title: "IIT Kanpur",
    sortOrder: 3,
    items: [
      { text: "Convener, SBRA (2015-2016)", sortOrder: 1 },
      { text: "In Charge, Billiard Club, Hall-4 (2012-2013)", sortOrder: 2 },
    ],
  },
];
