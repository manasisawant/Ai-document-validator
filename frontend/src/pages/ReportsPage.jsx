import {
  useEffect,
  useState,
} from "react";

import {
  useLocation,
  useNavigate,
} from "react-router-dom";

import {
  FiArrowLeft,
  FiArrowRight,
  FiCheckCircle,
  FiDownload,
  FiAlertTriangle,
  FiClock,
  FiFileText,
  FiRefreshCw,
} from "react-icons/fi";

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

import "./ReportsPage.css";


function ReportsPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const [validationResult, setValidationResult] =
    useState(null);

  const [loadingResult, setLoadingResult] =
    useState(true);


  /*
   * ==================================================
   * LOAD VALIDATION RESULT
   * ==================================================
   */

  useEffect(() => {
    try {
      /*
       * First priority:
       * Result passed directly from UploadPage
       */
      const navigationResult =
        location.state?.validationResult;

      if (navigationResult) {
        console.log(
          "Report received from navigation:",
          navigationResult
        );

        /*
         * Save the latest result so that it survives
         * refreshes and returning to the Reports page.
         */
        sessionStorage.setItem(
          "validationResult",
          JSON.stringify(navigationResult)
        );

        setValidationResult(navigationResult);
        setLoadingResult(false);

        return;
      }


      /*
       * Second priority:
       * Previously saved validation result.
       */
      const savedResult =
        sessionStorage.getItem("validationResult");

      if (savedResult) {
        const parsedResult =
          JSON.parse(savedResult);

        console.log(
          "Report restored from session storage:",
          parsedResult
        );

        setValidationResult(parsedResult);
      } else {
        /*
         * No validation has been completed yet.
         */
        setValidationResult(null);
      }

    } catch (error) {
      console.error(
        "Unable to load validation result:",
        error
      );

      /*
       * Remove corrupted data so it doesn't
       * keep causing errors.
       */
      sessionStorage.removeItem(
        "validationResult"
      );

      setValidationResult(null);

    } finally {
      setLoadingResult(false);
    }

  }, [location.state]);


  /*
   * ==================================================
   * COMPARISON RESULTS
   * ==================================================
   */

  const comparisonResults =
    validationResult?.comparison_results || [];


  const hasMismatches =
    Number(
      validationResult?.mismatches_count || 0
    ) > 0;


  /*
   * ==================================================
   * DOWNLOAD PDF REPORT
   * ==================================================
   */

  const downloadReport = () => {
    if (!validationResult) {
      return;
    }

    const doc = new jsPDF();


    /*
     * Title
     */

    doc.setFontSize(20);
    doc.setFont(
      "helvetica",
      "bold"
    );

    doc.text(
      "AI DOCUMENT VALIDATION REPORT",
      20,
      20
    );


    /*
     * Subtitle
     */

    doc.setFontSize(11);
    doc.setFont(
      "helvetica",
      "normal"
    );

    doc.text(
      "PDF and Excel Document Comparison",
      20,
      28
    );


    /*
     * Divider
     */

    doc.setDrawColor(
      200,
      200,
      200
    );

    doc.line(
      20,
      33,
      190,
      33
    );


    /*
     * Summary
     */

    doc.setFontSize(14);
    doc.setFont(
      "helvetica",
      "bold"
    );

    doc.text(
      "Validation Summary",
      20,
      45
    );


    doc.setFontSize(11);
    doc.setFont(
      "helvetica",
      "normal"
    );


    doc.text(
      `Accuracy: ${
        validationResult.accuracy ?? "-"
      }%`,
      20,
      55
    );


    doc.text(
      `Matched Fields: ${
        validationResult.matched_count ?? "-"
      }`,
      20,
      63
    );


    doc.text(
      `Mismatches: ${
        validationResult.mismatches_count ?? "-"
      }`,
      20,
      71
    );


    doc.text(
      `Processing Time: ${
        validationResult.processing_time ?? "-"
      }`,
      20,
      79
    );


    /*
     * Comparison
     */

    doc.setFontSize(14);
    doc.setFont(
      "helvetica",
      "bold"
    );

    doc.text(
      "Comparison Details",
      20,
      92
    );


    autoTable(doc, {
      startY: 98,

      head: [
        [
          "Field",
          "PDF Value",
          "Excel Value",
          "Status",
        ],
      ],

      body: comparisonResults.map(
        (result) => [
          result.field ?? "-",
          result.pdf_value ?? "-",
          result.excel_value ?? "-",
          result.status ?? "-",
        ]
      ),

      styles: {
        fontSize: 9,
        cellPadding: 4,
      },

      headStyles: {
        fontStyle: "bold",
      },

      alternateRowStyles: {
        fillColor: [
          245,
          247,
          250,
        ],
      },
    });


    /*
     * Footer
     */

    const pageCount =
      doc.internal.getNumberOfPages();

    for (
      let i = 1;
      i <= pageCount;
      i++
    ) {
      doc.setPage(i);

      doc.setFontSize(8);
      doc.setFont(
        "helvetica",
        "normal"
      );

      doc.text(
        `AI Document Validator | Page ${i} of ${pageCount}`,
        20,
        285
      );
    }


    /*
     * Download
     */

    doc.save(
      "AI-Document-Validation-Report.pdf"
    );
  };


  /*
   * ==================================================
   * LOADING
   * ==================================================
   */

  if (loadingResult) {
    return (
      <div className="report-empty-page">

        <div className="report-empty-card">

          <div className="report-empty-icon">
            <FiRefreshCw />
          </div>

          <div className="report-eyebrow">
            VALIDATION REPORT
          </div>

          <h1>
            Loading report...
          </h1>

          <p>
            Loading your latest validation result.
          </p>

        </div>

      </div>
    );
  }


  /*
   * ==================================================
   * NO RESULT
   * ==================================================
   */

  if (!validationResult) {
    return (
      <div className="report-empty-page">

        <div className="report-empty-card">

          <div className="report-empty-icon">
            <FiFileText />
          </div>

          <div className="report-eyebrow">
            VALIDATION REPORT
          </div>

          <h1>
            No validation result
          </h1>

          <p>
            There is no completed validation available
            to display yet. Start a new validation to
            generate your report.
          </p>

          <button
            type="button"
            className="report-primary-button"
            onClick={() =>
              navigate("/upload")
            }
          >
            <FiRefreshCw />
            Start New Validation
          </button>

        </div>

      </div>
    );
  }


  /*
   * ==================================================
   * REPORT
   * ==================================================
   */

  return (
    <div className="reports-page">


      {/* =================================
          HEADER
      ================================= */}

      <div className="reports-header">

        <div className="reports-header-left">

          <button
            type="button"
            className="back-button"
            onClick={() =>
              navigate("/upload")
            }
          >
            <FiArrowLeft />
            New validation
          </button>

          <div className="report-eyebrow">
            VALIDATION REPORT
          </div>

          <h1>
            Validation Results
          </h1>

          <p>
            Review the comparison between your PDF
            document and reference Excel data.
          </p>

        </div>


        <div className="reports-header-actions">

          <button
            type="button"
            className="report-download-button"
            onClick={downloadReport}
          >
            <FiDownload />
            Download Report
          </button>

          <button
            type="button"
            className="report-new-button"
            onClick={() =>
              navigate("/upload")
            }
          >
            <FiRefreshCw />
            New Validation
          </button>

        </div>

      </div>


      {/* =================================
          STATUS
      ================================= */}

      <div
        className={`validation-result-banner ${
          hasMismatches
            ? "validation-warning"
            : "validation-success"
        }`}
      >

        <div className="validation-result-icon">

          {hasMismatches ? (
            <FiAlertTriangle />
          ) : (
            <FiCheckCircle />
          )}

        </div>


        <div className="validation-result-content">

          <strong>
            {hasMismatches
              ? "Validation completed with discrepancies"
              : "Validation completed successfully"}
          </strong>

          <span>
            {hasMismatches
              ? `${validationResult.mismatches_count} field(s) require attention.`
              : "All compared fields matched successfully."}
          </span>

        </div>

      </div>


      {/* =================================
          SUMMARY
      ================================= */}

      <section className="report-summary">


        {/* Accuracy */}

        <div className="report-summary-card">

          <div className="summary-card-top">

            <span>
              Accuracy
            </span>

            <div className="summary-icon blue">
              <FiCheckCircle />
            </div>

          </div>

          <strong>
            {validationResult.accuracy ?? "-"}%
          </strong>

          <small>
            Overall document accuracy
          </small>

        </div>


        {/* Matched */}

        <div className="report-summary-card">

          <div className="summary-card-top">

            <span>
              Matched
            </span>

            <div className="summary-icon green">
              <FiCheckCircle />
            </div>

          </div>

          <strong>
            {validationResult.matched_count ?? "-"}
          </strong>

          <small>
            Fields matched successfully
          </small>

        </div>


        {/* Mismatches */}

        <div className="report-summary-card">

          <div className="summary-card-top">

            <span>
              Mismatches
            </span>

            <div className="summary-icon orange">
              <FiAlertTriangle />
            </div>

          </div>

          <strong>
            {validationResult.mismatches_count ?? "-"}
          </strong>

          <small>
            Fields requiring attention
          </small>

        </div>


        {/* Processing Time */}

        <div className="report-summary-card">

          <div className="summary-card-top">

            <span>
              Processing Time
            </span>

            <div className="summary-icon purple">
              <FiClock />
            </div>

          </div>

          <strong className="processing-value">
            {validationResult.processing_time ?? "-"}
          </strong>

          <small>
            Time taken for validation
          </small>

        </div>

      </section>


      {/* =================================
          COMPARISON TABLE
      ================================= */}

      <section className="comparison-section">

        <div className="comparison-header">

          <div>

            <div className="report-eyebrow">
              FIELD COMPARISON
            </div>

            <h2>
              Comparison Details
            </h2>

            <p>
              Compare the values extracted from the
              PDF against the reference spreadsheet.
            </p>

          </div>


          <div className="comparison-count">

            <FiFileText />

            {comparisonResults.length} fields

          </div>

        </div>


        <div className="comparison-table-wrapper">

          <table className="comparison-table">

            <thead>

              <tr>

                <th>
                  Field
                </th>

                <th>
                  PDF Value
                </th>

                <th>
                  Excel Value
                </th>

                <th>
                  Status
                </th>

              </tr>

            </thead>


            <tbody>

              {comparisonResults.length > 0 ? (
                comparisonResults.map(
                  (result, index) => {

                    const matched =
                      result.status === "Matched";

                    return (
                      <tr
                        key={index}
                        className={
                          matched
                            ? ""
                            : "mismatch-row"
                        }
                      >

                        <td className="field-cell">
                          {result.field ?? "-"}
                        </td>


                        <td
                          className={
                            matched
                              ? "value-cell"
                              : "value-cell mismatch-value"
                          }
                        >
                          {result.pdf_value ?? "-"}
                        </td>


                        <td
                          className={
                            matched
                              ? "value-cell"
                              : "value-cell mismatch-value"
                          }
                        >
                          {result.excel_value ?? "-"}
                        </td>


                        <td>

                          <span
                            className={`status-badge ${
                              matched
                                ? "status-matched"
                                : "status-mismatch"
                            }`}
                          >

                            {matched ? (
                              <FiCheckCircle />
                            ) : (
                              <FiAlertTriangle />
                            )}

                            {matched
                              ? "Matched"
                              : "Mismatch"}

                          </span>

                        </td>

                      </tr>
                    );
                  }
                )
              ) : (
                <tr>

                  <td
                    colSpan="4"
                    style={{
                      textAlign: "center",
                      padding: "35px",
                      color: "#64748b",
                    }}
                  >
                    No comparison fields were returned
                    by the validation service.
                  </td>

                </tr>
              )}

            </tbody>

          </table>

        </div>

      </section>


      {/* =================================
          FOOTER ACTION
      ================================= */}

      <div className="report-footer-action">

        <div>

          <strong>
            Need to validate another document?
          </strong>

          <span>
            Start a new comparison whenever you're ready.
          </span>

        </div>

        <button
          type="button"
          className="footer-new-validation"
          onClick={() =>
            navigate("/upload")
          }
        >
          New Validation
          <FiArrowRight />
        </button>

      </div>

    </div>
  );
}


export default ReportsPage;