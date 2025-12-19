
import { SquareToRoundResult, ConeResult, SegmentBendResult } from '../types.ts';

/**
 * Calculates the flat pattern for one quarter of a symmetrical square-to-round transition piece.
 * This uses triangulation to find the true lengths of the sections.
 * @param baseWidth - The width of the square base (A).
 * @param baseDepth - The depth of the square base (B). For this simplified symmetrical case, it's assumed to be equal to baseWidth.
 * @param topDiameter - The diameter of the round top (D).
 * @param height - The vertical height of the piece (H).
 * @returns An object with the dimensions needed to draw the flat pattern.
 */
export function calculateSquareToRound(baseWidth: number, baseDepth: number, topDiameter: number, height: number): SquareToRoundResult {
    if (baseWidth !== baseDepth) {
        // For simplicity, this implementation only supports a square base.
        // An eccentric or rectangular-to-round would require more complex triangulation.
        throw new Error("Denna beräkning stöder för närvarande endast fyrkantig bas (Bredd = Djup).");
    }

    const w = baseWidth / 2;
    const r = topDiameter / 2;
    const h = height;

    // Calculate the true length of the corner line (from base corner to top circle tangent)
    // This forms a right triangle with base = sqrt((w-r)^2 + w^2) and height = h
    // However, a more direct calculation is needed.
    // We calculate the true lengths of two key lines:
    // 1. From the center of a base side to the nearest point on the circle.
    // 2. From a base corner to the point on the circle 45 degrees away.

    // Line 1: True length from middle of base side to top circle edge.
    const l1 = Math.sqrt(Math.pow(h, 2) + Math.pow(w - r, 2));

    // Line 2: True length from base corner to top circle edge.
    const l2 = Math.sqrt(Math.pow(h, 2) + Math.pow(w, 2) + Math.pow(r, 2));

    // Now we unfold the pattern. The pattern consists of two triangles and a shape between them.
    // We can approximate the curve by laying out the true lengths L1 and L2.
    // Let's use L2 as the outer radius and L1 as an intermediate length.
    const outerArcRadius = l2;
    
    // The "inner" point of the pattern is where the two middle sections meet.
    // Its radius from the pattern's apex can be found.
    // Let's call the point where the pattern converges 'O'.
    // O, base-corner, and top-circle-point form a triangle with side L2.
    // O, base-midpoint, and top-circle-point form a triangle with side L1.

    // Height of the unfolded corner triangle section (isosceles triangle)
    const triangleHeight = Math.sqrt(Math.pow(l2, 2) - Math.pow(w, 2));
    
    // The inner radius is the height of this corner triangle.
    const innerArcRadius = triangleHeight;

    // The length of the chord connecting the two outer points of the 1/4 pattern
    const chordLength = 2 * w;

    // The height of the total unfolded pattern
    const patternHeight = outerArcRadius - innerArcRadius;

    // Calculate the angle of the arc segment using the Law of Cosines on the unfolded triangle
    // Triangle sides are outerArcRadius, outerArcRadius, and the top arc length for 1/4 of the circle.
    const topArcLength = (Math.PI * topDiameter) / 4;
    // cos(angle) = (a^2 + b^2 - c^2) / 2ab
    const cosAngle = (2 * Math.pow(outerArcRadius, 2) - Math.pow(topArcLength, 2)) / (2 * Math.pow(outerArcRadius, 2));
    let arcAngle = Math.acos(cosAngle) * (180 / Math.PI);

    // If the calculation results in NaN, it might be due to floating point inaccuracies
    // or an impossible geometry. Fallback to a simpler approximation.
    if (isNaN(arcAngle)) {
        // Use a different method to find the angle - from the apex of the developed cone section.
        const apexHeight = (r * l1) / (w - r);
        const apexTotalHeight = apexHeight + l1;
        const angleRad = Math.asin(w / apexTotalHeight) * 2;
        arcAngle = angleRad * (180 / Math.PI);
    }

    if (isNaN(arcAngle)) { // If it's still NaN, there's a problem with the input geometry.
        throw new Error("Kunde inte beräkna vinkeln med den angivna geometrin. Kontrollera måtten.");
    }


    return {
        patternHeight,
        outerArcRadius,
        innerArcRadius,
        chordLength,
        arcAngle,
    };
}

/**
 * Calculates the flat pattern for a truncated cone (frustum).
 * @param largeDia - The larger diameter of the cone (D).
 * @param smallDia - The smaller diameter of the cone (d).
 * @param height - The vertical height of the cone (H).
 * @returns An object containing radii and angle for the flat pattern.
 */
export function calculateCone(largeDia: number, smallDia: number, height: number): ConeResult {
    if (largeDia <= 0 || smallDia <= 0 || height <= 0) {
        throw new Error("Alla mått måste vara positiva.");
    }

    if (Math.abs(largeDia - smallDia) < 0.1) {
         throw new Error("Diametrarna är lika. Detta är en cylinder (använd rörutbredning).");
    }

    // Ensure D is the larger diameter for calculation simplicity
    // If input is swapped, the logic handles it, but let's normalize variables.
    const D = Math.max(largeDia, smallDia);
    const d = Math.min(largeDia, smallDia);
    const h = height;

    // 1. Calculate Slant Height of the frustum part (S)
    // Using Pythagorean theorem on the cross section triangle
    const radiusDiff = (D - d) / 2;
    const slantHeight = Math.sqrt(Math.pow(radiusDiff, 2) + Math.pow(h, 2));

    // 2. Calculate the "extension" to the apex of the full cone.
    // By similar triangles: R / (D/2) = r / (d/2)
    // And R - r = slantHeight
    // Solve for Outer Radius (R)
    // R = (SlantHeight * D) / (D - d)
    const outerRadius = (slantHeight * D) / (D - d);

    // 3. Inner Radius (r)
    const innerRadius = outerRadius - slantHeight;

    // 4. Arc Angle (alpha)
    // Circumference of base = PI * D
    // Circumference of flattened circle with radius R = 2 * PI * R
    // Ratio = (PI * D) / (2 * PI * R) = D / (2 * R)
    // Angle = 360 * Ratio
    const arcAngle = 360 * (D / (2 * outerRadius));

    return {
        outerRadius,
        innerRadius,
        arcAngle,
        slantHeight
    };
}

