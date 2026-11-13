import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  CircleAlert,
  Database,
  Layers3,
  ShieldCheck,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Methods & Provenance | Ember Grid",
  description:
    "Data sources, proposed harmonization workflow, anomaly methodology, validation, limitations, and references for Ember Grid.",
};

const sources = [
  {
    name: "NASA FIRMS",
    label: "DATA ACCESS",
    description:
      "NASA's Fire Information for Resource Management System distributes global near-real-time satellite active-fire detections and related products. FIRMS is the intended source for this prototype; no FIRMS feed is connected yet.",
    detail: "Global MODIS / VIIRS detections",
    href: "https://www.earthdata.nasa.gov/data/tools/firms",
    link: "FIRMS overview",
  },
  {
    name: "MODIS",
    label: "TERRA · AQUA",
    description:
      "The Moderate Resolution Imaging Spectroradiometer active-fire products provide a longer record at approximately 1 km nominal spatial resolution. FIRMS lists global MODIS active-fire detections from Terra and Aqua.",
    detail: "About 1 km nominal resolution",
    href: "https://www.earthdata.nasa.gov/data/tools/firms/faq",
    link: "FIRMS product details",
  },
  {
    name: "VIIRS",
    label: "SUOMI-NPP · NOAA-20 / NOAA-21",
    description:
      "The Visible Infrared Imaging Radiometer Suite 375 m active-fire product resolves smaller features than MODIS, while retaining its own sensor response, confidence fields, and observation opportunities.",
    detail: "375 m active-fire product",
    href: "https://viirsland.gsfc.nasa.gov/PDF/VIIRS_activefire_User_Guide.pdf",
    link: "NASA VIIRS user guide",
  },
];

const workflow = [
  {
    number: "01",
    title: "Collect",
    description:
      "Retrieve the selected FIRMS MODIS / VIIRS products and record source, product, platform, acquisition time, and retrieval/version metadata.",
  },
  {
    number: "02",
    title: "Quality-check",
    description:
      "Parse and validate fields, standardize time and coordinates, and interpret each product's quality and confidence flags using its own documentation.",
  },
  {
    number: "03",
    title: "Harmonize",
    description:
      "Map observations to a shared analysis grid and explicit time windows without discarding the original sensor, footprint, or confidence information.",
  },
  {
    number: "04",
    title: "Analyze",
    description:
      "Build comparable activity summaries, evaluate departures from a seasonal historical baseline, then publish with provenance and uncertainty notes.",
  },
];

const references = [
  {
    citation:
      "NASA Earthdata. Fire Information for Resource Management System (FIRMS): overview, user guides, and active-fire publications.",
    href: "https://www.earthdata.nasa.gov/data/tools/firms",
  },
  {
    citation:
      "NASA Earthdata. FIRMS FAQ: active-fire product resolutions, latency, and caveats.",
    href: "https://www.earthdata.nasa.gov/data/tools/firms/faq",
  },
  {
    citation:
      "NASA. Visible Infrared Imaging Radiometer Suite (VIIRS) 375 m Active Fire Algorithm User Guide (2018).",
    href: "https://viirsland.gsfc.nasa.gov/PDF/VIIRS_activefire_User_Guide.pdf",
  },
  {
    citation:
      "NASA. MODIS Collection 6 Active Fire Product User's Guide, Revision B (2018).",
    href: "https://www.earthdata.nasa.gov/sites/default/files/imported/MODIS_C6_Fire_User_Guide_B.pdf",
  },
  {
    citation:
      "Giglio, L., Schroeder, W., & Justice, C. O. (2016). The collection 6 MODIS active fire detection algorithm and fire products. Remote Sensing of Environment, 178, 31–41.",
    href: "https://doi.org/10.1016/j.rse.2016.02.054",
  },
  {
    citation:
      "Schroeder, W., Oliva, P., Giglio, L., & Csiszar, I. A. (2014). The New VIIRS 375 m active fire detection data product: algorithm description and initial assessment. Remote Sensing of Environment, 143, 85–96.",
    href: "https://doi.org/10.1016/j.rse.2013.12.008",
  },
];

const contributors = [
  { name: "A M Saadnan Tahsin", role: "Team Leader" },
  { name: "Shakhawat Hossain", role: "Web Developer" },
  { name: "Mst Rajia Akter Mitu", role: "Researcher" },
  { name: "S M Sajjad Hossain Shimanoto", role: "Data Analyst" },
  { name: "Habibur Rahman", role: "Video Editor" },
  { name: "Mohine Rana", role: "Science Strategist" },
];

