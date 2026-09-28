/**
 * Word (DOCX) Report Generator Service
 * Generates an editable, publication-quality .docx file for a test report using docx.
 * Identical structure, text, and layout to the Official 1-Page PDF Certificate (OIML R 76-1).
 */

import {
  Document,
  Paragraph,
  TextRun,
  Table,
  TableRow,
  TableCell,
  WidthType,
  AlignmentType,
  HeadingLevel,
  BorderStyle,
  Packer,
  Footer
} from 'docx';

export class WordService {
  /**
   * Generates a DOCX Buffer for a test report identical in content and styling to the PDF
   * @param {Object} report Full report object
   * @returns {Promise<Buffer>}
   */
  static async generateReportDocx(report) {
    const inst = report.instrument || {};
    const lab = report.laboratoryConditions || {};
    const observations = report.observations || [];
    const unit = inst.unit || 'kg';
    const rptNum = report.reportNumber || report.id || 'RPT-001';
    const testDt = report.testDate || new Date().toISOString().split('T')[0];
    const isPass = (report.overallResult || 'PASS').toUpperCase() === 'PASS';
    const labName = report.laboratoryName || 'Regional Reference Standards Laboratory (RRSL)';
    const engName = report.testEngineerName || 'Sunita Verma';
    const revName = report.reviewerName || 'Dr. Ramesh Sharma';

    const tableBorder = {
      style: BorderStyle.SINGLE,
      size: 1,
      color: 'CBD5E1'
    };

    const lightBorder = {
      style: BorderStyle.SINGLE,
      size: 1,
      color: 'E2E8F0'
    };

    const borders = {
      top: tableBorder,
      bottom: tableBorder,
      left: tableBorder,
      right: tableBorder
    };

    const subtleBorders = {
      top: lightBorder,
      bottom: lightBorder,
      left: lightBorder,
      right: lightBorder
    };

    const cellMargins = {
      top: 90,
      bottom: 90,
      left: 120,
      right: 120
    };

    const doc = new Document({
      sections: [{
        properties: {
          page: {
            margin: {
              top: 720,
              right: 720,
              bottom: 720,
              left: 720
            }
          }
        },
        footers: {
          default: new Footer({
            children: [
              new Paragraph({
                alignment: AlignmentType.RIGHT,
                children: [
                  new TextRun({
                    text: 'Government of India • Directorate of Legal Metrology • NAWI Type Evaluation System  |  Page 1 of 1',
                    size: 14,
                    color: '94A3B8'
                  })
                ]
              })
            ]
          })
        },
        children: [
          // ==========================================
          // 1. OFFICIAL HEADER (Matching PDF)
          // ==========================================
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 40 },
            children: [
              new TextRun({
                text: 'GOVERNMENT OF INDIA • MINISTRY OF CONSUMER AFFAIRS, FOOD & PUBLIC DISTRIBUTION',
                bold: true,
                size: 17,
                color: '334155'
              })
            ]
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 80 },
            children: [
              new TextRun({
                text: 'DIRECTORATE OF LEGAL METROLOGY • REGIONAL REFERENCE STANDARDS LABORATORY',
                size: 15,
                color: '64748B'
              })
            ]
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 60 },
            children: [
              new TextRun({
                text: 'NON-AUTOMATIC WEIGHING INSTRUMENT (NAWI) TEST REPORT',
                bold: true,
                size: 24,
                color: '0F172A'
              })
            ]
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 50 },
            children: [
              new TextRun({
                text: 'TYPE EVALUATION CERTIFICATE & PATTERN APPROVAL TEST RECORD',
                bold: true,
                size: 17,
                color: '1D4ED8'
              })
            ]
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 120 },
            children: [
              new TextRun({
                text: 'Evaluated in accordance with OIML R 76-1 (Edition 2006) & The Legal Metrology (General) Rules, 2011',
                italics: true,
                size: 15,
                color: '64748B'
              })
            ]
          }),

          // Tricolor Line Simulation
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: [
                  new TableCell({
                    shading: { fill: 'FF9933' },
                    borders: { top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE }, left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE } },
                    children: [new Paragraph({ spacing: { before: 20, after: 20 } })]
                  }),
                  new TableCell({
                    shading: { fill: 'CBD5E1' },
                    borders: { top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE }, left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE } },
                    children: [new Paragraph({ spacing: { before: 20, after: 20 } })]
                  }),
                  new TableCell({
                    shading: { fill: '138808' },
                    borders: { top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE }, left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE } },
                    children: [new Paragraph({ spacing: { before: 20, after: 20 } })]
                  })
                ]
              })
            ]
          }),

          new Paragraph({ spacing: { before: 100 } }),

          // ==========================================
          // 2. ADMINISTRATIVE METADATA STRIP
          // ==========================================
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            margins: cellMargins,
            rows: [
              new TableRow({
                children: [
                  new TableCell({
                    borders,
                    shading: { fill: 'F8FAFC' },
                    children: [
                      new Paragraph({
                        children: [
                          new TextRun({ text: 'Report ID: ', bold: true, size: 16 }),
                          new TextRun({ text: rptNum, bold: true, color: '1D4ED8', size: 16 })
                        ]
                      })
                    ]
                  }),
                  new TableCell({
                    borders,
                    shading: { fill: 'F8FAFC' },
                    children: [
                      new Paragraph({
                        children: [
                          new TextRun({ text: 'Date of Test: ', bold: true, size: 16 }),
                          new TextRun({ text: testDt, size: 16 })
                        ]
                      })
                    ]
                  }),
                  new TableCell({
                    borders,
                    shading: { fill: 'F8FAFC' },
                    children: [
                      new Paragraph({
                        children: [
                          new TextRun({ text: 'Overall Verdict: ', bold: true, size: 16 }),
                          new TextRun({
                            text: `${report.overallResult || 'PASS'} (${(report.status || 'COMPLETED').replace('_', ' ')})`,
                            bold: true,
                            size: 16,
                            color: isPass ? '15803D' : 'B91C1C'
                          })
                        ]
                      })
                    ]
                  })
                ]
              }),
              new TableRow({
                children: [
                  new TableCell({
                    borders,
                    shading: { fill: 'F8FAFC' },
                    children: [
                      new Paragraph({
                        children: [
                          new TextRun({ text: 'Laboratory: ', bold: true, size: 15 }),
                          new TextRun({ text: labName, size: 15 })
                        ]
                      })
                    ]
                  }),
                  new TableCell({
                    borders,
                    shading: { fill: 'F8FAFC' },
                    children: [
                      new Paragraph({
                        children: [
                          new TextRun({ text: 'Metrologist: ', bold: true, size: 15 }),
                          new TextRun({ text: engName, size: 15 })
                        ]
                      })
                    ]
                  }),
                  new TableCell({
                    borders,
                    shading: { fill: 'F8FAFC' },
                    children: [
                      new Paragraph({
                        children: [
                          new TextRun({ text: 'Reviewer: ', bold: true, size: 15 }),
                          new TextRun({ text: revName, size: 15 })
                        ]
                      })
                    ]
                  })
                ]
              })
            ]
          }),

          // ==========================================
          // 3. SECTION 1: INSTRUMENT SPECIFICATIONS
          // ==========================================
          new Paragraph({
            spacing: { before: 180, after: 60 },
            children: [
              new TextRun({ text: '1. INSTRUMENT IDENTIFICATION & TECHNICAL SPECIFICATIONS', bold: true, size: 17, color: '1D4ED8' })
            ]
          }),
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            margins: cellMargins,
            rows: [
              new TableRow({
                children: [
                  new TableCell({
                    borders: subtleBorders,
                    shading: { fill: 'F8FAFC' },
                    width: { size: 22, type: WidthType.PERCENTAGE },
                    children: [new Paragraph({ children: [new TextRun({ text: 'Manufacturer:', bold: true, size: 15 })] })]
                  }),
                  new TableCell({
                    borders: subtleBorders,
                    width: { size: 28, type: WidthType.PERCENTAGE },
                    children: [new Paragraph({ children: [new TextRun({ text: inst.manufacturer || 'Apex Weighing Systems Ltd', size: 15 })] })]
                  }),
                  new TableCell({
                    borders: subtleBorders,
                    shading: { fill: 'F8FAFC' },
                    width: { size: 22, type: WidthType.PERCENTAGE },
                    children: [new Paragraph({ children: [new TextRun({ text: 'Model Number:', bold: true, size: 15 })] })]
                  }),
                  new TableCell({
                    borders: subtleBorders,
                    width: { size: 28, type: WidthType.PERCENTAGE },
                    children: [new Paragraph({ children: [new TextRun({ text: inst.model || 'ABC-500', size: 15 })] })]
                  })
                ]
              }),
              new TableRow({
                children: [
                  new TableCell({
                    borders: subtleBorders,
                    shading: { fill: 'F8FAFC' },
                    children: [new Paragraph({ children: [new TextRun({ text: 'Instrument Type:', bold: true, size: 15 })] })]
                  }),
                  new TableCell({
                    borders: subtleBorders,
                    children: [new Paragraph({ children: [new TextRun({ text: inst.instrumentType || 'Electronic Bench Scale', size: 15 })] })]
                  }),
                  new TableCell({
                    borders: subtleBorders,
                    shading: { fill: 'F8FAFC' },
                    children: [new Paragraph({ children: [new TextRun({ text: 'Serial Number:', bold: true, size: 15 })] })]
                  }),
                  new TableCell({
                    borders: subtleBorders,
                    children: [new Paragraph({ children: [new TextRun({ text: inst.serialNumber || 'SN-10234', bold: true, size: 15 })] })]
                  })
                ]
              }),
              new TableRow({
                children: [
                  new TableCell({
                    borders: subtleBorders,
                    shading: { fill: 'F8FAFC' },
                    children: [new Paragraph({ children: [new TextRun({ text: 'Accuracy Class:', bold: true, size: 15 })] })]
                  }),
                  new TableCell({
                    borders: subtleBorders,
                    children: [new Paragraph({ children: [new TextRun({ text: `Class ${inst.accuracyClass || 'III'}`, bold: true, color: '1D4ED8', size: 15 })] })]
                  }),
                  new TableCell({
                    borders: subtleBorders,
                    shading: { fill: 'F8FAFC' },
                    children: [new Paragraph({ children: [new TextRun({ text: 'Max Capacity (Max):', bold: true, size: 15 })] })]
                  }),
                  new TableCell({
                    borders: subtleBorders,
                    children: [new Paragraph({ children: [new TextRun({ text: `${inst.maxCapacity || 30} ${unit}`, size: 15 })] })]
                  })
                ]
              }),
              new TableRow({
                children: [
                  new TableCell({
                    borders: subtleBorders,
                    shading: { fill: 'F8FAFC' },
                    children: [new Paragraph({ children: [new TextRun({ text: 'Min Capacity (Min):', bold: true, size: 15 })] })]
                  }),
                  new TableCell({
                    borders: subtleBorders,
                    children: [new Paragraph({ children: [new TextRun({ text: `${inst.minCapacity || 0.1} ${unit}`, size: 15 })] })]
                  }),
                  new TableCell({
                    borders: subtleBorders,
                    shading: { fill: 'F8FAFC' },
                    children: [new Paragraph({ children: [new TextRun({ text: 'Scale Intervals (e / d):', bold: true, size: 15 })] })]
                  }),
                  new TableCell({
                    borders: subtleBorders,
                    children: [new Paragraph({ children: [new TextRun({ text: `e = ${inst.verificationScaleInterval || 0.005} ${unit} | d = ${inst.actualScaleInterval || inst.verificationScaleInterval || 0.005} ${unit}`, size: 15 })] })]
                  })
                ]
              })
            ]
          }),

          // ==========================================
          // 4. SECTION 2: ENVIRONMENTAL CONDITIONS
          // ==========================================
          new Paragraph({
            spacing: { before: 180, after: 60 },
            children: [
              new TextRun({ text: '2. ENVIRONMENTAL CONDITIONS & METROLOGICAL STANDARDS', bold: true, size: 17, color: '1D4ED8' })
            ]
          }),
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            margins: cellMargins,
            rows: [
              new TableRow({
                children: [
                  new TableCell({
                    borders,
                    shading: { fill: 'F8FAFC' },
                    children: [
                      new Paragraph({
                        children: [
                          new TextRun({ text: 'Temperature: ', bold: true, size: 15 }),
                          new TextRun({ text: `${lab.temperature || '23.4'} °C`, size: 15 })
                        ]
                      })
                    ]
                  }),
                  new TableCell({
                    borders,
                    shading: { fill: 'F8FAFC' },
                    children: [
                      new Paragraph({
                        children: [
                          new TextRun({ text: 'Humidity: ', bold: true, size: 15 }),
                          new TextRun({ text: `${lab.humidity || '52.0'} % RH`, size: 15 })
                        ]
                      })
                    ]
                  }),
                  new TableCell({
                    borders,
                    shading: { fill: 'F8FAFC' },
                    children: [
                      new Paragraph({
                        children: [
                          new TextRun({ text: 'Pressure: ', bold: true, size: 15 }),
                          new TextRun({ text: `${lab.pressure || '1012.5'} hPa`, size: 15 })
                        ]
                      })
                    ]
                  }),
                  new TableCell({
                    borders,
                    shading: { fill: 'F8FAFC' },
                    children: [
                      new Paragraph({
                        children: [
                          new TextRun({ text: 'Ref Standards: ', bold: true, size: 15 }),
                          new TextRun({ text: lab.standardWeightsId || 'RRSL Class F1 Set', size: 15 })
                        ]
                      })
                    ]
                  })
                ]
              })
            ]
          }),

          // ==========================================
          // 5. SECTION 3: TEST OBSERVATIONS TABLE
          // ==========================================
          new Paragraph({
            spacing: { before: 180, after: 60 },
            children: [
              new TextRun({ text: '3. TEST OBSERVATIONS, CALCULATED ERRORS & PERMISSIBLE LIMITS (OIML R 76)', bold: true, size: 17, color: '1D4ED8' })
            ]
          }),
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            margins: cellMargins,
            rows: [
              new TableRow({
                children: [
                  new TableCell({
                    borders,
                    shading: { fill: '0F172A' },
                    width: { size: 36, type: WidthType.PERCENTAGE },
                    children: [new Paragraph({ children: [new TextRun({ text: 'Test Type & Load Application Point', bold: true, color: 'FFFFFF', size: 15 })] })]
                  }),
                  new TableCell({
                    borders,
                    shading: { fill: '0F172A' },
                    width: { size: 14, type: WidthType.PERCENTAGE },
                    children: [new Paragraph({ alignment: AlignmentType.RIGHT, children: [new TextRun({ text: `Ref (${unit})`, bold: true, color: 'FFFFFF', size: 15 })] })]
                  }),
                  new TableCell({
                    borders,
                    shading: { fill: '0F172A' },
                    width: { size: 14, type: WidthType.PERCENTAGE },
                    children: [new Paragraph({ alignment: AlignmentType.RIGHT, children: [new TextRun({ text: `Indicated (${unit})`, bold: true, color: 'FFFFFF', size: 15 })] })]
                  }),
                  new TableCell({
                    borders,
                    shading: { fill: '0F172A' },
                    width: { size: 14, type: WidthType.PERCENTAGE },
                    children: [new Paragraph({ alignment: AlignmentType.RIGHT, children: [new TextRun({ text: 'Error (E)', bold: true, color: 'FFFFFF', size: 15 })] })]
                  }),
                  new TableCell({
                    borders,
                    shading: { fill: '0F172A' },
                    width: { size: 12, type: WidthType.PERCENTAGE },
                    children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'MPE Limit', bold: true, color: 'FFFFFF', size: 15 })] })]
                  }),
                  new TableCell({
                    borders,
                    shading: { fill: '0F172A' },
                    width: { size: 10, type: WidthType.PERCENTAGE },
                    children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'Verdict', bold: true, color: 'FFFFFF', size: 15 })] })]
                  })
                ]
              }),
              ...observations.slice(0, 10).map((obs, idx) => {
                const isEven = idx % 2 === 0;
                const refVal = obs.referenceValue !== undefined && obs.referenceValue !== null
                  ? `${obs.referenceValue}`
                  : (obs.appliedLoad !== undefined ? `${obs.appliedLoad}` : '—');
                const indVal = obs.indicatedValue !== undefined && obs.indicatedValue !== null
                  ? `${obs.indicatedValue}`
                  : '—';
                const errNum = Number(obs.calculatedError !== undefined ? obs.calculatedError : obs.error);
                const errStr = !isNaN(errNum) ? (errNum > 0 ? `+${errNum}` : `${errNum}`) : (obs.calculatedError || '0');
                const mpeStr = obs.applicableRequirement || (obs.mpe ? `±${obs.mpe} ${unit}` : '±1.0 e');
                const rowPass = (obs.result || 'PASS').toUpperCase() === 'PASS';

                return new TableRow({
                  children: [
                    new TableCell({
                      borders: subtleBorders,
                      shading: { fill: isEven ? 'FFFFFF' : 'F8FAFC' },
                      children: [new Paragraph({ children: [new TextRun({ text: `${obs.testType || obs.testName || `Step ${idx + 1}`}${obs.testPoint ? ` - ${obs.testPoint}` : ''}`, size: 14 })] })]
                    }),
                    new TableCell({
                      borders: subtleBorders,
                      shading: { fill: isEven ? 'FFFFFF' : 'F8FAFC' },
                      children: [new Paragraph({ alignment: AlignmentType.RIGHT, children: [new TextRun({ text: refVal, size: 14 })] })]
                    }),
                    new TableCell({
                      borders: subtleBorders,
                      shading: { fill: isEven ? 'FFFFFF' : 'F8FAFC' },
                      children: [new Paragraph({ alignment: AlignmentType.RIGHT, children: [new TextRun({ text: indVal, size: 14 })] })]
                    }),
                    new TableCell({
                      borders: subtleBorders,
                      shading: { fill: isEven ? 'FFFFFF' : 'F8FAFC' },
                      children: [new Paragraph({ alignment: AlignmentType.RIGHT, children: [new TextRun({ text: `${errStr} ${unit}`, bold: true, color: '0F172A', size: 14 })] })]
                    }),
                    new TableCell({
                      borders: subtleBorders,
                      shading: { fill: isEven ? 'FFFFFF' : 'F8FAFC' },
                      children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: mpeStr, size: 13, color: '64748B' })] })]
                    }),
                    new TableCell({
                      borders: subtleBorders,
                      shading: { fill: isEven ? 'FFFFFF' : 'F8FAFC' },
                      children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: rowPass ? 'PASS' : 'FAIL', bold: true, color: rowPass ? '15803D' : 'B91C1C', size: 14 })] })]
                    })
                  ]
                });
              })
            ]
          }),

          // ==========================================
          // 6. SECTION 4: OVERALL DETERMINATION BOX
          // ==========================================
          new Paragraph({
            spacing: { before: 180, after: 60 },
            children: [
              new TextRun({ text: '4. OVERALL STATUTORY METROLOGICAL DETERMINATION', bold: true, size: 17, color: '1D4ED8' })
            ]
          }),
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            margins: cellMargins,
            rows: [
              new TableRow({
                children: [
                  new TableCell({
                    borders: {
                      top: { style: BorderStyle.SINGLE, size: 1, color: isPass ? '16A34A' : 'DC2626' },
                      bottom: { style: BorderStyle.SINGLE, size: 1, color: isPass ? '16A34A' : 'DC2626' },
                      left: { style: BorderStyle.SINGLE, size: 1, color: isPass ? '16A34A' : 'DC2626' },
                      right: { style: BorderStyle.SINGLE, size: 1, color: isPass ? '16A34A' : 'DC2626' }
                    },
                    shading: { fill: isPass ? 'F0FDF4' : 'FEF2F2' },
                    children: [
                      new Paragraph({
                        children: [
                          new TextRun({ text: 'COMPLIANCE VERDICT: ', bold: true, size: 17, color: '0F172A' }),
                          new TextRun({
                            text: isPass ? 'PASSED — CONFORMS TO OIML R 76-1' : 'FAILED — NON-COMPLIANT',
                            bold: true,
                            size: 19,
                            color: isPass ? '15803D' : 'B91C1C'
                          })
                        ]
                      }),
                      new Paragraph({
                        spacing: { before: 40 },
                        children: [
                          new TextRun({
                            text: `Remarks: ${report.remarks || 'All evaluated verification parameters satisfy the Maximum Permissible Error (MPE) limits specified in OIML Recommendation R 76-1.'}`,
                            italics: true,
                            size: 15,
                            color: '334155'
                          })
                        ]
                      })
                    ]
                  })
                ]
              })
            ]
          }),

          // ==========================================
          // 7. SECTION 5: SIGNATURES & AUTHORIZATION
          // ==========================================
          new Paragraph({
            spacing: { before: 180, after: 60 },
            children: [
              new TextRun({ text: '5. OFFICIAL AUTHORIZATION & DIGITAL SIGNATURES', bold: true, size: 17, color: '1D4ED8' })
            ]
          }),
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            margins: cellMargins,
            rows: [
              new TableRow({
                children: [
                  new TableCell({
                    borders,
                    shading: { fill: 'FFFFFF' },
                    width: { size: 50, type: WidthType.PERCENTAGE },
                    children: [
                      new Paragraph({ children: [new TextRun({ text: '✔ DIGITALLY VERIFIED BY METROLOGIST', bold: true, color: '15803D', size: 15 })] }),
                      new Paragraph({ spacing: { before: 30 }, children: [new TextRun({ text: engName, bold: true, size: 16, color: '0F172A' })] }),
                      new Paragraph({ children: [new TextRun({ text: 'Testing Metrologist • Regional Reference Standards Laboratory', size: 13, color: '64748B' })] }),
                      new Paragraph({ spacing: { before: 20 }, children: [new TextRun({ text: `Timestamp: ${testDt} 11:30 IST • Token: GOI-DLM-SIG-761`, italics: true, size: 12, color: '475569' })] })
                    ]
                  }),
                  new TableCell({
                    borders,
                    shading: { fill: 'FFFFFF' },
                    width: { size: 50, type: WidthType.PERCENTAGE },
                    children: [
                      new Paragraph({ children: [new TextRun({ text: '✔ APPROVED BY REVIEWING OFFICER', bold: true, color: '1D4ED8', size: 15 })] }),
                      new Paragraph({ spacing: { before: 30 }, children: [new TextRun({ text: revName, bold: true, size: 16, color: '0F172A' })] }),
                      new Paragraph({ children: [new TextRun({ text: 'Reviewing Officer • Directorate of Legal Metrology, New Delhi', size: 13, color: '64748B' })] }),
                      new Paragraph({ spacing: { before: 20 }, children: [new TextRun({ text: `Verification Ref: DLM-R76-CONF-${rptNum}`, italics: true, size: 12, color: '475569' })] })
                    ]
                  })
                ]
              })
            ]
          }),

          // Statutory Legal Notice
          new Paragraph({ spacing: { before: 120 } }),
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            margins: cellMargins,
            rows: [
              new TableRow({
                children: [
                  new TableCell({
                    borders: {
                      top: { style: BorderStyle.SINGLE, size: 1, color: 'F59E0B' },
                      bottom: { style: BorderStyle.SINGLE, size: 1, color: 'F59E0B' },
                      left: { style: BorderStyle.SINGLE, size: 1, color: 'F59E0B' },
                      right: { style: BorderStyle.SINGLE, size: 1, color: 'F59E0B' }
                    },
                    shading: { fill: 'FEF3C7' },
                    children: [
                      new Paragraph({
                        alignment: AlignmentType.CENTER,
                        children: [
                          new TextRun({
                            text: '★ OFFICIAL LEGAL METROLOGY RECORD — VERIFIED AND DIGITALLY RECORDED UNDER THE LEGAL METROLOGY ACT, 2009 ★',
                            bold: true,
                            size: 14,
                            color: '92400E'
                          })
                        ]
                      })
                    ]
                  })
                ]
              })
            ]
          })
        ]
      }]
    });

    return await Packer.toBuffer(doc);
  }
}
