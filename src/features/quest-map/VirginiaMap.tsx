/// <reference types="vite/client" />

import {
  useEffect,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  Check,
  LockKeyhole,
  MapPin,
  RotateCw,
  type LucideIcon,
} from "lucide-react";
import type {
  MapLayers,
  PortalDisplayState,
  QuestPortalView,
} from "./types";
import styles from "./VirginiaMap.module.css";

export type VirginiaMapPortal = Pick<
  QuestPortalView,
  "id" | "title" | "shortTitle" | "displayState" | "portal"
>;

export interface VirginiaMapProps {
  portals: readonly VirginiaMapPortal[];
  selectedId: string | null;
  layers: MapLayers;
  onSelect: (missionId: string) => void;
}

export interface ProjectedVirginiaPoint {
  x: number;
  y: number;
}

const VIEWBOX_WIDTH = 1_000;
const VIEWBOX_HEIGHT = 560;
const MAP_PADDING = { top: 48, right: 40, bottom: 48, left: 40 } as const;
const PUBLIC_BASE_URL = import.meta.env.BASE_URL.endsWith("/")
  ? import.meta.env.BASE_URL
  : `${import.meta.env.BASE_URL}/`;

/**
 * The bounds come from the checked-in Virginia outline. Keeping the frame fixed
 * makes portals, rivers, and the asynchronously loaded boundary line up exactly.
 */
const VIRGINIA_BOUNDS = {
  minLongitude: -83.67539,
  maxLongitude: -75.16643,
  minLatitude: 36.54265,
  maxLatitude: 39.46601,
} as const;

const MID_LATITUDE =
  (VIRGINIA_BOUNDS.minLatitude + VIRGINIA_BOUNDS.maxLatitude) / 2;
const MID_LONGITUDE =
  (VIRGINIA_BOUNDS.minLongitude + VIRGINIA_BOUNDS.maxLongitude) / 2;
const LONGITUDE_CORRECTION = Math.cos((MID_LATITUDE * Math.PI) / 180);
const LONGITUDE_SPAN =
  (VIRGINIA_BOUNDS.maxLongitude - VIRGINIA_BOUNDS.minLongitude) *
  LONGITUDE_CORRECTION;
const LATITUDE_SPAN =
  VIRGINIA_BOUNDS.maxLatitude - VIRGINIA_BOUNDS.minLatitude;
const MAP_SCALE = Math.min(
  (VIEWBOX_WIDTH - MAP_PADDING.left - MAP_PADDING.right) / LONGITUDE_SPAN,
  (VIEWBOX_HEIGHT - MAP_PADDING.top - MAP_PADDING.bottom) / LATITUDE_SPAN,
);
const PROJECTED_WIDTH = LONGITUDE_SPAN * MAP_SCALE;
const PROJECTED_HEIGHT = LATITUDE_SPAN * MAP_SCALE;
const PROJECTED_LEFT = (VIEWBOX_WIDTH - PROJECTED_WIDTH) / 2;
const PROJECTED_TOP = (VIEWBOX_HEIGHT - PROJECTED_HEIGHT) / 2;

type GeoPosition = readonly [longitude: number, latitude: number];
type OutlineStatus = "loading" | "ready" | "fallback";

interface OutlineState {
  path: string;
  status: OutlineStatus;
}

interface PlacedPortal {
  portal: VirginiaMapPortal;
  anchor: ProjectedVirginiaPoint;
  center: ProjectedVirginiaPoint;
}

interface RiverDefinition {
  id: string;
  name: string;
  coordinates: readonly GeoPosition[];
  labelAt: GeoPosition;
  labelRotation: number;
}

interface RegionLabel {
  name: readonly string[];
  at: GeoPosition;
  rotation: number;
}