function WorkflowDiagram() {
  return (
    <div className="overflow-x-auto rounded-md border border-[#e7e5dc] bg-white p-4 sm:p-6">
      <svg
        aria-labelledby="workflow-diagram-title workflow-diagram-description"
        className="min-w-[700px] w-full"
        role="img"
        viewBox="0 0 920 150"
      >
        <title id="workflow-diagram-title">Proposed processing workflow</title>
        <desc id="workflow-diagram-description">
          Four ordered stages: collect source observations, quality-check and
          normalize, harmonize to shared space and time, and analyze activity
          and anomalies.
        </desc>
        <defs>
          <marker
            id="workflow-arrow"
            markerHeight="7"
            markerWidth="7"
            orient="auto"
            refX="5"
            refY="3.5"
          >
            <path d="M0 0 6 3.5 0 7" fill="none" stroke="#a9a69b" />
          </marker>
        </defs>
        {workflow.map((step, index) => {
          const x = 10 + index * 230;
          return (
            <g key={step.number}>
              <rect
                fill={index === 3 ? "#fbf3ee" : "#fafaf7"}
                height="100"
                rx="5"
                stroke={index === 3 ? "#e5c4b1" : "#e7e5dc"}
                width="200"
                x={x}
                y="24"
              />
              <text
                fill="#9b4a28"
                fontFamily="monospace"
                fontSize="11"
                fontWeight="600"
                x={x + 16}
                y="48"
              >
                {step.number}
              </text>
              <text
                fill="#292c27"
                fontFamily="Arial, sans-serif"
                fontSize="16"
                fontWeight="600"
                x={x + 16}
                y="72"
              >
                {step.title}
              </text>
              <text
                fill="#777c74"
                fontFamily="Arial, sans-serif"
                fontSize="10"
                x={x + 16}
                y="94"
              >
                {["FIRMS products", "sensor-specific QA", "shared grid + time", "baseline comparison"][index]}
              </text>
              {index < workflow.length - 1 && (
                <path
                  d={`M${x + 204} 74h18`}
                  fill="none"
                  markerEnd="url(#workflow-arrow)"
                  stroke="#a9a69b"
                  strokeWidth="1.5"
                />
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
}

export default function MethodsPage() {
  return (
    <main className="min-h-screen bg-[#f7f7f3] text-[#252923]">
      <header className="border-b border-[#e7e5dc] bg-white">
        <div className="mx-auto flex h-16 max-w-[1240px] items-center justify-between gap-4 px-4 sm:px-6 lg:px-10">
          <Link
            className="flex items-center gap-2 font-semibold text-[#252923] no-underline"
            href="/"
          >
            <span className="size-2 rounded-full bg-[#bd4c1c]" />
            Ember Grid
          </Link>
          <nav aria-label="Main navigation" className="flex items-center gap-4">
            <span
              aria-current="page"
              className="hidden text-xs font-medium text-[#873716] sm:inline md:text-sm"
            >
              Methods &amp; Provenance
            </span>
            <Link
              className="inline-flex h-9 items-center gap-2 rounded-sm bg-[#a33900] px-3 font-mono text-[10px] font-medium uppercase tracking-[0.08em] text-white no-underline transition-colors hover:bg-[#7f2b00] sm:px-4 sm:text-[11px]"
              href="/dashboard"
            >
              Dashboard <ArrowRight aria-hidden="true" className="size-3.5" />
            </Link>
          </nav>
        </div>
      </header>

      <div className="mx-auto max-w-[1240px] px-4 pb-16 pt-10 sm:px-6 sm:pt-14 lg:px-10">
        <section aria-labelledby="methods-title" className="max-w-3xl">
          <p className="mb-3 flex items-center gap-2 font-mono text-[10px] font-semibold uppercase tracking-[0.12em] text-[#873716]">
            <span className="h-px w-5 bg-[#c9a896]" />
            Documentation · Prototype scope
          </p>
          <h1
            className="text-3xl font-semibold leading-tight tracking-[-0.03em] sm:text-4xl"
            id="methods-title"
          >
            Methods &amp; Provenance
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-[#5a6474] sm:text-base">
            How satellite active-fire observations can be compared responsibly:
            what the source products measure, what harmonization must preserve,
            and where uncertainty remains.
          </p>
        </section>

        {/* <aside
          aria-label="Prototype data status"
          className="mt-8 flex max-w-4xl gap-3 border border-[#ead8cc] bg-[#fbf3ee] p-4 sm:p-5"
        >
          <CircleAlert
            aria-hidden="true"
            className="mt-0.5 size-5 shrink-0 text-[#9b4a28]"
          />
          <p className="m-0 text-xs leading-6 text-[#70452f] sm:text-sm">
            <strong className="font-semibold text-[#873716]">
              Current status:
            </strong>{" "}
            Ember Grid is a static frontend prototype. It does not ingest live
            NASA data, run a processing pipeline, or calculate a validated
            anomaly score. Dashboard records and charts are synthetic
            demonstrations. The workflow below describes a proposed approach,
            not results currently produced by the site.
          </p>
        </aside> */}

        <nav
          aria-label="Methods page sections"
          className="mt-8 flex flex-wrap gap-x-5 gap-y-2 border-b border-[#e7e5dc] pb-5 text-xs text-[#5a6474]"
        >
          {[
            ["sources", "Data sources"],
            ["harmonization", "Harmonization"],
            ["workflow", "Workflow"],
            ["anomaly", "Anomaly detection"],
            ["validation", "Validation & limits"],
            ["references", "References"],
            ["contributors", "Contributors"],
          ].map(([id, label]) => (
            <a
              className="underline decoration-[#d9c6b8] underline-offset-4 hover:text-[#873716]"
              href={`#${id}`}
              key={id}
            >
              {label}
            </a>
          ))}
        </nav>

        <section aria-labelledby="sources-title" className="mt-12" id="sources">
          <SectionHeading
            eyebrow="01 / INPUT DATA"
            id="sources-title"
            title="Data sources"
          >
            NASA FIRMS is the intended access point for global MODIS and VIIRS
            active-fire detections. Sensor products differ in spatial
            resolution, acquisition timing, and confidence fields.
          </SectionHeading>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {sources.map((source) => (
              <article
                className="flex min-h-[240px] flex-col border border-[#e7e5dc] bg-white p-5"
                key={source.name}
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="font-mono text-[9px] font-medium uppercase tracking-[0.08em] text-[#898d84]">
                    {source.label}
                  </span>
                  <Database
                    aria-hidden="true"
                    className="size-4 text-[#a35632]"
                  />
                </div>
                <h3 className="mb-2 mt-4 text-lg font-semibold">{source.name}</h3>
                <p className="m-0 flex-1 text-xs leading-6 text-[#667064]">
                  {source.description}
                </p>
                <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-[#edede7] pt-3">
                  <span className="font-mono text-[9px] text-[#873716]">
                    {source.detail}
                  </span>
                  <a
                    className="inline-flex items-center gap-1 text-[10px] font-medium text-[#873716] underline underline-offset-4"
                    href={source.href}
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    {source.link}
                    <ArrowUpRight aria-hidden="true" className="size-3" />
                  </a>
                </div>
              </article>
            ))}
          </div>
          <div className="mt-4 flex gap-3 border border-[#e7e5dc] bg-white p-4 text-xs leading-6 text-[#5a6474]">
            <ShieldCheck
              aria-hidden="true"
              className="mt-0.5 size-4 shrink-0 text-[#526b4c]"
            />
            <p className="m-0">
              An active-fire detection is a satellite pixel flagged by a thermal
              detection algorithm—not a mapped fire perimeter or a confirmed
              ground report. FIRMS product coverage and latency depend on the
              product and region; consult its current product metadata before
              operational use.
            </p>
          </div>
        </section>

        <section
          aria-labelledby="harmonization-title"
          className="mt-14"
          id="harmonization"
        >
          <SectionHeading
            eyebrow="02 / COMPARABILITY"
            id="harmonization-title"
            title="Harmonization methodology"
          >
            MODIS and VIIRS do not observe fire at the same spatial or temporal
            scale. A shared reporting grid makes summaries easier to compare;
            it does not make the underlying sensors identical.
          </SectionHeading>
          <div className="mt-6 grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
            <article className="border border-[#e7e5dc] bg-white p-5 sm:p-6">
              <span className="font-mono text-[9px] uppercase tracking-[0.08em] text-[#898d84]">
                Native pixel scale · schematic
              </span>
              <h3 className="mb-1 mt-2 text-base font-semibold">
                Keep native observations visible
              </h3>
              <p className="mb-4 mt-0 text-xs leading-5 text-[#74796f]">
                Nominal product resolutions near nadir; footprints vary across
                the scan and are not uniform squares on the ground.
              </p>
              <svg
                aria-labelledby="scale-title scale-description"
                className="h-auto w-full"
                role="img"
                viewBox="0 0 520 180"
              >
                <title id="scale-title">
                  Schematic comparison of MODIS and VIIRS nominal pixel sizes
                </title>
                <desc id="scale-description">
                  A MODIS nominal one-kilometer pixel is shown beside a
                  VIIRS 375-meter pixel. Their sizes are illustrative.
                </desc>
                <rect
                  fill="#f3e5da"
                  height="112"
                  rx="2"
                  stroke="#a35632"
                  strokeWidth="2"
                  width="112"
                  x="38"
                  y="26"
                />
                <rect
                  fill="#efc7b2"
                  height="42"
                  rx="1"
                  stroke="#a33900"
                  strokeWidth="2"
                  width="42"
                  x="236"
                  y="61"
                />
                <path
                  d="M150 82h54m-6-6 6 6-6 6"
                  fill="none"
                  stroke="#a9a69b"
                  strokeWidth="1.5"
                />
                <text
                  fill="#873716"
                  fontFamily="monospace"
                  fontSize="11"
                  fontWeight="600"
                  x="174"
                  y="68"
                  textAnchor="middle"
                >
                  shared grid
                </text>
                <text
                  fill="#292c27"
                  fontFamily="Arial, sans-serif"
                  fontSize="14"
                  fontWeight="600"
                  x="94"
                  y="157"
                  textAnchor="middle"
                >
                  MODIS · ~1 km
                </text>
                <text
                  fill="#292c27"
                  fontFamily="Arial, sans-serif"
                  fontSize="14"
                  fontWeight="600"
                  x="257"
                  y="157"
                  textAnchor="middle"
                >
                  VIIRS · 375 m
                </text>
                <text
                  fill="#777c74"
                  fontFamily="Arial, sans-serif"
                  fontSize="10"
                  x="385"
                  y="62"
                >
                  Aggregate for
                </text>
                <text
                  fill="#777c74"
                  fontFamily="Arial, sans-serif"
                  fontSize="10"
                  x="385"
                  y="78"
                >
                  comparison,
                </text>
                <text
                  fill="#777c74"
                  fontFamily="Arial, sans-serif"
                  fontSize="10"
                  x="385"
                  y="94"
                >
                  retain source
                </text>
                <text
                  fill="#777c74"
                  fontFamily="Arial, sans-serif"
                  fontSize="10"
                  x="385"
                  y="110"
                >
                  detail.
                </text>
              </svg>
            </article>
            <article className="border border-[#e7e5dc] bg-white p-5 sm:p-6">
              <h3 className="mt-0 text-base font-semibold">
                Comparability rules
              </h3>
              <ul className="m-0 grid gap-3 pl-5 text-xs leading-6 text-[#667064] marker:text-[#a35632]">
                <li>
                  Choose a documented common analysis grid and time window;
                  reproject consistently and summarize at the chosen scale.
                </li>
                <li>
                  Keep acquisition time, platform, native sensor, product
                  version, and confidence alongside every observation.
                </li>
                <li>
                  Apply sensor/product-specific quality interpretation. Do not
                  treat MODIS and VIIRS confidence labels as interchangeable.
                </li>
                <li>
                  Account for observation opportunity and overpass timing.
                  Fewer detections can reflect coverage or clouds, not just
                  less fire activity.
                </li>
                <li>
                  Do not add raw sensor pixel counts as if each pixel
                  represented equal area or equal sampling.
                </li>
              </ul>
              <p className="mb-0 mt-4 border-t border-[#edede7] pt-3 text-[10px] leading-5 text-[#873716]">
                This is a proposed design. The current prototype does not
                reproject, resample, or harmonize satellite measurements.
              </p>
            </article>
          </div>
        </section>

        <section aria-labelledby="workflow-title" className="mt-14" id="workflow">
          <SectionHeading
            eyebrow="03 / PROPOSED PIPELINE"
            id="workflow-title"
            title="Processing workflow"
          >
            From source retrieval to a traceable summary, each stage should
            retain enough metadata to reproduce and audit the result.
          </SectionHeading>
          <div className="mt-6">
            <WorkflowDiagram />
          </div>
          <ol className="mt-4 grid list-none gap-3 p-0 sm:grid-cols-2 lg:grid-cols-4">
            {workflow.map((step) => (
              <li
                className="border-l-2 border-[#d7a68d] bg-white px-4 py-3"
                key={step.number}
              >
                <span className="font-mono text-[9px] font-semibold text-[#873716]">
                  {step.number}
                </span>
                <h3 className="mb-1 mt-1 text-sm font-semibold">{step.title}</h3>
                <p className="m-0 text-[11px] leading-5 text-[#74796f]">
                  {step.description}
                </p>
              </li>
            ))}
          </ol>
        </section>

        <section aria-labelledby="anomaly-title" className="mt-14" id="anomaly">
          <SectionHeading
            eyebrow="04 / CONTEXTUAL SIGNAL"
            id="anomaly-title"
            title="Anomaly detection"
          >
            “Unusual” should mean unusual for the place, season, sensor, and
            observation conditions—not merely a large number on a map.
          </SectionHeading>
          <div className="mt-6 grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
            <article className="border border-[#e7e5dc] bg-white p-5 sm:p-6">
              <div className="flex items-start gap-3">
                <div className="grid size-9 shrink-0 place-items-center rounded-full bg-[#f5e3d9] text-[#873716]">
                  <Layers3 aria-hidden="true" className="size-4" />
                </div>
                <div>
                  <h3 className="mb-2 mt-0 text-base font-semibold">
                    Establish a fair historical baseline
                  </h3>
                  <p className="m-0 text-xs leading-6 text-[#667064]">
                    For a production analysis, compare like with like: a
                    location and season against multiple historical years,
                    using a consistent activity measure and accounting for
                    sensor era, valid observations, and overpass opportunity.
                    Baseline length, spatial support, and minimum data
                    requirements must be specified before scoring.
                  </p>
                </div>
              </div>
            </article>
            <article className="border border-[#e7e5dc] bg-white p-5 sm:p-6">
              <div className="flex items-start gap-3">
                <div className="grid size-9 shrink-0 place-items-center rounded-full bg-[#f5e3d9] text-[#873716]">
                  <ArrowDown
                    aria-hidden="true"
                    className="size-4 rotate-[-45deg]"
                  />
                </div>
                <div>
                  <h3 className="mb-2 mt-0 text-base font-semibold">
                    Flag departures, then validate
                  </h3>
                  <p className="m-0 text-xs leading-6 text-[#667064]">
                    A candidate system could report departures from that
                    baseline with an interpretable score and uncertainty, then
                    set alert thresholds through independent validation.
                    Percentiles or standardized departures are possible
                    choices—not selected or calibrated methods in this
                    prototype.
                  </p>
                </div>
              </div>
            </article>
          </div>
          <p className="mb-0 mt-3 text-[10px] leading-5 text-[#873716]">
            No baseline, anomaly score, or alert threshold is currently
            calculated by Ember Grid.
          </p>
        </section>

        <section
          aria-labelledby="validation-title"
          className="mt-14"
          id="validation"
        >
          <SectionHeading
            eyebrow="05 / INTERPRETATION"
            id="validation-title"
            title="Validation & limitations"
          >
            Satellite detections are useful evidence, not a complete census of
            fire. The algorithm papers and NASA product guides describe
            product-specific performance and caveats.
          </SectionHeading>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <article className="border border-[#e7e5dc] bg-white p-5">
              <h3 className="mb-3 mt-0 flex items-center gap-2 text-sm font-semibold">
                <ShieldCheck
                  aria-hidden="true"
                  className="size-4 text-[#526b4c]"
                />
                What quality means
              </h3>
              <ul className="m-0 grid gap-2 pl-5 text-xs leading-6 text-[#667064] marker:text-[#a35632]">
                <li>
                  Detection confidence and quality fields are defined by
                  product algorithms; they are not a shared cross-sensor
                  probability scale.
                </li>
                <li>
                  Accuracy should be evaluated against independent reference
                  observations, with omission and commission errors considered
                  separately and by conditions.
                </li>
                <li>
                  Ember Grid has no independent validation set or measured
                  accuracy statistic at this prototype stage.
                </li>
              </ul>
            </article>
            <article className="border border-[#e7e5dc] bg-white p-5">
              <h3 className="mb-3 mt-0 flex items-center gap-2 text-sm font-semibold">
                <CircleAlert
                  aria-hidden="true"
                  className="size-4 text-[#a35632]"
                />
                Known limitations
              </h3>
              <ul className="m-0 grid gap-2 pl-5 text-xs leading-6 text-[#667064] marker:text-[#a35632]">
                <li>
                  Clouds, smoke, canopy, fire size and temperature, viewing
                  geometry, and satellite overpass timing can affect detection.
                </li>
                <li>
                  False detections and artifacts can occur; thermal sources
                  such as volcanoes or industrial activity are not necessarily
                  wildfires.
                </li>
                <li>
                  A detection is not a perimeter, and no detection does not
                  establish that no fire is present.
                </li>
              </ul>
            </article>
          </div>
        </section>

        <section
          aria-labelledby="references-title"
          className="mt-14"
          id="references"
        >
          <SectionHeading
            eyebrow="06 / SOURCE MATERIAL"
            id="references-title"
            title="References"
          >
            Product specifications and algorithm research for the statements
            above. NASA FIRMS provides additional product guides and
            publications.
          </SectionHeading>
          <ol className="mt-6 divide-y divide-[#e7e5dc] border-y border-[#e7e5dc] bg-white">
            {references.map((reference, index) => (
              <li
                className="flex items-start gap-4 px-4 py-4 sm:px-5"
                key={reference.href}
              >
                <span className="pt-0.5 font-mono text-[10px] text-[#9b4a28]">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <p className="m-0 flex-1 text-xs leading-6 text-[#555d53]">
                  {reference.citation}
                </p>
                <a
                  aria-label={`Open reference ${index + 1}`}
                  className="mt-1 shrink-0 text-[#873716] hover:text-[#a33900]"
                  href={reference.href}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  <ArrowUpRight aria-hidden="true" className="size-4" />
                </a>
              </li>
            ))}
          </ol>
          <p className="mt-3 text-[10px] leading-5 text-[#74796f]">
            MODIS/VIIRS spatial resolutions and FIRMS availability vary by
            product and processing stream; refer to the current NASA product
            documentation for operational details.
          </p>
        </section>

        <section
          aria-labelledby="contributors-title"
          className="mt-14"
          id="contributors"
        >
          <SectionHeading
            eyebrow="07 / PROJECT TEAM"
            id="contributors-title"
            title="Contributors"
          >
            The people behind this project.
          </SectionHeading>
          <ol className="mt-6 grid gap-x-8 sm:grid-cols-2 lg:grid-cols-3">
            {contributors.map((contributor, index) => (
              <li
                className="flex min-w-0 items-start gap-4 border-t border-[#e7e5dc] py-4"
                key={contributor.name}
              >
                <span className="pt-0.5 font-mono text-[10px] text-[#9b4a28]">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div className="min-w-0">
                  <h3 className="m-0 break-words text-sm font-semibold text-[#292c27]">
                    {contributor.name}
                  </h3>
                  <p className="mb-0 mt-1 text-xs text-[#74796f]">
                    {contributor.role}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <footer className="mt-14 flex flex-wrap items-center justify-between gap-3 border-t border-[#e1dfd7] pt-5 text-[10px] text-[#74796f]">
          <span>Ember Grid · static frontend prototype</span>
          <Link
            className="inline-flex items-center gap-1 font-medium text-[#873716] underline underline-offset-4"
            href="/"
          >
            Back to overview
            <ArrowRight aria-hidden="true" className="size-3" />
          </Link>
        </footer>
      </div>
    </main>
  );
}

function SectionHeading({
  children,
  eyebrow,
  id,
  title,
}: {
  children: React.ReactNode;
  eyebrow: string;
  id: string;
  title: string;
}) {
  return (
    <div className="max-w-3xl">
      <p className="mb-2 font-mono text-[9px] font-semibold uppercase tracking-[0.1em] text-[#9b4a28]">
        {eyebrow}
      </p>
      <h2 className="mb-2 mt-0 text-xl font-semibold tracking-[-0.02em]" id={id}>
        {title}
      </h2>
      <p className="m-0 text-xs leading-6 text-[#74796f] sm:text-sm">
        {children}
      </p>
    </div>
  );
}
