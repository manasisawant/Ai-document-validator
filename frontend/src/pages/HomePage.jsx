import React from "react";
import { Link } from "react-router-dom";
import "./HomePage.css";

function HomePage() {
  return (
    <div className="landing-page">

      {/* ================= NAVBAR ================= */}
      <header className="landing-navbar">
        <div className="landing-container navbar-inner">

          <Link to="/" className="logo">
            <div className="logo-mark">
              <span>✓</span>
            </div>

            <div className="logo-text">
              <strong>DocuVerify</strong>
              <span>AI Document Validation</span>
            </div>
          </Link>

          <nav className="desktop-nav">
            <a href="#features">Features</a>
            <a href="#how-it-works">How it works</a>
            <a href="#about">About</a>
          </nav>

          <div className="navbar-actions">
            <Link to="/login" className="login-button">
              Log in
            </Link>

            <Link to="/dashboard" className="nav-cta">
              Start validating
              <span>→</span>
            </Link>
          </div>

        </div>
      </header>


      {/* ================= HERO ================= */}
      <main>

        <section className="hero">
          <div className="landing-container hero-grid">

            <div className="hero-content">

              <div className="eyebrow">
                <span className="eyebrow-dot"></span>
                AI-powered document verification
              </div>

              <h1>
                Validate documents
                <span> with confidence.</span>
              </h1>

              <p className="hero-description">
                Upload an invoice and your reference data. DocuVerify
                extracts, compares, and highlights discrepancies so you
                can review documents faster and with less manual effort.
              </p>

              <div className="hero-actions">

                <Link
                  to="/dashboard"
                  className="primary-cta"
                >
                  Start validation
                  <span>→</span>
                </Link>

                <a
                  href="#how-it-works"
                  className="secondary-cta"
                >
                  See how it works
                  <span>↓</span>
                </a>

              </div>

              <div className="hero-trust">
                <div className="trust-item">
                  <span className="trust-check">✓</span>
                  OCR extraction
                </div>

                <div className="trust-item">
                  <span className="trust-check">✓</span>
                  Field comparison
                </div>

                <div className="trust-item">
                  <span className="trust-check">✓</span>
                  Validation reports
                </div>
              </div>

            </div>


            {/* PRODUCT PREVIEW */}
            <div className="hero-visual">

              <div className="visual-glow"></div>

              <div className="validation-window">

                <div className="window-topbar">

                  <div className="window-dots">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>

                  <div className="window-title">
                    Validation Report
                  </div>

                  <div className="window-status">
                    LIVE
                  </div>

                </div>


                <div className="window-body">

                  <div className="document-header">

                    <div>
                      <span className="small-label">
                        DOCUMENT
                      </span>

                      <h3>
                        Invoice_2026_091.pdf
                      </h3>
                    </div>

                    <div className="file-icon">
                      PDF
                    </div>

                  </div>


                  <div className="validation-score">

                    <div>
                      <span className="small-label">
                        VALIDATION SCORE
                      </span>

                      <strong>92%</strong>
                    </div>

                    <div className="score-ring">
                      <span>92</span>
                    </div>

                  </div>


                  <div className="field-list">

                    <div className="field-row">
                      <div>
                        <span className="field-name">
                          Vendor Name
                        </span>
                        <span className="field-value">
                          ABC Technologies
                        </span>
                      </div>

                      <span className="match-status">
                        ✓ Matched
                      </span>
                    </div>


                    <div className="field-row">
                      <div>
                        <span className="field-name">
                          Invoice Number
                        </span>
                        <span className="field-value">
                          INV-2026-091
                        </span>
                      </div>

                      <span className="match-status">
                        ✓ Matched
                      </span>
                    </div>


                    <div className="field-row warning-row">
                      <div>
                        <span className="field-name">
                          Invoice Amount
                        </span>

                        <span className="field-value">
                          ₹48,500
                        </span>
                      </div>

                      <span className="warning-status">
                        ! Mismatch
                      </span>
                    </div>


                    <div className="field-row">
                      <div>
                        <span className="field-name">
                          Invoice Date
                        </span>

                        <span className="field-value">
                          18 Sep 2026
                        </span>
                      </div>

                      <span className="match-status">
                        ✓ Matched
                      </span>
                    </div>

                  </div>


                  <div className="preview-footer">

                    <span>
                      4 fields checked
                    </span>

                    <button>
                      View report →
                    </button>

                  </div>

                </div>

              </div>


              <div className="floating-card floating-processing">

                <div className="processing-icon">
                  ✦
                </div>

                <div>
                  <strong>AI validation</strong>
                  <span>Comparing fields...</span>
                </div>

                <div className="processing-loader"></div>

              </div>


              <div className="floating-card floating-secure">

                <span className="secure-icon">
                  ✓
                </span>

                <div>
                  <strong>Validation complete</strong>
                  <span>Results ready</span>
                </div>

              </div>

            </div>

          </div>
        </section>


        {/* ================= TRUST BAR ================= */}
        <section className="trust-bar">

          <div className="landing-container trust-inner">

            <span>
              BUILT FOR FASTER DOCUMENT REVIEW
            </span>

            <div className="trust-line"></div>

            <p>
              Extract <b>→</b> Compare <b>→</b> Identify <b>→</b> Review
            </p>

          </div>

        </section>


        {/* ================= FEATURES ================= */}
        <section
          className="section features-section"
          id="features"
        >

          <div className="landing-container">

            <div className="section-heading">

              <span className="section-label">
                CORE CAPABILITIES
              </span>

              <h2>
                Everything you need to
                <span> validate faster.</span>
              </h2>

              <p>
                Replace repetitive document checking with a structured
                workflow designed around extraction, comparison, and
                clear validation results.
              </p>

            </div>


            <div className="features-grid">

              <article className="feature-card">

                <div className="feature-number">
                  01
                </div>

                <div className="feature-icon">
                  <span>▤</span>
                </div>

                <h3>
                  Smart extraction
                </h3>

                <p>
                  Extract important fields from invoices and scanned
                  documents using OCR technology.
                </p>

                <div className="feature-link">
                  OCR processing <span>→</span>
                </div>

              </article>


              <article className="feature-card featured-card">

                <div className="feature-number">
                  02
                </div>

                <div className="feature-icon blue-icon">
                  <span>⇄</span>
                </div>

                <h3>
                  Intelligent comparison
                </h3>

                <p>
                  Compare extracted document fields against reference
                  data and identify inconsistencies.
                </p>

                <div className="feature-link">
                  Field matching <span>→</span>
                </div>

              </article>


              <article className="feature-card">

                <div className="feature-number">
                  03
                </div>

                <div className="feature-icon">
                  <span>✓</span>
                </div>

                <h3>
                  Clear validation reports
                </h3>

                <p>
                  Review matched and mismatched fields through a
                  structured validation report.
                </p>

                <div className="feature-link">
                  Review results <span>→</span>
                </div>

              </article>

            </div>

          </div>

        </section>


        {/* ================= HOW IT WORKS ================= */}
        <section
          className="section workflow-section"
          id="how-it-works"
        >

          <div className="landing-container">

            <div className="workflow-layout">

              <div className="workflow-intro">

                <span className="section-label">
                  HOW IT WORKS
                </span>

                <h2>
                  From upload to
                  <span> validation.</span>
                </h2>

                <p>
                  A simple workflow that turns manual document
                  verification into a structured digital process.
                </p>

                <Link
                  to="/dashboard"
                  className="workflow-cta"
                >
                  Try the workflow
                  <span>→</span>
                </Link>

              </div>


              <div className="steps">

                <div className="step">

                  <div className="step-number">
                    01
                  </div>

                  <div className="step-content">

                    <h3>
                      Upload documents
                    </h3>

                    <p>
                      Upload your invoice or PDF along with the
                      corresponding Excel reference file.
                    </p>

                  </div>

                </div>


                <div className="step">

                  <div className="step-number">
                    02
                  </div>

                  <div className="step-content">

                    <h3>
                      Extract & compare
                    </h3>

                    <p>
                      OCR extracts relevant fields and the system
                      compares them with your reference data.
                    </p>

                  </div>

                </div>


                <div className="step">

                  <div className="step-number">
                    03
                  </div>

                  <div className="step-content">

                    <h3>
                      Review results
                    </h3>

                    <p>
                      See exactly which fields match and which
                      require attention in the validation report.
                    </p>

                  </div>

                </div>

              </div>

            </div>

          </div>

        </section>


        {/* ================= ABOUT ================= */}
        <section
          className="section about-section"
          id="about"
        >

          <div className="landing-container">

            <div className="about-card">

              <div className="about-copy">

                <span className="section-label">
                  BUILT AROUND YOUR WORKFLOW
                </span>

                <h2>
                  Less manual checking.
                  <br />
                  More meaningful review.
                </h2>

                <p>
                  DocuVerify combines document extraction, field
                  comparison, and validation history into one
                  streamlined workflow.
                </p>

              </div>


              <div className="about-stats">

                <div>
                  <strong>OCR</strong>
                  <span>Extraction</span>
                </div>

                <div>
                  <strong>PDF</strong>
                  <span>Documents</span>
                </div>

                <div>
                  <strong>Excel</strong>
                  <span>Reference data</span>
                </div>

                <div>
                  <strong>AI</strong>
                  <span>Validation</span>
                </div>

              </div>

            </div>

          </div>

        </section>


        {/* ================= CTA ================= */}
        <section className="final-cta">

          <div className="landing-container">

            <div className="cta-card">

              <div>

                <span className="section-label">
                  READY TO START?
                </span>

                <h2>
                  Turn document validation
                  <span> into a workflow.</span>
                </h2>

                <p>
                  Upload your first document and see the validation
                  process in action.
                </p>

              </div>

              <Link
                to="/dashboard"
                className="primary-cta cta-button"
              >
                Start validating
                <span>→</span>
              </Link>

            </div>

          </div>

        </section>

      </main>


      {/* ================= FOOTER ================= */}
      <footer className="landing-footer">

        <div className="landing-container footer-inner">

          <Link to="/" className="logo">

            <div className="logo-mark">
              <span>✓</span>
            </div>

            <div className="logo-text">
              <strong>DocuVerify</strong>
              <span>AI Document Validation</span>
            </div>

          </Link>

          <p>
            AI-powered document validation for faster review.
          </p>

          <span className="copyright">
            © 2026 DocuVerify
          </span>

        </div>

      </footer>

    </div>
  );
}

export default HomePage;