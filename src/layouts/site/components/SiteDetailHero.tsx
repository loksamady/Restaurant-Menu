import BgImage from "@src/assets/image/hero.jpg";
const SiteDetailHero = () => {
  return (
    <div
      id="hero"
      className="items-center flex h-[15vh] bg-cover bg-blend-overlay bg-black/65 overflow-hidden"
      style={{
        backgroundImage: `url(${BgImage})`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="max-w-screen-lg mx-auto grid grid-cols-1 md:grid-cols-2 justify-center w-full items-center px-4 md:pt-0">
        <p className="text-lg font-light text-white">
          DevSphere will become a Digital Innovator that creates new values of
          finance.
        </p>
      </div>
    </div>
  );
};

export default SiteDetailHero;
