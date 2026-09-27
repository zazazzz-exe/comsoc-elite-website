export type Officer = {
  role: string;
  name: string;
  image?: string;
  email?: string;
  facebook?: string;
};

export type Team = {
  name: string;
  tiers: Officer[][];
};

export type Adviser = {
  role: string;
  name: string;
  department: string;
  image?: string;
  email?: string;
  facebook?: string;
};

export const comsocOfficers: Team = {
  name: "COMSOC Officers",
  tiers: [
    [
      {
        role: "President",
        name: "Andrew Canales",
        image: "/images/officers/2. PRESIDENT.png",
        email: "canales_andrew@plpasig.edu.ph",
        facebook: "https://www.facebook.com/canalesandrewg",
      },
    ],
    [
      {
        role: "Vice President for Internal Affairs",
        name: "Kenzhi Louie Palomino",
        image: "/images/officers/3. VP - INTERNAL.png",
        email: "palomino_kenzhilouie@plpasig.edu.ph",
        facebook: "https://www.facebook.com/guffinmrilll#",
      },
      {
        role: "Vice President for External Affairs",
        name: "Zarra Hexekiel Valles",
        image: "/images/officers/4. VP - EXTERNAL.png",
        email: "valles_zarrahexekiel@plpasig.edu.ph",
        facebook: "https://www.facebook.com/share/14pXvfiSecT/",
      },
    ],
    [
      {
        role: "Secretary",
        name: "Gwynzurin Z. Martinez",
        image: "/images/officers/5. SECRETARY.png",
        email: "martinez_gwynzurinz@plpasig.edu.ph",
        facebook: "https://www.facebook.com/share/19WmYzPQg4/",
      },
      {
        role: "Treasurer",
        name: "Shellsea Silvano",
        image: "/images/officers/6. TREASURER.png",
        email: "silvano_shellsea@plpasig.edu.ph",
        facebook: "https://www.facebook.com/shellsea.silvano#",
      },
      {
        role: "Auditor",
        name: "Shanthel Borce",
        image: "/images/officers/7. AUDITOR.png",
        email: "borce_shanthel@plpasig.edu.ph",
        facebook: "https://www.facebook.com/shanthel.yabaoborce#",
      },
      {
        role: "Public Relations Officer",
        name: "Marvin Lopez",
        image: "/images/officers/8. PUBLIC RELATIONS OFFICER.png",
        email: "lopez_marvin@plpasig.edu.ph",
        facebook: "https://www.facebook.com/marvin.lopez.731634",
      },
      {
        role: "PSSC CCS Ambassador",
        name: "Justine Bryle Rollamas",
        image: "/images/officers/9. PSSC CCS Ambassador.png",
        email: "rollamas_justinebryle@plpasig.edu.ph",
        facebook: "https://www.facebook.com/jb.vasquezrollamas#",
      },
    ],
  ],
};

export const ccsElites: Team = {
  name: "CCS ELITES",
  tiers: [
    [{ role: "President", name: "———", image: "/images/officers/placeholder3.JPG"}],
    [
      { role: "VP Internal", name: "———", image: "/images/officers/placeholder3.JPG"},
      { role: "VP External", name: "———", image: "/images/officers/placeholder3.JPG" },
    ],
    [
      { role: "Secretary", name: "———", image: "/images/officers/placeholder3.JPG" },
      { role: "Treasurer", name: "———", image: "/images/officers/placeholder3.JPG" },
      { role: "Auditor", name: "———", image: "/images/officers/placeholder3.JPG" },
      { role: "PRO", name: "———", image: "/images/officers/placeholder3.JPG" },
      { role: "PSSC CCS Ambassador", name: "———", image: "/images/officers/placeholder3.JPG" },
    ],
  ],
};

export const facultyAdviser: Adviser = {
  role: "Faculty Adviser",
  name: "Racquel Cortez",
  department: "College of Computer Studies",
  image: "/images/faculty/CORTEZ, RACQUEL_4742.JPG",
  email: "cortez_racquel@plpasig.edu.ph",
  facebook: "https://www.facebook.com/racquel.a.cortez#",
};

export const ccsElitesAdviser: Adviser = {
  role: "Faculty Adviser",
  name: "Rebecca Fajardo",
  department: "CCS ELITES",
  image: "/images/faculty/FAJARDO, REBECCA_4759.JPG",
  email: "fajardo_rebecca@plpasig.edu.ph",
};

export const orgContact = {
  label: "Official Page",
  url: "https://www.facebook.com/PLPCOMSOC",
  handle: "@college_of_computer_studies",
};
