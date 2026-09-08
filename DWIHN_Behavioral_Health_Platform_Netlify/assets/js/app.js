/*
      Lumenore adaptation notes
      -------------------------
      1. This prototype is dependency-free HTML/CSS/JavaScript so its components can be
         split directly across Lumenore's HTML, CSS, and JavaScript custom-code editors.
      2. Never create a global variable called `data`; Lumenore reserves it for chart variables.
      3. Replace ZS_MODEL.demo values with the configured variables exposed as data.<variable>.
      4. emitDrill() already calls clickPoint(...) when Lumenore provides that function.
    */

    const PLATFORM_MODULES = [
      {
        id: "executive",
        name: "Executive Intelligence",
        short: "EI",
        active: true,
        pageTitle: "DWIHN Behavioral Health Executive Intelligence",
        subtitle: "Executive landing page · connected system performance",
        purpose: "Provides executive leadership with a role-specific view of behavioral health system performance, population trends, program outcomes, and emerging areas requiring attention. Personalized executive dashboards are configured by role at login and include geographic intelligence and an Executive Brief."
      },
      {
        id: "population",
        name: "Population Analytics",
        short: "PA",
        pageTitle: "DWIHN Population Analytics",
        subtitle: "Population cohorts · utilization patterns · care gaps",
        purpose: "Organizes residents into population cohorts based on patterns of interaction across behavioral health, emergency medical, and justice systems. Provides a population-level view of service utilization, care gaps, and opportunities for earlier or more coordinated intervention."
      },
      {
        id: "program",
        name: "Program Analytics",
        short: "PG",
        pageTitle: "DWIHN Program Analytics",
        subtitle: "Program reach · continuity · outcome comparison",
        purpose: "Measures the effectiveness of behavioral health and community programs by evaluating resident outcomes, service utilization patterns, and changes in crisis activity over time. Supports comparative analysis across participating programs, agencies, populations, demographic groups, and geographic areas using the available cross-system data."
      },
      {
        id: "geographic",
        name: "Geographic Intelligence",
        short: "GI",
        pageTitle: "DWIHN Geographic Intelligence",
        subtitle: "Hotspots · service gaps · equity · community priorities",
        purpose: "Visualizes behavioral health needs, program performance, service coverage, and outcome trends across Wayne County and Detroit, enabling leadership to identify geographic disparities, emerging hotspots, and areas requiring additional investment."
      },
      {
        id: "member360",
        name: "Resident Journey Analysis (Member 360 View)",
        short: "360",
        pageTitle: "DWIHN Resident Journey · Member 360",
        subtitle: "Authorized longitudinal cross-system evidence",
        purpose: "Provides a longitudinal, cross-system view of an individual's behavioral health journey, including system interactions, engagement history, and service gaps. Enables authorized users to understand the sequence of events leading to crisis and identify opportunities for earlier, more coordinated intervention. Provides resident-level evidence that supports insights identified through population and program analytics."
      },
      {
        id: "fiscal",
        name: "Fiscal Impact",
        short: "FI",
        pageTitle: "DWIHN Fiscal Impact",
        subtitle: "Directional utilization and investment estimates",
        purpose: "Demonstrates the operational and financial impact of behavioral health programs using configurable unit costs and directional estimates. Helps leadership understand how improvements in resident outcomes translate into more effective stewardship of public resources. Fiscal indicators are activated as agency cost assumptions are validated."
      },
      {
        id: "zero-suicide",
        name: "Zero Suicide Analytics",
        short: "ZS",
        pageTitle: "DWIHN Zero Suicide Dashboard",
        subtitle: "Prevention-to-recovery performance command center",
        purpose: "Measures the effectiveness of suicide prevention initiatives across the continuum of care, from screening and risk identification through crisis intervention, outpatient engagement, follow-up, and long-term outcomes. Provides leadership with visibility into suicide prevention performance, care continuity, service quality, and opportunities to improve clinical outcomes using evidence-based performance indicators."
      }
    ];

    const ZS_MODEL = {
      months: ["Sep", "Oct", "Nov", "Dec", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug"],
      screening: [64, 66, 69, 68, 72, 74, 73, 77, 79, 82, 84, 86],
      follow72: [57, 59, 60, 62, 61, 64, 66, 67, 70, 72, 75, 78],
      readmit: [18.0, 17.5, 18.2, 17.1, 16.8, 16.4, 15.9, 15.4, 14.9, 14.2, 13.7, 12.8],
      kpis: [
        { label: "Total individuals screened", value: 12486, kind: "count", delta: 8.4, chapter: "Screening", status: "low" },
        { label: "Screening rate", value: 86, kind: "percent", delta: 4.2, chapter: "Screening", status: "medium" },
        { label: "Positive screen rate", value: 26.9, kind: "percent", delta: 1.8, chapter: "Screening", status: "gap" },
        { label: "Follow-up within 72 hours", value: 78, kind: "percent", delta: 6.8, chapter: "Crisis services", status: "medium" },
        { label: "Successful transition to outpatient care", value: 72.6, kind: "percent", delta: 3.6, chapter: "Follow-up", status: "high" },
        { label: "30-day crisis readmission", value: 12.8, kind: "percent", delta: -2.1, chapter: "Readmission", status: "high", alert: true }
      ],
      funnel: [
        { label: "Individuals screened", value: 12486 },
        { label: "Positive screens", value: 3362 },
        { label: "Disposition documented", value: 3046 },
        { label: "Outpatient transition", value: 2210 },
        { label: "Follow-up within 7 days", value: 1813 }
      ],
      sla: [{ label: "24h", value: 55 }, { label: "48h", value: 68 }, { label: "72h", value: 78 }, { label: "7d", value: 86 }],
      programs: [
        { key: "bhuc", label: "Behavioral Health Urgent Care", value: 8.7 },
        { key: "outpatient", label: "Outpatient", value: 10.4 },
        { key: "inpatient", label: "Inpatient", value: 12.9 },
        { key: "mobile", label: "Mobile Crisis", value: 16.8 },
        { key: "all", label: "Other crisis pathways", value: 18.3 }
      ],
      heat: [
        { age: "0–17", values: [24, 18, 27, 21] },
        { age: "18–20", values: [32, 26, 34, 28] },
        { age: "21–25", values: [30, 25, 33, 27] },
        { age: "26–35", values: [28, 23, 31, 26] },
        { age: "36–45", values: [25, 21, 29, 24] },
        { age: "46–55", values: [22, 19, 25, 21] }
      ]
    };

    const MEASURES = [
      ["Screening", "Total individuals screened", "dbo.COPE_Adult + dbo.COPE_Children (PAR subset)", "low"],
      ["Screening", "Screening rate", "Care.VDTUnifiedClaims + screening fact needed", "medium"],
      ["Screening", "Positive screen rate", "C-SSRS / screening fact not located", "gap"],
      ["Screening", "Missed screening rate", "Encounter + screening fact needed", "gap"],
      ["Screening", "Encounter-to-screening time", "dbo.COPE_Adult + dbo.COPE_Children", "medium"],
      ["Positive response", "Positive screens routed to outpatient suicide-specific care", "Care.VDTUnifiedClaims + positive-screen fact", "medium"],
      ["Positive response", "Positive screens routed to crisis services", "Care.VDTUnifiedClaims + positive-screen fact", "medium"],
      ["Positive response", "Positive screen to disposition decision", "dbo.COPE_Adult + dbo.COPE_Children", "medium"],
      ["Outpatient care", "Referrals scheduled within 7 days", "Access Calendar not located", "gap"],
      ["Outpatient care", "Referrals completed within 7 and 30 days", "Care.VDTUnifiedClaims + referral anchor", "medium"],
      ["Outpatient care", "Members with completed Safety Plans", "Safety Plan fact not located", "gap"],
      ["Outpatient care", "Evidence-based intervention received", "Care.VDTUnifiedClaims", "high"],
      ["Outpatient care", "14-day new-member and 7/30-day post-discharge completion", "Care.VDTUnifiedClaims + Access Calendar", "medium"],
      ["Outpatient care", "30-day retention after first appointment", "Care.VDTUnifiedClaims", "high"],
      ["Crisis services", "Crisis episodes after first positive screen", "Care.VDTUnifiedClaims", "high"],
      ["Crisis services", "Positive screen to crisis-care initiation", "Care.VDTUnifiedClaims + dbo.COPE_*", "medium"],
      ["Crisis services", "Safety planning during crisis", "Claims + Safety Plan fact needed", "low"],
      ["Crisis services", "Lethal-means counseling", "Structured source not located", "gap"],
      ["Crisis services", "Follow-up within 24 hours", "Care.VDTUnifiedClaims", "medium"],
      ["Crisis services", "Follow-up within 48 hours", "Care.VDTUnifiedClaims", "medium"],
      ["Crisis services", "Follow-up within 72 hours", "Care.VDTUnifiedClaims", "medium"],
      ["Crisis services", "Follow-up within 7 days", "Care.VDTUnifiedClaims", "medium"],
      ["Follow-up", "Appointment completed within 7 days", "Access Calendar not located", "gap"],
      ["Follow-up", "Lost to follow-up within 30 days", "Care.VDTUnifiedClaims", "high"],
      ["Follow-up", "Successful transition to outpatient care", "Care.VDTUnifiedClaims", "high"],
      ["Follow-up", "Safety plan before crisis", "Safety Plan fact not located", "gap"],
      ["Follow-up", "Safety plan after crisis", "Safety Plan fact not located", "gap"],
      ["Follow-up", "Updated Safety Plan at follow-up", "Plan version history not located", "gap"],
      ["Follow-up", "Declined or missed follow-up", "Access Calendar not located", "gap"],
      ["Readmission", "30-day crisis readmission", "Care.VDTUnifiedClaims", "high"],
      ["Readmission", "30-day inpatient psychiatric readmission", "Care.VDTUnifiedClaims", "high"],
      ["Readmission", "90-day readmission trend", "Care.VDTUnifiedClaims", "high"],
      ["Readmission", "Readmissions by program/provider/location", "Claims + Provider + EQI2026ServiceDriver", "high"],
      ["Re-attempt", "Re-attempt within 30 days", "dbo.COPE_Adult + dbo.COPE_Children (proxy)", "low"],
      ["Re-attempt", "Re-attempt within 90 days", "dbo.COPE_Adult + dbo.COPE_Children (proxy)", "low"],
      ["Re-attempt", "Multiple attempts in 12 months", "dbo.COPE_Adult + dbo.COPE_Children (proxy)", "low"],
      ["Sentinel events", "Attempts classified as sentinel", "Sentinel-event fact not located", "gap"],
      ["Sentinel events", "Deaths by suicide", "Cause/manner source not located", "gap"],
      ["Sentinel events", "Sentinel events with completed RCA", "RCA source not located", "gap"],
      ["Sentinel events", "Implemented corrective actions", "Corrective-action source not located", "gap"]
    ];

    const CHAPTERS = ["All", "Screening", "Positive response", "Outpatient care", "Crisis services", "Follow-up", "Readmission", "Re-attempt", "Sentinel events"];
    const FILTER_WEIGHT = {
      program: { all: 1, bhuc: .24, mobile: .18, outpatient: .36, inpatient: .15 },
      age: { all: 1, "0-17": .17, "18-20": .06, "21-25": .09, "26-35": .18, "36-45": .17, "46-55": .15, "56-65": .11, "66-70": .04, "76+": .03 },
      gender: { all: 1, female: .51, male: .46, other: .03 },
      race: { all: 1, black: .57, white: .27, multi: .06, other: .10, hispanic: .08 },
      period: { rolling12: 1, ytd: .68, qtr: .26, month: .087 }
    };

    const MODULE_BRIEFS = {
      executive: [
        ["System signal", "Connection to care is improving.", "The connected-population rate rose while behavioral health crisis utilization declined across the rolling period."],
        ["Priority", "Three communities warrant geographic review.", "High crisis concentration and service gaps are driving the current priority ranking."],
        ["Program", "Retention varies materially by program.", "Open Program Analytics to compare enrollment, retention, conversion, and repeat crisis performance."],
        ["Evidence", "Some indicators remain dependency-led.", "Agency access, identity resolution, unit-cost validation, and clinical-documentation sources govern activation."]
      ],
      population: [["Cohort", "1,142 residents are not connected to care.", "This cohort has recent emergency or custody contact without a documented DWIHN service claim."],["Continuity", "736 residents initiated care but were not retained.", "No second qualifying claim is observed within the illustrative 60-day window."],["Context", "Cohort rules require governance.", "Identity resolution, event qualification, and mutually exclusive assignment rules must be validated before production use."]],
      program: [["Performance", "Outpatient retention leads the current comparison.", "The selected view shows the strongest continuity and lowest repeat crisis rate."],["Watch", "Mobile Crisis continuity remains below target.", "Review follow-up pathways and cohort mix before drawing a program-performance conclusion."],["Governance", "Composite weights are not yet approved.", "The Program Effectiveness Index remains illustrative until outcome indicators and weights are agreed."]],
      geographic: [["Hotspot", "ZIP 48205 ranks first in the current view.", "High crisis activity and a material service gap drive the composite priority."],["Improving", "Several communities show sustained improvement.", "Use the Community Improvement Index with local context and denominator thresholds."],["Scope", "Administrative geography changes by role.", "The SOW supports county, city, district, ZIP code, precinct, and neighborhood views."]],
      member360: [["Continuity", "The sample journey shows a follow-up gap.", "A recent crisis and outreach event are visible, but no confirmed outpatient appointment is present."],["Access", "Member 360 is role-scoped evidence.", "Individual-level data is limited to authorized operational users and all access should be logged."],["Boundary", "This module observes and measures.", "The SOW does not define intervention assignment, case management workflow, or an action queue in Member 360."]],
      fiscal: [["Direction", "Reduced crisis activity creates a modeled resource opportunity.", "The displayed values are synthetic and demonstrate how validated unit costs could be applied."],["Dependency", "Four unit-cost assumptions remain unvalidated.", "EMS, emergency department, custody, and inpatient costs require agreement with the responsible agencies."],["Use", "Fiscal outputs remain directional.", "They should not be treated as realized savings or approved financial claims until the model is governed."]],
      "zero-suicide": [["Improving", "72-hour follow-up reached 78%.", "Performance improved for the fourth consecutive month, with the remaining gap concentrated in high-volume crisis pathways."],["Watch", "30-day crisis readmission is 12.8%.", "The measure is moving in the intended direction, though program variation remains material."],["Equity", "Rates vary across demographic groups.", "Interpret differences with denominators and keep race and ethnicity as separate analytical fields."],["Data dependency", "Fourteen measures need an additional source.", "C-SSRS detail, Safety Plans, Access Calendar, lethal-means counseling, and sentinel-event governance data were not located."]]
    };

    const state = { dashboard: "executive", chapter: "All", measureChapter: "All" };
    const byId = id => document.getElementById(id);
    const fmt = new Intl.NumberFormat("en-US");

    function currentFilters() {
      return { period: byId("period").value, program: byId("program").value, age: byId("age").value, gender: byId("gender").value, race: byId("race").value };
    }

    function selectionFactor() {
      const f = currentFilters();
      return Object.keys(f).reduce((acc, key) => acc * (FILTER_WEIGHT[key][f[key]] ?? 1), 1);
    }

    function rateShift() {
      const f = currentFilters();
      const program = { all: 0, bhuc: 3.6, mobile: -4.2, outpatient: 2.1, inpatient: -1.7 }[f.program] || 0;
      const age = { all: 0, "0-17": 1.7, "18-20": -2.6, "21-25": -1.5, "26-35": -.8, "36-45": .4, "46-55": 1.2, "56-65": 2.0, "66-70": 2.4, "76+": 2.8 }[f.age] || 0;
      const gender = { all: 0, female: 1.4, male: -1.2, other: -2.1 }[f.gender] || 0;
      const race = { all: 0, black: -.7, white: 1.3, multi: -1.5, other: -2.2, hispanic: -.8 }[f.race] || 0;
      const period = { rolling12: 0, ytd: .6, qtr: 1.4, month: 2.0 }[f.period] || 0;
      return program + age + gender + race + period;
    }

    function clamp(value, min, max) { return Math.max(min, Math.min(max, value)); }
    function seriesShift(values, shift) { return values.map((value, index) => clamp(value + shift + Math.sin(index * .8) * Math.abs(shift) * .08, 0, 100)); }
    function scopeText() {
      const f = currentFilters();
      const labels = [];
      if (f.program !== "all") labels.push(byId("program").selectedOptions[0].text);
      if (f.age !== "all") labels.push(`Age ${byId("age").selectedOptions[0].text}`);
      if (f.gender !== "all") labels.push(byId("gender").selectedOptions[0].text);
      if (f.race !== "all") labels.push(byId("race").selectedOptions[0].text);
      return labels.length ? labels.join(" · ") : "All programs · all populations";
    }

    function renderModuleGrid() {
      byId("moduleGrid").innerHTML = PLATFORM_MODULES.map((module, index) => `<button class="module-card ${module.id === state.dashboard ? "active" : ""}" type="button" data-module-index="${index}" aria-label="Open ${module.name} dashboard"><span class="module-number">0${index + 1}</span><span class="module-icon">${module.short}</span><span class="module-name">${module.name}</span></button>`).join("");
      byId("moduleGrid").querySelectorAll(".module-card").forEach(card => {
        const module = PLATFORM_MODULES[Number(card.dataset.moduleIndex)];
        card.addEventListener("click", () => switchDashboard(module.id));
        bindTooltip(card, `${module.name} · open its dedicated dashboard.`);
      });
    }

    function switchDashboard(dashboardId, options = {}) {
      const module = PLATFORM_MODULES.find(item => item.id === dashboardId) || PLATFORM_MODULES[0];
      state.dashboard = module.id;
      document.querySelectorAll(".dashboard-view").forEach(view => view.classList.toggle("active", view.dataset.dashboard === module.id));
      byId("pageTitle").textContent = module.pageTitle;
      byId("pageSubtitle").textContent = module.subtitle;
      byId("moduleCountLabel").textContent = module.id === "executive" ? "Landing page" : `Module ${PLATFORM_MODULES.indexOf(module) + 1} of ${PLATFORM_MODULES.length}`;
      byId("footerModuleName").textContent = module.name;
      byId("openMeasuresTop").hidden = module.id !== "zero-suicide";
      byId("openBriefTop").textContent = module.id === "executive" ? "Executive brief" : "Module brief";
      document.title = `${module.name} · DWIHN Platform Prototype`;
      renderModuleGrid();
      if (options.updateHash !== false) history.replaceState(null, "", `#${module.id}`);
      emitDrill("Module", module.name);
      if (!options.noScroll) window.scrollTo({ top: 0, behavior: "smooth" });
    }

    function sparkPoints(values, width = 68, height = 24, pad = 2) {
      const min = Math.min(...values), max = Math.max(...values), range = max - min || 1;
      return values.map((value, index) => {
        const x = pad + index * ((width - pad * 2) / (values.length - 1));
        const y = height - pad - ((value - min) / range) * (height - pad * 2);
        return [x, y];
      });
    }

    function renderChapterNav() {
      byId("chapterNav").innerHTML = CHAPTERS.map(chapter => {
        const count = chapter === "All" ? MEASURES.length : MEASURES.filter(item => item[0] === chapter).length;
        return `<button class="chapter-btn ${chapter === state.chapter ? "active" : ""}" type="button" data-chapter="${chapter}">${chapter}<span>${count}</span></button>`;
      }).join("");
      byId("chapterNav").querySelectorAll("button").forEach(button => button.addEventListener("click", () => {
        state.chapter = button.dataset.chapter;
        renderChapterNav();
        if (state.chapter === "All") renderKpis(); else openMeasures(state.chapter);
      }));
    }

    function formatKpiValue(kpi, shift, factor) {
      if (kpi.kind === "count") return fmt.format(Math.max(1, Math.round(kpi.value * factor)));
      const adjusted = kpi.alert ? kpi.value - shift * .18 : kpi.value + shift;
      return `${clamp(adjusted, 0, 99).toFixed(Number.isInteger(kpi.value) ? 0 : 1)}%`;
    }

    function renderKpis() {
      const factor = selectionFactor();
      const shift = rateShift();
      const screeningSeries = seriesShift(ZS_MODEL.screening, shift);
      const followSeries = seriesShift(ZS_MODEL.follow72, shift);
      const readmitSeries = seriesShift(ZS_MODEL.readmit, -shift * .18);
      const sparkSeries = [ZS_MODEL.screening, screeningSeries, seriesShift(ZS_MODEL.screening.map(v => v - 55), shift * .3), followSeries, seriesShift(ZS_MODEL.follow72.map(v => v - 5), shift), readmitSeries];
      byId("kpiGrid").innerHTML = ZS_MODEL.kpis.map((kpi, index) => {
        const points = sparkPoints(sparkSeries[index]);
        const line = points.map(point => point.join(",")).join(" ");
        const area = `M ${points[0][0]},24 L ${points.map(point => point.join(",")).join(" L ")} L ${points.at(-1)[0]},24 Z`;
        const delta = kpi.alert ? kpi.delta : kpi.delta + shift * .08;
        return `<article class="kpi-card ${kpi.alert ? "alert" : ""}" tabindex="0" role="button" data-kpi-index="${index}" aria-label="Open ${kpi.label} definition">
          <div class="kpi-top"><div class="kpi-label">${kpi.label}</div><i class="kpi-dot"></i></div>
          <div class="kpi-value"><strong>${formatKpiValue(kpi, shift, factor)}</strong><small>${kpi.kind === "count" ? "people" : "rate"}</small></div>
          <div class="kpi-bottom"><span class="delta ${kpi.alert ? "down-good" : ""}">${delta >= 0 ? "↑" : "↓"} ${Math.abs(delta).toFixed(1)} pts</span><svg class="mini-spark" viewBox="0 0 68 24" aria-hidden="true"><path class="area" d="${area}"></path><polyline class="line" points="${line}"></polyline></svg></div>
        </article>`;
      }).join("");
      byId("kpiGrid").querySelectorAll(".kpi-card").forEach(card => {
        const activate = () => openMeasures(ZS_MODEL.kpis[Number(card.dataset.kpiIndex)].chapter);
        card.addEventListener("click", activate);
        card.addEventListener("keydown", event => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); activate(); } });
      });
    }

    function renderFunnel() {
      const factor = selectionFactor();
      const shift = rateShift();
      const ratios = [1, .269 + shift * .001, .906 + shift * .002, .726 + shift * .002, .82 + shift * .0015];
      const values = [];
      ZS_MODEL.funnel.forEach((item, index) => {
        if (index === 0) values[index] = Math.max(1, Math.round(item.value * factor));
        else if (index === 1) values[index] = Math.round(values[0] * clamp(ratios[index], .12, .48));
        else values[index] = Math.round(values[index - 1] * clamp(ratios[index], .5, .97));
      });
      const max = values[0];
      byId("funnel").innerHTML = ZS_MODEL.funnel.map((item, index) => {
        const overall = values[index] / max * 100;
        const stepRate = index === 0 ? 100 : values[index] / values[index - 1] * 100;
        return `<div class="funnel-row" data-stage="${item.label}" data-value="${values[index]}"><span class="funnel-label">${item.label}</span><div class="funnel-track"><div class="funnel-fill" style="width:${Math.max(3, overall)}%"></div></div><div class="funnel-rate">${fmt.format(values[index])}<small>${index === 0 ? "cohort" : `${stepRate.toFixed(1)}% step`}</small></div></div>`;
      }).join("");
      byId("flowCount").textContent = `${fmt.format(values.at(-1))} people`;
      byId("flowLoss").textContent = `${(100 - (values[3] / values[2] * 100)).toFixed(1)}% opportunity gap after disposition`;
      byId("funnel").querySelectorAll(".funnel-row").forEach(row => {
        row.addEventListener("click", event => { emitDrill("Care Path Stage", row.dataset.stage); toast(`${row.dataset.stage}: ${fmt.format(Number(row.dataset.value))} people in the selected cohort.`); });
        bindTooltip(row, `${row.dataset.stage} · click to send this stage as a dashboard filter.`);
      });
    }

    function chartPoint(value, index, count, width, height, padX = 30, padY = 15) {
      return [padX + index * ((width - padX * 2) / (count - 1)), height - padY - (value / 100) * (height - padY * 2)];
    }

    function renderTrendChart() {
      const width = 440, height = 184, shift = rateShift();
      const screening = seriesShift(ZS_MODEL.screening, shift);
      const follow = seriesShift(ZS_MODEL.follow72, shift);
      const screenPoints = screening.map((value, index) => chartPoint(value, index, screening.length, width, height));
      const followPoints = follow.map((value, index) => chartPoint(value, index, follow.length, width, height));
      const path = points => points.map((point, index) => `${index ? "L" : "M"}${point[0].toFixed(1)},${point[1].toFixed(1)}`).join(" ");
      const area = `${path(screenPoints)} L ${screenPoints.at(-1)[0]},${height - 15} L ${screenPoints[0][0]},${height - 15} Z`;
      const grid = [25, 50, 75, 100].map(value => {
        const y = chartPoint(value, 0, 2, width, height)[1];
        return `<line class="grid-line" x1="30" y1="${y}" x2="410" y2="${y}"></line><text class="axis-label" x="4" y="${y + 3}">${value}%</text>`;
      }).join("");
      const labels = ZS_MODEL.months.map((month, index) => `<text class="axis-label" x="${screenPoints[index][0]}" y="181" text-anchor="middle">${index % 2 === 0 || index === 11 ? month : ""}</text>`).join("");
      const dots = screenPoints.map((point, index) => `<circle class="chart-dot trend-dot" data-label="${ZS_MODEL.months[index]} screening" data-value="${screening[index].toFixed(1)}%" cx="${point[0]}" cy="${point[1]}" r="3.8" fill="#11b5c8"></circle>`).join("") + followPoints.map((point, index) => `<circle class="chart-dot trend-dot" data-label="${ZS_MODEL.months[index]} 72h follow-up" data-value="${follow[index].toFixed(1)}%" cx="${point[0]}" cy="${point[1]}" r="3.8" fill="#a7db57"></circle>`).join("");
      byId("trendChart").innerHTML = `<defs><linearGradient id="screenGradient" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#11b5c8" stop-opacity=".19"/><stop offset="100%" stop-color="#11b5c8" stop-opacity="0"/></linearGradient></defs>${grid}<path class="screen-area" d="${area}"></path><path class="screen-line" d="${path(screenPoints)}"></path><path class="follow-line" d="${path(followPoints)}"></path>${dots}${labels}`;
      byId("trendChart").querySelectorAll(".trend-dot").forEach(dot => bindTooltip(dot, `${dot.dataset.label}: ${dot.dataset.value}`));
    }

    function renderSla() {
      const shift = rateShift();
      const values = ZS_MODEL.sla.map(item => ({ ...item, value: clamp(item.value + shift, 0, 99) }));
      const ringValue = values[2].value;
      const circumference = 2 * Math.PI * 48;
      const ring = byId("slaRing");
      ring.style.strokeDasharray = `${circumference}`;
      ring.style.strokeDashoffset = `${circumference * (1 - ringValue / 100)}`;
      byId("slaRingValue").textContent = `${ringValue.toFixed(0)}%`;
      byId("slaBars").innerHTML = values.map(item => `<div class="sla-row"><label>${item.label}</label><div class="sla-track"><div class="sla-fill" style="width:${item.value}%"></div></div><strong>${item.value.toFixed(0)}%</strong></div>`).join("");
    }

    function renderProgramBars() {
      const shift = rateShift();
      const max = 22;
      byId("programBars").innerHTML = ZS_MODEL.programs.map((program, index) => {
        const value = clamp(program.value - shift * .18 + (index - 2) * .06, 3, 25);
        return `<div class="bar-item" data-program="${program.key}" data-label="${program.label}" data-value="${value.toFixed(1)}"><div class="bar-meta"><span>${program.label}</span><strong>${value.toFixed(1)}%</strong></div><div class="bar-track"><div class="bar-fill" style="width:${value / max * 100}%"></div></div></div>`;
      }).join("");
      byId("programBars").querySelectorAll(".bar-item").forEach(item => {
        item.addEventListener("click", () => {
          if (item.dataset.program !== "all") { byId("program").value = item.dataset.program; refresh(); }
          emitDrill("Program", item.dataset.label);
          toast(`${item.dataset.label} selected · 30-day crisis readmission ${item.dataset.value}%.`);
        });
        bindTooltip(item, `${item.dataset.label}: ${item.dataset.value}% readmission · click to filter.`);
      });
    }

    function renderHeatmap() {
      const columns = ["Black", "White", "Multi", "Other"];
      const shift = rateShift();
      const values = ZS_MODEL.heat.flatMap(row => row.values).map(value => clamp(value + shift * .35, 10, 45));
      const min = Math.min(...values), max = Math.max(...values);
      let cursor = 0;
      const rows = ZS_MODEL.heat.map(row => {
        const cells = row.values.map((_, index) => {
          const value = values[cursor++];
          const alpha = .12 + ((value - min) / (max - min || 1)) * .68;
          return `<button class="heat-cell" style="--alpha:${alpha.toFixed(2)}" type="button" data-age="${row.age}" data-group="${columns[index]}" data-value="${value.toFixed(0)}">${value.toFixed(0)}%</button>`;
        }).join("");
        return `<div class="equity-row"><label>${row.age}</label>${cells}</div>`;
      }).join("");
      byId("equityHeatmap").innerHTML = `<div class="equity-head"><span></span>${columns.map(column => `<span>${column}</span>`).join("")}</div>${rows}<div class="equity-legend"><span>Lower</span><i class="legend-block" style="--alpha:.15"></i><i class="legend-block" style="--alpha:.35"></i><i class="legend-block" style="--alpha:.55"></i><i class="legend-block" style="--alpha:.78"></i><span>Higher</span></div>`;
      byId("equityHeatmap").querySelectorAll(".heat-cell").forEach(cell => {
        cell.addEventListener("click", () => { emitDrill("Age Band", cell.dataset.age); emitDrill("Race", cell.dataset.group); toast(`${cell.dataset.age} · ${cell.dataset.group}: ${cell.dataset.value}% positive screen rate.`); });
        bindTooltip(cell, `${cell.dataset.age} · ${cell.dataset.group}: ${cell.dataset.value}%`);
      });
    }

    function updateNarrative() {
      const shift = rateShift();
      const follow = clamp(ZS_MODEL.follow72.at(-1) + shift, 0, 99);
      const readmit = clamp(ZS_MODEL.readmit.at(-1) - shift * .18, 0, 99);
      byId("heroFollowValue").textContent = `${follow.toFixed(0)}%`;
      byId("heroScope").textContent = scopeText();
      byId("heroDelta").textContent = `${(6.8 + shift * .08) >= 0 ? "+" : ""}${(6.8 + shift * .08).toFixed(1)} points vs prior quarter`;
      byId("drawerScope").textContent = `${byId("period").selectedOptions[0].text} · ${scopeText()}`;
      if (byId("insightFollow")) byId("insightFollow").textContent = `72-hour follow-up reached ${follow.toFixed(0)}%.`;
      if (byId("insightReadmit")) byId("insightReadmit").textContent = `30-day crisis readmission is ${readmit.toFixed(1)}%.`;
      const selected = currentFilters().program !== "all" || currentFilters().age !== "all" || currentFilters().gender !== "all" || currentFilters().race !== "all";
      byId("briefHeadline").textContent = selected ? "The selected cohort reveals a distinct care-continuity pattern." : "Three measures need focused attention.";
      byId("heroNarrative").textContent = selected ? `The current view is filtered to ${scopeText()}. Timely follow-up remains the leading continuity signal; interpret smaller cohorts with their denominators before acting.` : "Continuity after crisis improved while 30-day crisis readmissions continued to decline. Mobile Crisis shows the largest opportunity to close the remaining 72-hour follow-up gap.";
    }

    function renderMeasureNav() {
      byId("measureNav").innerHTML = CHAPTERS.map(chapter => {
        const count = chapter === "All" ? MEASURES.length : MEASURES.filter(item => item[0] === chapter).length;
        return `<button type="button" class="${state.measureChapter === chapter ? "active" : ""}" data-measure-chapter="${chapter}">${chapter}<span>${count}</span></button>`;
      }).join("");
      byId("measureNav").querySelectorAll("button").forEach(button => button.addEventListener("click", () => { state.measureChapter = button.dataset.measureChapter; renderMeasureNav(); renderMeasureRows(); }));
    }

    function renderMeasureRows() {
      const rows = MEASURES.map((item, index) => ({ item, index })).filter(entry => state.measureChapter === "All" || entry.item[0] === state.measureChapter);
      byId("measureCount").textContent = `${rows.length} measure${rows.length === 1 ? "" : "s"} shown`;
      byId("measureRows").innerHTML = rows.map(entry => `<div class="measure-row" tabindex="0" role="button" data-measure="${entry.item[1]}"><span class="measure-num">${String(entry.index + 1).padStart(2, "0")}</span><span class="measure-name">${entry.item[1]}</span><span class="status ${entry.item[3]}">${entry.item[3] === "gap" ? "not found" : entry.item[3]}</span><span class="measure-source" title="${entry.item[2]}">${entry.item[2]}</span></div>`).join("");
      byId("measureRows").querySelectorAll(".measure-row").forEach(row => {
        const activate = () => { emitDrill("KPI", row.dataset.measure); toast(`${row.dataset.measure} selected.`); };
        row.addEventListener("click", activate);
        row.addEventListener("keydown", event => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); activate(); } });
      });
    }

    function openMeasures(chapter = "All") {
      state.measureChapter = CHAPTERS.includes(chapter) ? chapter : "All";
      renderMeasureNav();
      renderMeasureRows();
      byId("measureModal").classList.add("open");
      document.body.style.overflow = "hidden";
      setTimeout(() => byId("measureModal").querySelector(".close-btn").focus(), 30);
    }

    function openBrief() {
      const module = PLATFORM_MODULES.find(item => item.id === state.dashboard) || PLATFORM_MODULES[0];
      const insights = MODULE_BRIEFS[module.id] || MODULE_BRIEFS.executive;
      byId("briefTitle").textContent = `${module.name} brief`;
      byId("drawerScope").textContent = `${byId("period").selectedOptions[0].text} · ${scopeText()}`;
      byId("briefDrawer").querySelector(".brief-stack").innerHTML = insights.map(insight => `<article class="insight"><div class="insight-label">${insight[0]}</div><h3>${insight[1]}</h3><p>${insight[2]}</p></article>`).join("");
      byId("briefDrawer").classList.add("open");
      document.body.style.overflow = "hidden";
      setTimeout(() => byId("briefDrawer").querySelector(".close-btn").focus(), 30);
    }

    function closeOverlay(id) {
      byId(id).classList.remove("open");
      document.body.style.overflow = "";
    }

    function emitDrill(column, value) {
      if (typeof clickPoint === "function") clickPoint({ [column]: [value] });
    }

    let toastTimer;
    function toast(message) {
      clearTimeout(toastTimer);
      byId("toastText").textContent = message;
      byId("toast").classList.add("show");
      toastTimer = setTimeout(() => byId("toast").classList.remove("show"), 2400);
    }

    function bindTooltip(element, text) {
      element.addEventListener("pointerenter", event => {
        byId("tooltip").textContent = text;
        byId("tooltip").classList.add("show");
        moveTooltip(event);
      });
      element.addEventListener("pointermove", moveTooltip);
      element.addEventListener("pointerleave", () => byId("tooltip").classList.remove("show"));
    }

    function moveTooltip(event) {
      const tip = byId("tooltip");
      const x = Math.min(window.innerWidth - 250, event.clientX + 13);
      const y = Math.min(window.innerHeight - 80, event.clientY + 13);
      tip.style.left = `${Math.max(8, x)}px`;
      tip.style.top = `${Math.max(8, y)}px`;
    }

    function renderPlatformMetrics() {
      const factor = selectionFactor();
      const shift = rateShift();
      document.querySelectorAll("[data-count-base]").forEach(element => {
        element.textContent = fmt.format(Math.max(0, Math.round(Number(element.dataset.countBase) * factor)));
      });
      document.querySelectorAll("[data-currency-base]").forEach(element => {
        const value = Number(element.dataset.currencyBase) * Math.max(.12, factor);
        element.textContent = value >= 1000000 ? `$${(value / 1000000).toFixed(2)}M` : `$${Math.round(value / 1000)}K`;
      });
      document.querySelectorAll("[data-rate-base]").forEach(element => {
        const base = Number(element.dataset.rateBase);
        const inverse = element.dataset.direction === "inverse";
        const value = base + (inverse ? -shift : shift) * .28;
        if (element.dataset.unit === "score") element.textContent = `${Math.round(clamp(value, 0, 100))}`;
        else if (element.dataset.unit === "multiplier") element.textContent = `${Math.max(0, value).toFixed(1)}×`;
        else if (element.dataset.signed === "true") element.textContent = `${value > 0 ? "+" : value < 0 ? "−" : ""}${Math.abs(value).toFixed(1)}%`;
        else element.textContent = `${clamp(value, 0, 100).toFixed(1)}%`;
      });
    }

    function refresh() {
      renderPlatformMetrics();
      renderKpis();
      renderFunnel();
      renderTrendChart();
      renderSla();
      renderProgramBars();
      renderHeatmap();
      updateNarrative();
    }

    document.querySelectorAll("select").forEach(select => select.addEventListener("change", () => { refresh(); toast(`Dashboard updated · ${scopeText()}.`); }));
    byId("resetFilters").addEventListener("click", () => {
      document.querySelectorAll("select").forEach(select => select.selectedIndex = 0);
      refresh();
      toast("All filters reset.");
    });
    byId("openMeasuresTop").addEventListener("click", () => openMeasures("All"));
    byId("openMeasuresReadiness").addEventListener("click", () => openMeasures("All"));
    byId("openBriefTop").addEventListener("click", openBrief);
    byId("openBriefCard").addEventListener("click", openBrief);
    document.querySelectorAll("[data-dashboard-link]").forEach(button => button.addEventListener("click", () => switchDashboard(button.dataset.dashboardLink)));
    document.querySelectorAll("[data-open-measures]").forEach(button => button.addEventListener("click", () => openMeasures(button.dataset.openMeasures)));
    document.querySelectorAll("[data-close]").forEach(button => button.addEventListener("click", () => closeOverlay(button.dataset.close)));
    [byId("briefDrawer"), byId("moduleDrawer"), byId("measureModal")].forEach(overlay => overlay.addEventListener("click", event => { if (event.target === overlay) closeOverlay(overlay.id); }));
    document.addEventListener("keydown", event => {
      if (event.key === "Escape") {
        if (byId("measureModal").classList.contains("open")) closeOverlay("measureModal");
        else if (byId("moduleDrawer").classList.contains("open")) closeOverlay("moduleDrawer");
        else if (byId("briefDrawer").classList.contains("open")) closeOverlay("briefDrawer");
      }
    });

    const requestedDashboard = location.hash.replace("#", "");
    if (PLATFORM_MODULES.some(module => module.id === requestedDashboard)) state.dashboard = requestedDashboard;
    switchDashboard(state.dashboard, { updateHash: false, noScroll: true });
    renderChapterNav();
    renderMeasureNav();
    renderMeasureRows();
    refresh();
    window.addEventListener("hashchange", () => {
      const dashboardId = location.hash.replace("#", "");
      if (PLATFORM_MODULES.some(module => module.id === dashboardId) && dashboardId !== state.dashboard) switchDashboard(dashboardId, { updateHash: false });
    });
