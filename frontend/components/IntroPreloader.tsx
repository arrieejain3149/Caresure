'use client';

import React, { useState, useEffect } from 'react';

// Exact mathematical centerline paths of the official Namaha emblem
const PATH_LOWER_RIBBON = "M 322.0 371.0 C 326.8 373.8, 341.3 381.3, 351.0 388.0 C 360.7 394.7, 370.3 403.5, 380.0 411.0 C 389.7 418.5, 399.3 425.3, 409.0 433.0 C 418.7 440.7, 428.7 448.3, 438.0 457.0 C 447.3 465.7, 456.7 476.5, 465.0 485.0 C 473.3 493.5, 480.5 499.3, 488.0 508.0 C 495.5 516.7, 503.8 527.3, 510.0 537.0 C 516.2 546.7, 520.7 556.3, 525.0 566.0 C 529.3 575.7, 533.2 585.3, 536.0 595.0 C 538.8 604.7, 540.5 614.3, 542.0 624.0 C 543.5 633.7, 544.7 643.3, 545.0 653.0 C 545.3 662.7, 544.8 672.3, 544.0 682.0 C 543.2 691.7, 541.8 701.3, 540.0 711.0 C 538.2 720.7, 536.3 730.3, 533.0 740.0 C 529.7 749.7, 525.0 759.3, 520.0 769.0 C 515.0 778.7, 509.8 788.3, 503.0 798.0 C 496.2 807.7, 487.8 817.8, 479.0 827.0 C 470.2 836.2, 459.7 845.3, 450.0 853.0 C 440.3 860.7, 430.7 867.0, 421.0 873.0 C 411.3 879.0, 401.7 883.8, 392.0 889.0 C 382.3 894.2, 372.7 899.0, 363.0 904.0 C 353.3 909.0, 343.7 914.0, 334.0 919.0 C 324.3 924.0, 314.7 931.8, 305.0 934.0 C 295.3 936.2, 285.7 934.8, 276.0 932.0 C 266.3 929.2, 256.7 922.0, 247.0 917.0 C 237.3 912.0, 227.7 907.0, 218.0 902.0 C 208.3 897.0, 198.7 892.2, 189.0 887.0 C 179.3 881.8, 169.7 877.2, 160.0 871.0 C 150.3 864.8, 140.7 858.0, 131.0 850.0 C 121.3 842.0, 110.8 832.3, 102.0 823.0 C 93.2 813.7, 84.8 803.7, 78.0 794.0 C 71.2 784.3, 65.7 774.7, 61.0 765.0 C 56.3 755.3, 53.0 745.7, 50.0 736.0 C 47.0 726.3, 44.8 716.7, 43.0 707.0 C 41.2 697.3, 39.7 687.7, 39.0 678.0 C 38.3 668.3, 38.5 658.7, 39.0 649.0 C 39.5 639.3, 40.3 629.7, 42.0 620.0 C 43.7 610.3, 45.8 600.7, 49.0 591.0 C 52.2 581.3, 56.3 571.7, 61.0 562.0 C 65.7 552.3, 73.5 539.8, 77.0 533.0 C 80.5 526.2, 81.2 523.0, 82.0 521.0";
const PATH_UPPER_RIBBON = "lr";
const PATH_LOWER_TEARDROP = "M 262.0 609.0 C 257.2 606.2 242.7 598.7 233.0 592.0 C 223.3 585.3 213.7 576.5 204.0 569.0 C 194.3 561.5 184.7 554.7 175.0 547.0 C 165.3 539.3 155.3 531.7 146.0 523.0 C 136.7 514.3 127.3 503.5 119.0 495.0 C 110.7 486.5 103.5 480.7 96.0 472.0 C 88.5 463.3 80.2 452.7 74.0 443.0 C 67.8 433.3 63.3 423.7 59.0 414.0 C 54.7 404.3 50.8 394.7 48.0 385.0 C 45.2 375.3 43.5 365.7 42.0 356.0 C 40.5 346.3 39.3 336.7 39.0 327.0 C 38.7 317.3 39.2 307.7 40.0 298.0 C 40.8 288.3 42.2 278.7 44.0 269.0 C 45.8 259.3 47.7 249.7 51.0 240.0 C 54.3 230.3 59.0 220.7 64.0 211.0 C 69.0 201.3 74.2 191.7 81.0 182.0 C 87.8 172.3 96.2 162.2 105.0 153.0 C 113.8 143.8 124.3 134.7 134.0 127.0 C 143.7 119.3 153.3 113.0 163.0 107.0 C 172.7 101.0 182.3 96.2 192.0 91.0 C 201.7 85.8 211.3 81.0 221.0 76.0 C 230.7 71.0 240.3 66.0 250.0 61.0 C 259.7 56.0 269.3 48.2 279.0 46.0 C 288.7 43.8 298.3 45.2 308.0 48.0 C 317.7 50.8 327.3 58.0 337.0 63.0 C 346.7 68.0 356.3 73.0 366.0 78.0 C 375.7 83.0 385.3 87.8 395.0 93.0 C 404.7 98.2 414.3 102.8 424.0 109.0 C 433.7 115.2 443.3 122.0 453.0 130.0 C 462.7 138.0 473.2 147.7 482.0 157.0 C 490.8 166.3 499.2 176.3 506.0 186.0 C 512.8 195.7 518.3 205.3 523.0 215.0 C 527.7 224.7 531.0 234.3 534.0 244.0 C 537.0 253.7 539.2 263.3 541.0 273.0 C 542.8 282.7 544.3 292.3 545.0 302.0 C 545.7 311.7 545.5 321.3 545.0 331.0 C 544.5 340.7 543.7 350.3 542.0 360.0 C 540.3 369.7 538.2 379.3 535.0 389.0 C 531.8 398.7 527.7 408.3 523.0 418.0 C 518.3 427.7 510.5 440.2 507.0 447.0 C 503.5 453.8 502.8 457.0 502.0 459.0";
const PATH_UPPER_TEARDROP = "ur";

