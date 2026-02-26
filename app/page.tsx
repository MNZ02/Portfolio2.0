import AboutMe from './_components/AboutMe';
import Banner from './_components/Banner';
import Experiences from './_components/Experiences';
import SkillsOrbitV2 from './_components/SkillsOrbitV2';
import ProjectList from './_components/ProjectList';

export default function Home() {
    return (
        <div className="relative z-[1]">
            <Banner />
            <AboutMe />
            <SkillsOrbitV2 />
            <Experiences />
            <ProjectList />
        </div>
    );
}
