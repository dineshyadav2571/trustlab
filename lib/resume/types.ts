export type ResumeLink = {
  label: string;
  url: string;
};

export type ResumeTimelineEntry = {
  title: string;
  period: string;
  description: string;
  thesisUrl?: string;
};

export type ResumeProject = {
  title: string;
  lines: string[];
};

export type ResumePublicationItem = {
  text: string;
  link?: string;
};

export type ResumePublicationGroup = {
  category: string;
  items: ResumePublicationItem[];
};

export type ResumeStudentGroup = {
  category: string;
  entries: { nameLine: string; topic: string }[];
};

export type ResumeAdminSection = {
  title: string;
  items: string[];
};

export type ResumeData = {
  lead: {
    name: string;
    role: string;
    location: string;
    phone: string;
    imageMimeType: string;
    imageBase64: string;
  };
  contact: {
    email: string;
    webUrl: string;
    webLinkLabel: string;
    linkedInUrl: string;
    linkedInLabel: string;
  };
  links: ResumeLink[];
  aboutSummary: string;
  researchInterests: string[];
  highlights: string[];
  education: ResumeTimelineEntry[];
  employment: ResumeTimelineEntry[];
  projects: ResumeProject[];
  publications: ResumePublicationGroup[];
  teaching: string[];
  students: ResumeStudentGroup[];
  administration: ResumeAdminSection[];
  patents: { category: string; items: string[] }[];
  achievements: { category: string; items: string[] }[];
};
