import { useRef, useEffect, useLayoutEffect, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/* ============================================================
   GSAP-based utility hooks for the starlog design system.

   These replace the motion/react useTransform + MotionValue
   patterns with GSAP-native equivalents:

   • useGSAP(setup, deps)
       Thin wrapper: runs a setup function, auto-reverts on
       unmount via gsap.context().

   • useProgressTimeline(containerRef, timelineFn, options)
       Creates a GSAP timeline scrubbed by a ScrollTrigger on
       `containerRef`. The `timelineFn(tl)` callback populates
       the timeline. Returns the ScrollTrigger's progress getter.

   • mapRange(progress, inMin, inMax, outMin, outMax)
       Pure math: maps a 0-1 scroll progress into an arbitrary
       output range with clamping. Use inside onUpdate callbacks.
   ============================================================ */

// ── useGSAP ────────────────────────────────────────────────
export function useGSAP(setup, deps = []) {
  // Use useLayoutEffect to set up GSAP before paint
  const useIsomorphicEffect =
    typeof window !== "undefined" ? useLayoutEffect : useEffect;

  useIsomorphicEffect(() => {
    const ctx = gsap.context(setup);
    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}

// ── useProgressTimeline ────────────────────────────────────
/**
 * Creates a ScrollTrigger-scrubbed timeline.
 *
 * @param {RefObject} containerRef  — trigger element
 * @param {(tl: gsap.core.Timeline) => void} timelineFn — populate the timeline
 * @param {object} options — { start, end, pin, pinSpacing, scrub, onUpdate }
 * @returns {{ get: () => number, onChange: (cb) => unsub }}
 */
export function useProgressTimeline(containerRef, timelineFn, options = {}) {
  const progressRef = useRef(0);
  const listenersRef = useRef(new Set());

  const get = useCallback(() => progressRef.current, []);
  const onChange = useCallback((cb) => {
    listenersRef.current.add(cb);
    cb(progressRef.current);
    return () => listenersRef.current.delete(cb);
  }, []);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const {
      start = "top top",
      end = "bottom bottom",
      pin = false,
      pinSpacing = true,
      scrub = 0.5,
      onUpdate: externalOnUpdate,
    } = options;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: el,
        start,
        end,
        pin,
        pinSpacing,
        scrub,
        onUpdate: (self) => {
          progressRef.current = self.progress;
          for (const cb of listenersRef.current) cb(self.progress);
          if (externalOnUpdate) externalOnUpdate(self);
        },
      },
    });

    timelineFn(tl);

    return () => {
      tl.scrollTrigger?.kill();
      tl.kill();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [containerRef]);

  return { get, onChange };
}

// ── mapRange ───────────────────────────────────────────────
/**
 * Maps `value` from [inMin, inMax] to [outMin, outMax] with clamping.
 * Pure function — no side effects.
 */
export function mapRange(value, inMin, inMax, outMin, outMax) {
  const clamped = Math.max(inMin, Math.min(inMax, value));
  const t = (clamped - inMin) / (inMax - inMin || 1);
  return outMin + t * (outMax - outMin);
}

/**
 * Maps `value` from [inMin, inMax] to [0, 1] with clamping.
 */
export function normalize(value, inMin, inMax) {
  return mapRange(value, inMin, inMax, 0, 1);
}

/**
 * Multi-stop interpolation — equivalent to motion's useTransform
 * with arrays: useTransform(progress, [0, 0.5, 1], [0, 1, 0.5])
 *
 * @param {number} progress — current 0..1 value
 * @param {number[]} inputs — sorted breakpoints
 * @param {number[]} outputs — corresponding output values
 * @returns {number} interpolated output
 */
export function interpolate(progress, inputs, outputs) {
  if (inputs.length !== outputs.length || inputs.length < 2) {
    return outputs[0] ?? 0;
  }
  // Clamp to range
  if (progress <= inputs[0]) return outputs[0];
  if (progress >= inputs[inputs.length - 1]) return outputs[outputs.length - 1];

  // Find segment
  for (let i = 0; i < inputs.length - 1; i++) {
    if (progress >= inputs[i] && progress <= inputs[i + 1]) {
      const t = (progress - inputs[i]) / (inputs[i + 1] - inputs[i]);
      return outputs[i] + t * (outputs[i + 1] - outputs[i]);
    }
  }
  return outputs[outputs.length - 1];
}

/**
 * String interpolation for percentage values like "0%" → "100%".
 * Assumes the format is `${number}${suffix}`.
 */
export function interpolateString(progress, inputs, outputStrings) {
  // Parse numeric values and suffix from the first output string
  const match = outputStrings[0].match(/^(-?[\d.]+)(.*)$/);
  if (!match) return outputStrings[0];
  const suffix = match[2];
  const nums = outputStrings.map((s) => parseFloat(s));
  const result = interpolate(progress, inputs, nums);
  return `${result}${suffix}`;
}
