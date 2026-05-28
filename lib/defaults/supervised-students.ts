import type { SupervisedStudentCategory } from "@/lib/models/SupervisedStudent";

export type DefaultSupervisedStudent = {
  category: SupervisedStudentCategory;
  nameLine: string;
  topic: string;
  sortOrder: number;
};

export const defaultSupervisedStudents: DefaultSupervisedStudent[] = [
  // Ph.D. Ongoing
  { category: "Ph.D. Ongoing", nameLine: "Saurabh Maurya (2025–Ongoing)", topic: "Air Pollution and Crop Yield.", sortOrder: 1 },
  { category: "Ph.D. Ongoing", nameLine: "Vineet Jain (2025–Ongoing)", topic: "Pollution Dispersion in ground Water.", sortOrder: 2 },
  { category: "Ph.D. Ongoing", nameLine: "Maniranjan (2022–Ongoing)", topic: "Comprehensive Assessment of Groundwater in Tropical River Basins using Machine Learning and SWAT Model.", sortOrder: 3 },
  { category: "Ph.D. Ongoing", nameLine: "Megavath Narahari (2021–Ongoing)", topic: "Effects of Climate Change on Water Quality.", sortOrder: 4 },
  { category: "Ph.D. Ongoing", nameLine: "Krishna Kumar (2022–Ongoing)", topic: "Crop Yield Estimation and Forecasting using Machine Learning.", sortOrder: 5 },
  { category: "Ph.D. Ongoing", nameLine: "Hari Prakash (2023–Ongoing)", topic: "Peak Discharge Estimation for Ungauged Basins.", sortOrder: 6 },
  { category: "Ph.D. Ongoing", nameLine: "Ashwin Chitravanshi (2023–Ongoing)", topic: "Water Quality Modeling for Varuna River Basin.", sortOrder: 7 },
  // M.Tech Students
  { category: "M.Tech Students", nameLine: "Ritika Upadhyay (2024-Ongoing)", topic: "Impact of Pollution on Rainfall Characteristics. Co-supervisor (External with BHU).", sortOrder: 1 },
  { category: "M.Tech Students", nameLine: "Makardhwaj Awasthi (2024-Ongoing)", topic: "Atmospheric–Rainfall Interaction Analysis. Co-supervisor (External with BHU).", sortOrder: 2 },
  { category: "M.Tech Students", nameLine: "Buddepu Harsha Vardhan (2023-2025)", topic: "A Comparative Evaluation of WRF and ANN for Weather Prediction: Performance and Accuracy.", sortOrder: 3 },
  { category: "M.Tech Students", nameLine: "Saurabh Maurya (2023-2025)", topic: "Investigation of Microphysical Characteristics of Raindrop Size Distribution using WRF Model.", sortOrder: 4 },
  { category: "M.Tech Students", nameLine: "Raju Singh (2023-2025)", topic: "Estimation of Surface Velocity in Open Channel Flows using Image Processing.", sortOrder: 5 },
  { category: "M.Tech Students", nameLine: "Shailesh Kushwaha (2023-2025)", topic: "Seasonal Forecasting of Crop Yield over Varuna River Basin.", sortOrder: 6 },
  { category: "M.Tech Students", nameLine: "Tripti Yadav (2023-2025)", topic: "Estimation of E-Flow for Varuna River Basin.", sortOrder: 7 },
  { category: "M.Tech Students", nameLine: "Ritika Upadhyay (2025)", topic: "Impact of Pollution on Rainfall Characteristics (Tentative). Co-supervisor (External with BHU).", sortOrder: 8 },
  { category: "M.Tech Students", nameLine: "Makardhwaj Awasthi (2025)", topic: "Atmospheric–Rainfall Interaction Analysis (Tentative). Co-supervisor (External with BHU).", sortOrder: 9 },
  { category: "M.Tech Students", nameLine: "Suryansh Srivastava (2025)", topic: "Geomorphological Change Analysis using Arc-GIS (Tentative). Co-supervisor (External with BHU).", sortOrder: 10 },
  { category: "M.Tech Students", nameLine: "Shadab Ansari (2020)", topic: "Single and Dual Frequency Atmospheric Free Precise Point Positioning using Combined GPS and GLONASS Observations.", sortOrder: 11 },
  { category: "M.Tech Students", nameLine: "Prity Dhanai (2021)", topic: "Rainfall Triggered Slope Instability Analysis with Changing Climate.", sortOrder: 12 },
  { category: "M.Tech Students", nameLine: "Pankaj Singh (2021)", topic: "Spatiotemporal Prediction of Criteria Air Pollutants using Air Pollution Monitoring Station Data.", sortOrder: 13 },
  { category: "M.Tech Students", nameLine: "Shubham Khare (2022)", topic: "Effects of COVID-19 Lockdown on Meteorological Variables over India.", sortOrder: 14 },
  { category: "M.Tech Students", nameLine: "Anandita Raj (2022)", topic: "Impacts of Climate Change on Water Quality for Krishna River Basin.", sortOrder: 15 },
  // B.Tech Students
  { category: "B.Tech Students", nameLine: "Harshit Patel (24065047) (2025-26)", topic: "Dam Break Analysis using HEC-RAS.", sortOrder: 1 },
  { category: "B.Tech Students", nameLine: "Abhyudaya Singh (24065008) (2025-26)", topic: "Inland River Water Quality Modeling.", sortOrder: 2 },
  { category: "B.Tech Students", nameLine: "Ketan Kumar (24065055) (2025-26)", topic: "Water Quality Analysis using HEC-RAS.", sortOrder: 3 },
  { category: "B.Tech Students", nameLine: "Gautam Kumar (24065040) (2025-26)", topic: "Bridge Scour Analysis using HEC-RAS.", sortOrder: 4 },
  { category: "B.Tech Students", nameLine: "Aryan Gupta (24065026) (2025-26)", topic: "2D Sediment Transport Modelling of the Ganga River at Varanasi using HEC-RAS 6.6.", sortOrder: 5 },
  { category: "B.Tech Students", nameLine: "Narendra Prasad (22065058) (2025-26)", topic: "CFD Modeling of Bridge Pier Scour.", sortOrder: 6 },
  { category: "B.Tech Students", nameLine: "Arushi Aggarwal (23064002) (2025-26)", topic: "Geomorphological Analysis.", sortOrder: 7 },
  { category: "B.Tech Students", nameLine: "Abhishek Sharma (23065006) (2025-26)", topic: "Forecasting of River Sinuosity using Remote Sensing and Machine Learning.", sortOrder: 8 },
  { category: "B.Tech Students", nameLine: "Bishal Das (23065032) (2025-26)", topic: "DSSAT Crop Simulation.", sortOrder: 9 },
  { category: "B.Tech Students", nameLine: "Chandraveer Singh (23065035) (2025-26)", topic: "Forecasting of River Sinuosity using Remote Sensing and Machine Learning.", sortOrder: 10 },
  { category: "B.Tech Students", nameLine: "Vaibhav Rajvardhan (23065110) (2025-26)", topic: "2D Hydraulic Simulation and Inundation Mapping of the Hirakud Dam Breach.", sortOrder: 11 },
  { category: "B.Tech Students", nameLine: "Mayank Singh (23065124) (2025-26)", topic: "Sub-daily Rainfall Analysis over Varuna River Basin.", sortOrder: 12 },
  { category: "B.Tech Students", nameLine: "Nitish Kumar Maurya (20065067), Umesh Harsana (20065109) (2024-25)", topic: "River Meandering Analysis Project.", sortOrder: 13 },
  { category: "B.Tech Students", nameLine: "Dinesh Singh (20065035), Harshit Bangari (20065041), Bhuvnesh Gaur (20065030) (2024-25)", topic: "Flood Risk Zone Mapping using ArcGIS.", sortOrder: 14 },
  { category: "B.Tech Students", nameLine: "Mayank Mani Nath Gupta (21065127) (2024-25)", topic: "River Extraction using Image Processing and QGIS using Python.", sortOrder: 15 },
  { category: "B.Tech Students", nameLine: "Saatwiik Srivastava (21065091) (2024-25)", topic: "Rainfall–Runoff Modeling using ANN.", sortOrder: 16 },
  { category: "B.Tech Students", nameLine: "Vishal Yadav (21065113) (2024-25)", topic: "River Boundary Extraction using Image Processing and QGIS.", sortOrder: 17 },
  { category: "B.Tech Students", nameLine: "Aditi Gupta (21065006) (2024-25)", topic: "Monthly Discharge Estimation using Image Processing.", sortOrder: 18 },
  { category: "B.Tech Students", nameLine: "Shridhar Kumar (21065100) (2024-25)", topic: "Application of ANN in Rainfall–Runoff Modeling.", sortOrder: 19 },
  { category: "B.Tech Students", nameLine: "Aman Mani Shandilya (22065012) (2025)", topic: "River Extraction and Analysis using Image Processing and QGIS.", sortOrder: 20 },
  { category: "B.Tech Students", nameLine: "Sanyam Jain (22065118) (2025)", topic: "Application of ANN in Rainfall–Runoff Modeling.", sortOrder: 21 },
  { category: "B.Tech Students", nameLine: "Harsh Pant (22065128), Aditya Maurya (22065122) (2025)", topic: "Analysis of NCEP Global Forecast Data.", sortOrder: 22 },
  { category: "B.Tech Students", nameLine: "Chandraveer Singh (23065035) (2025)", topic: "Topic under progress.", sortOrder: 23 },
  { category: "B.Tech Students", nameLine: "Danish Dubey (23065038) (2025)", topic: "CFD Modeling of Varuna River Basin.", sortOrder: 24 },
  { category: "B.Tech Students", nameLine: "Harsh Suryawanshi (23065051) (2025)", topic: "Impact of Climate Change on Water Footprint and Crop Yield over Mahanadi Basin, Odisha.", sortOrder: 25 },
  { category: "B.Tech Students", nameLine: "Sachin (23065092) (2025)", topic: "Impact of Climate Change on Water Footprint and Crop Yield over Mahanadi Basin, Odisha.", sortOrder: 26 },
  { category: "B.Tech Students", nameLine: "Vaibhav Rajvardhan (23065110) (2025)", topic: "Impact of Climate Change on Water Footprint and Crop Yield over Mahanadi Basin, Odisha.", sortOrder: 27 },
  { category: "B.Tech Students", nameLine: "Mahesh Chandra Verma, Nishant Rai, Balram Yogi, Kuldeep Bhamu (2020)", topic: "Impact of Climate Change on Water Resources using Artificial Neural Network (ANN).", sortOrder: 28 },
  { category: "B.Tech Students", nameLine: "Anitya Sagar, Pulkit Garg, Abhay Singh, Umesh Karna (2021)", topic: "Design of Rainwater Harvesting Structure for MNNIT Allahabad Campus.", sortOrder: 29 },
  { category: "B.Tech Students", nameLine: "Shiv Virendra Chaubey, Ajit Kumar, Aditya Kumar, Shubham Kumar Singh (2022)", topic: "Impact of Climate Change on Water Footprint and Crop Yield over Mahanadi Basin, Odisha.", sortOrder: 30 },
  // External Thesis
  {
    category: "External Thesis (BITS Pilani)",
    nameLine: "Nimish Tiwari (2022A2PS1449H) (2026)",
    topic:
      "Prediction of Water Quality Parameters of the Varuna River Basin using Remote Sensing and Machine Learning. Co-supervisor with Prof. Abhradeep Majumder (BITS Pilani).",
    sortOrder: 1,
  },
];
