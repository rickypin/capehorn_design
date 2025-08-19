import React, { useMemo, useState } from "react";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Brush,
  ComposedChart,
  ScatterChart,
  Scatter,
  ZAxis,
  ReferenceLine,
} from "recharts";

/**
 * VISA 网络侧优先监控看板｜i18n 版本 (zh-CN / en-US)
 * - 单文件 React 组件，可在画布中直接预览
 * - 国际化：文案字典 + 语言切换 + 本地化时间/数字格式
 * - 指标：NHI（网络影响指数）/ THI（交易健康指数）+ 自动归因徽章
 */

// -----------------------------
// i18n 基础：字典 + 帮助函数
// -----------------------------
const DICT = {
  "zh-CN": {
    title: "VISA 服务 · 网络侧监控",
    region: "区域",
    txnType: "交易类型",
    timeRange: "时间窗",
    compare7d: "与过去 7 天同期对比",
    scenario: "场景",
    scenario_normal: "场景：正常",
    scenario_network: "场景：网络异常",
    scenario_app: "场景：应用异常",
    scenario_crossborder: "场景：跨境路由抖动",
    scenario_retrans: "场景：重传风暴",

    nhi: "NHI 网络影响",
    thi: "THI 交易健康",

    card_latency: "端到端延迟 P50/P95/P99 (ms)",
    filterable: "可刷选",
    card_loss_retrans: "丢包率 / TCP 重传率 (%)",
    dual_axis: "双轴",
    card_bitrate_conn: "入/出站比特率 + 并发连接数",
    area_line: "面积+线",

    kpi_title: "交易验证区（KPI 与返回码分布）",
    legend_hint: "点击图例可高亮",
    req: "请求数 (rps)",
    succRate: "成功率 (%)",
    respP95: "响应时间 P95 (ms)",
    errRate: "错误率 (5xx+超时, %)",
    latest: "最新",

    success: "成功",
    fourxx: "4xx",
    fivexx: "5xx",
    timeout: "超时",

    corr_title_1: "成功率 vs 网络延迟（双轴诊断）",
    corr_read_1: "读法：成功率下行且 RTT 上行 → 网络疑似；成功率下行且 RTT 平稳 → 应用/依赖疑似。",

    corr_title_2: "响应时间 P95 vs 丢包率（散点诊断）",
    corr_read_2: "读法：右上象限为网络传输瓶颈；气泡越大表示重传率越高。",

    bar_title: "返回码 × 响应时间（简化箱线-均值图）",
    bar_hint: "用于判断 5xx/超时类型",
    weighted_avg: "加权均值 P95 (ms)",

    footer: "单页原型，仅演示交互逻辑与组合读法。指标阈值、权重可在真实环境中调整。",

    badge_net: "网络疑似",
    badge_app: "应用/依赖疑似",
    badge_cross: "疑似跨境路由抖动",
    badge_retrans: "疑似异常流量/重传风暴",

    GLOBAL: "GLOBAL",
    APAC: "APAC",
    EMEA: "EMEA",
    AMER: "AMER",

    AUTH: "AUTH",
    CAPTURE: "CAPTURE",
    REFUND: "REFUND",

    r5: "5 分钟",
    r15: "15 分钟",
    r60: "1 小时",
    r1440: "24 小时",
  },
  "en-US": {
    title: "VISA Service · Network Monitoring",
    region: "Region",
    txnType: "Txn Type",
    timeRange: "Time Range",
    compare7d: "Compare with same time 7d ago",
    scenario: "Scenario",
    scenario_normal: "Scenario: Normal",
    scenario_network: "Scenario: Network Incident",
    scenario_app: "Scenario: App/Dependency Incident",
    scenario_crossborder: "Scenario: Cross-border Jitter",
    scenario_retrans: "Scenario: Retransmission Storm",

    nhi: "NHI Network Impact",
    thi: "THI Transaction Health",

    card_latency: "End-to-end Latency P50/P95/P99 (ms)",
    filterable: "Filterable",
    card_loss_retrans: "Packet Loss / TCP Retransmission (%)",
    dual_axis: "Dual Axis",
    card_bitrate_conn: "Ingress/Egress Bitrate + Concurrent Connections",
    area_line: "Area + Line",

    kpi_title: "Transaction Validation (KPIs & Response Codes)",
    legend_hint: "Click legend to highlight",
    req: "Requests (rps)",
    succRate: "Success Rate (%)",
    respP95: "Response Time P95 (ms)",
    errRate: "Error Rate (5xx+timeout, %)",
    latest: "Latest",

    success: "Success",
    fourxx: "4xx",
    fivexx: "5xx",
    timeout: "Timeout",

    corr_title_1: "Success Rate vs Network Latency (Dual Axis)",
    corr_read_1: "Guide: Success ↓ with RTT ↑ ⇒ likely Network; Success ↓ with stable RTT ⇒ likely App/Dependency.",

    corr_title_2: "Response P95 vs Packet Loss (Scatter)",
    corr_read_2: "Guide: Top-right quadrant indicates network transport bottleneck; larger bubbles = higher retransmission.",

    bar_title: "Resp Codes × Response (Weighted Mean)",
    bar_hint: "Helps distinguish 5xx vs timeout",
    weighted_avg: "Weighted Mean P95 (ms)",

    footer: "Prototype only. Thresholds/weights are adjustable in real environments.",

    badge_net: "Likely Network",
    badge_app: "Likely App/Dependency",
    badge_cross: "Likely Cross-border Routing Jitter",
    badge_retrans: "Suspected Abnormal Traffic/ Retrans Storm",

    GLOBAL: "GLOBAL",
    APAC: "APAC",
    EMEA: "EMEA",
    AMER: "AMER",

    AUTH: "AUTH",
    CAPTURE: "CAPTURE",
    REFUND: "REFUND",

    r5: "5 min",
    r15: "15 min",
    r60: "1 h",
    r1440: "24 h",
  },
};

