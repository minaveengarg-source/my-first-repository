import { useState, useEffect } from "react";

// 🔑 Get your free API key at: https://openweathermap.org/api
const API_KEY = "YOUR_API_KEY_HERE"; // Replace with your key
const BASE_URL = "https://api.openweathermap.org/data/2.5/weather";

function getWeatherIcon(description = "") {
  const d = description.toLowerCase();
  if (d.includes("thunder")) return "⛈️";
  if (d.includes("drizzle")) return "🌦️";
  if (d.includes("rain")) return "🌧️";
  if (d.includes("snow")) return "❄️";
  if (d.includes("fog") || d.includes("mist") || d.includes("haze")) return "🌫️";
  if (d.includes("clear")) return "☀️";
  if (d.includes("few clouds") || d.includes("partly")) return "🌤️";
  if (d.includes("scattered") || d.includes("broken")) return "⛅";
  if (d.includes("cloud") || d.includes("overcast")) return "☁️";
  return "🌡️";
}

function getWindDirection(deg) {
  const dirs = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
  return dirs[Math.round(deg / 45) % 8];
}

export default function WeatherApp() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // useEffect: runs whenever 'weather' changes — for side effects
  useEffect(() => {
    if (weather) {
      document.title = `${Math.round(weather.main.temp)}°C — ${weather.name}`;
    }
    return () => {
      document.title = "WeatherApp";
    };
  }, [weather]);

  // API Fetch + State Update on user action
  const fetchWeather = async () => {
    if (!city.trim()) return;
    setLoading(true);
    setError("");
    setWeather(null);

    try {
      const res = await fetch(
        `${BASE_URL}?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`
      );
      const data = await res.json();

      if (!res.ok) {
        throw new Error(
          data.message
            ? data.message.charAt(0).toUpperCase() + data.message.slice(1)
            : "City not found"
        );
      }

      setWeather(data);
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") fetchWeather();
  };

  const temp = weather ? Math.round(weather.main.temp) : null;
  const feelsLike = weather ? Math.round(weather.main.feels_like) : null;
  const windKmh = weather
    ? (weather.wind.speed * 3.6).toFixed(1)
    : null;
  const windDir = weather ? getWindDirection(weather.wind.deg || 0) : null;
  const description = weather?.weather[0]?.description || "";

  return (
    <div style={styles.root}>
      {/* Stars background */}
      <div style={styles.starsLayer}>
        {Array.from({ length: 40 }).map((_, i) => (
          <div
            key={i}
            style={{
              ...styles.star,
              width: Math.random() * 2 + 1,
              height: Math.random() * 2 + 1,
              top: `${Math.random() * 65}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 3}s`,
            }}
          />
        ))}
      </div>

      <div style={styles.inner}>
        {/* Header */}
        <p style={styles.label}>⚡ Weather Station</p>

        {/* Search bar */}
        <div style={styles.row}>
          <input
            style={styles.input}
            type="text"
            placeholder="Enter city name (e.g. Delhi, Mumbai)..."
            value={city}
            onChange={(e) => setCity(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <button
            style={{
              ...styles.btn,
              opacity: loading ? 0.5 : 1,
              cursor: loading ? "not-allowed" : "pointer",
            }}
            onClick={fetchWeather}
            disabled={loading}
          >
            {loading ? "..." : "Search 🔍"}
          </button>
        </div>

        {/* Output area */}
        <div style={styles.output}>
          {/* Loading */}
          {loading && (
            <div style={styles.loader}>
              <div style={styles.spinner} />
              <span>
                Fetching weather for{" "}
                <strong style={{ color: "#7ec8e3" }}>{city}</strong>…
              </span>
            </div>
          )}

          {/* Error */}
          {error && !loading && (
            <div style={styles.errorBox}>⚠️ {error}</div>
          )}

          {/* Weather Card */}
          {weather && !loading && (
            <div style={styles.card}>
              {/* City + Icon */}
              <div style={styles.cardTop}>
                <div>
                  <div style={styles.cityName}>{weather.name}</div>
                  <div style={styles.countryDate}>
                    {weather.sys.country} ·{" "}
                    {new Date().toLocaleDateString("en-IN", {
                      weekday: "long",
                      day: "numeric",
                      month: "short",
                    })}
                  </div>
                </div>
                <div style={styles.bigIcon}>
                  {getWeatherIcon(description)}
                </div>
              </div>

              {/* Temperature */}
              <div style={styles.tempRow}>
                <span style={styles.temp}>{temp}</span>
                <span style={styles.unit}>°C</span>
              </div>
              <p style={styles.desc}>{description}</p>

              <div style={styles.divider} />

              {/* Stats Grid */}
              <div style={styles.grid}>
                <StatCard icon="🤔" value={`${feelsLike}°C`} label="Feels like" />
                <StatCard
                  icon="💧"
                  value={`${weather.main.humidity}%`}
                  label="Humidity"
                />
                <StatCard
                  icon="💨"
                  value={`${windKmh} ${windDir}`}
                  label="Wind km/h"
                />
                <StatCard
                  icon="🔭"
                  value={
                    weather.visibility
                      ? `${(weather.visibility / 1000).toFixed(1)} km`
                      : "—"
                  }
                  label="Visibility"
                />
              </div>

              <div style={{ ...styles.grid, marginTop: 10 }}>
                <StatCard
                  icon="🌡️"
                  value={`${weather.main.pressure} hPa`}
                  label="Pressure"
                  wide
                />
                <StatCard
                  icon="🌅"
                  value={new Date(
                    weather.sys.sunrise * 1000
                  ).toLocaleTimeString("en-IN", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                  label="Sunrise"
                  wide
                />
              </div>
            </div>
          )}

          {/* Welcome */}
          {!weather && !loading && !error && (
            <div style={styles.welcome}>
              <div style={{ fontSize: 48, marginBottom: 10 }}>🌍</div>
              <p style={styles.welcomeText}>
                Search any city to get real-time weather
              </p>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes twinkle {
          0%,100% { opacity: 0.2; }
          50% { opacity: 0.9; }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

function StatCard({ icon, value, label, wide }) {
  return (
    <div style={{ ...styles.stat, ...(wide ? { gridColumn: "span 2" } : {}) }}>
      <div style={{ fontSize: 20, marginBottom: 4 }}>{icon}</div>
      <div style={styles.statVal}>{value}</div>
      <div style={styles.statLabel}>{label}</div>
    </div>
  );
}

const styles = {
  root: {
    fontFamily: "'Segoe UI', sans-serif",
    minHeight: 480,
    background: "linear-gradient(135deg,#0f172a 0%,#1e3a5f 50%,#0f2942 100%)",
    borderRadius: 20,
    overflow: "hidden",
    position: "relative",
  },
  starsLayer: {
    position: "absolute",
    inset: 0,
    pointerEvents: "none",
  },
  star: {
    position: "absolute",
    borderRadius: "50%",
    background: "#fff",
    animation: "twinkle 3s infinite",
  },
  inner: {
    position: "relative",
    zIndex: 2,
    padding: 28,
  },
  label: {
    fontSize: 11,
    fontWeight: 700,
    letterSpacing: 3,
    color: "#7ec8e3",
    textTransform: "uppercase",
    marginBottom: 18,
  },
  row: {
    display: "flex",
    gap: 10,
  },
  input: {
    flex: 1,
    background: "rgba(255,255,255,0.08)",
    border: "1.5px solid rgba(255,255,255,0.15)",
    borderRadius: 12,
    padding: "13px 16px",
    fontSize: 15,
    color: "#fff",
    outline: "none",
  },
  btn: {
    background: "linear-gradient(135deg,#7ec8e3,#4a9fc0)",
    border: "none",
    borderRadius: 12,
    padding: "13px 20px",
    fontSize: 15,
    fontWeight: 700,
    color: "#0f172a",
    transition: "all .2s",
    whiteSpace: "nowrap",
  },
  output: {
    marginTop: 22,
  },
  loader: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    color: "rgba(255,255,255,0.55)",
    fontSize: 14,
  },
  spinner: {
    width: 18,
    height: 18,
    border: "2px solid rgba(255,255,255,0.12)",
    borderTopColor: "#7ec8e3",
    borderRadius: "50%",
    animation: "spin .8s linear infinite",
    flexShrink: 0,
  },
  errorBox: {
    background: "rgba(226,75,74,0.12)",
    border: "1px solid rgba(226,75,74,0.3)",
    borderRadius: 12,
    padding: "14px 16px",
    color: "#f09595",
    fontSize: 14,
  },
  card: {
    animation: "up .45s ease forwards",
  },
  cardTop: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 6,
  },
  cityName: {
    fontSize: 24,
    fontWeight: 800,
    color: "#fff",
  },
  countryDate: {
    fontSize: 12,
    color: "rgba(255,255,255,0.45)",
    marginTop: 3,
  },
  bigIcon: {
    fontSize: 64,
    lineHeight: 1,
  },
  tempRow: {
    display: "flex",
    alignItems: "baseline",
    gap: 6,
    margin: "10px 0 4px",
  },
  temp: {
    fontSize: 60,
    fontWeight: 800,
    color: "#fff",
    lineHeight: 1,
  },
  unit: {
    fontSize: 22,
    color: "rgba(255,255,255,0.4)",
    fontWeight: 300,
  },
  desc: {
    fontSize: 16,
    color: "#7ec8e3",
    fontStyle: "italic",
    textTransform: "capitalize",
    marginBottom: 20,
  },
  divider: {
    height: 1,
    background: "rgba(255,255,255,0.07)",
    marginBottom: 16,
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: 10,
  },
  stat: {
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.07)",
    borderRadius: 12,
    padding: "13px 10px",
    textAlign: "center",
  },
  statVal: {
    fontSize: 15,
    fontWeight: 700,
    color: "#fff",
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 11,
    color: "rgba(255,255,255,0.38)",
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },
  welcome: {
    padding: "20px 0 8px",
    textAlign: "center",
  },
  welcomeText: {
    fontSize: 15,
    color: "rgba(255,255,255,0.4)",
    lineHeight: 1.6,
  },
};