const FALLBACK_OUTLINE: readonly GeoPosition[] = [
  [-76.92, 36.55],
  [-75.8, 36.55],
  [-75.66, 37.32],
  [-75.17, 38.03],
  [-76.18, 37.95],
  [-76.62, 38.12],
  [-77.02, 38.31],
  [-77.04, 38.85],
  [-77.26, 39.02],
  [-77.73, 39.32],
  [-78.35, 39.47],
  [-78.72, 38.91],
  [-79.31, 38.42],
  [-79.67, 38.59],
  [-80.18, 37.85],
  [-81.23, 37.23],
  [-82.0, 37.47],
  [-82.35, 37.27],
  [-83.68, 36.6],
  [-81.93, 36.59],
  [-80.12, 36.54],
  [-78.2, 36.54],
  [-76.92, 36.55],
] as const;

const REGION_LABELS: readonly RegionLabel[] = [
  {
    name: ["APPALACHIAN", "PLATEAU"],
    at: [-82.72, 36.94],
    rotation: -12,
  },
  { name: ["VALLEY &", "RIDGE"], at: [-81.3, 37.38], rotation: -10 },
  {
    name: ["BLUE RIDGE", "MOUNTAINS"],
    at: [-79.88, 37.44],
    rotation: -9,
  },
  { name: ["PIEDMONT"], at: [-78.36, 37.58], rotation: -7 },
  { name: ["COASTAL", "PLAIN"], at: [-76.76, 37.32], rotation: -6 },
] as const;

const REGION_BOUNDARIES: readonly (readonly GeoPosition[])[] = [
  [
    [-82.05, 36.58],
    [-81.86, 36.96],
    [-81.62, 37.25],
  ],
  [
    [-80.72, 36.56],
    [-80.24, 37.08],
    [-79.76, 37.68],
    [-79.1, 38.35],
    [-78.65, 38.9],
  ],
  [
    [-79.88, 36.56],
    [-79.42, 37.12],
    [-78.9, 37.73],
    [-78.25, 38.43],
    [-77.74, 39.08],
  ],
  [
    [-77.48, 36.56],
    [-77.42, 37.2],
    [-77.36, 37.55],
    [-77.25, 38.04],
    [-77.1, 38.72],
  ],
] as const;

const RIVERS: readonly RiverDefinition[] = [
  {
    id: "potomac",
    name: "Potomac River",
    coordinates: [
      [-78.35, 39.44],
      [-77.74, 39.31],
      [-77.46, 39.08],
      [-77.18, 38.97],
      [-77.04, 38.84],
      [-77.12, 38.68],
      [-76.88, 38.43],
      [-76.58, 38.22],
    ],
    labelAt: [-77.22, 38.82],
    labelRotation: 18,
  },
  {
    id: "rappahannock",
    name: "Rappahannock River",
    coordinates: [
      [-78.35, 38.62],
      [-77.84, 38.48],
      [-77.47, 38.3],
      [-77.04, 38.23],
      [-76.64, 38.04],
      [-76.42, 37.93],
    ],
    labelAt: [-76.86, 38.12],
    labelRotation: 16,
  },
  {
    id: "york",
    name: "York River",
    coordinates: [
      [-78.08, 37.92],
      [-77.54, 37.8],
      [-77.04, 37.63],
      [-76.8, 37.53],
      [-76.55, 37.39],
      [-76.35, 37.25],
    ],
    labelAt: [-76.72, 37.49],
    labelRotation: 18,
  },
  {
    id: "james",
    name: "James River",
    coordinates: [
      [-80.2, 37.89],
      [-79.74, 37.8],
      [-79.15, 37.42],
      [-78.55, 37.36],
      [-77.89, 37.45],
      [-77.44, 37.54],
      [-76.93, 37.34],
      [-76.73, 37.2],
      [-76.37, 36.99],
    ],
    labelAt: [-77.16, 37.17],
    labelRotation: 8,
  },
] as const;

const THEN_NOW_PLACES: readonly {
  name: string;
  then: string;
  at: GeoPosition;
}[] = [
  { name: "Harpers Ferry", then: "1859", at: [-77.74, 39.3] },
  { name: "Richmond", then: "1780", at: [-77.44, 37.54] },
  { name: "Jamestown", then: "1607", at: [-76.78, 37.21] },
] as const;

