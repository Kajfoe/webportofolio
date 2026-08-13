/* Embedded fallback copy of data/data.json — used when the site is
   opened directly from disk (file://) where fetch() is blocked. Keep
   this in sync with data/data.json, or just rely on the admin panel
   after first load since it persists to localStorage. */
window.DEFAULT_DATA = {
  "site": {
    "title": "Portofolio | Personal Website",
    "favicon": "assets/icons/favicon.svg",
    "logoText": "PF.",
    "loaderText": "Loading Experience"
  },
  "theme": {
    "colorBlue": "#4f7cff",
    "colorPurple": "#a855f7",
    "mode": "dark"
  },
  "sectionOrder": [
    "about",
    "skills",
    "education",
    "experience",
    "certificate",
    "gallery",
    "contact"
  ],
  "sectionVisibility": {
    "about": true,
    "skills": true,
    "education": true,
    "experience": true,
    "certificate": true,
    "gallery": true,
    "contact": true
  },
  "hero": {
    "greeting": "Halo, saya",
    "name": "Nama Anda",
    "roles": [
      "Web Developer",
      "UI/UX Designer",
      "AI Enthusiast",
      "Problem Solver"
    ],
    "description": "Saya membangun pengalaman digital yang bersih, cepat, dan terasa hidup — memadukan teknik dan desain menjadi satu kesatuan.",
    "photo": "assets/images/profile.png",
    "cvFile": "resume/cv.pdf"
  },
  "about": {
    "heading": "Tentang Saya",
    "description": "Deskripsi singkat mengenai perjalanan, minat, dan nilai yang saya pegang dalam bekerja maupun berkarya. Bagian ini sepenuhnya dapat diedit dari panel admin.",
    "biodata": {
      "Nama": "Nama Anda",
      "Umur": "22 Tahun",
      "Lokasi": "Sidoarjo, Indonesia",
      "Pendidikan": "S1 Teknik Informatika",
      "Jurusan": "Rekayasa Perangkat Lunak",
      "Email": "nama@email.com",
      "No. HP": "+62 812-0000-0000",
      "Bahasa": "Indonesia, Inggris",
      "Hobi": "Coding, Desain, Fotografi",
      "Tujuan Karier": "Menjadi Software Engineer / Product Designer profesional"
    }
  },
  "skills": {
    "heading": "Keahlian",
    "categories": [
      {
        "name": "Programming",
        "icon": "code-2",
        "level": 90
      },
      {
        "name": "UI/UX Design",
        "icon": "pen-tool",
        "level": 85
      },
      {
        "name": "Machine Learning",
        "icon": "brain-circuit",
        "level": 70
      },
      {
        "name": "Artificial Intelligence",
        "icon": "sparkles",
        "level": 72
      },
      {
        "name": "Data Science",
        "icon": "bar-chart-3",
        "level": 75
      },
      {
        "name": "Database",
        "icon": "database",
        "level": 80
      },
      {
        "name": "Cyber Security",
        "icon": "shield-check",
        "level": 65
      },
      {
        "name": "Linux",
        "icon": "terminal-square",
        "level": 78
      },
      {
        "name": "Tools & Workflow",
        "icon": "wrench",
        "level": 85
      },
      {
        "name": "Soft Skills",
        "icon": "users",
        "level": 88
      }
    ]
  },
  "education": {
    "heading": "Pendidikan",
    "items": [
      {
        "period": "2022 — Sekarang",
        "title": "S1 Teknik Informatika",
        "place": "Universitas Anda",
        "desc": "Fokus pada rekayasa perangkat lunak dan kecerdasan buatan."
      },
      {
        "period": "2019 — 2022",
        "title": "SMA / SMK",
        "place": "Sekolah Anda",
        "desc": "Jurusan yang relevan dengan minat teknologi."
      }
    ]
  },
  "experience": {
    "heading": "Pengalaman & Proyek",
    "items": [
      {
        "title": "Nama Proyek 1",
        "thumbnail": "projects/project1.jpg",
        "description": "Deskripsi singkat mengenai proyek, masalah yang diselesaikan, dan dampaknya.",
        "tech": [
          "HTML",
          "CSS",
          "JavaScript"
        ],
        "status": "Selesai",
        "demo": "#",
        "github": "#"
      },
      {
        "title": "Nama Proyek 2",
        "thumbnail": "projects/project2.jpg",
        "description": "Deskripsi singkat mengenai proyek kedua yang menunjukkan keahlian lain.",
        "tech": [
          "Python",
          "Machine Learning"
        ],
        "status": "Dalam Pengembangan",
        "demo": "#",
        "github": "#"
      },
      {
        "title": "Nama Proyek 3",
        "thumbnail": "projects/project3.jpg",
        "description": "Deskripsi singkat proyek ketiga, bisa berupa desain UI/UX atau riset data.",
        "tech": [
          "Figma",
          "UI/UX"
        ],
        "status": "Selesai",
        "demo": "#",
        "github": "#"
      }
    ]
  },
  "certificate": {
    "heading": "Sertifikat",
    "items": [
      {
        "title": "Sertifikat 1",
        "issuer": "Penyelenggara",
        "image": "certificates/cert1.jpg"
      },
      {
        "title": "Sertifikat 2",
        "issuer": "Penyelenggara",
        "image": "certificates/cert2.jpg"
      },
      {
        "title": "Sertifikat 3",
        "issuer": "Penyelenggara",
        "image": "certificates/cert3.jpg"
      }
    ]
  },
  "gallery": {
    "heading": "Galeri",
    "items": [
      {
        "image": "gallery/img1.jpg",
        "caption": "Momen 1"
      },
      {
        "image": "gallery/img2.jpg",
        "caption": "Momen 2"
      },
      {
        "image": "gallery/img3.jpg",
        "caption": "Momen 3"
      },
      {
        "image": "gallery/img4.jpg",
        "caption": "Momen 4"
      },
      {
        "image": "gallery/img5.jpg",
        "caption": "Momen 5"
      }
    ]
  },
  "contact": {
    "heading": "Hubungi Saya",
    "description": "Terbuka untuk kolaborasi, diskusi proyek, maupun sekadar menyapa.",
    "email": "nama@email.com",
    "whatsapp": "6281200000000",
    "mapEmbed": "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d126868.7!2d112.68!3d-7.44!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2sSidoarjo!5e0!3m2!1sid!2sid",
    "social": {
      "github": "https://github.com/",
      "linkedin": "https://linkedin.com/",
      "instagram": "https://instagram.com/"
    }
  },
  "footer": {
    "text": "Dibangun dengan sepenuh hati menggunakan HTML, CSS & JavaScript."
  },
  "stats": {
    "visitors": 1284,
    "projects": 12,
    "experienceYears": 3,
    "cupsOfCoffee": 999
  },
  "admin": {
    "username": "admin",
    "password": "admin123"
  }
};
