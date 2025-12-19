
export enum ShapeType {
  SQUARE_TO_ROUND = 'SQUARE_TO_ROUND',
  CONE = 'CONE',
  PROFILE = 'PROFILE',
  SEGMENT_BEND = 'SEGMENT_BEND',
  CHIMNEY_FLASHING = 'CHIMNEY_FLASHING',
  TIME_REPORT = 'TIME_REPORT',
  CALCULATOR = 'CALCULATOR',
  CAMERA = 'CAMERA',
  FLASHLIGHT = 'FLASHLIGHT',
  MUSIC_RADIO = 'MUSIC_RADIO',
  PROJECT_CONTACTS = 'PROJECT_CONTACTS',
  COMPANY_WEB = 'COMPANY_WEB',
  MATERIAL_ORDER = 'MATERIAL_ORDER',
}

export interface Shape {
  type: ShapeType;
  name: string;
  description: string;
}

export interface Contact {
  id: string;
  name: string;
  role: string;
  phone: string;
}

export interface SquareToRoundResult {
  patternHeight: number;
  outerArcRadius: number;
  innerArcRadius: number;
  chordLength: number;
  arcAngle: number;
}

export interface ConeResult {
    outerRadius: number;
    innerRadius: number;
    arcAngle: number;
    slantHeight: number; // Sida (hypotenusan på själva konen)
}

export interface ProfileSegment {
    id: string;
    length: number; // Length of the leg
    angle: number;  // Angle relative to previous leg (bend angle)
}

export interface SegmentBendResult {
    cutAngle: number; // Vinkel per snitt
    segmentAngle: number; // Vinkel per segment (2 * cutAngle)
    middleHeight: number; // Höjd i mitten av segmentet (vid radien)
    maxHeight: number; // Höjd i ryggen (långsidan)
    minHeight: number; // Höjd i buken (kortsidan)
    circumference: number;
    coordinates: { x: number; y: number; angle: number }[]; // Punkter för kurvan
}

export interface TimeEntry {
  id: string;
  date: string;
  project: string;
  category: string;
  hours: number;
  description: string;
  materials: string;
}

export interface MediaItem {
  id: string;
  type: 'image' | 'video';
  url: string;
  timestamp: number;
  name: string;
}