const PORTAL_STATUS = {
  restored: { label: "restored", Icon: Check },
  in_progress: { label: "in progress", Icon: RotateCw },
  available: { label: "available", Icon: MapPin },
  locked: { label: "locked; preview available", Icon: LockKeyhole },
} as const satisfies Record<
  PortalDisplayState,
  { label: string; Icon: LucideIcon }
>;

const PORTAL_STATE_CLASS: Record<PortalDisplayState, string> = {
  restored: styles.portalRestored,
  in_progress: styles.portalInProgress,
  available: styles.portalAvailable,
  locked: styles.portalLocked,
};

const COLLISION_OFFSETS: readonly (readonly [number, number])[] = [
  [0, 0],
  [0, -88],
  [78, -56],
  [88, 36],
  [0, 92],
  [-88, 38],
  [-78, -56],
  [0, -172],
  [112, -130],
  [164, -44],
  [164, 62],
  [98, 146],
  [0, 176],
  [-98, 146],
  [-164, 62],
  [-164, -44],
  [-112, -130],
] as const;

function clamp(value: number, minimum: number, maximum: number): number {
  return Math.min(Math.max(value, minimum), maximum);
}

/** Project WGS84 longitude/latitude into the component's fixed Virginia frame. */
function projectVirginiaCoordinate(
  longitude: number,
  latitude: number,
): ProjectedVirginiaPoint {
  const safeLongitude = clamp(
    Number.isFinite(longitude) ? longitude : MID_LONGITUDE,
    VIRGINIA_BOUNDS.minLongitude,
    VIRGINIA_BOUNDS.maxLongitude,
  );
  const safeLatitude = clamp(
    Number.isFinite(latitude) ? latitude : MID_LATITUDE,
    VIRGINIA_BOUNDS.minLatitude,
    VIRGINIA_BOUNDS.maxLatitude,
  );

  return {
    x:
      PROJECTED_LEFT +
      (safeLongitude - VIRGINIA_BOUNDS.minLongitude) *
        LONGITUDE_CORRECTION *
        MAP_SCALE,
    y:
      PROJECTED_TOP +
      (VIRGINIA_BOUNDS.maxLatitude - safeLatitude) * MAP_SCALE,
  };
}

function positionPath(coordinates: readonly GeoPosition[], close = false): string {
  const commands = coordinates.map(([longitude, latitude], index) => {
    const { x, y } = projectVirginiaCoordinate(longitude, latitude);
    return `${index === 0 ? "M" : "L"}${x.toFixed(2)},${y.toFixed(2)}`;
  });
  return `${commands.join(" ")}${close ? " Z" : ""}`;
}

const FALLBACK_PATH = positionPath(FALLBACK_OUTLINE, true);

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function readPosition(value: unknown): GeoPosition | null {
  if (
    !Array.isArray(value) ||
    value.length < 2 ||
    typeof value[0] !== "number" ||
    typeof value[1] !== "number" ||
    !Number.isFinite(value[0]) ||
    !Number.isFinite(value[1])
  ) {
    return null;
  }

  return [value[0], value[1]];
}

function readRing(value: unknown): GeoPosition[] | null {
  if (!Array.isArray(value) || value.length < 4) return null;
  const ring: GeoPosition[] = [];

  for (const candidate of value) {
    const position = readPosition(candidate);
    if (!position) return null;
    ring.push(position);
  }

  return ring;
}

function readPolygon(value: unknown): GeoPosition[][] | null {
  if (!Array.isArray(value) || value.length === 0) return null;
  const polygon: GeoPosition[][] = [];

  for (const candidate of value) {
    const ring = readRing(candidate);
    if (!ring) return null;
    polygon.push(ring);
  }

  return polygon;
}

