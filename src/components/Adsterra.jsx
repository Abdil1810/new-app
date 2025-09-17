import { useEffect } from "react";

const adUnits = [
  { id: "ad-1", type: "adsterra", key: "41da71c2380add686b1797ca553636f", width: 300, height: 250 },
  { id: "ad-2", type: "adsterra", key: "fed995b4f74dfc04c8737b39d647ea10", width: 728, height: 90 },
  { id: "ad-3", type: "adsterra", key: "5320f758d5e80b9f31be23e82306a82f", width: 468, height: 60 },
  { id: "ad-4", type: "revenuecpm", src: "//pl27645538.revenuecpmgate.com/c14a4d8dcd271333575bfc4cd68ef286/invoke.js", width: 468, height: 60 },
  { id: "ad-5", type: "adsterra", key: "1afbf9a51367bd12a2a668c5e170659f", width: 160, height: 300 },
];

function AdSlot({ unit }) {
  useEffect(() => {
    const container = document.getElementById(unit.id);
    if (!container) return;

    if (unit.type === "adsterra") {
      const iframe = document.createElement("iframe");
      iframe.width = "100%"; // responsive width
      iframe.height = unit.height;
      iframe.style.border = "none";
      iframe.style.overflow = "hidden";
      iframe.style.maxWidth = `${unit.width}px`; // tetap maksimal sesuai unit

      const html = `
        <html>
          <head><meta name="referrer" content="no-referrer-when-downgrade"></head>
          <body style="margin:0;padding:0;overflow:hidden;">
            <script type="text/javascript">
              window.atOptions = {
                'key' : '${unit.key}',
                'format' : 'iframe',
                'height' : ${unit.height},
                'width' : ${unit.width},
                'params' : {}
              };
            </script>
            <script src="//www.highperformanceformat.com/${unit.key}/invoke.js"></script>
          </body>
        </html>
      `;
      iframe.srcdoc = html;
      container.appendChild(iframe);
    }

    if (unit.type === "revenuecpm") {
      const s = document.createElement("script");
      s.src = unit.src;
      s.async = true;
      s.setAttribute("data-cfasync", "false");
      container.appendChild(s);
      return () => s.remove();
    }
  }, [unit]);

  return (
    <div
      id={unit.id}
      style={{
        width: "100%", // responsive
        maxWidth: `${unit.width}px`,
        height: unit.height,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f1f1f1",
        margin: "10px",
      }}
    />
  );
}

export default function Adsterra({ show }) {
  const visibleAds = adUnits.filter(ad => show.includes(ad.id));

  return (
    <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center" }}>
      {visibleAds.map(unit => (
        <AdSlot key={unit.id} unit={unit} />
      ))}
    </div>
  );
}
