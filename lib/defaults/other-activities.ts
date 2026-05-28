import type { OtherActivityListStyle } from "@/lib/models/OtherActivitySection";

export type DefaultOtherActivitySection = {
  title: string;
  sortOrder: number;
  listStyle: OtherActivityListStyle;
  items: { text: string; sortOrder: number }[];
};

export const defaultOtherActivitySections: DefaultOtherActivitySection[] = [
  {
    title: "Expert Lectures / Talks",
    sortOrder: 1,
    listStyle: "default",
    items: [
      {
        text: "Expert Lecture on \"Estimation of Scour Depth for Large Bridges over Alluvial Rivers\", delivered under the training program (INFRA-IMPACT), organized by IIT Patna for engineers of the Rural Works Department, Government of Bihar (10 January 2026)",
        sortOrder: 1,
      },
      {
        text: "Expert talk on forecasting hydrological events and water resource planning (2025)",
        sortOrder: 2,
      },
      {
        text: "Guest lecture on numerical modeling using finite difference methods (2024)",
        sortOrder: 3,
      },
    ],
  },
  {
    title: "Short Term Programmes / STP",
    sortOrder: 2,
    listStyle: "default",
    items: [
      { text: "Numerical and Optimization Techniques (NOT-2019)", sortOrder: 1 },
      { text: "Basics of Linux and MATLAB for Civil Engineering Applications", sortOrder: 2 },
    ],
  },
  {
    title: "Awards & Achievements",
    sortOrder: 3,
    listStyle: "award",
    items: [
      {
        text: "2016 – Certificate of Appreciation for outstanding contribution to research and teaching",
        sortOrder: 1,
      },
      {
        text: "2018 – Best Paper Award at national conference on water resources engineering",
        sortOrder: 2,
      },
    ],
  },
  {
    title: "New Media & Digital Outreach",
    sortOrder: 4,
    listStyle: "default",
    items: [
      {
        text: "Smart Laboratory on Clean Rivers: media coverage and outreach articles on river basin management initiatives",
        sortOrder: 1,
      },
    ],
  },
  {
    title: "Professional Memberships",
    sortOrder: 5,
    listStyle: "default",
    items: [
      { text: "Life Member, Indian Society for Hydraulics (ISH)", sortOrder: 1 },
      { text: "Member, International Association for Hydro-Environment Engineering and Research (IAHR)", sortOrder: 2 },
    ],
  },
  {
    title: "Skills",
    sortOrder: 6,
    listStyle: "default",
    items: [
      { text: "Languages: English, Hindi", sortOrder: 1 },
      { text: "Coding: MATLAB, Python, R, FORTRAN", sortOrder: 2 },
      { text: "Web Dev: HTML, CSS, JavaScript basics", sortOrder: 3 },
    ],
  },
];
