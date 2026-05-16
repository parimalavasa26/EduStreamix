/* ════════════════════════════════════════════════
   Seed Script — Sample data for Class 8, 9, 10 (CBSE)
   Run: npm run seed
   ════════════════════════════════════════════════ */

require('dotenv').config();
const mongoose = require('mongoose');
const Subject = require('../models/Subject');

const SEED_DATA = [
  // ── Class 8 CBSE ──────────────────────────
    {
    "grade": 8,
    "board": "CBSE",
    "subject": "Social Science",
    "units": [
      {
        "unitName": "Unit 1: History - Our Past III (Part 1 & 2)",
        "chapters": [
          {
            "lessonNo": "1",
            "chapterName": "How, When and Where",
            "type": "History - Sources and Time Periods",
            "videos": [
              {
                "language": "English",
                "youtubeVideoId": "dQw4w9WgXcQ",
                "title": "How, When and Where - Class 8 (English)",
                "viewCount": 150000,
                "likeCount": 4200,
                "embedUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ"
              },
              {
                "language": "Hindi",
                "youtubeVideoId": "dQw4w9WgXcQ",
                "title": "How, When and Where - Class 8 (Hindi)",
                "viewCount": 120000,
                "likeCount": 3800,
                "embedUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ"
              }
            ]
          },
          {
            "lessonNo": "2",
            "chapterName": "From Trade to Territory",
            "type": "History - Colonialism Begins",
            "videos": [
              {
                "language": "English",
                "youtubeVideoId": "dQw4w9WgXcQ",
                "title": "From Trade to Territory - Class 8 (English)",
                "viewCount": 150000,
                "likeCount": 4200,
                "embedUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ"
              },
              {
                "language": "Hindi",
                "youtubeVideoId": "dQw4w9WgXcQ",
                "title": "From Trade to Territory - Class 8 (Hindi)",
                "viewCount": 120000,
                "likeCount": 3800,
                "embedUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ"
              }
            ]
          },
          {
            "lessonNo": "3",
            "chapterName": "Ruling the Countryside",
            "type": "History - British Agrarian Policies",
            "videos": [
              {
                "language": "English",
                "youtubeVideoId": "dQw4w9WgXcQ",
                "title": "Ruling the Countryside - Class 8 (English)",
                "viewCount": 150000,
                "likeCount": 4200,
                "embedUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ"
              },
              {
                "language": "Hindi",
                "youtubeVideoId": "dQw4w9WgXcQ",
                "title": "Ruling the Countryside - Class 8 (Hindi)",
                "viewCount": 120000,
                "likeCount": 3800,
                "embedUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ"
              }
            ]
          },
          {
            "lessonNo": "4",
            "chapterName": "Tribals, Dikus and the Vision of a Golden Age",
            "type": "History - Tribal Uprisings",
            "videos": [
              {
                "language": "English",
                "youtubeVideoId": "dQw4w9WgXcQ",
                "title": "Tribals, Dikus and the Vision of a Golden Age - Class 8 (English)",
                "viewCount": 150000,
                "likeCount": 4200,
                "embedUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ"
              },
              {
                "language": "Hindi",
                "youtubeVideoId": "dQw4w9WgXcQ",
                "title": "Tribals, Dikus and the Vision of a Golden Age - Class 8 (Hindi)",
                "viewCount": 120000,
                "likeCount": 3800,
                "embedUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ"
              }
            ]
          },
          {
            "lessonNo": "5",
            "chapterName": "When People Rebel (1857 and After)",
            "type": "History - First War of Independence",
            "videos": [
              {
                "language": "English",
                "youtubeVideoId": "dQw4w9WgXcQ",
                "title": "When People Rebel (1857 and After) - Class 8 (English)",
                "viewCount": 150000,
                "likeCount": 4200,
                "embedUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ"
              },
              {
                "language": "Hindi",
                "youtubeVideoId": "dQw4w9WgXcQ",
                "title": "When People Rebel (1857 and After) - Class 8 (Hindi)",
                "viewCount": 120000,
                "likeCount": 3800,
                "embedUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ"
              }
            ]
          },
          {
            "lessonNo": "6",
            "chapterName": "Colonialism and the City",
            "type": "History - Urban Changes",
            "videos": [
              {
                "language": "English",
                "youtubeVideoId": "dQw4w9WgXcQ",
                "title": "Colonialism and the City - Class 8 (English)",
                "viewCount": 150000,
                "likeCount": 4200,
                "embedUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ"
              },
              {
                "language": "Hindi",
                "youtubeVideoId": "dQw4w9WgXcQ",
                "title": "Colonialism and the City - Class 8 (Hindi)",
                "viewCount": 120000,
                "likeCount": 3800,
                "embedUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ"
              }
            ]
          },
          {
            "lessonNo": "7",
            "chapterName": "Weavers, Iron Smelters and Factory Owners",
            "type": "History - Industrial Impact",
            "videos": [
              {
                "language": "English",
                "youtubeVideoId": "dQw4w9WgXcQ",
                "title": "Weavers, Iron Smelters and Factory Owners - Class 8 (English)",
                "viewCount": 150000,
                "likeCount": 4200,
                "embedUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ"
              },
              {
                "language": "Hindi",
                "youtubeVideoId": "dQw4w9WgXcQ",
                "title": "Weavers, Iron Smelters and Factory Owners - Class 8 (Hindi)",
                "viewCount": 120000,
                "likeCount": 3800,
                "embedUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ"
              }
            ]
          },
          {
            "lessonNo": "8",
            "chapterName": "Civilising the “Native”, Educating the Nation",
            "type": "History - British Education Policy",
            "videos": [
              {
                "language": "English",
                "youtubeVideoId": "dQw4w9WgXcQ",
                "title": "Civilising the “Native”, Educating the Nation - Class 8 (English)",
                "viewCount": 150000,
                "likeCount": 4200,
                "embedUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ"
              },
              {
                "language": "Hindi",
                "youtubeVideoId": "dQw4w9WgXcQ",
                "title": "Civilising the “Native”, Educating the Nation - Class 8 (Hindi)",
                "viewCount": 120000,
                "likeCount": 3800,
                "embedUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ"
              }
            ]
          },
          {
            "lessonNo": "9",
            "chapterName": "Women, Caste and Reform",
            "type": "History - Social Reform Movements",
            "videos": [
              {
                "language": "English",
                "youtubeVideoId": "dQw4w9WgXcQ",
                "title": "Women, Caste and Reform - Class 8 (English)",
                "viewCount": 150000,
                "likeCount": 4200,
                "embedUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ"
              },
              {
                "language": "Hindi",
                "youtubeVideoId": "dQw4w9WgXcQ",
                "title": "Women, Caste and Reform - Class 8 (Hindi)",
                "viewCount": 120000,
                "likeCount": 3800,
                "embedUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ"
              }
            ]
          },
          {
            "lessonNo": "10",
            "chapterName": "The Changing World of Visual Arts",
            "type": "History - Culture and Expression",
            "videos": [
              {
                "language": "English",
                "youtubeVideoId": "dQw4w9WgXcQ",
                "title": "The Changing World of Visual Arts - Class 8 (English)",
                "viewCount": 150000,
                "likeCount": 4200,
                "embedUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ"
              },
              {
                "language": "Hindi",
                "youtubeVideoId": "dQw4w9WgXcQ",
                "title": "The Changing World of Visual Arts - Class 8 (Hindi)",
                "viewCount": 120000,
                "likeCount": 3800,
                "embedUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ"
              }
            ]
          },
          {
            "lessonNo": "11",
            "chapterName": "The Making of the National Movement (1870–1947)",
            "type": "History - Freedom Struggle",
            "videos": [
              {
                "language": "English",
                "youtubeVideoId": "dQw4w9WgXcQ",
                "title": "The Making of the National Movement (1870–1947) - Class 8 (English)",
                "viewCount": 150000,
                "likeCount": 4200,
                "embedUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ"
              },
              {
                "language": "Hindi",
                "youtubeVideoId": "dQw4w9WgXcQ",
                "title": "The Making of the National Movement (1870–1947) - Class 8 (Hindi)",
                "viewCount": 120000,
                "likeCount": 3800,
                "embedUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ"
              }
            ]
          },
          {
            "lessonNo": "12",
            "chapterName": "India After Independence",
            "type": "History - Nation Building",
            "videos": [
              {
                "language": "English",
                "youtubeVideoId": "dQw4w9WgXcQ",
                "title": "India After Independence - Class 8 (English)",
                "viewCount": 150000,
                "likeCount": 4200,
                "embedUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ"
              },
              {
                "language": "Hindi",
                "youtubeVideoId": "dQw4w9WgXcQ",
                "title": "India After Independence - Class 8 (Hindi)",
                "viewCount": 120000,
                "likeCount": 3800,
                "embedUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ"
              }
            ]
          }
        ]
      },
      {
        "unitName": "Unit 2: Geography - Resources and Development",
        "chapters": [
          {
            "lessonNo": "1",
            "chapterName": "Resources",
            "type": "Geography - Classification & Use",
            "videos": [
              {
                "language": "English",
                "youtubeVideoId": "dQw4w9WgXcQ",
                "title": "Resources - Class 8 (English)",
                "viewCount": 150000,
                "likeCount": 4200,
                "embedUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ"
              },
              {
                "language": "Hindi",
                "youtubeVideoId": "dQw4w9WgXcQ",
                "title": "Resources - Class 8 (Hindi)",
                "viewCount": 120000,
                "likeCount": 3800,
                "embedUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ"
              }
            ]
          },
          {
            "lessonNo": "2",
            "chapterName": "Land, Soil, Water, Natural Vegetation and Wildlife Resources",
            "type": "Geography - Conservation",
            "videos": [
              {
                "language": "English",
                "youtubeVideoId": "dQw4w9WgXcQ",
                "title": "Land, Soil, Water, Natural Vegetation and Wildlife Resources - Class 8 (English)",
                "viewCount": 150000,
                "likeCount": 4200,
                "embedUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ"
              },
              {
                "language": "Hindi",
                "youtubeVideoId": "dQw4w9WgXcQ",
                "title": "Land, Soil, Water, Natural Vegetation and Wildlife Resources - Class 8 (Hindi)",
                "viewCount": 120000,
                "likeCount": 3800,
                "embedUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ"
              }
            ]
          },
          {
            "lessonNo": "3",
            "chapterName": "Mineral and Power Resources",
            "type": "Geography - Resource Management",
            "videos": [
              {
                "language": "English",
                "youtubeVideoId": "dQw4w9WgXcQ",
                "title": "Mineral and Power Resources - Class 8 (English)",
                "viewCount": 150000,
                "likeCount": 4200,
                "embedUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ"
              },
              {
                "language": "Hindi",
                "youtubeVideoId": "dQw4w9WgXcQ",
                "title": "Mineral and Power Resources - Class 8 (Hindi)",
                "viewCount": 120000,
                "likeCount": 3800,
                "embedUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ"
              }
            ]
          },
          {
            "lessonNo": "4",
            "chapterName": "Agriculture",
            "type": "Geography - Farming Types & Output",
            "videos": [
              {
                "language": "English",
                "youtubeVideoId": "dQw4w9WgXcQ",
                "title": "Agriculture - Class 8 (English)",
                "viewCount": 150000,
                "likeCount": 4200,
                "embedUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ"
              },
              {
                "language": "Hindi",
                "youtubeVideoId": "dQw4w9WgXcQ",
                "title": "Agriculture - Class 8 (Hindi)",
                "viewCount": 120000,
                "likeCount": 3800,
                "embedUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ"
              }
            ]
          },
          {
            "lessonNo": "5",
            "chapterName": "Industries",
            "type": "Geography - Industrial Systems",
            "videos": [
              {
                "language": "English",
                "youtubeVideoId": "dQw4w9WgXcQ",
                "title": "Industries - Class 8 (English)",
                "viewCount": 150000,
                "likeCount": 4200,
                "embedUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ"
              },
              {
                "language": "Hindi",
                "youtubeVideoId": "dQw4w9WgXcQ",
                "title": "Industries - Class 8 (Hindi)",
                "viewCount": 120000,
                "likeCount": 3800,
                "embedUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ"
              }
            ]
          },
          {
            "lessonNo": "6",
            "chapterName": "Human Resources",
            "type": "Geography - Population and Density",
            "videos": [
              {
                "language": "English",
                "youtubeVideoId": "dQw4w9WgXcQ",
                "title": "Human Resources - Class 8 (English)",
                "viewCount": 150000,
                "likeCount": 4200,
                "embedUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ"
              },
              {
                "language": "Hindi",
                "youtubeVideoId": "dQw4w9WgXcQ",
                "title": "Human Resources - Class 8 (Hindi)",
                "viewCount": 120000,
                "likeCount": 3800,
                "embedUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ"
              }
            ]
          }
        ]
      },
      {
        "unitName": "Unit 3: Civics - Social and Political Life III",
        "chapters": [
          {
            "lessonNo": "1",
            "chapterName": "The Indian Constitution",
            "type": "Civics - Framework and Values",
            "videos": [
              {
                "language": "English",
                "youtubeVideoId": "dQw4w9WgXcQ",
                "title": "The Indian Constitution - Class 8 (English)",
                "viewCount": 150000,
                "likeCount": 4200,
                "embedUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ"
              },
              {
                "language": "Hindi",
                "youtubeVideoId": "dQw4w9WgXcQ",
                "title": "The Indian Constitution - Class 8 (Hindi)",
                "viewCount": 120000,
                "likeCount": 3800,
                "embedUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ"
              }
            ]
          },
          {
            "lessonNo": "2",
            "chapterName": "Understanding Secularism",
            "type": "Civics - Equality & Diversity",
            "videos": [
              {
                "language": "English",
                "youtubeVideoId": "dQw4w9WgXcQ",
                "title": "Understanding Secularism - Class 8 (English)",
                "viewCount": 150000,
                "likeCount": 4200,
                "embedUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ"
              },
              {
                "language": "Hindi",
                "youtubeVideoId": "dQw4w9WgXcQ",
                "title": "Understanding Secularism - Class 8 (Hindi)",
                "viewCount": 120000,
                "likeCount": 3800,
                "embedUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ"
              }
            ]
          },
          {
            "lessonNo": "3",
            "chapterName": "Why Do We Need a Parliament?",
            "type": "Civics - Role of Legislature",
            "videos": [
              {
                "language": "English",
                "youtubeVideoId": "dQw4w9WgXcQ",
                "title": "Why Do We Need a Parliament? - Class 8 (English)",
                "viewCount": 150000,
                "likeCount": 4200,
                "embedUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ"
              },
              {
                "language": "Hindi",
                "youtubeVideoId": "dQw4w9WgXcQ",
                "title": "Why Do We Need a Parliament? - Class 8 (Hindi)",
                "viewCount": 120000,
                "likeCount": 3800,
                "embedUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ"
              }
            ]
          },
          {
            "lessonNo": "4",
            "chapterName": "Understanding Laws",
            "type": "Civics - Law-making Process",
            "videos": [
              {
                "language": "English",
                "youtubeVideoId": "dQw4w9WgXcQ",
                "title": "Understanding Laws - Class 8 (English)",
                "viewCount": 150000,
                "likeCount": 4200,
                "embedUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ"
              },
              {
                "language": "Hindi",
                "youtubeVideoId": "dQw4w9WgXcQ",
                "title": "Understanding Laws - Class 8 (Hindi)",
                "viewCount": 120000,
                "likeCount": 3800,
                "embedUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ"
              }
            ]
          },
          {
            "lessonNo": "5",
            "chapterName": "Judiciary",
            "type": "Civics - Court Structure & Role",
            "videos": [
              {
                "language": "English",
                "youtubeVideoId": "dQw4w9WgXcQ",
                "title": "Judiciary - Class 8 (English)",
                "viewCount": 150000,
                "likeCount": 4200,
                "embedUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ"
              },
              {
                "language": "Hindi",
                "youtubeVideoId": "dQw4w9WgXcQ",
                "title": "Judiciary - Class 8 (Hindi)",
                "viewCount": 120000,
                "likeCount": 3800,
                "embedUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ"
              }
            ]
          },
          {
            "lessonNo": "6",
            "chapterName": "Understanding Our Criminal Justice System",
            "type": "Civics - Legal Processes",
            "videos": [
              {
                "language": "English",
                "youtubeVideoId": "dQw4w9WgXcQ",
                "title": "Understanding Our Criminal Justice System - Class 8 (English)",
                "viewCount": 150000,
                "likeCount": 4200,
                "embedUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ"
              },
              {
                "language": "Hindi",
                "youtubeVideoId": "dQw4w9WgXcQ",
                "title": "Understanding Our Criminal Justice System - Class 8 (Hindi)",
                "viewCount": 120000,
                "likeCount": 3800,
                "embedUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ"
              }
            ]
          },
          {
            "lessonNo": "7",
            "chapterName": "Understanding Marginalisation",
            "type": "Civics - Social Exclusion",
            "videos": [
              {
                "language": "English",
                "youtubeVideoId": "dQw4w9WgXcQ",
                "title": "Understanding Marginalisation - Class 8 (English)",
                "viewCount": 150000,
                "likeCount": 4200,
                "embedUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ"
              },
              {
                "language": "Hindi",
                "youtubeVideoId": "dQw4w9WgXcQ",
                "title": "Understanding Marginalisation - Class 8 (Hindi)",
                "viewCount": 120000,
                "likeCount": 3800,
                "embedUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ"
              }
            ]
          },
          {
            "lessonNo": "8",
            "chapterName": "Confronting Marginalisation",
            "type": "Civics - Empowerment & Resistance",
            "videos": [
              {
                "language": "English",
                "youtubeVideoId": "dQw4w9WgXcQ",
                "title": "Confronting Marginalisation - Class 8 (English)",
                "viewCount": 150000,
                "likeCount": 4200,
                "embedUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ"
              },
              {
                "language": "Hindi",
                "youtubeVideoId": "dQw4w9WgXcQ",
                "title": "Confronting Marginalisation - Class 8 (Hindi)",
                "viewCount": 120000,
                "likeCount": 3800,
                "embedUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ"
              }
            ]
          },
          {
            "lessonNo": "9",
            "chapterName": "Public Facilities",
            "type": "Civics - Services & Governance",
            "videos": [
              {
                "language": "English",
                "youtubeVideoId": "dQw4w9WgXcQ",
                "title": "Public Facilities - Class 8 (English)",
                "viewCount": 150000,
                "likeCount": 4200,
                "embedUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ"
              },
              {
                "language": "Hindi",
                "youtubeVideoId": "dQw4w9WgXcQ",
                "title": "Public Facilities - Class 8 (Hindi)",
                "viewCount": 120000,
                "likeCount": 3800,
                "embedUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ"
              }
            ]
          },
          {
            "lessonNo": "10",
            "chapterName": "Law and Social Justice",
            "type": "Civics - Role of Government & Law",
            "videos": [
              {
                "language": "English",
                "youtubeVideoId": "dQw4w9WgXcQ",
                "title": "Law and Social Justice - Class 8 (English)",
                "viewCount": 150000,
                "likeCount": 4200,
                "embedUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ"
              },
              {
                "language": "Hindi",
                "youtubeVideoId": "dQw4w9WgXcQ",
                "title": "Law and Social Justice - Class 8 (Hindi)",
                "viewCount": 120000,
                "likeCount": 3800,
                "embedUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ"
              }
            ]
          }
        ]
      },
      {
        "unitName": "Unit 4: Economics - Understanding Economic Development",
        "chapters": [
          {
            "lessonNo": "12",
            "chapterName": "The Story of Village Palampur",
            "type": "Economics - Rural Economy",
            "videos": [
              {
                "language": "English",
                "youtubeVideoId": "dQw4w9WgXcQ",
                "title": "The Story of Village Palampur - Class 8 (English)",
                "viewCount": 150000,
                "likeCount": 4200,
                "embedUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ"
              },
              {
                "language": "Hindi",
                "youtubeVideoId": "dQw4w9WgXcQ",
                "title": "The Story of Village Palampur - Class 8 (Hindi)",
                "viewCount": 120000,
                "likeCount": 3800,
                "embedUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ"
              }
            ]
          },
          {
            "lessonNo": "13",
            "chapterName": "Role of the Government in Health",
            "type": "Economics - Public Health",
            "videos": [
              {
                "language": "English",
                "youtubeVideoId": "dQw4w9WgXcQ",
                "title": "Role of the Government in Health - Class 8 (English)",
                "viewCount": 150000,
                "likeCount": 4200,
                "embedUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ"
              },
              {
                "language": "Hindi",
                "youtubeVideoId": "dQw4w9WgXcQ",
                "title": "Role of the Government in Health - Class 8 (Hindi)",
                "viewCount": 120000,
                "likeCount": 3800,
                "embedUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ"
              }
            ]
          },
          {
            "lessonNo": "14",
            "chapterName": "How the Markets Work",
            "type": "Economics - Buyers and Sellers",
            "videos": [
              {
                "language": "English",
                "youtubeVideoId": "dQw4w9WgXcQ",
                "title": "How the Markets Work - Class 8 (English)",
                "viewCount": 150000,
                "likeCount": 4200,
                "embedUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ"
              },
              {
                "language": "Hindi",
                "youtubeVideoId": "dQw4w9WgXcQ",
                "title": "How the Markets Work - Class 8 (Hindi)",
                "viewCount": 120000,
                "likeCount": 3800,
                "embedUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ"
              }
            ]
          },
          {
            "lessonNo": "15",
            "chapterName": "Globalisation and the Indian Economy",
            "type": "Economics - Trade & Global Links",
            "videos": [
              {
                "language": "English",
                "youtubeVideoId": "dQw4w9WgXcQ",
                "title": "Globalisation and the Indian Economy - Class 8 (English)",
                "viewCount": 150000,
                "likeCount": 4200,
                "embedUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ"
              },
              {
                "language": "Hindi",
                "youtubeVideoId": "dQw4w9WgXcQ",
                "title": "Globalisation and the Indian Economy - Class 8 (Hindi)",
                "viewCount": 120000,
                "likeCount": 3800,
                "embedUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ"
              }
            ]
          },
          {
            "lessonNo": "16",
            "chapterName": "Public Distribution System",
            "type": "Economics - Food Security",
            "videos": [
              {
                "language": "English",
                "youtubeVideoId": "dQw4w9WgXcQ",
                "title": "Public Distribution System - Class 8 (English)",
                "viewCount": 150000,
                "likeCount": 4200,
                "embedUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ"
              },
              {
                "language": "Hindi",
                "youtubeVideoId": "dQw4w9WgXcQ",
                "title": "Public Distribution System - Class 8 (Hindi)",
                "viewCount": 120000,
                "likeCount": 3800,
                "embedUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ"
              }
            ]
          }
        ]
      }
    ]
  },
  {
    "grade": 8,
    "board": "CBSE",
    "subject": "Science",
    "units": [
      {
        "unitName": "Unit 1: Physical Science",
        "chapters": [
          {
            "lessonNo": "1",
            "chapterName": "Force and Pressure",
            "type": "Physics - Mechanics",
            "videos": [
              {
                "language": "English",
                "youtubeVideoId": "dQw4w9WgXcQ",
                "title": "Force and Pressure - Class 8 (English)",
                "viewCount": 150000,
                "likeCount": 4200,
                "embedUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ"
              },
              {
                "language": "Hindi",
                "youtubeVideoId": "dQw4w9WgXcQ",
                "title": "Force and Pressure - Class 8 (Hindi)",
                "viewCount": 120000,
                "likeCount": 3800,
                "embedUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ"
              }
            ]
          },
          {
            "lessonNo": "2",
            "chapterName": "Friction",
            "type": "Physics - Motion & Resistance",
            "videos": [
              {
                "language": "English",
                "youtubeVideoId": "dQw4w9WgXcQ",
                "title": "Friction - Class 8 (English)",
                "viewCount": 150000,
                "likeCount": 4200,
                "embedUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ"
              },
              {
                "language": "Hindi",
                "youtubeVideoId": "dQw4w9WgXcQ",
                "title": "Friction - Class 8 (Hindi)",
                "viewCount": 120000,
                "likeCount": 3800,
                "embedUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ"
              }
            ]
          },
          {
            "lessonNo": "3",
            "chapterName": "Sound",
            "type": "Physics - Vibrations & Waves",
            "videos": [
              {
                "language": "English",
                "youtubeVideoId": "dQw4w9WgXcQ",
                "title": "Sound - Class 8 (English)",
                "viewCount": 150000,
                "likeCount": 4200,
                "embedUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ"
              },
              {
                "language": "Hindi",
                "youtubeVideoId": "dQw4w9WgXcQ",
                "title": "Sound - Class 8 (Hindi)",
                "viewCount": 120000,
                "likeCount": 3800,
                "embedUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ"
              }
            ]
          },
          {
            "lessonNo": "4",
            "chapterName": "Chemical Effects of Electric Current",
            "type": "Physics/Chemistry - Electricity",
            "videos": [
              {
                "language": "English",
                "youtubeVideoId": "dQw4w9WgXcQ",
                "title": "Chemical Effects of Electric Current - Class 8 (English)",
                "viewCount": 150000,
                "likeCount": 4200,
                "embedUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ"
              },
              {
                "language": "Hindi",
                "youtubeVideoId": "dQw4w9WgXcQ",
                "title": "Chemical Effects of Electric Current - Class 8 (Hindi)",
                "viewCount": 120000,
                "likeCount": 3800,
                "embedUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ"
              }
            ]
          }
        ]
      },
      {
        "unitName": "Unit 2: Materials and Matter",
        "chapters": [
          {
            "lessonNo": "5",
            "chapterName": "Synthetic Fibres and Plastics",
            "type": "Chemistry - Materials",
            "videos": [
              {
                "language": "English",
                "youtubeVideoId": "dQw4w9WgXcQ",
                "title": "Synthetic Fibres and Plastics - Class 8 (English)",
                "viewCount": 150000,
                "likeCount": 4200,
                "embedUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ"
              },
              {
                "language": "Hindi",
                "youtubeVideoId": "dQw4w9WgXcQ",
                "title": "Synthetic Fibres and Plastics - Class 8 (Hindi)",
                "viewCount": 120000,
                "likeCount": 3800,
                "embedUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ"
              }
            ]
          },
          {
            "lessonNo": "6",
            "chapterName": "Metals and Non-Metals",
            "type": "Chemistry - Properties & Uses",
            "videos": [
              {
                "language": "English",
                "youtubeVideoId": "dQw4w9WgXcQ",
                "title": "Metals and Non-Metals - Class 8 (English)",
                "viewCount": 150000,
                "likeCount": 4200,
                "embedUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ"
              },
              {
                "language": "Hindi",
                "youtubeVideoId": "dQw4w9WgXcQ",
                "title": "Metals and Non-Metals - Class 8 (Hindi)",
                "viewCount": 120000,
                "likeCount": 3800,
                "embedUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ"
              }
            ]
          },
          {
            "lessonNo": "7",
            "chapterName": "Coal and Petroleum",
            "type": "Chemistry - Natural Resources",
            "videos": [
              {
                "language": "English",
                "youtubeVideoId": "dQw4w9WgXcQ",
                "title": "Coal and Petroleum - Class 8 (English)",
                "viewCount": 150000,
                "likeCount": 4200,
                "embedUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ"
              },
              {
                "language": "Hindi",
                "youtubeVideoId": "dQw4w9WgXcQ",
                "title": "Coal and Petroleum - Class 8 (Hindi)",
                "viewCount": 120000,
                "likeCount": 3800,
                "embedUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ"
              }
            ]
          },
          {
            "lessonNo": "8",
            "chapterName": "Combustion and Flame",
            "type": "Chemistry - Energy Transformation",
            "videos": [
              {
                "language": "English",
                "youtubeVideoId": "dQw4w9WgXcQ",
                "title": "Combustion and Flame - Class 8 (English)",
                "viewCount": 150000,
                "likeCount": 4200,
                "embedUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ"
              },
              {
                "language": "Hindi",
                "youtubeVideoId": "dQw4w9WgXcQ",
                "title": "Combustion and Flame - Class 8 (Hindi)",
                "viewCount": 120000,
                "likeCount": 3800,
                "embedUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ"
              }
            ]
          }
        ]
      },
      {
        "unitName": "Unit 3: Life Science",
        "chapters": [
          {
            "lessonNo": "9",
            "chapterName": "Cell - Structure and Functions",
            "type": "Biology - Cells",
            "videos": [
              {
                "language": "English",
                "youtubeVideoId": "dQw4w9WgXcQ",
                "title": "Cell - Structure and Functions - Class 8 (English)",
                "viewCount": 150000,
                "likeCount": 4200,
                "embedUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ"
              },
              {
                "language": "Hindi",
                "youtubeVideoId": "dQw4w9WgXcQ",
                "title": "Cell - Structure and Functions - Class 8 (Hindi)",
                "viewCount": 120000,
                "likeCount": 3800,
                "embedUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ"
              }
            ]
          },
          {
            "lessonNo": "10",
            "chapterName": "Reproduction in Animals",
            "type": "Biology - Reproduction",
            "videos": [
              {
                "language": "English",
                "youtubeVideoId": "dQw4w9WgXcQ",
                "title": "Reproduction in Animals - Class 8 (English)",
                "viewCount": 150000,
                "likeCount": 4200,
                "embedUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ"
              },
              {
                "language": "Hindi",
                "youtubeVideoId": "dQw4w9WgXcQ",
                "title": "Reproduction in Animals - Class 8 (Hindi)",
                "viewCount": 120000,
                "likeCount": 3800,
                "embedUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ"
              }
            ]
          },
          {
            "lessonNo": "11",
            "chapterName": "Reaching the Age of Adolescence",
            "type": "Biology - Human Body & Changes",
            "videos": [
              {
                "language": "English",
                "youtubeVideoId": "dQw4w9WgXcQ",
                "title": "Reaching the Age of Adolescence - Class 8 (English)",
                "viewCount": 150000,
                "likeCount": 4200,
                "embedUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ"
              },
              {
                "language": "Hindi",
                "youtubeVideoId": "dQw4w9WgXcQ",
                "title": "Reaching the Age of Adolescence - Class 8 (Hindi)",
                "viewCount": 120000,
                "likeCount": 3800,
                "embedUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ"
              }
            ]
          }
        ]
      },
      {
        "unitName": "Unit 4: Environment and Systems",
        "chapters": [
          {
            "lessonNo": "12",
            "chapterName": "Microorganisms: Friend and Foe",
            "type": "Biology - Microbiology",
            "videos": [
              {
                "language": "English",
                "youtubeVideoId": "dQw4w9WgXcQ",
                "title": "Microorganisms: Friend and Foe - Class 8 (English)",
                "viewCount": 150000,
                "likeCount": 4200,
                "embedUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ"
              },
              {
                "language": "Hindi",
                "youtubeVideoId": "dQw4w9WgXcQ",
                "title": "Microorganisms: Friend and Foe - Class 8 (Hindi)",
                "viewCount": 120000,
                "likeCount": 3800,
                "embedUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ"
              }
            ]
          },
          {
            "lessonNo": "13",
            "chapterName": "Pollution of Air and Water",
            "type": "Environmental Science",
            "videos": [
              {
                "language": "English",
                "youtubeVideoId": "dQw4w9WgXcQ",
                "title": "Pollution of Air and Water - Class 8 (English)",
                "viewCount": 150000,
                "likeCount": 4200,
                "embedUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ"
              },
              {
                "language": "Hindi",
                "youtubeVideoId": "dQw4w9WgXcQ",
                "title": "Pollution of Air and Water - Class 8 (Hindi)",
                "viewCount": 120000,
                "likeCount": 3800,
                "embedUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ"
              }
            ]
          },
          {
            "lessonNo": "14",
            "chapterName": "Some Natural Phenomena",
            "type": "Physics - Lightning & Earthquakes",
            "videos": [
              {
                "language": "English",
                "youtubeVideoId": "dQw4w9WgXcQ",
                "title": "Some Natural Phenomena - Class 8 (English)",
                "viewCount": 150000,
                "likeCount": 4200,
                "embedUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ"
              },
              {
                "language": "Hindi",
                "youtubeVideoId": "dQw4w9WgXcQ",
                "title": "Some Natural Phenomena - Class 8 (Hindi)",
                "viewCount": 120000,
                "likeCount": 3800,
                "embedUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ"
              }
            ]
          },
          {
            "lessonNo": "15",
            "chapterName": "Light",
            "type": "Physics - Reflection & Refraction",
            "videos": [
              {
                "language": "English",
                "youtubeVideoId": "dQw4w9WgXcQ",
                "title": "Light - Class 8 (English)",
                "viewCount": 150000,
                "likeCount": 4200,
                "embedUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ"
              },
              {
                "language": "Hindi",
                "youtubeVideoId": "dQw4w9WgXcQ",
                "title": "Light - Class 8 (Hindi)",
                "viewCount": 120000,
                "likeCount": 3800,
                "embedUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ"
              }
            ]
          },
          {
            "lessonNo": "16",
            "chapterName": "Stars and The Solar System",
            "type": "Astronomy",
            "videos": [
              {
                "language": "English",
                "youtubeVideoId": "dQw4w9WgXcQ",
                "title": "Stars and The Solar System - Class 8 (English)",
                "viewCount": 150000,
                "likeCount": 4200,
                "embedUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ"
              },
              {
                "language": "Hindi",
                "youtubeVideoId": "dQw4w9WgXcQ",
                "title": "Stars and The Solar System - Class 8 (Hindi)",
                "viewCount": 120000,
                "likeCount": 3800,
                "embedUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ"
              }
            ]
          },
          {
            "lessonNo": "17",
            "chapterName": "Conservation of Plants and Animals",
            "type": "Biology - Ecology & Conservation",
            "videos": [
              {
                "language": "English",
                "youtubeVideoId": "dQw4w9WgXcQ",
                "title": "Conservation of Plants and Animals - Class 8 (English)",
                "viewCount": 150000,
                "likeCount": 4200,
                "embedUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ"
              },
              {
                "language": "Hindi",
                "youtubeVideoId": "dQw4w9WgXcQ",
                "title": "Conservation of Plants and Animals - Class 8 (Hindi)",
                "viewCount": 120000,
                "likeCount": 3800,
                "embedUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ"
              }
            ]
          }
        ]
      }
    ]
  },
  {
    "grade": 8,
    "board": "CBSE",
    "subject": "Mathematics",
    "units": [
      {
        "unitName": "Unit 1: Number Systems",
        "chapters": [
          {
            "lessonNo": "1",
            "chapterName": "Rational Numbers",
            "type": "Properties and Operations",
            "videos": [
              {
                "language": "English",
                "youtubeVideoId": "dQw4w9WgXcQ",
                "title": "Rational Numbers - Class 8 (English)",
                "viewCount": 150000,
                "likeCount": 4200,
                "embedUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ"
              },
              {
                "language": "Hindi",
                "youtubeVideoId": "dQw4w9WgXcQ",
                "title": "Rational Numbers - Class 8 (Hindi)",
                "viewCount": 120000,
                "likeCount": 3800,
                "embedUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ"
              }
            ]
          },
          {
            "lessonNo": "2",
            "chapterName": "Powers and Exponents",
            "type": "Laws of Exponents, Integers",
            "videos": [
              {
                "language": "English",
                "youtubeVideoId": "dQw4w9WgXcQ",
                "title": "Powers and Exponents - Class 8 (English)",
                "viewCount": 150000,
                "likeCount": 4200,
                "embedUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ"
              },
              {
                "language": "Hindi",
                "youtubeVideoId": "dQw4w9WgXcQ",
                "title": "Powers and Exponents - Class 8 (Hindi)",
                "viewCount": 120000,
                "likeCount": 3800,
                "embedUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ"
              }
            ]
          },
          {
            "lessonNo": "3",
            "chapterName": "Squares and Square Roots",
            "type": "Estimation and Factorization",
            "videos": [
              {
                "language": "English",
                "youtubeVideoId": "dQw4w9WgXcQ",
                "title": "Squares and Square Roots - Class 8 (English)",
                "viewCount": 150000,
                "likeCount": 4200,
                "embedUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ"
              },
              {
                "language": "Hindi",
                "youtubeVideoId": "dQw4w9WgXcQ",
                "title": "Squares and Square Roots - Class 8 (Hindi)",
                "viewCount": 120000,
                "likeCount": 3800,
                "embedUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ"
              }
            ]
          },
          {
            "lessonNo": "4",
            "chapterName": "Cubes and Cube Roots",
            "type": "Patterns and Prime Factorization",
            "videos": [
              {
                "language": "English",
                "youtubeVideoId": "dQw4w9WgXcQ",
                "title": "Cubes and Cube Roots - Class 8 (English)",
                "viewCount": 150000,
                "likeCount": 4200,
                "embedUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ"
              },
              {
                "language": "Hindi",
                "youtubeVideoId": "dQw4w9WgXcQ",
                "title": "Cubes and Cube Roots - Class 8 (Hindi)",
                "viewCount": 120000,
                "likeCount": 3800,
                "embedUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ"
              }
            ]
          }
        ]
      },
      {
        "unitName": "Unit 2: Algebra and Equations",
        "chapters": [
          {
            "lessonNo": "5",
            "chapterName": "Algebraic Expressions",
            "type": "Terms, Operations, Identities",
            "videos": [
              {
                "language": "English",
                "youtubeVideoId": "dQw4w9WgXcQ",
                "title": "Algebraic Expressions - Class 8 (English)",
                "viewCount": 150000,
                "likeCount": 4200,
                "embedUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ"
              },
              {
                "language": "Hindi",
                "youtubeVideoId": "dQw4w9WgXcQ",
                "title": "Algebraic Expressions - Class 8 (Hindi)",
                "viewCount": 120000,
                "likeCount": 3800,
                "embedUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ"
              }
            ]
          },
          {
            "lessonNo": "6",
            "chapterName": "Linear Equations in One Variable",
            "type": "Solving and Applying Equations",
            "videos": [
              {
                "language": "English",
                "youtubeVideoId": "dQw4w9WgXcQ",
                "title": "Linear Equations in One Variable - Class 8 (English)",
                "viewCount": 150000,
                "likeCount": 4200,
                "embedUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ"
              },
              {
                "language": "Hindi",
                "youtubeVideoId": "dQw4w9WgXcQ",
                "title": "Linear Equations in One Variable - Class 8 (Hindi)",
                "viewCount": 120000,
                "likeCount": 3800,
                "embedUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ"
              }
            ]
          }
        ]
      },
      {
        "unitName": "Unit 3: Geometry and Mensuration",
        "chapters": [
          {
            "lessonNo": "7",
            "chapterName": "Understanding Quadrilaterals",
            "type": "Types and Properties",
            "videos": [
              {
                "language": "English",
                "youtubeVideoId": "dQw4w9WgXcQ",
                "title": "Understanding Quadrilaterals - Class 8 (English)",
                "viewCount": 150000,
                "likeCount": 4200,
                "embedUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ"
              },
              {
                "language": "Hindi",
                "youtubeVideoId": "dQw4w9WgXcQ",
                "title": "Understanding Quadrilaterals - Class 8 (Hindi)",
                "viewCount": 120000,
                "likeCount": 3800,
                "embedUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ"
              }
            ]
          },
          {
            "lessonNo": "8",
            "chapterName": "Practical Geometry",
            "type": "Construction and Properties",
            "videos": [
              {
                "language": "English",
                "youtubeVideoId": "dQw4w9WgXcQ",
                "title": "Practical Geometry - Class 8 (English)",
                "viewCount": 150000,
                "likeCount": 4200,
                "embedUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ"
              },
              {
                "language": "Hindi",
                "youtubeVideoId": "dQw4w9WgXcQ",
                "title": "Practical Geometry - Class 8 (Hindi)",
                "viewCount": 120000,
                "likeCount": 3800,
                "embedUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ"
              }
            ]
          },
          {
            "lessonNo": "9",
            "chapterName": "Mensuration",
            "type": "Surface Area and Volume",
            "videos": [
              {
                "language": "English",
                "youtubeVideoId": "dQw4w9WgXcQ",
                "title": "Mensuration - Class 8 (English)",
                "viewCount": 150000,
                "likeCount": 4200,
                "embedUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ"
              },
              {
                "language": "Hindi",
                "youtubeVideoId": "dQw4w9WgXcQ",
                "title": "Mensuration - Class 8 (Hindi)",
                "viewCount": 120000,
                "likeCount": 3800,
                "embedUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ"
              }
            ]
          }
        ]
      },
      {
        "unitName": "Unit 4: Data and Graphs",
        "chapters": [
          {
            "lessonNo": "10",
            "chapterName": "Data Handling",
            "type": "Mean, Median, Bar Graphs",
            "videos": [
              {
                "language": "English",
                "youtubeVideoId": "dQw4w9WgXcQ",
                "title": "Data Handling - Class 8 (English)",
                "viewCount": 150000,
                "likeCount": 4200,
                "embedUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ"
              },
              {
                "language": "Hindi",
                "youtubeVideoId": "dQw4w9WgXcQ",
                "title": "Data Handling - Class 8 (Hindi)",
                "viewCount": 120000,
                "likeCount": 3800,
                "embedUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ"
              }
            ]
          },
          {
            "lessonNo": "11",
            "chapterName": "Introduction to Graphs",
            "type": "Linear Graphs and Coordinates",
            "videos": [
              {
                "language": "English",
                "youtubeVideoId": "dQw4w9WgXcQ",
                "title": "Introduction to Graphs - Class 8 (English)",
                "viewCount": 150000,
                "likeCount": 4200,
                "embedUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ"
              },
              {
                "language": "Hindi",
                "youtubeVideoId": "dQw4w9WgXcQ",
                "title": "Introduction to Graphs - Class 8 (Hindi)",
                "viewCount": 120000,
                "likeCount": 3800,
                "embedUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ"
              }
            ]
          }
        ]
      },
      {
        "unitName": "Unit 5: Comparing Quantities and Patterns",
        "chapters": [
          {
            "lessonNo": "12",
            "chapterName": "Comparing Quantities",
            "type": "Percentages, Profit & Loss",
            "videos": [
              {
                "language": "English",
                "youtubeVideoId": "dQw4w9WgXcQ",
                "title": "Comparing Quantities - Class 8 (English)",
                "viewCount": 150000,
                "likeCount": 4200,
                "embedUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ"
              },
              {
                "language": "Hindi",
                "youtubeVideoId": "dQw4w9WgXcQ",
                "title": "Comparing Quantities - Class 8 (Hindi)",
                "viewCount": 120000,
                "likeCount": 3800,
                "embedUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ"
              }
            ]
          },
          {
            "lessonNo": "13",
            "chapterName": "Direct and Inverse Proportions",
            "type": "Ratio-based Applications",
            "videos": [
              {
                "language": "English",
                "youtubeVideoId": "dQw4w9WgXcQ",
                "title": "Direct and Inverse Proportions - Class 8 (English)",
                "viewCount": 150000,
                "likeCount": 4200,
                "embedUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ"
              },
              {
                "language": "Hindi",
                "youtubeVideoId": "dQw4w9WgXcQ",
                "title": "Direct and Inverse Proportions - Class 8 (Hindi)",
                "viewCount": 120000,
                "likeCount": 3800,
                "embedUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ"
              }
            ]
          },
          {
            "lessonNo": "14",
            "chapterName": "Visualising Patterns",
            "type": "Number Patterns and Sequences",
            "videos": [
              {
                "language": "English",
                "youtubeVideoId": "dQw4w9WgXcQ",
                "title": "Visualising Patterns - Class 8 (English)",
                "viewCount": 150000,
                "likeCount": 4200,
                "embedUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ"
              },
              {
                "language": "Hindi",
                "youtubeVideoId": "dQw4w9WgXcQ",
                "title": "Visualising Patterns - Class 8 (Hindi)",
                "viewCount": 120000,
                "likeCount": 3800,
                "embedUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ"
              }
            ]
          }
        ]
      }
    ]
  },
  {
    "grade": 8,
    "board": "CBSE",
    "subject": "English",
    "units": [
      {
        "unitName": "Unit 1: Exploring Together",
        "chapters": [
          {
            "lessonNo": "1",
            "chapterName": "A World of Ideas",
            "type": "Story",
            "videos": [
              {
                "language": "English",
                "youtubeVideoId": "dQw4w9WgXcQ",
                "title": "A World of Ideas - Class 8 (English)",
                "viewCount": 150000,
                "likeCount": 4200,
                "embedUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ"
              },
              {
                "language": "Hindi",
                "youtubeVideoId": "dQw4w9WgXcQ",
                "title": "A World of Ideas - Class 8 (Hindi)",
                "viewCount": 120000,
                "likeCount": 3800,
                "embedUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ"
              }
            ]
          },
          {
            "lessonNo": "2",
            "chapterName": "The Power of Unity",
            "type": "Poem",
            "videos": [
              {
                "language": "English",
                "youtubeVideoId": "dQw4w9WgXcQ",
                "title": "The Power of Unity - Class 8 (English)",
                "viewCount": 150000,
                "likeCount": 4200,
                "embedUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ"
              },
              {
                "language": "Hindi",
                "youtubeVideoId": "dQw4w9WgXcQ",
                "title": "The Power of Unity - Class 8 (Hindi)",
                "viewCount": 120000,
                "likeCount": 3800,
                "embedUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ"
              }
            ]
          },
          {
            "lessonNo": "3",
            "chapterName": "Smart Choices, Safe Living",
            "type": "Informative / Value based",
            "videos": [
              {
                "language": "English",
                "youtubeVideoId": "dQw4w9WgXcQ",
                "title": "Smart Choices, Safe Living - Class 8 (English)",
                "viewCount": 150000,
                "likeCount": 4200,
                "embedUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ"
              },
              {
                "language": "Hindi",
                "youtubeVideoId": "dQw4w9WgXcQ",
                "title": "Smart Choices, Safe Living - Class 8 (Hindi)",
                "viewCount": 120000,
                "likeCount": 3800,
                "embedUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ"
              }
            ]
          }
        ]
      },
      {
        "unitName": "Unit 2: Nature and Us",
        "chapters": [
          {
            "lessonNo": "4",
            "chapterName": "Nature’s Gift",
            "type": "Poem",
            "videos": [
              {
                "language": "English",
                "youtubeVideoId": "dQw4w9WgXcQ",
                "title": "Nature’s Gift - Class 8 (English)",
                "viewCount": 150000,
                "likeCount": 4200,
                "embedUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ"
              },
              {
                "language": "Hindi",
                "youtubeVideoId": "dQw4w9WgXcQ",
                "title": "Nature’s Gift - Class 8 (Hindi)",
                "viewCount": 120000,
                "likeCount": 3800,
                "embedUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ"
              }
            ]
          },
          {
            "lessonNo": "5",
            "chapterName": "The Last Leaf",
            "type": "Story (Classic Adaptation)",
            "videos": [
              {
                "language": "English",
                "youtubeVideoId": "dQw4w9WgXcQ",
                "title": "The Last Leaf - Class 8 (English)",
                "viewCount": 150000,
                "likeCount": 4200,
                "embedUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ"
              },
              {
                "language": "Hindi",
                "youtubeVideoId": "dQw4w9WgXcQ",
                "title": "The Last Leaf - Class 8 (Hindi)",
                "viewCount": 120000,
                "likeCount": 3800,
                "embedUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ"
              }
            ]
          },
          {
            "lessonNo": "6",
            "chapterName": "Wonders of Water",
            "type": "Informative Text",
            "videos": [
              {
                "language": "English",
                "youtubeVideoId": "dQw4w9WgXcQ",
                "title": "Wonders of Water - Class 8 (English)",
                "viewCount": 150000,
                "likeCount": 4200,
                "embedUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ"
              },
              {
                "language": "Hindi",
                "youtubeVideoId": "dQw4w9WgXcQ",
                "title": "Wonders of Water - Class 8 (Hindi)",
                "viewCount": 120000,
                "likeCount": 3800,
                "embedUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ"
              }
            ]
          }
        ]
      },
      {
        "unitName": "Unit 3: Mind and Motion",
        "chapters": [
          {
            "lessonNo": "7",
            "chapterName": "Active Body, Sharp Mind",
            "type": "Descriptive Text",
            "videos": [
              {
                "language": "English",
                "youtubeVideoId": "dQw4w9WgXcQ",
                "title": "Active Body, Sharp Mind - Class 8 (English)",
                "viewCount": 150000,
                "likeCount": 4200,
                "embedUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ"
              },
              {
                "language": "Hindi",
                "youtubeVideoId": "dQw4w9WgXcQ",
                "title": "Active Body, Sharp Mind - Class 8 (Hindi)",
                "viewCount": 120000,
                "likeCount": 3800,
                "embedUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ"
              }
            ]
          },
          {
            "lessonNo": "8",
            "chapterName": "The Chess Master",
            "type": "Story",
            "videos": [
              {
                "language": "English",
                "youtubeVideoId": "dQw4w9WgXcQ",
                "title": "The Chess Master - Class 8 (English)",
                "viewCount": 150000,
                "likeCount": 4200,
                "embedUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ"
              },
              {
                "language": "Hindi",
                "youtubeVideoId": "dQw4w9WgXcQ",
                "title": "The Chess Master - Class 8 (Hindi)",
                "viewCount": 120000,
                "likeCount": 3800,
                "embedUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ"
              }
            ]
          },
          {
            "lessonNo": "9",
            "chapterName": "The Marathon That Changed Me",
            "type": "Personal Narrative",
            "videos": [
              {
                "language": "English",
                "youtubeVideoId": "dQw4w9WgXcQ",
                "title": "The Marathon That Changed Me - Class 8 (English)",
                "viewCount": 150000,
                "likeCount": 4200,
                "embedUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ"
              },
              {
                "language": "Hindi",
                "youtubeVideoId": "dQw4w9WgXcQ",
                "title": "The Marathon That Changed Me - Class 8 (Hindi)",
                "viewCount": 120000,
                "likeCount": 3800,
                "embedUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ"
              }
            ]
          }
        ]
      },
      {
        "unitName": "Unit 4: Heights and Hopes",
        "chapters": [
          {
            "lessonNo": "10",
            "chapterName": "Wings to Fly",
            "type": "Poem",
            "videos": [
              {
                "language": "English",
                "youtubeVideoId": "dQw4w9WgXcQ",
                "title": "Wings to Fly - Class 8 (English)",
                "viewCount": 150000,
                "likeCount": 4200,
                "embedUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ"
              },
              {
                "language": "Hindi",
                "youtubeVideoId": "dQw4w9WgXcQ",
                "title": "Wings to Fly - Class 8 (Hindi)",
                "viewCount": 120000,
                "likeCount": 3800,
                "embedUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ"
              }
            ]
          },
          {
            "lessonNo": "11",
            "chapterName": "Across the Peaks",
            "type": "Descriptive / Travelogue",
            "videos": [
              {
                "language": "English",
                "youtubeVideoId": "dQw4w9WgXcQ",
                "title": "Across the Peaks - Class 8 (English)",
                "viewCount": 150000,
                "likeCount": 4200,
                "embedUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ"
              },
              {
                "language": "Hindi",
                "youtubeVideoId": "dQw4w9WgXcQ",
                "title": "Across the Peaks - Class 8 (Hindi)",
                "viewCount": 120000,
                "likeCount": 3800,
                "embedUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ"
              }
            ]
          },
          {
            "lessonNo": "12",
            "chapterName": "In the Footsteps of History-Hampi",
            "type": "Informative / Heritage Story",
            "videos": [
              {
                "language": "English",
                "youtubeVideoId": "dQw4w9WgXcQ",
                "title": "In the Footsteps of History-Hampi - Class 8 (English)",
                "viewCount": 150000,
                "likeCount": 4200,
                "embedUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ"
              },
              {
                "language": "Hindi",
                "youtubeVideoId": "dQw4w9WgXcQ",
                "title": "In the Footsteps of History-Hampi - Class 8 (Hindi)",
                "viewCount": 120000,
                "likeCount": 3800,
                "embedUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ"
              }
            ]
          }
        ]
      }
    ]
  },
  {
    "grade": 8,
    "board": "CBSE",
    "subject": "Hindi",
    "units": [
      {
        "unitName": "Unit 1: परिवार और समाज",
        "chapters": [
          {
            "lessonNo": "1",
            "chapterName": "नई शुरुआत",
            "type": "Story",
            "videos": [
              {
                "language": "English",
                "youtubeVideoId": "dQw4w9WgXcQ",
                "title": "नई शुरुआत - Class 8 (English)",
                "viewCount": 150000,
                "likeCount": 4200,
                "embedUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ"
              },
              {
                "language": "Hindi",
                "youtubeVideoId": "dQw4w9WgXcQ",
                "title": "नई शुरुआत - Class 8 (Hindi)",
                "viewCount": 120000,
                "likeCount": 3800,
                "embedUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ"
              }
            ]
          },
          {
            "lessonNo": "2",
            "chapterName": "एक बार की बात",
            "type": "Poem",
            "videos": [
              {
                "language": "English",
                "youtubeVideoId": "dQw4w9WgXcQ",
                "title": "एक बार की बात - Class 8 (English)",
                "viewCount": 150000,
                "likeCount": 4200,
                "embedUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ"
              },
              {
                "language": "Hindi",
                "youtubeVideoId": "dQw4w9WgXcQ",
                "title": "एक बार की बात - Class 8 (Hindi)",
                "viewCount": 120000,
                "likeCount": 3800,
                "embedUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ"
              }
            ]
          },
          {
            "lessonNo": "3",
            "chapterName": "हमारी माँ",
            "type": "Story",
            "videos": [
              {
                "language": "English",
                "youtubeVideoId": "dQw4w9WgXcQ",
                "title": "हमारी माँ - Class 8 (English)",
                "viewCount": 150000,
                "likeCount": 4200,
                "embedUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ"
              },
              {
                "language": "Hindi",
                "youtubeVideoId": "dQw4w9WgXcQ",
                "title": "हमारी माँ - Class 8 (Hindi)",
                "viewCount": 120000,
                "likeCount": 3800,
                "embedUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ"
              }
            ]
          },
          {
            "lessonNo": "4",
            "chapterName": "बड़ों का आदर",
            "type": "Value based",
            "videos": [
              {
                "language": "English",
                "youtubeVideoId": "dQw4w9WgXcQ",
                "title": "बड़ों का आदर - Class 8 (English)",
                "viewCount": 150000,
                "likeCount": 4200,
                "embedUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ"
              },
              {
                "language": "Hindi",
                "youtubeVideoId": "dQw4w9WgXcQ",
                "title": "बड़ों का आदर - Class 8 (Hindi)",
                "viewCount": 120000,
                "likeCount": 3800,
                "embedUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ"
              }
            ]
          },
          {
            "lessonNo": "5",
            "chapterName": "मेरे प्रिय दादा",
            "type": "Biography based",
            "videos": [
              {
                "language": "English",
                "youtubeVideoId": "dQw4w9WgXcQ",
                "title": "मेरे प्रिय दादा - Class 8 (English)",
                "viewCount": 150000,
                "likeCount": 4200,
                "embedUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ"
              },
              {
                "language": "Hindi",
                "youtubeVideoId": "dQw4w9WgXcQ",
                "title": "मेरे प्रिय दादा - Class 8 (Hindi)",
                "viewCount": 120000,
                "likeCount": 3800,
                "embedUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ"
              }
            ]
          }
        ]
      },
      {
        "unitName": "Unit 2: विविध रंग",
        "chapters": [
          {
            "lessonNo": "6",
            "chapterName": "रंगों की दुनिया",
            "type": "Poem",
            "videos": [
              {
                "language": "English",
                "youtubeVideoId": "dQw4w9WgXcQ",
                "title": "रंगों की दुनिया - Class 8 (English)",
                "viewCount": 150000,
                "likeCount": 4200,
                "embedUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ"
              },
              {
                "language": "Hindi",
                "youtubeVideoId": "dQw4w9WgXcQ",
                "title": "रंगों की दुनिया - Class 8 (Hindi)",
                "viewCount": 120000,
                "likeCount": 3800,
                "embedUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ"
              }
            ]
          },
          {
            "lessonNo": "7",
            "chapterName": "दोस्ती की ताकत",
            "type": "Story",
            "videos": [
              {
                "language": "English",
                "youtubeVideoId": "dQw4w9WgXcQ",
                "title": "दोस्ती की ताकत - Class 8 (English)",
                "viewCount": 150000,
                "likeCount": 4200,
                "embedUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ"
              },
              {
                "language": "Hindi",
                "youtubeVideoId": "dQw4w9WgXcQ",
                "title": "दोस्ती की ताकत - Class 8 (Hindi)",
                "viewCount": 120000,
                "likeCount": 3800,
                "embedUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ"
              }
            ]
          },
          {
            "lessonNo": "8",
            "chapterName": "त्योहारों की रौनक",
            "type": "Descriptive",
            "videos": [
              {
                "language": "English",
                "youtubeVideoId": "dQw4w9WgXcQ",
                "title": "त्योहारों की रौनक - Class 8 (English)",
                "viewCount": 150000,
                "likeCount": 4200,
                "embedUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ"
              },
              {
                "language": "Hindi",
                "youtubeVideoId": "dQw4w9WgXcQ",
                "title": "त्योहारों की रौनक - Class 8 (Hindi)",
                "viewCount": 120000,
                "likeCount": 3800,
                "embedUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ"
              }
            ]
          },
          {
            "lessonNo": "9",
            "chapterName": "जीवन में हँसी",
            "type": "Poem",
            "videos": [
              {
                "language": "English",
                "youtubeVideoId": "dQw4w9WgXcQ",
                "title": "जीवन में हँसी - Class 8 (English)",
                "viewCount": 150000,
                "likeCount": 4200,
                "embedUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ"
              },
              {
                "language": "Hindi",
                "youtubeVideoId": "dQw4w9WgXcQ",
                "title": "जीवन में हँसी - Class 8 (Hindi)",
                "viewCount": 120000,
                "likeCount": 3800,
                "embedUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ"
              }
            ]
          },
          {
            "lessonNo": "10",
            "chapterName": "हाथों की भाषा",
            "type": "Informative",
            "videos": [
              {
                "language": "English",
                "youtubeVideoId": "dQw4w9WgXcQ",
                "title": "हाथों की भाषा - Class 8 (English)",
                "viewCount": 150000,
                "likeCount": 4200,
                "embedUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ"
              },
              {
                "language": "Hindi",
                "youtubeVideoId": "dQw4w9WgXcQ",
                "title": "हाथों की भाषा - Class 8 (Hindi)",
                "viewCount": 120000,
                "likeCount": 3800,
                "embedUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ"
              }
            ]
          }
        ]
      },
      {
        "unitName": "Unit 3: प्रकृति और विज्ञान",
        "chapters": [
          {
            "lessonNo": "13",
            "chapterName": "पृथ्वी की पुकार",
            "type": "Poem",
            "videos": [
              {
                "language": "English",
                "youtubeVideoId": "dQw4w9WgXcQ",
                "title": "पृथ्वी की पुकार - Class 8 (English)",
                "viewCount": 150000,
                "likeCount": 4200,
                "embedUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ"
              },
              {
                "language": "Hindi",
                "youtubeVideoId": "dQw4w9WgXcQ",
                "title": "पृथ्वी की पुकार - Class 8 (Hindi)",
                "viewCount": 120000,
                "likeCount": 3800,
                "embedUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ"
              }
            ]
          },
          {
            "lessonNo": "14",
            "chapterName": "चिड़ियों की सभा",
            "type": "Story",
            "videos": [
              {
                "language": "English",
                "youtubeVideoId": "dQw4w9WgXcQ",
                "title": "चिड़ियों की सभा - Class 8 (English)",
                "viewCount": 150000,
                "likeCount": 4200,
                "embedUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ"
              },
              {
                "language": "Hindi",
                "youtubeVideoId": "dQw4w9WgXcQ",
                "title": "चिड़ियों की सभा - Class 8 (Hindi)",
                "viewCount": 120000,
                "likeCount": 3800,
                "embedUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ"
              }
            ]
          },
          {
            "lessonNo": "15",
            "chapterName": "बादलों की यात्रा",
            "type": "Descriptive",
            "videos": [
              {
                "language": "English",
                "youtubeVideoId": "dQw4w9WgXcQ",
                "title": "बादलों की यात्रा - Class 8 (English)",
                "viewCount": 150000,
                "likeCount": 4200,
                "embedUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ"
              },
              {
                "language": "Hindi",
                "youtubeVideoId": "dQw4w9WgXcQ",
                "title": "बादलों की यात्रा - Class 8 (Hindi)",
                "viewCount": 120000,
                "likeCount": 3800,
                "embedUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ"
              }
            ]
          },
          {
            "lessonNo": "16",
            "chapterName": "विज्ञान की दुनिया",
            "type": "Informative / Story",
            "videos": [
              {
                "language": "English",
                "youtubeVideoId": "dQw4w9WgXcQ",
                "title": "विज्ञान की दुनिया - Class 8 (English)",
                "viewCount": 150000,
                "likeCount": 4200,
                "embedUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ"
              },
              {
                "language": "Hindi",
                "youtubeVideoId": "dQw4w9WgXcQ",
                "title": "विज्ञान की दुनिया - Class 8 (Hindi)",
                "viewCount": 120000,
                "likeCount": 3800,
                "embedUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ"
              }
            ]
          },
          {
            "lessonNo": "17",
            "chapterName": "बूँदों की कहानी",
            "type": "Poem",
            "videos": [
              {
                "language": "English",
                "youtubeVideoId": "dQw4w9WgXcQ",
                "title": "बूँदों की कहानी - Class 8 (English)",
                "viewCount": 150000,
                "likeCount": 4200,
                "embedUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ"
              },
              {
                "language": "Hindi",
                "youtubeVideoId": "dQw4w9WgXcQ",
                "title": "बूँदों की कहानी - Class 8 (Hindi)",
                "viewCount": 120000,
                "likeCount": 3800,
                "embedUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ"
              }
            ]
          }
        ]
      },
      {
        "unitName": "Unit 4: प्रेरणा और मूल्य",
        "chapters": [
          {
            "lessonNo": "18",
            "chapterName": "सच्ची वीरता",
            "type": "Inspirational Story",
            "videos": [
              {
                "language": "English",
                "youtubeVideoId": "dQw4w9WgXcQ",
                "title": "सच्ची वीरता - Class 8 (English)",
                "viewCount": 150000,
                "likeCount": 4200,
                "embedUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ"
              },
              {
                "language": "Hindi",
                "youtubeVideoId": "dQw4w9WgXcQ",
                "title": "सच्ची वीरता - Class 8 (Hindi)",
                "viewCount": 120000,
                "likeCount": 3800,
                "embedUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ"
              }
            ]
          },
          {
            "lessonNo": "19",
            "chapterName": "जीत किसकी?",
            "type": "Moral based Story",
            "videos": [
              {
                "language": "English",
                "youtubeVideoId": "dQw4w9WgXcQ",
                "title": "जीत किसकी? - Class 8 (English)",
                "viewCount": 150000,
                "likeCount": 4200,
                "embedUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ"
              },
              {
                "language": "Hindi",
                "youtubeVideoId": "dQw4w9WgXcQ",
                "title": "जीत किसकी? - Class 8 (Hindi)",
                "viewCount": 120000,
                "likeCount": 3800,
                "embedUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ"
              }
            ]
          },
          {
            "lessonNo": "20",
            "chapterName": "कोशिश करने वालों की हार नहीं होती",
            "type": "Poem",
            "videos": [
              {
                "language": "English",
                "youtubeVideoId": "dQw4w9WgXcQ",
                "title": "कोशिश करने वालों की हार नहीं होती - Class 8 (English)",
                "viewCount": 150000,
                "likeCount": 4200,
                "embedUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ"
              },
              {
                "language": "Hindi",
                "youtubeVideoId": "dQw4w9WgXcQ",
                "title": "कोशिश करने वालों की हार नहीं होती - Class 8 (Hindi)",
                "viewCount": 120000,
                "likeCount": 3800,
                "embedUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ"
              }
            ]
          },
          {
            "lessonNo": "21",
            "chapterName": "संघर्ष से सफलता तक",
            "type": "Real life Based",
            "videos": [
              {
                "language": "English",
                "youtubeVideoId": "dQw4w9WgXcQ",
                "title": "संघर्ष से सफलता तक - Class 8 (English)",
                "viewCount": 150000,
                "likeCount": 4200,
                "embedUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ"
              },
              {
                "language": "Hindi",
                "youtubeVideoId": "dQw4w9WgXcQ",
                "title": "संघर्ष से सफलता तक - Class 8 (Hindi)",
                "viewCount": 120000,
                "likeCount": 3800,
                "embedUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ"
              }
            ]
          }
        ]
      },
      {
        "unitName": "Unit 5: संस्कृति और विरासत",
        "chapters": [
          {
            "lessonNo": "22",
            "chapterName": "कहानियों का खजाना",
            "type": "Story",
            "videos": [
              {
                "language": "English",
                "youtubeVideoId": "dQw4w9WgXcQ",
                "title": "कहानियों का खजाना - Class 8 (English)",
                "viewCount": 150000,
                "likeCount": 4200,
                "embedUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ"
              },
              {
                "language": "Hindi",
                "youtubeVideoId": "dQw4w9WgXcQ",
                "title": "कहानियों का खजाना - Class 8 (Hindi)",
                "viewCount": 120000,
                "likeCount": 3800,
                "embedUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ"
              }
            ]
          },
          {
            "lessonNo": "23",
            "chapterName": "लोकगीतों की मिठास",
            "type": "Poem",
            "videos": [
              {
                "language": "English",
                "youtubeVideoId": "dQw4w9WgXcQ",
                "title": "लोकगीतों की मिठास - Class 8 (English)",
                "viewCount": 150000,
                "likeCount": 4200,
                "embedUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ"
              },
              {
                "language": "Hindi",
                "youtubeVideoId": "dQw4w9WgXcQ",
                "title": "लोकगीतों की मिठास - Class 8 (Hindi)",
                "viewCount": 120000,
                "likeCount": 3800,
                "embedUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ"
              }
            ]
          },
          {
            "lessonNo": "24",
            "chapterName": "भारत की धरोहर",
            "type": "Informative",
            "videos": [
              {
                "language": "English",
                "youtubeVideoId": "dQw4w9WgXcQ",
                "title": "भारत की धरोहर - Class 8 (English)",
                "viewCount": 150000,
                "likeCount": 4200,
                "embedUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ"
              },
              {
                "language": "Hindi",
                "youtubeVideoId": "dQw4w9WgXcQ",
                "title": "भारत की धरोहर - Class 8 (Hindi)",
                "viewCount": 120000,
                "likeCount": 3800,
                "embedUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ"
              }
            ]
          },
          {
            "lessonNo": "25",
            "chapterName": "कश्मीर की वादियाँ",
            "type": "Travel/Descriptive",
            "videos": [
              {
                "language": "English",
                "youtubeVideoId": "dQw4w9WgXcQ",
                "title": "कश्मीर की वादियाँ - Class 8 (English)",
                "viewCount": 150000,
                "likeCount": 4200,
                "embedUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ"
              },
              {
                "language": "Hindi",
                "youtubeVideoId": "dQw4w9WgXcQ",
                "title": "कश्मीर की वादियाँ - Class 8 (Hindi)",
                "viewCount": 120000,
                "likeCount": 3800,
                "embedUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ"
              }
            ]
          },
          {
            "lessonNo": "26",
            "chapterName": "मिट्टी की खुशबू",
            "type": "Story",
            "videos": [
              {
                "language": "English",
                "youtubeVideoId": "dQw4w9WgXcQ",
                "title": "मिट्टी की खुशबू - Class 8 (English)",
                "viewCount": 150000,
                "likeCount": 4200,
                "embedUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ"
              },
              {
                "language": "Hindi",
                "youtubeVideoId": "dQw4w9WgXcQ",
                "title": "मिट्टी की खुशबू - Class 8 (Hindi)",
                "viewCount": 120000,
                "likeCount": 3800,
                "embedUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ"
              }
            ]
          }
        ]
      }
    ]
  },

];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    await Subject.deleteMany({});
    console.log('🗑️  Cleared existing data');

    // Inject dummy data for the new features into every chapter
    SEED_DATA.forEach(subject => {
      subject.units.forEach(unit => {
        unit.chapters.forEach(chapter => {
          chapter.textbookContent = [
            { title: "Part 1: Introduction", content: "This is the introduction to " + chapter.chapterName + ". It covers the foundational concepts and historical context." },
            { title: "Part 2: Core Concept", content: "The core concept of this chapter revolves around the fundamental principles. Understanding this is crucial for the rest of the topic." },
            { title: "Part 3: Examples", content: "Here are some examples illustrating the core concept. Example 1 shows the basic application. Example 2 demonstrates a more complex scenario." },
            { title: "Part 4: Applications", content: "These concepts are applied in real-world scenarios. For instance, in engineering, medicine, and everyday life." }
          ];
          chapter.keyMoments = [
            { timestamp: "0:00", title: "Introduction" },
            { timestamp: "1:30", title: "Core Concept Explanation" },
            { timestamp: "3:45", title: "Examples" },
            { timestamp: "5:20", title: "Real-world Applications" }
          ];
          chapter.quizQuestions = Array.from({ length: 10 }, (_, i) => ({
            question: `Which of the following is a key aspect of ${chapter.chapterName} (Question ${i + 1})?`,
            options: [`Option A for ${chapter.chapterName}`, `Option B for ${chapter.chapterName}`, `Option C for ${chapter.chapterName}`, `Option D for ${chapter.chapterName}`],
            correctAnswer: Math.floor(Math.random() * 4) // 0 to 3
          }));
          chapter.summary = `AI Summary of this Chapter:\n\n• The chapter covers the fundamental principles of ${chapter.chapterName}.\n• Explores historical context and core theories.\n• Provides practical examples and real-world applications.\n• Ensures a comprehensive understanding of the topic.`;
        });
      });
    });

    await Subject.insertMany(SEED_DATA);
    console.log('🌱 Seeded ' + SEED_DATA.length + ' subject documents');

    console.log('\n📄 Example document (Class 8 CBSE Mathematics):');
    const example = await Subject.findOne({ grade: 8, board: 'CBSE', subject: 'Mathematics' });
    console.log(JSON.stringify(example.toJSON(), null, 2));

    await mongoose.disconnect();
    console.log('\n✅ Seed complete. Disconnected.');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seed error:', err);
    process.exit(1);
  }
}

seed();