function useI18n(initial = "zh-CN") {
  const [locale, setLocale] = useState(initial);
  const dict = DICT[locale] || DICT["en-US"];
  const t = (k) => dict[k] ?? k;
  const nfmt = (v, opts) => new Intl.NumberFormat(locale, opts).format(v);
  const tfmt = (ts) => new Date(ts).toLocaleTimeString(locale, { hour: "2-digit", minute: "2-digit" });
  return { locale, setLocale, t, nfmt, tfmt };
}

// -----------------------------
// 小型 UI 原子（无外部依赖）
// -----------------------------
const Card = ({ title, extra, children, className = "" }) => (
  <div className={`rounded-2xl shadow-sm border border-gray-200 bg-white ${className}`}>
    {(title || extra) && (
      <div className="flex items-center justify-between px-4 py-2 border-b border-gray-100">
        <div className="font-medium text-gray-800">{title}</div>
        <div>{extra}</div>
      </div>
    )}
    <div className="p-4">{children}</div>
  </div>
);

const Badge = ({ children, color = "gray" }) => {
  const map = {
    gray: "bg-gray-100 text-gray-700 border-gray-200",
    green: "bg-green-100 text-green-700 border-green-200",
    orange: "bg-amber-100 text-amber-700 border-amber-200",
    red: "bg-rose-100 text-rose-700 border-rose-200",
    blue: "bg-blue-100 text-blue-700 border-blue-200",
    purple: "bg-purple-100 text-purple-700 border-purple-200",
  };
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 text-sm rounded-full border ${map[color]}`}>
      {children}
    </span>
  );
};

const Toggle = ({ checked, onChange, label }) => (
  <label className="inline-flex items-center gap-2 cursor-pointer select-none">
    <input type="checkbox" className="peer hidden" checked={checked} onChange={(e) => onChange(e.target.checked)} />
    <span className={`w-10 h-6 rounded-full transition bg-gray-300 relative after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:w-5 after:h-5 after:bg-white after:rounded-full after:transition peer-checked:bg-blue-500 peer-checked:after:translate-x-4`}></span>
    <span className="text-sm text-gray-700">{label}</span>
  </label>
);

const Progress = ({ value, color = "green" }) => (
  <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
    <div
      className={`h-full ${
        color === "green"
          ? "bg-green-500"
          : color === "orange"
          ? "bg-amber-500"
          : "bg-rose-500"
      }`}
      style={{ width: `${Math.max(0, Math.min(100, value))}%` }}
    />
  </div>
);

// -----------------------------
// 数据与指标计算
// -----------------------------
function genSeries({ minutes = 60, scenario = "normal", tfmt }) {
  const now = Date.now();
  const points = [];
  let baseRtt = 120; // ms P95
  let baseLoss = 0.1; // %
  let baseRetrans = 1.0; // %
  let baseConn = 800;
  let baseIn = 180; // Mbps
  let baseOut = 120; // Mbps
  let baseReq = 300; // rps
  let baseSucc = 99.7; // %
  let baseResp = 350; // ms P95
  let baseErr = 0.2; // % (5xx+timeout)

  for (let i = minutes; i >= 0; i--) {
    const ts = now - i * 60 * 1000;
    const pulse = Math.sin((i / 10) * Math.PI) * 0.5 + Math.random() * 0.2;

    // 基线抖动
    let rtt = baseRtt * (1 + 0.05 * pulse);
    let loss = baseLoss * (1 + 0.5 * Math.max(0, pulse));
    let retrans = baseRetrans * (1 + 0.4 * Math.max(0, pulse));
    let conn = baseConn * (1 + 0.1 * pulse);
    let inMbps = baseIn * (1 + 0.2 * pulse);
    let outMbps = baseOut * (1 + 0.2 * pulse);

    let req = baseReq * (1 + 0.15 * pulse);
    let succ = baseSucc - 0.05 * Math.max(0, pulse);
    let resp = baseResp * (1 + 0.08 * pulse);
    let err = baseErr * (1 + 0.3 * Math.max(0, pulse));

    // 情景注入异常
    if (scenario === "network") {
      if (i < 20 && i > 8) {
        rtt *= 1.6; // 延迟上升
        loss += 0.6; // 百分点
        retrans *= 2.5;
        resp *= 1.4;
        succ -= 1.0; // 成功率下降
        err *= 3.0;
      }
    }

    if (scenario === "app") {
      if (i < 20 && i > 8) {
        resp *= 1.6;
        succ -= 1.5;
        err *= 4.0;
        // 网络保持稳定
      }
    }

    if (scenario === "crossborder") {
      if (i < 30 && i > 12) {
        rtt *= 1.8;
        loss += 0.4;
        retrans *= 1.8;
        succ -= 0.6;
        // 比特率变化不大
      }
    }

    if (scenario === "retransStorm") {
      if (i < 25 && i > 5) {
        outMbps *= 1.8;
        inMbps *= 2.0;
        conn *= 1.6;
        retrans *= 3.5;
        // 请求数基本不变
        succ -= 0.7;
        resp *= 1.2;
      }
    }

    // 返回码分布（凭借成功率/错误率推分）
    const successRate = Math.max(95, Math.min(100, succ));
    const errorRate = Math.max(0.05, err); // %
    const timeoutRate = Math.max(0, scenario === "network" || scenario === "crossborder" ? errorRate * 0.4 : errorRate * 0.2);
    const fiveXXRate = Math.max(0, scenario === "app" ? errorRate * 0.6 : errorRate * 0.4);
    const fourXXRate = Math.max(0, errorRate - timeoutRate - fiveXXRate);

    points.push({
      ts,
      time: tfmt(ts),
      rtt: +rtt.toFixed(1),
      loss: +loss.toFixed(2),
      retrans: +retrans.toFixed(2),
      conn: Math.round(conn),
      inMbps: +inMbps.toFixed(1),
      outMbps: +outMbps.toFixed(1),
      req: Math.round(req),
      successRate: +successRate.toFixed(2),
      respP95: +resp.toFixed(1),
      errorRate: +errorRate.toFixed(2),
      codeSuccess: +(100 - errorRate).toFixed(2),
      code4xx: +fourXXRate.toFixed(2),
      code5xx: +fiveXXRate.toFixed(2),
      codeTimeout: +timeoutRate.toFixed(2),
    });
  }
  return points;
}

function zscore(values, v) {
  const n = values.length;
  const mean = values.reduce((a, b) => a + b, 0) / n;
  const variance = values.reduce((a, b) => a + (b - mean) ** 2, 0) / n;
  const std = Math.sqrt(variance) || 1;
  return (v - mean) / std;
}

function calcNHI(windowPoints) {
  const rttZ = zscore(windowPoints.map((p) => p.rtt), windowPoints.at(-1).rtt);
  const lossZ = zscore(windowPoints.map((p) => p.loss), windowPoints.at(-1).loss);
  const retransZ = zscore(windowPoints.map((p) => p.retrans), windowPoints.at(-1).retrans);
  const connZ = zscore(windowPoints.map((p) => p.conn), windowPoints.at(-1).conn);
  const w1 = 0.35, w2 = 0.3, w3 = 0.2, w4 = 0.15;
  const raw = w1 * Math.max(0, rttZ) + w2 * Math.max(0, lossZ) + w3 * Math.max(0, retransZ) + w4 * Math.max(0, connZ);
  return Math.max(0, Math.min(100, 100 - 18 * raw));
}

function calcTHI(windowPoints) {
  const oneMinusSucc = 100 - windowPoints.at(-1).successRate; // 越小越好
  const p95 = windowPoints.at(-1).respP95;
  const err = windowPoints.at(-1).errorRate;
  const sZ = zscore(windowPoints.map((p) => 100 - p.successRate), oneMinusSucc);
  const pZ = zscore(windowPoints.map((p) => p.respP95), p95);
  const eZ = zscore(windowPoints.map((p) => p.errorRate), err);
  const a1 = 0.45, a2 = 0.35, a3 = 0.2;
  const raw = a1 * Math.max(0, sZ) + a2 * Math.max(0, pZ) + a3 * Math.max(0, eZ);
  return Math.max(0, Math.min(100, 100 - 20 * raw));
}

function healthColor(v) {
  if (v >= 80) return "green";
  if (v >= 60) return "orange";
  return "red";
}

function attributionBadge(nhi, thi, points, t) {
  const last = points.at(-1);
  const window = points.slice(-15); // 近15个点作对比
  const nhiPrev = calcNHI(window.slice(0, -3));
  const thiPrev = calcTHI(window.slice(0, -3));
  const nhiDrop = nhiPrev - nhi;
  const thiDrop = thiPrev - thi;

  // 额外规则依据曲线形态
  const reqFlat = Math.abs(zscore(window.map((p) => p.req), last.req)) < 0.6;
  const bitrateUp = zscore(window.map((p) => p.inMbps + p.outMbps), last.inMbps + last.outMbps) > 1.0;

  if (bitrateUp && reqFlat && zscore(window.map((p) => p.retrans), last.retrans) > 1.2) {
    return { text: t("badge_retrans"), color: "purple" };
  }

  if (thiDrop > 8 && nhiDrop > 10) return { text: t("badge_net"), color: "red" };
  if (thiDrop > 8 && Math.abs(nhiDrop) <= 5) return { text: t("badge_app"), color: "orange" };

  // 跨境：延迟阶跃 + 丢包小幅上扬
  const rttJump = zscore(window.map((p) => p.rtt), last.rtt) > 1.2;
  const lossSlight = zscore(window.map((p) => p.loss), last.loss) > 0.6;
  if (rttJump && lossSlight && thiDrop > 3) return { text: t("badge_cross"), color: "blue" };

  return null;
}

// 生成基线（简单：滑动中位数近似）
function baselineSeries(points, key) {
  const arr = points.map((p, i) => {
    const win = points.slice(Math.max(0, i - 30), Math.min(points.length, i + 30));
    const sorted = win.map((x) => x[key]).sort((a, b) => a - b);
    const mid = sorted[Math.floor(sorted.length / 2)] || points[i][key];
    return { ts: p.ts, time: p.time, value: mid };
  });
  return arr;
}

// -----------------------------
// 主组件
// -----------------------------
export default function VisaNetworkDashboard() {
  const { locale, setLocale, t, nfmt, tfmt } = useI18n("zh-CN");

  const [timeRange, setTimeRange] = useState("15m");
  const [compare, setCompare] = useState(false);
  const [scenario, setScenario] = useState("network"); // normal | network | app | crossborder | retransStorm
  const [region, setRegion] = useState("GLOBAL");
  const [txnType, setTxnType] = useState("AUTH");
  const minutes = timeRange === "5m" ? 5 : timeRange === "15m" ? 15 : timeRange === "1h" ? 60 : 240;

  const data = useMemo(() => genSeries({ minutes, scenario, tfmt }), [minutes, scenario, tfmt]);
  const windowPoints = data; // 本原型中 timeRange 即窗口
  const nhi = useMemo(() => calcNHI(windowPoints), [windowPoints]);
  const thi = useMemo(() => calcTHI(windowPoints), [windowPoints]);
  const badge = useMemo(() => attributionBadge(nhi, thi, windowPoints, t), [nhi, thi, windowPoints, t]);

  const baselines = useMemo(() => ({
    rtt: baselineSeries(windowPoints, "rtt"),
    loss: baselineSeries(windowPoints, "loss"),
    retrans: baselineSeries(windowPoints, "retrans"),
    bitrate: windowPoints.map((p) => ({ ts: p.ts, time: p.time, value: (p.inMbps + p.outMbps) * 0.9 })),
    conn: baselineSeries(windowPoints, "conn"),
    success: windowPoints.map((p) => ({ ts: p.ts, time: p.time, value: 99.7 })),
    resp: windowPoints.map((p) => ({ ts: p.ts, time: p.time, value: 350 })),
  }), [windowPoints]);

  // KPI
  const kpi = windowPoints.at(-1);

  function labelForXAxis(value) {
    return value; // 稀疏刻度由 recharts 处理
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      {/* Header */}
      <div className="sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-3 flex flex-wrap items-center gap-3">
          {/* 左侧：服务与过滤 */}
          <div className="flex items-center gap-3">
            <span className="font-semibold text-lg">{t("title")}</span>

            {/* 语言切换 */}
            <select className="px-2 py-1 border rounded-lg text-sm" value={locale} onChange={(e) => setLocale(e.target.value)} title="Language">
              <option value="zh-CN">中文</option>
              <option value="en-US">English</option>
            </select>

            <select className="px-2 py-1 border rounded-lg text-sm" value={region} onChange={(e) => setRegion(e.target.value)}>
              <option value="GLOBAL">{t("GLOBAL")}</option>
              <option value="APAC">{t("APAC")}</option>
              <option value="EMEA">{t("EMEA")}</option>
              <option value="AMER">{t("AMER")}</option>
            </select>
            <select className="px-2 py-1 border rounded-lg text-sm" value={txnType} onChange={(e) => setTxnType(e.target.value)}>
              <option>{t("AUTH")}</option>
              <option>{t("CAPTURE")}</option>
              <option>{t("REFUND")}</option>
            </select>
            <select className="px-2 py-1 border rounded-lg text-sm" value={timeRange} onChange={(e) => setTimeRange(e.target.value)}>
              <option value="5m">{t("r5")}</option>
              <option value="15m">{t("r15")}</option>
              <option value="1h">{t("r60")}</option>
              <option value="24h">{t("r1440")}</option>
            </select>
            <Toggle checked={compare} onChange={setCompare} label={t("compare7d")} />
          </div>

          {/* 右侧：健康条 + 徽章 */}
          <div className="ml-auto flex items-center gap-4">
            <div className="w-56">
              <div className="flex items-center justify-between text-sm mb-1"><span>{t("nhi")}</span><span className={`font-semibold text-${healthColor(nhi) === "green" ? "green" : healthColor(nhi) === "orange" ? "amber" : "rose"}-600`}>{nfmt(nhi, { maximumFractionDigits: 0 })}</span></div>
              <Progress value={nhi} color={healthColor(nhi)} />
            </div>
            <div className="w-56">
              <div className="flex items-center justify-between text-sm mb-1"><span>{t("thi")}</span><span className={`font-semibold text-${healthColor(thi) === "green" ? "green" : healthColor(thi) === "orange" ? "amber" : "rose"}-600`}>{nfmt(thi, { maximumFractionDigits: 0 })}</span></div>
              <Progress value={thi} color={healthColor(thi)} />
            </div>
            <Badge color={badge.color}>{badge.text}</Badge>
            <select className="px-2 py-1 border rounded-lg text-sm" value={scenario} onChange={(e) => setScenario(e.target.value)} title={t("scenario")}>
              <option value="normal">{t("scenario_normal")}</option>
              <option value="network">{t("scenario_network")}</option>
              <option value="app">{t("scenario_app")}</option>
              <option value="crossborder">{t("scenario_crossborder")}</option>
              <option value="retransStorm">{t("scenario_retrans")}</option>
            </select>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-4 space-y-4">
        {/* 网络健康区 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <Card title={t("card_latency")} extra={<span className="text-sm text-gray-500">{t("filterable")}</span>}>
            <div className="h-56">
              <ResponsiveContainer>
                <ComposedChart data={windowPoints} syncId="main">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" interval="preserveStartEnd"/>
                  <YAxis yAxisId="left" orientation="left" />
                  <Tooltip />
                  <Line yAxisId="left" type="monotone" dataKey="rtt" stroke="#6366f1" name="P95 RTT" dot={false} strokeWidth={2} />
                  {compare && (
                    <Line yAxisId="left" type="monotone" data={baselines.rtt} dataKey="value" stroke="#a5b4fc" name="Baseline" dot={false} strokeDasharray="4 4" />
                  )}
                  <Brush dataKey="time" height={20} stroke="#94a3b8" travellerWidth={10} />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <Card title={t("card_loss_retrans")} extra={<span className="text-sm text-gray-500">{t("dual_axis")}</span>}>
            <div className="h-56">
              <ResponsiveContainer>
                <ComposedChart data={windowPoints} syncId="main">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" interval="preserveStartEnd"/>
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip />
                  <Line yAxisId="left" type="monotone" dataKey="loss" stroke="#f59e0b" name="Loss %" dot={false} />
                  <Line yAxisId="right" type="monotone" dataKey="retrans" stroke="#ef4444" name="Retrans %" dot={false} />
                  {compare && (
                    <Line yAxisId="left" type="monotone" data={baselines.loss} dataKey="value" stroke="#fde68a" name="Baseline (Loss)" dot={false} strokeDasharray="3 3" />
                  )}
                  <Brush dataKey="time" height={20} stroke="#94a3b8" travellerWidth={10} />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <Card title={t("card_bitrate_conn")} extra={<span className="text-sm text-gray-500">{t("area_line")}</span>}>
            <div className="h-56">
              <ResponsiveContainer>
                <ComposedChart data={windowPoints} syncId="main">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" interval="preserveStartEnd"/>
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip />
                  <Area yAxisId="left" type="monotone" dataKey="inMbps" stackId="1" name="Ingress Mbps" fill="#bfdbfe" stroke="#60a5fa" />
                  <Area yAxisId="left" type="monotone" dataKey="outMbps" stackId="1" name="Egress Mbps" fill="#c7d2fe" stroke="#818cf8" />
                  <Line yAxisId="right" type="monotone" dataKey="conn" name="Concurrent" stroke="#10b981" dot={false} />
                  {compare && (
                    <Line yAxisId="left" type="monotone" data={baselines.bitrate} dataKey="value" stroke="#93c5fd" name="Baseline (Mbps)" dot={false} strokeDasharray="4 4" />
                  )}
                  <Brush dataKey="time" height={20} stroke="#94a3b8" travellerWidth={10} />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>

        {/* 交易验证区 */}
        <div className="grid grid-cols-1 gap-4">
          <Card title={t("kpi_title")} extra={<span className="text-sm text-gray-500">{t("legend_hint")}</span>}>
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
              <div>
                <div className="text-sm text-gray-500 mb-1">{t("req")}</div>
                <div className="text-2xl font-semibold">{nfmt(kpi.req)}</div>
                <div className="text-xs text-gray-500">{t("latest")}</div>
              </div>
              <div>
                <div className="text-sm text-gray-500 mb-1">{t("succRate")}</div>
                <div className="text-2xl font-semibold">{kpi.successRate.toFixed(2)}</div>
                <div className="text-xs text-gray-500">{t("latest")}</div>
              </div>
              <div>
                <div className="text-sm text-gray-500 mb-1">{t("respP95")}</div>
                <div className="text-2xl font-semibold">{kpi.respP95.toFixed(0)}</div>
                <div className="text-xs text-gray-500">{t("latest")}</div>
              </div>
              <div>
                <div className="text-sm text-gray-500 mb-1">{t("errRate")}</div>
                <div className="text-2xl font-semibold">{kpi.errorRate.toFixed(2)}</div>
                <div className="text-xs text-gray-500">{t("latest")}</div>
              </div>
            </div>

            <div className="h-56 mt-4">
              <ResponsiveContainer>
                <BarChart data={windowPoints} syncId="main">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" interval="preserveStartEnd"/>
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="codeSuccess" stackId="codes" name={t("success")} fill="#10b981" />
                  <Bar dataKey="code4xx" stackId="codes" name={t("fourxx")} fill="#f59e0b" />
                  <Bar dataKey="code5xx" stackId="codes" name={t("fivexx")} fill="#ef4444" />
                  <Bar dataKey="codeTimeout" stackId="codes" name={t("timeout")} fill="#6366f1" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>

        {/* 关联诊断区 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card title={t("corr_title_1")}>
            <div className="h-56">
              <ResponsiveContainer>
                <ComposedChart data={windowPoints} syncId="main">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" interval="preserveStartEnd"/>
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip />
                  <Line yAxisId="left" type="monotone" dataKey="successRate" stroke="#10b981" name="Success %" dot={false} />
                  <Line yAxisId="right" type="monotone" dataKey="rtt" stroke="#6366f1" name="P95 RTT" dot={false} />
                  <ReferenceLine yAxisId="left" y={99.5} stroke="#0ea5e9" strokeDasharray="4 4" />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
            <div className="text-xs text-gray-500 mt-2">{t("corr_read_1")}</div>
          </Card>

          <Card title={t("corr_title_2")}>
            <div className="h-56">
              <ResponsiveContainer>
                <ScatterChart syncId="main">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" dataKey="loss" name="Loss %" domain={[0, 'dataMax + 0.5']} />
                  <YAxis type="number" dataKey="respP95" name="P95 (ms)" />
                  <ZAxis type="number" dataKey="retrans" range={[60, 200]} name="Retrans % (bubble)" />
                  <Tooltip cursor={{ strokeDasharray: "3 3" }} />
                  <Scatter name="t" data={windowPoints} fill="#ef4444" />
                </ScatterChart>
              </ResponsiveContainer>
            </div>
            <div className="text-xs text-gray-500 mt-2">{t("corr_read_2")}</div>
          </Card>
        </div>

        <div className="grid grid-cols-1 gap-4">
          <Card title={t("bar_title")} extra={<span className="text-sm text-gray-500">{t("bar_hint")}</span>}>
            <div className="h-56">
              <ResponsiveContainer>
                <ComposedChart data={[
                  { name: t("success"), avg: avg(windowPoints, 'respP95', 'codeSuccess') },
                  { name: t("fourxx"), avg: avg(windowPoints, 'respP95', 'code4xx') },
                  { name: t("fivexx"), avg: avg(windowPoints, 'respP95', 'code5xx') },
                ]}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="avg" name={t("weighted_avg")} fill="#6366f1" />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
            <div className="text-xs text-gray-500 mt-2">{t("footer")}</div>
          </Card>
        </div>

        <div className="pb-10 text-xs text-gray-500 text-center">{t("footer")}</div>
      </div>
    </div>
  );
}

function avg(points, valueKey, weightKey) {
  let wsum = 0, vsum = 0;
  for (const p of points) {
    const w = Math.max(0.0001, p[weightKey]);
    wsum += w;
    vsum += p[valueKey] * w;
  }
  return +(vsum / wsum).toFixed(1);
}
