import MixConfigObserver from "./MixConfigObserver";
import HelpObserver from "./HelpObserver";
import PingObserver from "./PingObserver";
import EndMixObserver from "./EndMixObserver";

export default [
  new HelpObserver(),
  new PingObserver(),
  new MixConfigObserver(),
];
