import type {
  JSXElementConstructor,
  ReactElement,
  ReactFragment,
  ReactPortal,
} from "react";

const SettingsSegment = (props: {
  title: string;
  desc: string;
  children:
    | ReactElement<any, string | JSXElementConstructor<any>>
    | ReactFragment
    | ReactPortal;
}) => (
  <div className="gird mb-8 grid w-full gap-4 lg:grid-cols-[1fr_3fr]">
    <div className="divider col-start-1 lg:col-span-2" />
    <div className="col-start-1 row-start-2">
      <div className="text-xl font-bold ">{props.title}</div>
      <div className="py-1 opacity-90">{props.desc}</div>
    </div>
    <div className="col-start-1 row-start-3 mt-8 lg:col-start-2 lg:row-start-2">
      {props.children}
    </div>
  </div>
);

export default SettingsSegment;