/**
 * Calculates a segment bend (lobster back).
 * @param diameter - Pipe Diameter.
 * @param radius - Center line radius of bend.
 * @param angle - Total angle of bend.
 * @param segments - Number of segments.
 */
export function calculateSegmentBend(diameter: number, radius: number, angle: number, segments: number): SegmentBendResult {
    if (diameter <= 0 || radius <= 0 || angle <= 0 || segments < 2) {
        throw new Error("Ogiltiga värden. Segment måste vara minst 2.");
    }

    const circumference = diameter * Math.PI;

    // Number of joints (skarvar) = segments - 1
    // A standard segment bend has 2 end pieces (half segments) and (N-2) middle pieces (full segments).
    // Or simpler: Total Angle is distributed over (2 * (N-1)) cuts if we view ends as halves.
    // Cut Angle = TotalAngle / (2 * (Segments - 1))
    // Example: 90 deg, 3 segments (2 cuts). Cut angle = 90 / (2*2) = 22.5 deg.
    // Middle piece covers 2 * 22.5 = 45 deg. End piece covers 22.5 deg.
    
    const numberOfJoints = segments - 1;
    const cutAngleDeg = angle / (2 * numberOfJoints);
    const cutAngleRad = (cutAngleDeg * Math.PI) / 180;

    // Calculate Heights for the MIDDLE (Full) Segment
    // A full segment is like two cut wedges back to back.
    // The mean length of the segment along the centerline is usually arbitrary or defined by the radius arc length.
    // But for the pattern, we usually unroll it relative to a centerline height.
    
    // We calculate the deviation from the centerline height at the cut.
    // Deviation = (Diameter / 2) * tan(cutAngle)
    const amplitude = (diameter / 2) * Math.tan(cutAngleRad);

    // To make a drawable pattern, we need a base height.
    // The "Throat" (Inner curve) length of a full segment at the center:
    // Arc Length at Radius = (Angle / (N-1)) * (PI/180) * Radius
    // But practically, the height of the segment at the center line (neutral axis)
    // H_center = 2 * Radius * tan(cutAngle)
    const segmentCenterHeight = 2 * radius * Math.tan(cutAngleRad);
    
    // Heights
    const maxHeight = segmentCenterHeight + 2 * amplitude; // Back (Rygg)
    const minHeight = segmentCenterHeight - 2 * amplitude; // Throat (Buk)
    
    // Generate coordinates for the unroll pattern (0 to 360 degrees)
    const coordinates: { x: number; y: number; angle: number }[] = [];
    const steps = 24; // Resolution
    
    for (let i = 0; i <= steps; i++) {
        const thetaDeg = (360 / steps) * i;
        const thetaRad = (thetaDeg * Math.PI) / 180;
        
        // X coordinate (along the flat sheet length)
        const x = (circumference / steps) * i;
        
        // Y coordinate (Height of the curve at this point)
        // We use cosine to simulate the circle projection
        // We add amplitude * cos(theta) to the half-height, done twice (top and bottom cut)
        // Pattern height y = segmentCenterHeight/2 + amplitude * cos(theta) ... mirrored?
        // Actually, for a full segment, the top cut matches the bottom cut but rotated 180?
        // No, typically a segment is symmetrical. The cut planes converge.
        // H(theta) = segmentCenterHeight + 2 * (D/2) * tan(cutAngle) * cos(theta)? No.
        
        // Let's look at the height of the element from the bottom cut line to top cut line.
        // Bottom cut y = - tan(cutAngle) * (D/2 * cos(theta))
        // Top cut y = + tan(cutAngle) * (D/2 * cos(theta))
        // Distance = Top - Bottom = 2 * tan(cutAngle) * (D/2) * cos(theta) ... relative to center.
        // Plus the center offset.
        
        // Usually we start 0 at the "Back" (Longest part) or "Throat".
        // Let's assume 0 is the Back (Max height).
        // H(theta) = segmentCenterHeight + 2 * amplitude * cos(theta) 
        // Note: cos(0) = 1 (Max), cos(180) = -1 (Min).
        
        // Let's normalize it to be a valid coordinate for SVG (y down)
        // We usually want to draw the *shape*.
        const h = segmentCenterHeight + 2 * amplitude * Math.cos(thetaRad); // 0 deg = Max height
        
        // Wait, standard formulas often start at the seam.
        // Let's adhere to: 0 = Rygg (Back), 180 = Buk (Throat).
        
        coordinates.push({ x, y: h, angle: thetaDeg });
    }

    return {
        cutAngle: cutAngleDeg,
        segmentAngle: cutAngleDeg * 2,
        middleHeight: segmentCenterHeight,
        maxHeight,
        minHeight,
        circumference,
        coordinates
    };
}
