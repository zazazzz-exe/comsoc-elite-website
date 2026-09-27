export type BaseEvent = {
  id: string;
  date: string;
  title: string;
  location?: string;
  time?: string;
  budget?: number;
};

export type UpcomingEvent = BaseEvent & {
  type: 'upcoming';
  description: string;
  coverImage?: string;
};

export type GalleryEvent = BaseEvent & {
  type: 'gallery';
  subtitle: string;
  coverImage: string;
  images: string[];
};

export type ModalEvent = UpcomingEvent | GalleryEvent;

export const upcomingEvents: UpcomingEvent[] = [
  {
    id: "brigada-eskwela",
    date: "JUL 27",
    title: "Call for Volunteers",
    location: "CCS 6th Floor",
    time: "8:00 AM - 12:00 NN",
    budget: 3400,
    description: "Got an extra hour? We've got a mission for you!\n\nThis Brigada Eskwela 2026, let's go beyond the screen and give back to our CCS community. Join us as we clean, organize, and prepare the College of Computer Studies for the upcoming academic year. Every helping hand counts, and even the smallest effort can make a big difference.\n\nNo experience? No problem! Just bring your energy, willingness to help, and a heart to serve. Whether you can stay for an hour or the entire activity, we'd be happy to have you with us.\n\nPlease bring your own cleaning materials (such as a broom, dustpan, rug, or any cleaning supplies you can share) to help make our clean-up more effective.\n\nLet's work together to create a clean, welcoming, and inspiring space for everyone. See you at Brigada Eskwela!",
    coverImage: "/events/brigada/brigada.jpg",
    type: 'upcoming'
  },
  {
    id: "locker-clearance",
    date: "JUL 27-30",
    title: "Locker Clearance",
    location: "CCS Campus Lockers",
    time: "All Day",
    budget: 2100,
    description: "Attention, CCS Nation!\n\nIf you occupied a locker during the previous academic year, please remember to clear out all your belongings from July 27–30, 2026 (Monday–Thursday).\n\nLet's keep our lockers ready for the new academic year. Thank you for your cooperation!",
    coverImage: "/events/locker-clearance/locker-clearance.jpg",
    type: 'upcoming'
  },
  {
    id: "freshmen-walk",
    date: "AUG 3-4",
    title: "Freshmen Walk",
    location: "PLP Auditorium / Façade",
    time: "8:00 AM",
    budget: 12500,
    description: "CCS NATION, ATTENTION!\n\nOfficially welcome the newest members of the CCS community as they take their first steps into college life through the Freshmen Walk, and celebrate the start of Academic Year 2026-2027!\n\nDAY 1 (August 3, 2026)\n- Time: 8:00 AM - 12:00 NN\n- Venue: PLP Auditorium, 8th Floor\n\nDAY 2 (August 4, 2026)\n- Time: 8:00 AM\n- Assembly Area: PLP Façade",
    coverImage: "/events/freshmen-walk/freshmen-walk.jpg",
    type: 'upcoming'
  }
];

export const galleryEvents: GalleryEvent[] = [
  {
    id: "maxwell",
    date: "July 20, 2026",
    title: "Maxwell",
    budget: 8200,
    subtitle: "Participants gathered at the Maxwell Pasig Next Gen Leadership Camp for inspiring sessions on purpose-driven and servant leadership.",
    coverImage: "/events/maxwell/maxwell-pasig-01.jpg",
    images: Array.from({ length: 10 }).map((_, i) => `/events/maxwell/maxwell-pasig-${String(i + 1).padStart(2, '0')}.jpg`),
    type: 'gallery'
  },
  {
    id: "oath-taking",
    date: "July 08, 2026",
    title: "Oath Taking",
    budget: 6500,
    subtitle: "The official induction ceremony for the newly elected officers and student leaders.",
    coverImage: "/events/oath-taking/oath-taking-01.jpg",
    images: ["01", "02", "04", "05"].map(n => `/events/oath-taking/oath-taking-${n}.jpg`),
    type: 'gallery'
  },
  {
    id: "ccs-sso",
    date: "July 15, 2026",
    title: "CCS SSO",
    budget: 1800,
    subtitle: "Computer Society deliberation at the Student Success Office with newly appointed appointees.",
    coverImage: "/events/ccs-sso/ccs-sso.jpg",
    images: ["/events/ccs-sso/ccs-sso.jpg"],
    type: 'gallery'
  }
];