function pathsFromGeoJson(value: unknown): string | null {
  if (!isRecord(value) || value.type !== "FeatureCollection") return null;
  if (!Array.isArray(value.features) || value.features.length === 0) return null;

  const polygons: GeoPosition[][][] = [];

  for (const feature of value.features) {
    if (!isRecord(feature) || !isRecord(feature.geometry)) continue;
    const geometry = feature.geometry;

    if (geometry.type === "Polygon") {
      const polygon = readPolygon(geometry.coordinates);
      if (polygon) polygons.push(polygon);
    } else if (geometry.type === "MultiPolygon" && Array.isArray(geometry.coordinates)) {
      for (const candidate of geometry.coordinates) {
        const polygon = readPolygon(candidate);
        if (polygon) polygons.push(polygon);
      }
    }
  }

  if (polygons.length === 0) return null;

  return polygons
    .flatMap((polygon) => polygon.map((ring) => positionPath(ring, true)))
    .join(" ");
}

function placePortals(
  portals: readonly VirginiaMapPortal[],
): PlacedPortal[] {
  const placed: PlacedPortal[] = [];
  const minimumDistance = 88;
  const edgePadding = 64;

  for (const portal of portals) {
    const anchor = projectVirginiaCoordinate(
      portal.portal.longitude,
      portal.portal.latitude,
    );
    let center = {
      x: clamp(anchor.x, edgePadding, VIEWBOX_WIDTH - edgePadding),
      y: clamp(anchor.y, edgePadding, VIEWBOX_HEIGHT - edgePadding),
    };

    for (const [offsetX, offsetY] of COLLISION_OFFSETS) {
      const candidate = {
        x: clamp(anchor.x + offsetX, edgePadding, VIEWBOX_WIDTH - edgePadding),
        y: clamp(anchor.y + offsetY, edgePadding, VIEWBOX_HEIGHT - edgePadding),
      };
      const hasRoom = placed.every(
        ({ center: other }) =>
          Math.hypot(candidate.x - other.x, candidate.y - other.y) >=
          minimumDistance,
      );

      if (hasRoom) {
        center = candidate;
        break;
      }
    }

    placed.push({ portal, anchor, center });
  }

  return placed;
}

function missionNumber(id: string): string {
  return id.replace(/^VS\./i, "");
}

function compactLabel(label: string): string {
  return label.length > 24 ? `${label.slice(0, 23).trimEnd()}…` : label;
}

function precisionLabel(precision: string): string {
  switch (precision) {
    case "exact_public":
      return "public site";
    case "approximate":
      return "approximate place";
    case "generalized_sensitive":
      return "generalized area";
    case "route":
      return "route";
    case "region":
      return "region";
    case "water_body":
      return "water area";
    default:
      return "generalized map position";
  }
}

