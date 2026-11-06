'use client';

import { Link } from "lucide-react";

export default function BookButton() {
  return (
      <button className="btn">
        <span className="text">Book Appointment</span>

        <div className="arrow">
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="black"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="7" y1="17" x2="17" y2="7" />
            <polyline points="7 7 17 7 17 17" />
          </svg>
        </div>
      </button>

  );
}
