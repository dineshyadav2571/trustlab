import type { ImportantLinkLayout } from "@/lib/important-link-types";

type SeedLink = {
  icon: string;
  title: string;
  url: string;
  description: string;
  sortOrder: number;
};

type SeedCategory = {
  title: string;
  sortOrder: number;
  links: SeedLink[];
};

type SeedSection = {
  title: string;
  intro: string;
  layout: ImportantLinkLayout;
  sortOrder: number;
  categories: SeedCategory[];
};

export const defaultImportantLinkSections: SeedSection[] = [
  {
    title: "My Content",
    intro: "",
    layout: "simple",
    sortOrder: 0,
    categories: [
      {
        title: "",
        sortOrder: 0,
        links: [
          {
            icon: "globe",
            title: "Presentation and lecture material",
            url: "https://example.com/lectures",
            description: "Online watershed delineation and basin boundary tools.",
            sortOrder: 0,
          },
        ],
      },
    ],
  },
  {
    title: "Tools & Data Resources (for Students)",
    intro:
      "Curated links for watershed delineation, rainfall/climate data, remote sensing, and modelling tools.",
    layout: "grouped",
    sortOrder: 1,
    categories: [
      {
        title: "Watershed Delineation & Hydro Tools",
        sortOrder: 0,
        links: [
          {
            icon: "globe",
            title: "HydroSHEDS / MG Hydro – Watershed Delineation",
            url: "https://www.hydrosheds.org/",
            description: "Online watershed delineation and basin boundary tools.",
            sortOrder: 0,
          },
          {
            icon: "water",
            title: "Global Surface Water Explorer",
            url: "https://global-surface-water.appspot.com/",
            description: "Global Surface Water Explorer tools.",
            sortOrder: 1,
          },
          {
            icon: "monitor",
            title: "QGIS (Free GIS Software)",
            url: "https://qgis.org/",
            description: "Watershed processing, DEM tools, map-making, plugins.",
            sortOrder: 2,
          },
          {
            icon: "map",
            title: "SRTM DEM (USGS)",
            url: "https://www.usgs.gov/",
            description: "Widely used DEM for watershed and terrain analysis.",
            sortOrder: 3,
          },
          {
            icon: "laptop",
            title: "Watershed Delineation using Python (pysheds)",
            url: "https://github.com/mdbartos/pysheds",
            description:
              "Open-source implementation for DEM preprocessing, flow direction, accumulation, and catchment delineation using pysheds.",
            sortOrder: 4,
          },
        ],
      },
    ],
  },
];
