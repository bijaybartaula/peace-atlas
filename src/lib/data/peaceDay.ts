export interface PeaceDayTheme {
  year: number;
  theme: string;
  note: string;
}

// Curated from UN observance pages. 2026 theme is dated and marked provisional:
// update from https://www.un.org/en/observances/international-day-peace each year.
export const peaceDayThemes: PeaceDayTheme[] = [
  { year: 2015, theme: "Partnerships for Peace – Dignity for All", note: " linked to the newly adopted 2030 Agenda." },
  { year: 2016, theme: "The Sustainable Development Goals: Building Blocks for Peace", note: "" },
  { year: 2017, theme: "Together for Peace: Respect, Safety and Dignity for All", note: "Aligned with the TOGETHER refugee/migrant initiative." },
  { year: 2018, theme: "The Right to Peace", note: "70th anniversary of the UDHR." },
  { year: 2019, theme: "Climate Action for Peace", note: "" },
  { year: 2020, theme: "Shaping Peace Together", note: "UN75; first largely virtual observance during COVID-19." },
  { year: 2021, theme: "Recovering better for an equitable and sustainable world", note: "" },
  { year: 2022, theme: "End racism. Build peace.", note: "" },
  { year: 2023, theme: "Actions for Peace: Our Ambition for the #GlobalGoals", note: "" },
  { year: 2024, theme: "Cultivating a Culture of Peace", note: "25th anniversary of the UN Declaration and Programme of Action on a Culture of Peace (1999)." },
  { year: 2025, theme: "Act Now for a Peaceful World", note: "As published by the UN for 2025." },
  { year: 2026, theme: "Act Now for a Peaceful World — carry the work forward", note: "Provisional display: confirm the current year's theme at un.org/en/observances/international-day-peace before citing." },
];

export const currentPeaceDayYear = 2026;

export function currentTheme(): PeaceDayTheme {
  return peaceDayThemes.find((t) => t.year === currentPeaceDayYear) ?? peaceDayThemes[peaceDayThemes.length - 1];
}
