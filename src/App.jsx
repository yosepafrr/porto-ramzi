import { MotionConfig } from 'framer-motion'
import Navbar from './components/Navbar.jsx'
import Hero from './components/Hero.jsx'
import About from './components/About.jsx'
import Education from './components/Education.jsx'
import WorkExperience from './components/WorkExperience.jsx'
import SocialExperience from './components/SocialExperience.jsx'
import OrganizationExperience from './components/OrganizationExperience.jsx'
import Skills from './components/Skills.jsx'
import PersonalSkills from './components/PersonalSkills.jsx'
import SoftwareSkills from './components/SoftwareSkills.jsx'
import Projects from './components/Projects.jsx'
import Certificates from './components/Certificates.jsx'
import Gallery from './components/Gallery.jsx'
import MusicPlayer from './components/MusicPlayer.jsx'
import Contact from './components/Contact.jsx'
import Footer from './components/Footer.jsx'
import PageIntro from './components/PageIntro.jsx'
import ScrollTools from './components/ScrollTools.jsx'
import useAnchorFocus from './hooks/useAnchorFocus.js'
import { portfolioData } from './data/portfolioData.js'

export default function App() {
  const data = portfolioData
  const { sections, ui } = data
  useAnchorFocus()
  return (
    <MotionConfig reducedMotion="user">
      <PageIntro />
      <a className="skip-link" href="#main-content">Lewati navigasi</a>
      <Navbar name={portfolioData.hero.name} navigation={portfolioData.navigation} email={portfolioData.contact.email} />
      <main id="main-content" tabIndex={-1}>
        <Hero hero={portfolioData.hero} contact={portfolioData.contact} />
        <About about={data.about} hero={data.hero} contact={data.contact} education={data.education} heading={sections.about} ui={ui} />
        <Education items={data.education} heading={sections.education} ui={ui} />
        <div id="experience">
          <WorkExperience items={data.workExperience} heading={sections.work} ui={ui} />
          <SocialExperience items={data.socialExperience} heading={sections.social} ui={ui} />
          <OrganizationExperience items={data.organizationExperience} heading={sections.organization} ui={ui} />
        </div>
        <Skills hardSkills={data.hardSkills} coreSkills={data.coreSkills} heading={sections.skills} ui={ui} />
        <PersonalSkills items={data.personalSkills} heading={sections.personal} ui={ui} />
        <SoftwareSkills items={data.softwareSkills} heading={sections.software} ui={ui} />
        <Projects items={data.projects} heading={sections.projects} ui={ui} />
        <Certificates items={data.certificates} heading={sections.certificates} ui={ui} />
        <Gallery items={data.gallery} heading={sections.gallery} ui={ui} />
        <MusicPlayer items={data.music} heading={sections.music} settings={data.musicPlayer} />
        <Contact contact={data.contact} heading={sections.contact} ui={ui} />
        <ScrollTools label={ui.backToTop} />
      </main>
      <Footer name={data.hero.name} footer={data.footer} contact={data.contact} ui={ui} />
    </MotionConfig>
  )
}
