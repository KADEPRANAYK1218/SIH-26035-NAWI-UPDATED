/**
 * Database Abstraction Layer
 * Supports in-memory transactional storage seeded with complete demo dataset,
 * with optional PostgreSQL client interface.
 */

import { getSeedData } from '../../../database/seed.js';

class InMemoryDatabase {
  constructor() {
    this.users = [];
    this.instruments = [];
    this.testReports = [];
    this.laboratoryConditions = [];
    this.testObservations = [];
    this.attachments = [];
    this.regulatoryReferences = [];
    this.ruleConfigurations = [];
    this.auditLogs = [];
    this.initialized = false;
  }

  async initialize() {
    if (this.initialized) return;
    const seed = await getSeedData();
    this.users = [...seed.users];
    this.instruments = [...seed.instruments];
    this.testReports = [...seed.testReports];
    this.laboratoryConditions = [...seed.laboratoryConditions];
    this.testObservations = [...seed.testObservations];
    this.attachments = [...seed.attachments];
    this.regulatoryReferences = [...seed.regulatoryReferences];
    this.ruleConfigurations = [...seed.ruleConfigurations];
    this.auditLogs = [...seed.auditLogs];
    this.initialized = true;
    console.log(`[Database] Initialized in-memory store with ${this.testReports.length} reports, ${this.instruments.length} instruments, ${this.users.length} users.`);
  }

  // Users
  async findUserByEmail(email) {
    await this.initialize();
    return this.users.find(u => u.email.toLowerCase() === email.toLowerCase());
  }

  async findUserById(id) {
    await this.initialize();
    return this.users.find(u => u.id === id);
  }

  async getAllUsers() {
    await this.initialize();
    return this.users.map(({ passwordHash, ...rest }) => rest);
  }

  async createUser(userData) {
    await this.initialize();
    const newUser = {
      id: `USR-${Date.now().toString().slice(-4)}`,
      createdAt: new Date().toISOString(),
      status: 'ACTIVE',
      ...userData
    };
    this.users.push(newUser);
    return newUser;
  }

  async updateUser(id, updates) {
    await this.initialize();
    const index = this.users.findIndex(u => u.id === id);
    if (index === -1) return null;
    this.users[index] = { ...this.users[index], ...updates, updatedAt: new Date().toISOString() };
    const { passwordHash, ...safeUser } = this.users[index];
    return safeUser;
  }

  // Instruments
  async getAllInstruments() {
    await this.initialize();
    return this.instruments;
  }

  async findInstrumentById(id) {
    await this.initialize();
    return this.instruments.find(i => i.id === id || i.serialNumber === id);
  }

  async createInstrument(data) {
    await this.initialize();
    const id = `INST-${Date.now().toString().slice(-4)}`;
    const n = Math.round(Number(data.maxCapacity) / (Number(data.verificationScaleInterval) || 1));
    const newInst = {
      id,
      ...data,
      numberOfVerificationIntervals: n,
      createdAt: new Date().toISOString()
    };
    this.instruments.push(newInst);
    return newInst;
  }

  async updateInstrument(id, updates) {
    await this.initialize();
    const index = this.instruments.findIndex(i => i.id === id);
    if (index === -1) return null;
    this.instruments[index] = { ...this.instruments[index], ...updates };
    return this.instruments[index];
  }

  // Test Reports
  async getAllReports(filters = {}) {
    await this.initialize();
    let results = [...this.testReports];

    if (filters.status) {
      results = results.filter(r => r.status.toUpperCase() === filters.status.toUpperCase());
    }
    if (filters.overallResult) {
      results = results.filter(r => r.overallResult.toUpperCase() === filters.overallResult.toUpperCase());
    }
    if (filters.search) {
      const q = filters.search.toLowerCase();
      results = results.filter(r => {
        const inst = this.instruments.find(i => i.id === r.instrumentId);
        return (
          r.reportNumber.toLowerCase().includes(q) ||
          r.laboratoryName.toLowerCase().includes(q) ||
          r.testEngineerName.toLowerCase().includes(q) ||
          (inst && (
            inst.manufacturer.toLowerCase().includes(q) ||
            inst.model.toLowerCase().includes(q) ||
            inst.serialNumber.toLowerCase().includes(q)
          ))
        );
      });
    }
    if (filters.fromDate) {
      results = results.filter(r => new Date(r.testDate) >= new Date(filters.fromDate));
    }
    if (filters.toDate) {
      results = results.filter(r => new Date(r.testDate) <= new Date(filters.toDate));
    }

    // Sort by testDate / createdAt descending
    results.sort((a, b) => new Date(b.createdAt || b.testDate) - new Date(a.createdAt || a.testDate));

    // Enrich with instrument details
    return results.map(report => {
      const instrument = this.instruments.find(i => i.id === report.instrumentId) || null;
      return { ...report, instrument };
    });
  }

  async findReportById(id) {
    await this.initialize();
    const report = this.testReports.find(r => r.id === id || r.reportNumber === id);
    if (!report) return null;

    const instrument = this.instruments.find(i => i.id === report.instrumentId) || null;
    const labConditions = this.laboratoryConditions.find(lc => lc.reportId === report.id) || null;
    const observations = this.testObservations.filter(o => o.reportId === report.id);
    const reportAttachments = this.attachments.filter(a => a.reportId === report.id);

    // Get instrument test history
    const historyReports = this.testReports
      .filter(r => r.instrumentId === report.instrumentId)
      .map(r => ({
        id: r.id,
        reportNumber: r.reportNumber,
        testDate: r.testDate,
        status: r.status,
        overallResult: r.overallResult
      }));

    return {
      ...report,
      instrument,
      laboratoryConditions: labConditions,
      observations,
      attachments: reportAttachments,
      history: historyReports
    };
  }

