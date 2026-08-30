import { BoltIcon } from "@solar-icons/react/bold/bolt";
import { CloudCheckIcon } from "@solar-icons/react/bold/cloud-check";
import { UsersGroupRoundedIcon } from "@solar-icons/react/bold/users-group-rounded";

const features = [
  {
    icon: UsersGroupRoundedIcon,
    title: "Real-time collaboration.",
    description:
      "See your team's cursors and edits appear live, powered by CRDTs that never conflict.",
  },
  {
    icon: CloudCheckIcon,
    title: "Everything synced.",
    description:
      "Your workspace lives in the cloud, so every page is current on every device you open it on.",
  },
  {
    icon: BoltIcon,
    title: "Structure that scales.",
    description:
      "Nest pages inside pages, and keep long documents organised without losing your place.",
  },
];

export function FeatureGrid() {
  return (
    <div className="mx-auto grid w-full max-w-5xl grid-cols-1 justify-center gap-x-8 gap-y-12 px-5 sm:grid-cols-2 md:grid-cols-3 md:justify-start">
      {features.map(({ icon: Icon, title, description }) => (
        <div
          key={title}
          className="flex max-w-xs flex-col items-center justify-start gap-3 md:max-w-none"
        >
          <div className="flex h-9 w-10 items-center justify-center rounded-full bg-accent-4/15">
            <Icon className="text-accent-4" size={20} />
          </div>
          <h3 className="text-center text-lg font-medium text-fg-4">
            {title} <span className="text-fg-3">{description}</span>
          </h3>
        </div>
      ))}
    </div>
  );
}