export function VirginiaMap({
  portals,
  selectedId,
  layers,
  onSelect,
}: VirginiaMapProps) {
  const mapRegionRef = useRef<HTMLElement>(null);
  const generatedId = useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const outlineClipId = `virginia-outline-${generatedId || "map"}`;
  const descriptionId = `virginia-map-description-${generatedId || "map"}`;
  const [outline, setOutline] = useState<OutlineState>(() => ({
    path: FALLBACK_PATH,
    status: "loading",
  }));

  useEffect(() => {
    if (typeof globalThis.fetch !== "function") {
      setOutline({ path: FALLBACK_PATH, status: "fallback" });
      return undefined;
    }

    const controller = new AbortController();

    void globalThis
      .fetch(`${PUBLIC_BASE_URL}data/virginia-outline.geojson`, {
        signal: controller.signal,
      })
      .then((response) => {
        if (!response.ok) throw new Error(`Outline request failed: ${response.status}`);
        return response.json() as Promise<unknown>;
      })
      .then((geoJson) => {
        if (controller.signal.aborted) return;
        const path = pathsFromGeoJson(geoJson);
        if (!path) throw new Error("The outline file did not contain polygon geometry");
        setOutline({ path, status: "ready" });
      })
      .catch((error: unknown) => {
        if (
          controller.signal.aborted ||
          (error instanceof DOMException && error.name === "AbortError")
        ) {
          return;
        }
        setOutline({ path: FALLBACK_PATH, status: "fallback" });
      });

    return () => controller.abort();
  }, []);

  const placedPortals = useMemo(() => placePortals(portals), [portals]);
  const selectedPortal = placedPortals.find(
    ({ portal }) => portal.id === selectedId,
  );

  useLayoutEffect(() => {
    const mapRegion = mapRegionRef.current;
    if (!mapRegion || !selectedPortal) return;

    const renderedScale = mapRegion.scrollWidth / VIEWBOX_WIDTH;

    if (mapRegion.scrollWidth <= mapRegion.clientWidth + 1) {
      mapRegion.scrollLeft = 0;
    } else {
      const selectedCenterX = selectedPortal.center.x * renderedScale;
      mapRegion.scrollLeft = clamp(
        selectedCenterX - mapRegion.clientWidth / 2,
        0,
        mapRegion.scrollWidth - mapRegion.clientWidth,
      );
    }

    if (mapRegion.scrollHeight <= mapRegion.clientHeight + 1) {
      mapRegion.scrollTop = 0;
    } else {
      const selectedCenterY = selectedPortal.center.y * renderedScale;
      mapRegion.scrollTop = clamp(
        selectedCenterY - mapRegion.clientHeight / 2,
        0,
        mapRegion.scrollHeight - mapRegion.clientHeight,
      );
    }
  }, [selectedPortal]);

  const description = [
    "An illustrated relief map of Virginia with thirteen selectable mission portals.",
    "Virginia's five physical regions are labeled from west to east.",
    "Region edges are broad transition areas rather than sharp borders.",
    layers.rivers
      ? "The Potomac, Rappahannock, York, and James rivers are shown."
      : "The river layer is hidden.",
    layers.terrain ? "The terrain layer is shown." : "The terrain layer is hidden.",
    layers.thenNow
      ? "Then-and-now place markers are shown."
      : "Then-and-now place markers are hidden.",
    "Use Tab to reach a portal and Enter or Space to select it.",
  ].join(" ");

  return (
    <section
      ref={mapRegionRef}
      className={styles.mapRegion}
      role="region"
      tabIndex={0}
      aria-label="Interactive Virginia mission map"
      aria-describedby={descriptionId}
    >
      <p id={descriptionId} className={styles.srOnly}>
        {description}
      </p>

      <div className={styles.mapCanvas}>
        <svg
          className={styles.mapSvg}
          viewBox={`0 0 ${VIEWBOX_WIDTH} ${VIEWBOX_HEIGHT}`}
          preserveAspectRatio="xMidYMid meet"
          role="group"
          aria-label="Virginia map and mission portal controls"
        >
        <title>Virginia mission map</title>
        <desc>{description}</desc>
        <defs>
          <clipPath id={outlineClipId}>
            <path d={outline.path} fillRule="evenodd" clipRule="evenodd" />
          </clipPath>
          <filter id={`map-shadow-${generatedId || "map"}`} x="-20%" y="-20%" width="140%" height="150%">
            <feDropShadow dx="0" dy="5" stdDeviation="5" floodColor="#17304a" floodOpacity="0.24" />
          </filter>
          <pattern
            id={`paper-grid-${generatedId || "map"}`}
            width="32"
            height="32"
            patternUnits="userSpaceOnUse"
          >
            <path d="M32 0H0V32" className={styles.paperGridLine} />
          </pattern>
        </defs>

        <g aria-hidden="true">
          <rect width={VIEWBOX_WIDTH} height={VIEWBOX_HEIGHT} className={styles.paper} />
          <rect
            width={VIEWBOX_WIDTH}
            height={VIEWBOX_HEIGHT}
            fill={`url(#paper-grid-${generatedId || "map"})`}
          />
          <path
            d={outline.path}
            className={styles.landBase}
            fillRule="evenodd"
            filter={`url(#map-shadow-${generatedId || "map"})`}
          />

          {layers.terrain ? (
            <image
              className={styles.terrain}
              href={`${PUBLIC_BASE_URL}assets/virginia-atlas-terrain.jpg`}
              x={PROJECTED_LEFT}
              y={PROJECTED_TOP}
              width={PROJECTED_WIDTH}
              height={PROJECTED_HEIGHT}
              preserveAspectRatio="none"
              clipPath={`url(#${outlineClipId})`}
            />
          ) : (
            <g clipPath={`url(#${outlineClipId})`}>
              <rect
                x={PROJECTED_LEFT}
                y={PROJECTED_TOP}
                width={PROJECTED_WIDTH * 0.2}
                height={PROJECTED_HEIGHT}
                className={styles.regionPlateau}
              />
              <rect
                x={PROJECTED_LEFT + PROJECTED_WIDTH * 0.16}
                y={PROJECTED_TOP}
                width={PROJECTED_WIDTH * 0.27}
                height={PROJECTED_HEIGHT}
                className={styles.regionValley}
              />
              <rect
                x={PROJECTED_LEFT + PROJECTED_WIDTH * 0.36}
                y={PROJECTED_TOP}
                width={PROJECTED_WIDTH * 0.16}
                height={PROJECTED_HEIGHT}
                className={styles.regionRidge}
              />
              <rect
                x={PROJECTED_LEFT + PROJECTED_WIDTH * 0.48}
                y={PROJECTED_TOP}
                width={PROJECTED_WIDTH * 0.27}
                height={PROJECTED_HEIGHT}
                className={styles.regionPiedmont}
              />
              <rect
                x={PROJECTED_LEFT + PROJECTED_WIDTH * 0.72}
                y={PROJECTED_TOP}
                width={PROJECTED_WIDTH * 0.28}
                height={PROJECTED_HEIGHT}
                className={styles.regionCoastal}
              />
            </g>
          )}

          <g clipPath={`url(#${outlineClipId})`} className={styles.regionLines}>
            {REGION_BOUNDARIES.map((coordinates, index) => (
              <path key={index} d={positionPath(coordinates)} />
            ))}
          </g>

          <g className={styles.regionLabels}>
            {REGION_LABELS.map((region) => {
              const point = projectVirginiaCoordinate(...region.at);
              return (
                <text
                  key={region.name.join("-")}
                  x={point.x}
                  y={point.y}
                  transform={`rotate(${region.rotation} ${point.x} ${point.y})`}
                  textAnchor="middle"
                >
                  {region.name.map((line, index) => (
                    <tspan key={line} x={point.x} dy={index === 0 ? 0 : 17}>
                      {line}
                    </tspan>
                  ))}
                </text>
              );
            })}
          </g>

          {layers.rivers ? (
            <g className={styles.riverLayer}>
              <g clipPath={`url(#${outlineClipId})`}>
                {RIVERS.map((river) => (
                  <path key={river.id} d={positionPath(river.coordinates)} />
                ))}
              </g>
              {RIVERS.map((river) => {
                const point = projectVirginiaCoordinate(...river.labelAt);
                const [firstWord, ...rest] = river.name.split(" ");
                return (
                  <text
                    key={`${river.id}-label`}
                    x={point.x}
                    y={point.y}
                    transform={`rotate(${river.labelRotation} ${point.x} ${point.y})`}
                    textAnchor="middle"
                  >
                    <tspan x={point.x}>{firstWord}</tspan>
                    <tspan x={point.x} dy="14">
                      {rest.join(" ")}
                    </tspan>
                  </text>
                );
              })}
              <text x="899" y="280" className={styles.waterLabel} textAnchor="middle">
                <tspan x="899">CHESAPEAKE</tspan>
                <tspan x="899" dy="18">BAY</tspan>
              </text>
            </g>
          ) : null}

          {layers.thenNow ? (
            <g className={styles.thenNowLayer}>
              {THEN_NOW_PLACES.map((place, index) => {
                const point = projectVirginiaCoordinate(...place.at);
                const placeAbove = point.y > 150;
                const labelY = point.y + (placeAbove ? -24 : 31);
                return (
                  <g key={place.name}>
                    <circle cx={point.x} cy={point.y} r="7" />
                    <path
                      d={`M${point.x},${point.y} L${point.x},${labelY + (placeAbove ? 8 : -12)}`}
                    />
                    <rect
                      x={point.x - 60}
                      y={labelY - 12}
                      width="120"
                      height="22"
                      rx="11"
                    />
                    <text x={point.x} y={labelY + 3} textAnchor="middle">
                      {place.then} ↔ now · {place.name}
                    </text>
                    <text className={styles.thenNowIndex} x={point.x + 8} y={point.y - 8}>
                      {index + 1}
                    </text>
                  </g>
                );
              })}
            </g>
          ) : null}

          <path
            d={outline.path}
            className={styles.stateOutline}
            fill="none"
            fillRule="evenodd"
          />
        </g>

        <g aria-hidden="true" className={styles.portalConnectors}>
          {placedPortals.map(({ portal, anchor, center }) =>
            Math.hypot(anchor.x - center.x, anchor.y - center.y) > 2 ? (
              <g key={`${portal.id}-connector`}>
                <path d={`M${anchor.x},${anchor.y} L${center.x},${center.y}`} />
                <circle cx={anchor.x} cy={anchor.y} r="4" />
              </g>
            ) : null,
          )}
        </g>

        {selectedPortal ? (
          <g className={styles.selectedLabel} aria-hidden="true">
            {(() => {
              const x = clamp(selectedPortal.center.x, 98, VIEWBOX_WIDTH - 98);
              const labelBelow = selectedPortal.center.y < 135;
              const y = selectedPortal.center.y + (labelBelow ? 53 : -53);
              return (
                <>
                  <rect x={x - 94} y={y - 17} width="188" height="34" rx="10" />
                  <text x={x} y={y + 5} textAnchor="middle">
                    {selectedPortal.portal.id} ·{" "}
                    {compactLabel(selectedPortal.portal.shortTitle)}
                  </text>
                </>
              );
            })()}
          </g>
        ) : null}

        </svg>

        <div className={styles.portalLayer}>
          {placedPortals.map(({ portal, center }) => {
            const status = PORTAL_STATUS[portal.displayState];
            const StatusIcon = status.Icon;
            const isSelected = portal.id === selectedId;
            return (
              <div
                key={portal.id}
                className={styles.portalControl}
                style={{
                  left: `${(center.x / VIEWBOX_WIDTH) * 100}%`,
                  top: `${(center.y / VIEWBOX_HEIGHT) * 100}%`,
                }}
              >
                <button
                  type="button"
                  className={`${styles.portalButton} ${PORTAL_STATE_CLASS[portal.displayState]} ${
                    isSelected ? styles.portalSelected : ""
                  }`}
                  aria-label={`${portal.id}: ${portal.title}. Status: ${status.label}. Map position: ${precisionLabel(portal.portal.precision)}.`}
                  aria-pressed={isSelected}
                  title={`${portal.id} · ${portal.shortTitle} · ${status.label}`}
                  onClick={() => onSelect(portal.id)}
                >
                  <span className={styles.missionNumber} aria-hidden="true">
                    {missionNumber(portal.id)}
                  </span>
                  <span className={styles.statusGlyph} aria-hidden="true">
                    <StatusIcon />
                  </span>
                </button>
              </div>
            );
          })}
        </div>
      </div>

      <ul className={styles.legend} aria-label="Portal status key">
        {(Object.keys(PORTAL_STATUS) as PortalDisplayState[]).map((state) => {
          const StatusIcon = PORTAL_STATUS[state].Icon;
          return (
            <li key={state}>
              <span
                className={`${styles.legendSymbol} ${PORTAL_STATE_CLASS[state]}`}
                aria-hidden="true"
              >
                <StatusIcon />
              </span>
              <span>{PORTAL_STATUS[state].label.replace("; preview available", "")}</span>
            </li>
          );
        })}
      </ul>

      <p className={styles.regionNote}>
        Region edges are broad transition areas.
      </p>

      {outline.status === "fallback" ? (
        <p className={styles.fallbackNotice} role="status">
          Showing a simplified Virginia outline.
        </p>
      ) : null}
    </section>
  );
}
