import type { DesignId } from "@/lib/designs";
import type { Lane } from "@/lib/site";

export function laneHref(design: DesignId, lane: Lane) {
  return lane.external ? lane.href : `/designs/archive/${design}/${lane.href}`;
}

export function laneLinkProps(lane: Lane) {
  return lane.external
    ? { target: "_blank", rel: "noopener noreferrer" }
    : {};
}
