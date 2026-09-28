import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiActivity,
  FiAlertCircle,
  FiCheckCircle,
  FiClock,
  FiFileText,
  FiRefreshCw,
  FiTrendingUp,
} from "react-icons/fi";

import "./AnalyticsPage.css";

function AnalyticsPage() {
  const navigate = useNavigate();

  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAnalytics = async () => {
      const token = localStorage.getItem("access_token");

      if (!token) {
        navigate("/login");
        return;
      }

      try {
        const response = await fetch(
          "http://127.0.0.1:8000/history/",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.status === 401) {
          localStorage.removeItem("access_token");
          localStorage.removeItem("token_type");
          navigate("/login");
          return;
        }

        if (!response.ok) {
          throw new Error(
            `Failed to fetch analytics data. Status: ${response.status}`
          );
        }

        const data = await response.json();

        setHistory(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Analytics Error:", err);
        setError("Unable to load analytics data.");
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [navigate]);

  const analytics = useMemo(() => {
    const totalValidations = history.length;

    const totalMatched = history.reduce(
      (sum, item) => sum + Number(item.matched_count || 0),
      0
    );

    const totalMismatches = history.reduce(
      (sum, item) => sum + Number(item.mismatches_count || 0),
      0
    );

    const totalFields = totalMatched + totalMismatches;

    const averageAccuracy =
      totalValidations > 0
        ? history.reduce(
            (sum, item) => sum + Number(item.accuracy || 0),
            0
          ) / totalValidations
        : 0;

    const matchRate =
      totalFields > 0
        ? (totalMatched / totalFields) * 100
        : 0;

    const mismatchRate =
      totalFields > 0
        ? (totalMismatches / totalFields) * 100
        : 0;

    const averageProcessingTime =
      totalValidations > 0
        ? history.reduce((sum, item) => {
            const seconds = parseFloat(
              String(item.processing_time || "0")
            );
            return sum + (Number.isNaN(seconds) ? 0 : seconds);
          }, 0) / totalValidations
        : 0;

    const latest = history[0] || null;

    return {
      totalValidations,
      totalMatched,
      totalMismatches,
      totalFields,
      averageAccuracy,
      matchRate,
      mismatchRate,
      averageProcessingTime,
      latest,
    };
  }, [history]);

  const chartData = useMemo(() => {
    return history
      .slice()
      .reverse()
      .map((item, index) => ({
        number: index + 1,
        accuracy: Number(item.accuracy || 0),
        matched: Number(item.matched_count || 0),
        mismatches: Number(item.mismatches_count || 0),
      }));
  }, [history]);

  const maxFieldCount = Math.max(
    ...history.map(
      (item) =>
        Number(item.matched_count || 0) +
        Number(item.mismatches_count || 0)
    ),
    1
  );

  if (loading) {
    return (
      <div className="analytics-state">
        <div className="analytics-spinner" />
        <h2>Loading analytics...</h2>
        <p>Preparing your validation insights.</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="analytics-state">
        <div className="analytics-state-icon error">
          <FiAlertCircle />
        </div>

        <h2>{error}</h2>

        <button
          className="analytics-primary-button"
          onClick={() => window.location.reload()}
        >
          <FiRefreshCw />
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="analytics-page">
      {/* Header */}
      <div className="analytics-header">
        <div>
          <div className="analytics-eyebrow">
            <FiActivity />
            VALIDATION INSIGHTS
          </div>

          <h1>Analytics</h1>

          <p>
            Understand validation quality, accuracy and document
            comparison performance at a glance.
          </p>
        </div>

        <button
          className="analytics-primary-button"
          onClick={() => navigate("/upload")}
        >
          <FiFileText />
          New Validation
        </button>
      </div>

      {/* KPI Cards */}
      <div className="analytics-kpi-grid">
        <div className="analytics-kpi-card">
          <div className="kpi-icon blue">
            <FiFileText />
          </div>

          <div className="kpi-content">
            <span>Total Validations</span>
            <strong>{analytics.totalValidations}</strong>
            <small>Completed validations</small>
          </div>
        </div>

        <div className="analytics-kpi-card">
          <div className="kpi-icon green">
            <FiCheckCircle />
          </div>

          <div className="kpi-content">
            <span>Average Accuracy</span>
            <strong>
              {analytics.averageAccuracy.toFixed(1)}%
            </strong>
            <small>Across all validations</small>
          </div>
        </div>

        <div className="analytics-kpi-card">
          <div className="kpi-icon emerald">
            <FiCheckCircle />
          </div>

          <div className="kpi-content">
            <span>Matched Fields</span>
            <strong>{analytics.totalMatched}</strong>
            <small>
              {analytics.matchRate.toFixed(1)}% match rate
            </small>
          </div>
        </div>

        <div className="analytics-kpi-card">
          <div className="kpi-icon red">
            <FiAlertCircle />
          </div>

          <div className="kpi-content">
            <span>Mismatches</span>
            <strong>{analytics.totalMismatches}</strong>
            <small>
              {analytics.mismatchRate.toFixed(1)}% of fields
            </small>
          </div>
        </div>
      </div>

      {history.length === 0 ? (
        <div className="analytics-empty">
          <div className="analytics-empty-icon">
            <FiActivity />
          </div>

          <h2>No analytics data yet</h2>

          <p>
            Complete your first document validation to start
            building your analytics dashboard.
          </p>

          <button
            className="analytics-primary-button"
            onClick={() => navigate("/upload")}
          >
            Start Validation
          </button>
        </div>
      ) : (
        <>
          {/* Main Analytics Row */}
          <div className="analytics-main-grid">
            {/* Accuracy Trend */}
            <section className="analytics-panel accuracy-panel">
              <div className="panel-header">
                <div>
                  <h2>Validation Accuracy</h2>
                  <p>
                    Accuracy across your recent validations
                  </p>
                </div>

                <div className="panel-stat">
                  <span>Average</span>
                  <strong>
                    {analytics.averageAccuracy.toFixed(1)}%
                  </strong>
                </div>
              </div>

              <div className="accuracy-chart">
                <div className="chart-y-axis">
                  <span>100%</span>
                  <span>75%</span>
                  <span>50%</span>
                  <span>25%</span>
                  <span>0%</span>
                </div>

                <div className="chart-area">
                  <div className="chart-grid-line top" />
                  <div className="chart-grid-line high" />
                  <div className="chart-grid-line middle" />
                  <div className="chart-grid-line low" />
                  <div className="chart-grid-line bottom" />

                  <div className="accuracy-bars">
                    {chartData.map((item) => (
                      <div
                        className="accuracy-column"
                        key={item.number}
                      >
                        <div className="accuracy-value">
                          {item.accuracy.toFixed(0)}%
                        </div>

                        <div
                          className="accuracy-bar"
                          style={{
                            height: `${Math.max(
                              item.accuracy,
                              4
                            )}%`,
                          }}
                          title={`Validation ${item.number}: ${item.accuracy.toFixed(
                            1
                          )}%`}
                        />

                        <span>
                          #{item.number}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            {/* Quality Breakdown */}
            <section className="analytics-panel quality-panel">
              <div className="panel-header">
                <div>
                  <h2>Validation Quality</h2>
                  <p>Overall field comparison</p>
                </div>
              </div>

              <div className="quality-content">
                <div
                  className="quality-donut"
                  style={{
                    background: `conic-gradient(
                      #16a34a 0 ${analytics.matchRate}%,
                      #ef4444 ${analytics.matchRate}% 100%
                    )`,
                  }}
                >
                  <div className="quality-donut-inner">
                    <strong>
                      {analytics.matchRate.toFixed(0)}%
                    </strong>
                    <span>Matched</span>
                  </div>
                </div>

                <div className="quality-legend">
                  <div className="quality-item">
                    <span className="legend-dot matched" />

                    <div>
                      <strong>
                        {analytics.totalMatched}
                      </strong>
                      <span>Matched fields</span>
                    </div>
                  </div>

                  <div className="quality-item">
                    <span className="legend-dot mismatch" />

                    <div>
                      <strong>
                        {analytics.totalMismatches}
                      </strong>
                      <span>Mismatched fields</span>
                    </div>
                  </div>

                  <div className="quality-total">
                    <span>Total fields</span>
                    <strong>
                      {analytics.totalFields}
                    </strong>
                  </div>
                </div>
              </div>

              <div className="quality-message">
                {analytics.matchRate >= 90 ? (
                  <>
                    <FiCheckCircle />
                    <span>
                      Most compared fields are matching.
                    </span>
                  </>
                ) : analytics.matchRate >= 70 ? (
                  <>
                    <FiTrendingUp />
                    <span>
                      Some fields require closer review.
                    </span>
                  </>
                ) : (
                  <>
                    <FiAlertCircle />
                    <span>
                      A significant number of fields require
                      review.
                    </span>
                  </>
                )}
              </div>
            </section>
          </div>

          {/* Comparison + Insights */}
          <div className="analytics-secondary-grid">
            {/* Matched vs Mismatch */}
            <section className="analytics-panel comparison-panel">
              <div className="panel-header">
                <div>
                  <h2>Matched vs Mismatched</h2>
                  <p>Field comparison by validation</p>
                </div>
              </div>

              <div className="comparison-chart">
                {chartData.map((item) => {
                  const total =
                    item.matched + item.mismatches;

                  const matchedWidth =
                    total > 0
                      ? (item.matched / total) * 100
                      : 0;

                  const mismatchWidth =
                    total > 0
                      ? (item.mismatches / total) * 100
                      : 0;

                  return (
                    <div
                      className="comparison-row"
                      key={item.number}
                    >
                      <div className="comparison-label">
                        <span>
                          Validation #{item.number}
                        </span>

                        <strong>{total} fields</strong>
                      </div>

                      <div className="comparison-track">
                        <div
                          className="comparison-matched"
                          style={{
                            width: `${matchedWidth}%`,
                          }}
                        />

                        <div
                          className="comparison-mismatch"
                          style={{
                            width: `${mismatchWidth}%`,
                          }}
                        />
                      </div>

                      <div className="comparison-values">
                        <span className="matched-text">
                          {item.matched} matched
                        </span>

                        <span className="mismatch-text">
                          {item.mismatches} mismatch
                          {item.mismatches !== 1
                            ? "es"
                            : ""}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="comparison-legend">
                <span>
                  <i className="legend-dot matched" />
                  Matched
                </span>

                <span>
                  <i className="legend-dot mismatch" />
                  Mismatched
                </span>
              </div>
            </section>

            {/* Insights */}
            <section className="analytics-panel insights-panel">
              <div className="panel-header">
                <div>
                  <h2>Key Insights</h2>
                  <p>What your validation data tells you</p>
                </div>
              </div>

              <div className="insights-list">
                <div className="insight-card blue">
                  <div className="insight-icon">
                    <FiActivity />
                  </div>

                  <div>
                    <strong>
                      {analytics.totalValidations}
                    </strong>

                    <span>
                      validation
                      {analytics.totalValidations !== 1
                        ? "s"
                        : ""}{" "}
                      completed
                    </span>
                  </div>
                </div>

                <div className="insight-card green">
                  <div className="insight-icon">
                    <FiCheckCircle />
                  </div>

                  <div>
                    <strong>
                      {analytics.averageAccuracy.toFixed(
                        1
                      )}
                      %
                    </strong>

                    <span>
                      average validation accuracy
                    </span>
                  </div>
                </div>

                <div className="insight-card red">
                  <div className="insight-icon">
                    <FiAlertCircle />
                  </div>

                  <div>
                    <strong>
                      {analytics.totalMismatches}
                    </strong>

                    <span>
                      fields need review across all
                      validations
                    </span>
                  </div>
                </div>

                <div className="insight-card purple">
                  <div className="insight-icon">
                    <FiClock />
                  </div>

                  <div>
                    <strong>
                      {analytics.averageProcessingTime.toFixed(
                        2
                      )}
                      s
                    </strong>

                    <span>
                      average processing time
                    </span>
                  </div>
                </div>
              </div>
            </section>
          </div>

          {/* Recent Validations */}
          <section className="analytics-panel recent-panel">
            <div className="panel-header recent-header">
              <div>
                <h2>Recent Validations</h2>
                <p>
                  Latest document comparisons from your
                  validation history
                </p>
              </div>

              <button
                className="text-button"
                onClick={() => navigate("/history")}
              >
                View Full History →
              </button>
            </div>

            <div className="recent-table-wrapper">
              <table className="recent-table">
                <thead>
                  <tr>
                    <th>Validation</th>
                    <th>PDF Document</th>
                    <th>Excel Document</th>
                    <th>Accuracy</th>
                    <th>Matched</th>
                    <th>Mismatches</th>
                    <th>Processing</th>
                  </tr>
                </thead>

                <tbody>
                  {history.slice(0, 6).map((item) => {
                    const accuracy = Number(
                      item.accuracy || 0
                    );

                    return (
                      <tr key={item.validation_id}>
                        <td>
                          <button
                            className="validation-id"
                            onClick={() =>
                              navigate(
                                `/history/${item.validation_id}`
                              )
                            }
                          >
                            #{item.validation_id}
                          </button>
                        </td>

                        <td>
                          <div className="file-cell">
                            <div className="file-icon pdf">
                              PDF
                            </div>

                            <span>
                              {item.pdf_filename}
                            </span>
                          </div>
                        </td>

                        <td>
                          <div className="file-cell">
                            <div className="file-icon excel">
                              XLS
                            </div>

                            <span>
                              {item.excel_filename}
                            </span>
                          </div>
                        </td>

                        <td>
                          <span
                            className={`accuracy-pill ${
                              accuracy >= 90
                                ? "excellent"
                                : accuracy >= 70
                                ? "good"
                                : "review"
                            }`}
                          >
                            {accuracy.toFixed(1)}%
                          </span>
                        </td>

                        <td>
                          <span className="matched-count">
                            {item.matched_count}
                          </span>
                        </td>

                        <td>
                          <span
                            className={
                              Number(
                                item.mismatches_count
                              ) > 0
                                ? "mismatch-count"
                                : "matched-count"
                            }
                          >
                            {item.mismatches_count}
                          </span>
                        </td>

                        <td>
                          <span className="processing-time">
                            {item.processing_time || "-"}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>
        </>
      )}
    </div>
  );
}

export default AnalyticsPage;