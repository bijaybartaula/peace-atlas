import type { Metadata } from "next";
import { peaceDayThemes, currentPeaceDayYear, currentTheme } from "@/lib/data/peaceDay";

export const metadata: Metadata = {
  title: "International Day of Peace — 21 September",
  description:
    "Why 21 September exists: the 1981 establishment, the 2001 cease-fire designation, annual themes, observance practice, and source records.",
};

export default function PeaceDayPage() {
  const theme = currentTheme();
  return (
    <div>
      <p className="meta">Permanent page for the observance itself</p>
      <h1 className="display" style={{ fontSize: "2.4rem" }}>International Day of Peace — 21 September</h1>
      <div className="card">
        <p className="meta">{currentPeaceDayYear} theme (dated)</p>
        <h2 className="display" style={{ margin: 0 }}>{theme.theme}</h2>
        <p>{theme.note} Confirm at the <a href="https://www.un.org/en/observances/international-day-peace">UN observance page</a>. Campaign material must not overwhelm this permanent resource.</p>
      </div>
      <hr className="rule" />
      <h2 className="display">Why 21 September exists</h2>
      <p><strong>1981 — established.</strong> General Assembly Resolution 36/67 (30 Nov 1981) created an International Day of Peace, first observed on the opening day of the Assembly session (third Tuesday of September). <a href="https://digitallibrary.un.org/record/25071">Resolution record</a>.</p>
      <p><strong>2001 — fixed and deepened.</strong> Resolution 55/282 fixed 21 September and declared it a day of global cease-fire and non-violence. Text dated 7 Sept, adopted 28 Sept 2001 — weeks after 9/11. <a href="https://digitallibrary.un.org/record/444973">Resolution record</a>.</p>
      <p><strong>Observance:</strong> Peace Bell ceremony at UN Headquarters, Secretary-General message, and educational events worldwide. Humanitarian pauses have been called in its name with uneven compliance — a norm, not an enforced truce.</p>
      <p>Follow the thread: <a href="/events#peace-day-established-1981">1981 establishment</a> · <a href="/events#peace-day-ceasefire-2001">2001 designation</a> · <a href="/documents#ga-res-36-67">Res. 36/67</a> · <a href="/documents#ga-res-55-282">Res. 55/282</a> · <a href="/timeline#tl-peaceday01">timeline</a>.</p>
      <hr className="rule" />
      <h2 className="display">Annual themes (dated archive)</h2>
      <div className="table-scroll">
      <table className="timeline"><tbody>
        {[...peaceDayThemes].sort((a, b) => b.year - a.year).map((t) => (
          <tr key={t.year}><td><span className="meta">{t.year}</span></td><td><strong>{t.theme}</strong><br /><span style={{ fontSize: ".9rem" }}>{t.note}</span></td></tr>
        ))}
      </tbody></table>
      </div>
      <p style={{ fontSize: ".9rem" }}>Themes sourced from the UN observance page; the {currentPeaceDayYear} line is provisional until confirmed at un.org each September.</p>
    </div>
  );
}