  async createReport(reportData, labData = {}, observations = []) {
    await this.initialize();
    const count = this.testReports.length + 1;
    const reportId = `RPT-${String(count).padStart(3, '0')}`;
    const reportNumber = `RPT-${new Date().getFullYear()}-${String(count).padStart(3, '0')}`;

    const newReport = {
      id: reportId,
      reportNumber,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: reportData.status || 'IN_PROGRESS',
      overallResult: reportData.overallResult || 'PENDING',
      signedByEngineer: false,
      engineerSignedAt: null,
      signedByReviewer: false,
      reviewerSignedAt: null,
      ...reportData
    };

    this.testReports.push(newReport);

    if (labData) {
      const labConditionId = `LC-${String(this.laboratoryConditions.length + 1).padStart(3, '0')}`;
      this.laboratoryConditions.push({
        id: labConditionId,
        reportId,
        ...labData
      });
    }

    if (Array.isArray(observations) && observations.length > 0) {
      observations.forEach((obs, idx) => {
        this.testObservations.push({
          id: `OBS-${Date.now()}-${idx}`,
          reportId,
          createdAt: new Date().toISOString(),
          ...obs
        });
      });
    }

    return this.findReportById(reportId);
  }

  async updateReport(id, updates) {
    await this.initialize();
    const index = this.testReports.findIndex(r => r.id === id || r.reportNumber === id);
    if (index === -1) return null;

    this.testReports[index] = {
      ...this.testReports[index],
      ...updates,
      updatedAt: new Date().toISOString()
    };

    return this.findReportById(this.testReports[index].id);
  }

  async deleteReport(id) {
    await this.initialize();
    const index = this.testReports.findIndex(r => r.id === id || r.reportNumber === id);
    if (index === -1) return false;
    const repId = this.testReports[index].id;
    this.testReports.splice(index, 1);
    this.laboratoryConditions = this.laboratoryConditions.filter(lc => lc.reportId !== repId);
    this.testObservations = this.testObservations.filter(o => o.reportId !== repId);
    this.attachments = this.attachments.filter(a => a.reportId !== repId);
    return true;
  }

  // Observations
  async getObservationsByReportId(reportId) {
    await this.initialize();
    return this.testObservations.filter(o => o.reportId === reportId);
  }

  async saveObservations(reportId, observations) {
    await this.initialize();
    // remove existing observations for this report
    this.testObservations = this.testObservations.filter(o => o.reportId !== reportId);
    observations.forEach((obs, idx) => {
      this.testObservations.push({
        id: `OBS-${Date.now()}-${idx}`,
        reportId,
        createdAt: new Date().toISOString(),
        ...obs
      });
    });
    return this.getObservationsByReportId(reportId);
  }

  // Attachments
  async getAttachmentsByReportId(reportId) {
    await this.initialize();
    return this.attachments.filter(a => a.reportId === reportId);
  }

  async createAttachment(data) {
    await this.initialize();
    const attId = `ATT-${Date.now().toString().slice(-4)}`;
    const newAtt = {
      id: attId,
      uploadedAt: new Date().toISOString(),
      ...data
    };
    this.attachments.push(newAtt);
    return newAtt;
  }

  // Regulatory references & Rule configs
  async getRegulatoryReferences() {
    await this.initialize();
    return this.regulatoryReferences;
  }

  async getRuleConfigurations() {
    await this.initialize();
    return this.ruleConfigurations;
  }

  // Audit Logs
  async logAction(userId, userEmail, action, entity, entityId, details) {
    await this.initialize();
    const log = {
      id: `LOG-${Date.now()}`,
      userId,
      userEmail,
      action,
      entity,
      entityId,
      details,
      timestamp: new Date().toISOString()
    };
    this.auditLogs.push(log);
    return log;
  }

  async getAuditLogs() {
    await this.initialize();
    return this.auditLogs.slice(-50).reverse();
  }

  // Dashboard Summary Analytics
  async getDashboardSummary() {
    await this.initialize();
    const totalReports = this.testReports.length;
    const inProgress = this.testReports.filter(r => r.status === 'IN_PROGRESS').length;
    const completed = this.testReports.filter(r => r.status === 'COMPLETED').length;
    const failed = this.testReports.filter(r => r.status === 'FAILED' || r.overallResult === 'FAIL').length;
    const pendingReview = this.testReports.filter(r => r.status === 'PENDING_REVIEW').length;

    // Test type distribution count
    const testTypeCounts = {};
    this.testObservations.forEach(obs => {
      testTypeCounts[obs.testType] = (testTypeCounts[obs.testType] || 0) + 1;
    });

    const testTypeDistribution = Object.keys(testTypeCounts).map(type => ({
      name: type,
      count: testTypeCounts[type]
    }));

    return {
      totalReports,
      inProgress,
      completed,
      failed,
      pendingReview,
      testTypeDistribution
    };
  }
}

export const db = new InMemoryDatabase();
