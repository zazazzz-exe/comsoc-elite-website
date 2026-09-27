import HeroSection from "@/components/landing/HeroSection";
import AboutSection from "@/components/landing/AboutSection";
import OfficersSection from "@/components/landing/OfficersSection";
import FacultySection from "@/components/landing/FacultySection";
import EventsSection from "@/components/landing/EventsSection";
import MembershipSection from "@/components/landing/MembershipSection";
import ContactSection from "@/components/landing/ContactSection";
import SideNav from "@/components/landing/SideNav";
import { getPublicContent } from "@/lib/content";

export const revalidate = 60;

export default async function Home() {
  const content = await getPublicContent();
  return (
    <div className="flex flex-col flex-1">
      <SideNav />
       <HeroSection upcomingEvents={content.upcoming} />
      <AboutSection />
       <FacultySection faculty={content.faculty} />
       <OfficersSection comsocTeam={content.comsocTeam} elitesTeam={content.elitesTeam} comsocAdviser={content.comsocAdviser} elitesAdviser={content.elitesAdviser} />
       <EventsSection upcoming={content.upcoming} gallery={content.gallery} />
      <MembershipSection />
      <ContactSection />
    </div>
  );
}
