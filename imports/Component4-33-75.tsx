import imgScreenshot20250722At1833072 from "figma:asset/bce7075b15da3c8d6804c53ef0167853f2767007.png";

function SearchBarPlaceholder() {
  return (
    <div
      className="basis-0 grow h-[23.926px] min-h-px min-w-px relative shrink-0"
      data-name="Search bar placeholder"
    >
      <div className="absolute flex flex-col font-['Suisse_Int\'l:Regular',_sans-serif] inset-0 justify-center leading-[0] not-italic text-[0px] text-[rgba(45,45,45,0.5)] text-left tracking-[-0.24px]">
        <p className="leading-[0.96] text-[12px]">
          <span className="text-[rgba(66,66,66,0.6)]">Quero ler sobre</span>
          <span className="adjustLetterSpacing text-[rgba(255,255,255,0.6)]">
            {" "}
          </span>
        </p>
      </div>
    </div>
  );
}

function Container() {
  return (
    <div
      className="bg-[rgba(0,0,0,0.3)] h-[57px] mb-[-50px] order-2 relative rounded-[18.375px] shrink-0 w-full"
      data-name="Container"
    >
      <div className="flex flex-row items-center relative size-full">
        <div className="box-border content-stretch flex flex-row h-[57px] items-center justify-between px-[18.696px] py-[9.348px] relative w-full">
          <SearchBarPlaceholder />
          <div
            className="[background-size:2203.7%_622.22%] bg-[86.62%_36.88%] bg-no-repeat rounded-[75.797px] shrink-0 size-[20.672px]"
            data-name="Screenshot 2025-07-22 at 18.33.07 2"
            style={{
              backgroundImage: `url('${imgScreenshot20250722At1833072}')`,
            }}
          />
        </div>
      </div>
    </div>
  );
}

function MenuContainer() {
  return (
    <div
      className="bg-[rgba(0,0,0,0.2)] h-[49px] opacity-0 relative rounded-[21.504px] shrink-0 w-[419px]"
      data-name="Menu container"
    >
      <div className="relative size-full">
        <div className="box-border content-stretch flex flex-row gap-[9.945px] h-[49px] items-start justify-start pb-[10.94px] pt-16 px-[18px] relative w-[419px]">
          <div className="flex flex-col font-['Suisse_Int\'l:Regular',_sans-serif] justify-center leading-[1.47] not-italic opacity-0 relative shrink-0 text-[0px] text-[12px] text-[rgba(45,45,45,0.5)] text-left tracking-[-0.24px] w-[178px]">
            <p className="adjustLetterSpacing block font-['Suisse_Int\'l:Medium',_sans-serif] mb-0 text-[rgba(48,48,48,0.5)]">
              Instituto Kunumi
            </p>
            <p className="adjustLetterSpacing block mb-0 text-[rgba(249,249,249,0.8)]">
              Sobre
            </p>
            <p className="adjustLetterSpacing block mb-0 text-[rgba(249,249,249,0.8)]">
              Cases
            </p>
            <p className="adjustLetterSpacing block mb-0 text-[rgba(249,249,249,0.8)]">
              Labs
            </p>
            <p className="adjustLetterSpacing block text-[rgba(249,249,249,0.8)]">
              Careers
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Frame() {
  return (
    <div className="h-[13px] relative shrink-0 w-[78px]" data-name="Frame">
      <svg
        className="block size-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 78 13"
      >
        <g id="Frame">
          <rect
            fill="var(--fill-0, black)"
            fillOpacity="0.2"
            height="13"
            rx="6.5"
            width="78"
          />
          <path
            d="M36 5L39 8L42 5"
            id="Vector"
            stroke="var(--stroke-0, #616161)"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </g>
      </svg>
    </div>
  );
}

function Frame2147227290() {
  return (
    <div className="box-border content-stretch flex flex-col gap-[3px] items-center justify-start mb-[-50px] order-1 p-0 relative shrink-0 w-full">
      <MenuContainer />
      <Frame />
    </div>
  );
}

export default function Component4() {
  return (
    <div
      className="box-border content-stretch flex flex-col-reverse items-start justify-start pb-[50px] pt-0 px-0 relative size-full"
      data-name="Component 4"
    >
      <Container />
      <Frame2147227290 />
    </div>
  );
}