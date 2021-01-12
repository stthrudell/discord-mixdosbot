import MixConfigObserver from "./MixConfigObserver";
import HelpObserver from "./HelpObserver";
import PingObserver from "./PingObserver";

export default [
  new HelpObserver(),
  new PingObserver(),
  new MixConfigObserver(),
];