interface IntroPreloaderProps {
  onComplete?: () => void;
}

export default function IntroPreloader({ onComplete }: IntroPreloaderProps) {
  // Stages: 'drawing' -> 'revealing' (smooth zoom & fadeout to homepage) -> 'done' (unmounted)
  const [stage, setStage] = useState<'drawing' | 'revealing' | 'done'>('drawing');

  useEffect(() => {
    // 1. Line drawing animation finishes at ~2.2s
    const revealTimer = setTimeout(() => {
      setStage('revealing');
    }, 2200);

    // 2. Fadeout transition completes at 3.1s, revealing homepage
    const doneTimer = setTimeout(() => {
      setStage('done');
      onComplete?.();
    }, 3100);

    return () => {
      clearTimeout(revealTimer);
      clearTimeout(doneTimer);
    };
  }, [onComplete]);

  // Click anywhere to skip directly to homepage transition
  const handleSkip = () => {
    if (stage === 'drawing') {
      setStage('revealing');
      setTimeout(() => {
        setStage('done');
        onComplete?.();
      }, 700);
    }
  };

  if (stage === 'done') {
    return null;
  }

  const isRevealing = stage === 'revealing';

  return (
    <div
      onClick={handleSkip}
      className={`fixed inset-0 z-[99999] flex items-center justify-center bg-[#faf7f2] cursor-pointer select-none transition-opacity ease-out ${
        isRevealing ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
      style={{
        transitionDuration: '900ms',
      }}
      aria-label="PillVox Intro"
      role="dialog"
      aria-modal="true"
    >
      <style jsx>{`
        @keyframes drawRibbonStroke {
          0% {
            stroke-dashoffset: 2600;
            opacity: 0;
          }
          8% {
            opacity: 1;
          }
          100% {
            stroke-dashoffset: 0;
            opacity: 1;
          }
        }

        @keyframes drawTeardropStroke {
          0% {
            stroke-dashoffset: 700;
            opacity: 0;
          }
          8% {
            opacity: 1;
          }
          100% {
            stroke-dashoffset: 0;
            opacity: 1;
          }
        }

        .emblem-ribbon {
          stroke: #b88a75;
          stroke-width: 11;
          stroke-linecap: round;
          stroke-linejoin: round;
          fill: none;
          stroke-dasharray: 2600;
          stroke-dashoffset: 2600;
          animation: drawRibbonStroke 2.1s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }

        .emblem-teardrop {
          stroke: #b88a75;
          stroke-width: 11;
          stroke-linecap: round;
          stroke-linejoin: round;
          fill: none;
          stroke-dasharray: 700;
          stroke-dashoffset: 700;
          animation: drawTeardropStroke 1.7s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }
      `}</style>

      {/* Center animated emblem with refined compact size */}
      <div
        className={`transform transition-all duration-800 ease-out ${
          isRevealing ? 'scale-110 opacity-0' : 'scale-100 opacity-100'
        }`}
      >
        <svg
          viewBox="20 20 544 940"
          className="w-20 h-32 sm:w-24 sm:h-40 md:w-28 md:h-48 drop-shadow-sm"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Inner Teardrop Loops: Drawing smoothly first */}
          <path className="emblem-teardrop" d={PATH_LOWER_TEARDROP} />
          <path className="emblem-teardrop" d={PATH_UPPER_TEARDROP} />

          {/* Sweeping Ribbons: Intertwined central diagonal & pointed arches */}
          <path className="emblem-ribbon" d={PATH_LOWER_RIBBON} />
          <path className="emblem-ribbon" d={PATH_UPPER_RIBBON} />
        </svg>
      </div>
    </div>
  );
}
