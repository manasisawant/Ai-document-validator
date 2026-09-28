import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiFileText,
  FiGrid,
  FiUploadCloud,
  FiCheckCircle,
  FiArrowRight,
  FiX,
} from "react-icons/fi";

import "./UploadPage.css";

function UploadPage() {
  const navigate = useNavigate();

  const [pdfFile, setPdfFile] = useState(null);
  const [excelFile, setExcelFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const pdfInputRef = useRef(null);
  const excelInputRef = useRef(null);

  const handleValidate = async () => {
    if (!pdfFile || !excelFile) {
      alert("Please upload both PDF and Excel files.");
      return;
    }

    const token = localStorage.getItem("access_token");

    if (!token) {
      alert("Please sign in before validating documents.");
      navigate("/login");
      return;
    }

    setLoading(true);

    const formData = new FormData();

    formData.append("pdf_file", pdfFile);
    formData.append("excel_file", excelFile);

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/validation/upload",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      const data = await response.json();

      console.log("Validation Response:", data);

      /*
       * Handle API errors
       */
      if (!response.ok) {
        console.error("Validation API Error:", data);

        if (response.status === 401) {
          localStorage.removeItem("access_token");
          localStorage.removeItem("token_type");

          alert("Your session has expired. Please sign in again.");
          navigate("/login");
          return;
        }

        alert(
          data.detail ||
            data.message ||
            `Validation failed. Server returned ${response.status}.`
        );

        return;
      }

      /*
       * Successful validation
       *
       * Backend structure:
       *
       * data
       * ├── message
       * ├── pdf_filename
       * ├── excel_filename
       * └── validation
       *      ├── accuracy
       *      ├── matched_count
       *      ├── mismatches_count
       *      └── results
       */
      if (response.ok && data.validation) {
        const validation = data.validation;

        /*
         * Get comparison results from the backend.
         *
         * Depending on the backend response, results may
         * already be called comparison_results or results.
         */
        const rawResults =
          validation.comparison_results ||
          validation.results ||
          [];

        /*
         * Normalize the backend result format so that
         * ReportsPage always receives the same structure.
         *
         * Backend:
         * document_value
         *
         * ReportsPage:
         * pdf_value
         */
        const comparisonResults = rawResults.map((result) => ({
          field:
            result.field ??
            result.field_name ??
            "",

          pdf_value:
            result.pdf_value ??
            result.document_value ??
            "",

          excel_value:
            result.excel_value ??
            "",

          status:
            result.status ??
            "",
        }));

        /*
         * Create the final report object.
         */
        const reportData = {
          ...validation,

          pdf_filename: data.pdf_filename,
          excel_filename: data.excel_filename,
          message: data.message,

          comparison_results: comparisonResults,
        };

        console.log("Normalized Report Data:", reportData);

        /*
         * Save the latest validation temporarily.
         *
         * ReportsPage can use this if the page is refreshed
         * during the current browser session.
         */
        sessionStorage.setItem(
          "validationResult",
          JSON.stringify(reportData)
        );

        /*
         * Send the normalized result to ReportsPage.
         */
        navigate("/reports", {
          state: {
            validationResult: reportData,
          },
        });

        return;
      }

      /*
       * Fallback if the server responded successfully
       * but did not return a validation object.
       */
      alert(
        data.message ||
          data.detail ||
          "Validation could not be completed."
      );
    } catch (error) {
      console.error("Validation Request Error:", error);

      alert(
        "Unable to connect to the validation server. Please make sure the backend is running."
      );
    } finally {
      setLoading(false);
    }
  };

  const removePdf = () => {
    setPdfFile(null);

    if (pdfInputRef.current) {
      pdfInputRef.current.value = "";
    }
  };

  const removeExcel = () => {
    setExcelFile(null);

    if (excelInputRef.current) {
      excelInputRef.current.value = "";
    }
  };

  return (
    <div className="upload-page">

      {/* PAGE HEADER */}
      <div className="upload-page-header">
        <div>
          <div className="upload-eyebrow">
            VALIDATION WORKSPACE
          </div>

          <h1>New Validation</h1>

          <p>
            Upload your source document and reference spreadsheet
            to compare their data automatically.
          </p>
        </div>
      </div>

      {/* UPLOAD WORKSPACE */}
      <div className="upload-workspace">

        <div className="upload-workspace-header">
          <div>
            <h2>Upload documents</h2>

            <p>
              Both files are required before validation can begin.
            </p>
          </div>

          <div className="validation-status">
            <span className="status-dot" />
            Ready for upload
          </div>
        </div>

        <div className="upload-cards">

          {/* PDF CARD */}

          <div
            className={`upload-card ${
              pdfFile ? "upload-card-complete" : ""
            }`}
          >
            <div className="upload-card-top">

              <div className="upload-file-icon pdf-icon">
                <FiFileText />
              </div>

              {pdfFile && (
                <div className="upload-complete">
                  <FiCheckCircle />
                </div>
              )}
            </div>

            <div className="upload-card-content">

              <div className="upload-card-label">
                SOURCE DOCUMENT
              </div>

              <h3>PDF Document</h3>

              <p>
                Upload the PDF document that needs to be
                validated.
              </p>
            </div>

            {pdfFile ? (
              <div className="selected-file">

                <div className="selected-file-info">

                  <FiFileText />

                  <div>
                    <strong>{pdfFile.name}</strong>

                    <span>
                      PDF document selected
                    </span>
                  </div>

                </div>

                <button
                  type="button"
                  className="remove-file"
                  onClick={removePdf}
                  aria-label="Remove PDF"
                >
                  <FiX />
                </button>

              </div>
            ) : (
              <button
                type="button"
                className="upload-file-button upload-pdf-button"
                onClick={() => pdfInputRef.current?.click()}
              >
                <FiUploadCloud />
                Choose PDF
              </button>
            )}

            <input
              ref={pdfInputRef}
              type="file"
              accept=".pdf"
              hidden
              onChange={(e) => {
                setPdfFile(
                  e.target.files?.[0] || null
                );
              }}
            />

            <div className="upload-format">
              PDF files only
            </div>

          </div>

          {/* EXCEL CARD */}

          <div
            className={`upload-card ${
              excelFile ? "upload-card-complete" : ""
            }`}
          >

            <div className="upload-card-top">

              <div className="upload-file-icon excel-icon">
                <FiGrid />
              </div>

              {excelFile && (
                <div className="upload-complete">
                  <FiCheckCircle />
                </div>
              )}

            </div>

            <div className="upload-card-content">

              <div className="upload-card-label">
                REFERENCE DATA
              </div>

              <h3>Excel Spreadsheet</h3>

              <p>
                Upload the Excel file containing the reference
                values for comparison.
              </p>

            </div>

            {excelFile ? (
              <div className="selected-file">

                <div className="selected-file-info">

                  <FiGrid />

                  <div>
                    <strong>{excelFile.name}</strong>

                    <span>
                      Excel spreadsheet selected
                    </span>
                  </div>

                </div>

                <button
                  type="button"
                  className="remove-file"
                  onClick={removeExcel}
                  aria-label="Remove Excel"
                >
                  <FiX />
                </button>

              </div>
            ) : (
              <button
                type="button"
                className="upload-file-button upload-excel-button"
                onClick={() =>
                  excelInputRef.current?.click()
                }
              >
                <FiUploadCloud />
                Choose Excel
              </button>
            )}

            <input
              ref={excelInputRef}
              type="file"
              accept=".xlsx,.xls"
              hidden
              onChange={(e) => {
                setExcelFile(
                  e.target.files?.[0] || null
                );
              }}
            />

            <div className="upload-format">
              XLSX or XLS files
            </div>

          </div>

        </div>

        {/* VALIDATION ACTION */}

        <div className="validation-action">

          <div className="validation-action-info">

            <div className="validation-action-icon">
              <FiCheckCircle />
            </div>

            <div>
              <strong>
                Ready to validate?
              </strong>

              <span>
                Upload both files to start the comparison.
              </span>
            </div>

          </div>

          <button
            type="button"
            className={`validate-button ${
              !pdfFile || !excelFile || loading
                ? "validate-button-disabled"
                : ""
            }`}
            disabled={
              !pdfFile ||
              !excelFile ||
              loading
            }
            onClick={handleValidate}
          >

            {loading ? (
              <>
                <span className="validation-spinner" />
                Validating...
              </>
            ) : (
              <>
                Validate Documents
                <FiArrowRight />
              </>
            )}

          </button>

        </div>

      </div>

      {/* PROCESS */}

      <div className="upload-process">

        <div className="process-step">

          <span>01</span>

          <div>
            <strong>Upload documents</strong>

            <p>
              Provide the PDF and reference Excel file.
            </p>
          </div>

        </div>

        <div className="process-line" />

        <div className="process-step">

          <span>02</span>

          <div>
            <strong>AI validation</strong>

            <p>
              DocuVerify extracts and compares the data.
            </p>
          </div>

        </div>

        <div className="process-line" />

        <div className="process-step">

          <span>03</span>

          <div>
            <strong>Review results</strong>

            <p>
              Inspect matches and discrepancies in the report.
            </p>
          </div>

        </div>

      </div>

    </div>
  );
}

export default UploadPage;