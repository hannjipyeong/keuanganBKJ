<?php

namespace App\Support;

class FinanceDataService
{
    /**
     * @return array<string, mixed>
     */
    public function build(): array
    {
        $accountPayableInvoices = [
            ['id' => 'INV-001', 'vendor' => 'Acme Corp', 'amount' => 1200.00, 'dueDate' => '2026-08-01', 'status' => 'Pending'],
            ['id' => 'INV-002', 'vendor' => 'Global Tech', 'amount' => 3500.00, 'dueDate' => '2026-07-30', 'status' => 'Paid'],
            ['id' => 'INV-003', 'vendor' => 'Stark Industries', 'amount' => 850.00, 'dueDate' => '2026-08-15', 'status' => 'Pending'],
            ['id' => 'INV-004', 'vendor' => 'Wayne Enterprises', 'amount' => 1250.00, 'dueDate' => '2026-07-24', 'status' => 'Overdue'],
            ['id' => 'INV-008', 'vendor' => 'Global Tech', 'amount' => 3800.00, 'dueDate' => '2026-07-21', 'status' => 'Overdue'],
        ];

        $accountReceivableInvoices = [
            ['id' => 'REC-1001', 'customer' => 'Wayne Enterprises', 'amount' => 5000.00, 'dueDate' => '2026-07-28', 'status' => 'Pending', 'aging' => 0],
            ['id' => 'REC-1002', 'customer' => 'LexCorp', 'amount' => 3200.50, 'dueDate' => '2026-07-15', 'status' => 'Overdue', 'aging' => 12],
            ['id' => 'REC-1003', 'customer' => 'Daily Planet', 'amount' => 1500.00, 'dueDate' => '2026-08-10', 'status' => 'Pending', 'aging' => 0],
            ['id' => 'REC-1004', 'customer' => 'Oscorp', 'amount' => 8900.00, 'dueDate' => '2026-06-20', 'status' => 'Overdue', 'aging' => 37],
            ['id' => 'REC-1005', 'customer' => 'Umbrella Corp', 'amount' => 450.00, 'dueDate' => '2026-07-25', 'status' => 'Paid', 'aging' => 0],
        ];

        $generalLedgerCoa = [
            ['code' => '1001', 'name' => 'Kas', 'type' => 'Asset', 'balance' => 15500.00],
            ['code' => '1002', 'name' => 'Piutang Usaha', 'type' => 'Asset', 'balance' => 5000.00],
            ['code' => '2001', 'name' => 'Utang Usaha', 'type' => 'Liability', 'balance' => 2500.00],
            ['code' => '3001', 'name' => 'Ekuitas Pemilik', 'type' => 'Equity', 'balance' => 10000.00],
            ['code' => '4001', 'name' => 'Pendapatan Penjualan', 'type' => 'Revenue', 'balance' => 15000.00],
            ['code' => '5001', 'name' => 'Beban Sewa', 'type' => 'Expense', 'balance' => 1000.00],
            ['code' => '5002', 'name' => 'Beban Gaji', 'type' => 'Expense', 'balance' => 6000.00],
        ];

        $generalLedgerJournals = [
            [
                'id' => 'JE-001',
                'date' => '2026-07-01',
                'description' => 'Investasi Awal',
                'isPosted' => true,
                'lines' => [
                    ['accountCode' => '1001', 'debit' => 10000.00, 'credit' => 0],
                    ['accountCode' => '3001', 'debit' => 0, 'credit' => 10000.00],
                ],
            ],
            [
                'id' => 'JE-002',
                'date' => '2026-07-05',
                'description' => 'Sewa Kantor Juli',
                'isPosted' => true,
                'lines' => [
                    ['accountCode' => '5001', 'debit' => 1000.00, 'credit' => 0],
                    ['accountCode' => '1001', 'debit' => 0, 'credit' => 1000.00],
                ],
            ],
        ];

        $approvalRules = [
            ['id' => 'R-001', 'division' => 'All', 'transactionType' => 'Expense Claim', 'minAmount' => 0, 'maxAmount' => 1000, 'approvers' => ['Manager']],
            ['id' => 'R-002', 'division' => 'All', 'transactionType' => 'Expense Claim', 'minAmount' => 1001, 'maxAmount' => null, 'approvers' => ['Manager', 'Director']],
            ['id' => 'R-003', 'division' => 'IT', 'transactionType' => 'Equipment Purchase', 'minAmount' => 0, 'maxAmount' => 5000, 'approvers' => ['IT Manager', 'CTO']],
            ['id' => 'R-004', 'division' => 'Finance', 'transactionType' => 'Vendor Payment', 'minAmount' => 0, 'maxAmount' => 10000, 'approvers' => ['Finance Controller']],
            ['id' => 'R-005', 'division' => 'Finance', 'transactionType' => 'Vendor Payment', 'minAmount' => 10001, 'maxAmount' => null, 'approvers' => ['Finance Controller', 'CFO']],
        ];

        $approvalRequests = [
            [
                'id' => 'REQ-501',
                'date' => '2026-07-25',
                'requester' => 'John Doe',
                'division' => 'Sales',
                'transactionType' => 'Expense Claim',
                'amount' => 450.00,
                'description' => 'Client Lunch Meeting',
                'currentLevel' => 1,
                'requiredLevels' => 1,
                'status' => 'Pending',
                'history' => [],
            ],
            [
                'id' => 'REQ-502',
                'date' => '2026-07-26',
                'requester' => 'Jane Smith',
                'division' => 'IT',
                'transactionType' => 'Equipment Purchase',
                'amount' => 4500.00,
                'description' => 'New Developer Laptops (3x)',
                'currentLevel' => 1,
                'requiredLevels' => 2,
                'status' => 'Pending',
                'history' => [],
            ],
            [
                'id' => 'REQ-503',
                'date' => '2026-07-26',
                'requester' => 'Mike Ross',
                'division' => 'Finance',
                'transactionType' => 'Vendor Payment',
                'amount' => 15000.00,
                'description' => 'Annual Software License Renewal',
                'currentLevel' => 2,
                'requiredLevels' => 2,
                'status' => 'Pending',
                'history' => [
                    ['level' => 1, 'approver' => 'Finance Controller', 'action' => 'Approved', 'date' => '2026-07-26 10:00 AM'],
                ],
            ],
            [
                'id' => 'REQ-499',
                'date' => '2026-07-20',
                'requester' => 'Sarah Connor',
                'division' => 'Marketing',
                'transactionType' => 'Expense Claim',
                'amount' => 2500.00,
                'description' => 'Ad Campaign Funding',
                'currentLevel' => 2,
                'requiredLevels' => 2,
                'status' => 'Rejected',
                'history' => [
                    ['level' => 1, 'approver' => 'Manager', 'action' => 'Approved', 'date' => '2026-07-21 09:00 AM'],
                    ['level' => 2, 'approver' => 'Director', 'action' => 'Rejected', 'date' => '2026-07-22 14:30 PM'],
                ],
            ],
            [
                'id' => 'REQ-498',
                'date' => '2026-07-19',
                'requester' => 'Bruce Wayne',
                'division' => 'IT',
                'transactionType' => 'Equipment Purchase',
                'amount' => 1200.00,
                'description' => 'Server Rack Upgrade',
                'currentLevel' => 2,
                'requiredLevels' => 2,
                'status' => 'Approved',
                'history' => [
                    ['level' => 1, 'approver' => 'IT Manager', 'action' => 'Approved', 'date' => '2026-07-19 11:00 AM'],
                    ['level' => 2, 'approver' => 'CTO', 'action' => 'Approved', 'date' => '2026-07-20 16:00 PM'],
                ],
            ],
        ];

        $approverBottlenecks = [
            ['name' => 'Finance Controller', 'role' => 'Level 1 Finance Approval', 'delayedCases' => 12, 'avgDelayHours' => 28, 'onTimeRate' => 62],
            ['name' => 'Director', 'role' => 'Level 2 Management Approval', 'delayedCases' => 9, 'avgDelayHours' => 35, 'onTimeRate' => 58],
            ['name' => 'CTO', 'role' => 'Level 2 IT Approval', 'delayedCases' => 7, 'avgDelayHours' => 22, 'onTimeRate' => 69],
            ['name' => 'Manager', 'role' => 'Level 1 General Approval', 'delayedCases' => 4, 'avgDelayHours' => 14, 'onTimeRate' => 81],
        ];

        $processBottlenecks = [
            ['process' => 'Vendor Payment > 10,000 (Finance + CFO)', 'delayedCases' => 11, 'avgDelayHours' => 31, 'impactToClosingDays' => 3.6],
            ['process' => 'Equipment Purchase (IT Manager + CTO)', 'delayedCases' => 8, 'avgDelayHours' => 24, 'impactToClosingDays' => 2.4],
            ['process' => 'Expense Claim Level 2 (Manager + Director)', 'delayedCases' => 6, 'avgDelayHours' => 18, 'impactToClosingDays' => 1.8],
        ];

        $reconciliationSuggestions = [
            [
                'id' => 'REC-SUG-01',
                'bankRef' => 'BNK-TRX-778102',
                'bankDate' => '2026-07-27 08:19:44',
                'bankAmount' => 1250,
                'direction' => 'Outgoing',
                'candidateDoc' => 'INV-004',
                'candidateParty' => 'Wayne Enterprises',
                'matchReason' => 'Nominal sama, vendor sama, tanggal jatuh tempo selisih 1 hari.',
                'confidence' => 96,
                'status' => 'Cocok Otomatis',
            ],
            [
                'id' => 'REC-SUG-02',
                'bankRef' => 'BNK-TRX-778123',
                'bankDate' => '2026-07-27 11:03:21',
                'bankAmount' => 3200.5,
                'direction' => 'Incoming',
                'candidateDoc' => 'REC-1002',
                'candidateParty' => 'LexCorp',
                'matchReason' => 'Nominal sama, customer sama, memo transfer mirip nomor invoice.',
                'confidence' => 91,
                'status' => 'Disarankan',
            ],
            [
                'id' => 'REC-SUG-03',
                'bankRef' => 'BNK-TRX-778145',
                'bankDate' => '2026-07-26 16:12:09',
                'bankAmount' => 3800,
                'direction' => 'Outgoing',
                'candidateDoc' => 'INV-008',
                'candidateParty' => 'Global Tech',
                'matchReason' => 'Nominal cocok, namun dokumen pendukung belum tersedia.',
                'confidence' => 74,
                'status' => 'Perlu Tinjauan',
            ],
            [
                'id' => 'REC-SUG-04',
                'bankRef' => 'BNK-TRX-778167',
                'bankDate' => '2026-07-26 10:40:11',
                'bankAmount' => 98500,
                'direction' => 'Incoming',
                'candidateDoc' => 'REC-1005',
                'candidateParty' => 'Daily Planet',
                'matchReason' => 'Nilai mendekati setelah potongan biaya transfer bank.',
                'confidence' => 67,
                'status' => 'Perlu Tinjauan',
            ],
        ];

        $auditLogs = [
            [
                'id' => 'LOG-8092',
                'user' => ['name' => 'Sarah Connor', 'email' => 'sarah.c@example.com'],
                'action' => 'Approve',
                'module' => 'Alur Persetujuan',
                'description' => 'Menyetujui pembelian peralatan REQ-498 (Level 2)',
                'timestamp' => '2026-07-27 14:30:12',
            ],
            [
                'id' => 'LOG-8091',
                'user' => ['name' => 'John Doe', 'email' => 'john.d@example.com'],
                'action' => 'Input',
                'module' => 'Utang Usaha',
                'description' => 'Membuat faktur baru INV-004 untuk Wayne Enterprises (Rp1.250,00)',
                'timestamp' => '2026-07-27 11:15:05',
                'document' => ['name' => 'invoice_wayne_ent.pdf', 'size' => '2.4 MB'],
            ],
            [
                'id' => 'LOG-8090',
                'user' => ['name' => 'Jane Smith', 'email' => 'jane.s@example.com'],
                'action' => 'Edit',
                'module' => 'Piutang Usaha',
                'description' => 'Memperbarui jatuh tempo REC-1002 dari 2026-07-15 ke 2026-07-30',
                'timestamp' => '2026-07-26 16:45:22',
                'document' => ['name' => 'agreement_extension.pdf', 'size' => '1.1 MB'],
            ],
            [
                'id' => 'LOG-8089',
                'user' => ['name' => 'Mike Ross', 'email' => 'mike.r@example.com'],
                'action' => 'Reject',
                'module' => 'Alur Persetujuan',
                'description' => 'Menolak klaim biaya REQ-499 (alokasi anggaran tidak cukup)',
                'timestamp' => '2026-07-26 09:20:00',
            ],
        ];

        $anomalies = [
            [
                'id' => 'ANM-101',
                'invoiceNo' => 'INV-004',
                'vendorOrCustomer' => 'Wayne Enterprises',
                'module' => 'Accounts Payable',
                'amount' => 1250,
                'type' => 'Duplicate Invoice',
                'reason' => 'Nomor invoice dan nominal sama terdeteksi dua kali dalam 24 jam.',
                'timestamp' => '2026-07-27 11:20:10',
                'severity' => 'High',
            ],
            [
                'id' => 'ANM-102',
                'invoiceNo' => 'REC-1005',
                'vendorOrCustomer' => 'Daily Planet',
                'module' => 'Accounts Receivable',
                'amount' => 98500,
                'type' => 'Unusual Amount',
                'reason' => 'Nilai transaksi jauh di atas rata-rata historis (+340%).',
                'timestamp' => '2026-07-27 10:04:18',
                'severity' => 'High',
            ],
            [
                'id' => 'ANM-103',
                'invoiceNo' => 'INV-008',
                'vendorOrCustomer' => 'Global Tech',
                'module' => 'Accounts Payable',
                'amount' => 3800,
                'type' => 'Missing Document',
                'reason' => 'Transaksi diposting tanpa lampiran faktur atau tanda terima.',
                'timestamp' => '2026-07-26 15:42:57',
                'severity' => 'Medium',
            ],
        ];

        $reporting = [
            'profitAndLoss' => [
                'period' => 'July 2026',
                'revenue' => [
                    ['account' => 'Sales Revenue', 'amount' => 125000],
                    ['account' => 'Service Revenue', 'amount' => 45000],
                    ['account' => 'Interest Income', 'amount' => 1500],
                ],
                'cogs' => [
                    ['account' => 'Cost of Goods Sold', 'amount' => -65000],
                ],
                'expenses' => [
                    ['account' => 'Salaries & Wages', 'amount' => -35000],
                    ['account' => 'Rent Expense', 'amount' => -10000],
                    ['account' => 'Utilities', 'amount' => -2500],
                    ['account' => 'Marketing & Advertising', 'amount' => -8000],
                    ['account' => 'Depreciation', 'amount' => -4000],
                ],
            ],
            'balanceSheet' => [
                'period' => 'As of July 31, 2026',
                'assets' => [
                    'current' => [
                        ['account' => 'Cash & Equivalents', 'amount' => 85000],
                        ['account' => 'Accounts Receivable', 'amount' => 42000],
                        ['account' => 'Inventory', 'amount' => 35000],
                    ],
                    'fixed' => [
                        ['account' => 'Property & Equipment', 'amount' => 150000],
                        ['account' => 'Accumulated Depreciation', 'amount' => -45000],
                    ],
                ],
                'liabilities' => [
                    ['account' => 'Accounts Payable', 'amount' => 28000],
                    ['account' => 'Short-term Debt', 'amount' => 15000],
                    ['account' => 'Long-term Loans', 'amount' => 65000],
                ],
                'equity' => [
                    ['account' => "Owner's Capital", 'amount' => 100000],
                    ['account' => 'Retained Earnings', 'amount' => 59000],
                ],
            ],
            'cashFlow' => [
                'period' => 'July 2026',
                'operating' => [
                    ['account' => 'Net Income', 'amount' => 47000],
                    ['account' => 'Depreciation (Non-cash)', 'amount' => 4000],
                    ['account' => 'Increase in Accounts Receivable', 'amount' => -5000],
                    ['account' => 'Increase in Accounts Payable', 'amount' => 3000],
                ],
                'investing' => [
                    ['account' => 'Purchase of Equipment', 'amount' => -15000],
                ],
                'financing' => [
                    ['account' => 'Repayment of Bank Loan', 'amount' => -5000],
                    ['account' => 'Dividend Paid', 'amount' => -8000],
                ],
                'beginningCash' => 64000,
            ],
            'budgetVsActual' => [
                ['department' => 'Sales Division', 'budget' => 150000, 'actual' => 170000],
                ['department' => 'Marketing', 'budget' => 12000, 'actual' => 8000],
                ['department' => 'IT & Infrastructure', 'budget' => 25000, 'actual' => 28000],
                ['department' => 'Operations', 'budget' => 50000, 'actual' => 48000],
                ['department' => 'Human Resources', 'budget' => 40000, 'actual' => 38000],
            ],
            'fluxAnalysisData' => [
                ['account' => 'Cash & Equivalents', 'previousMonth' => 72000, 'currentMonth' => 85000, 'expectedVolatilityPct' => 20],
                ['account' => 'Accounts Receivable', 'previousMonth' => 30000, 'currentMonth' => 42000, 'expectedVolatilityPct' => 25],
                ['account' => 'Inventory', 'previousMonth' => 36000, 'currentMonth' => 35000, 'expectedVolatilityPct' => 15],
                ['account' => 'Accounts Payable', 'previousMonth' => 21000, 'currentMonth' => 28000, 'expectedVolatilityPct' => 20],
                ['account' => 'Marketing Expense', 'previousMonth' => 5000, 'currentMonth' => 8000, 'expectedVolatilityPct' => 18],
                ['account' => 'Utilities Expense', 'previousMonth' => 2100, 'currentMonth' => 2500, 'expectedVolatilityPct' => 15],
                ['account' => 'Service Revenue', 'previousMonth' => 36000, 'currentMonth' => 45000, 'expectedVolatilityPct' => 20],
            ],
        ];

        $apOpen = array_values(array_filter($accountPayableInvoices, fn ($item) => $item['status'] !== 'Paid'));
        $apOverdue = array_values(array_filter($accountPayableInvoices, fn ($item) => $item['status'] === 'Overdue'));
        $arOpen = array_values(array_filter($accountReceivableInvoices, fn ($item) => $item['status'] !== 'Paid'));
        $arOverdue = array_values(array_filter($accountReceivableInvoices, fn ($item) => $item['status'] === 'Overdue'));
        $pendingApprovals = array_values(array_filter($approvalRequests, fn ($item) => $item['status'] === 'Pending'));
        $unreconciled = array_values(array_filter($reconciliationSuggestions, fn ($item) => $item['confidence'] < 75 || $item['status'] === 'Perlu Tinjauan'));

        $totalApRisk = array_sum(array_map(fn ($item) => $this->currencyToFloat((string) $item['amount']), $apOverdue));
        $totalArRisk = array_sum(array_map(fn ($item) => (float) $item['amount'], $arOverdue));
        $approvalRisk = array_sum(array_map(fn ($item) => (float) $item['amount'], $pendingApprovals));

        $dashboard = [
            'kpi' => [
                'totalOverdueCount' => count($apOverdue) + count($arOverdue),
                'pendingApprovalCount' => count($pendingApprovals),
                'unreconciledCount' => count($unreconciled),
                'anomalyCount' => count($anomalies),
                'cashRiskLevel' => ($totalArRisk + $approvalRisk) > ($totalApRisk * 2) ? 'Kritis' : 'Waspada',
            ],
            'operationalSnapshot' => [
                [
                    'module' => 'Utang Usaha',
                    'openItems' => count($apOpen),
                    'overdueItems' => count($apOverdue),
                    'riskValue' => $totalApRisk,
                ],
                [
                    'module' => 'Piutang Usaha',
                    'openItems' => count($arOpen),
                    'overdueItems' => count($arOverdue),
                    'riskValue' => $totalArRisk,
                ],
                [
                    'module' => 'Alur Persetujuan',
                    'openItems' => count($pendingApprovals),
                    'overdueItems' => count(array_filter($pendingApprovals, fn ($item) => (int) $item['currentLevel'] > 1)),
                    'riskValue' => $approvalRisk,
                ],
            ],
            'areaChart' => [
                'overdueTrend' => [
                    ['label' => 'M1', 'ap' => 6, 'ar' => 5],
                    ['label' => 'M2', 'ap' => 5, 'ar' => 6],
                    ['label' => 'M3', 'ap' => 7, 'ar' => 5],
                    ['label' => 'M4', 'ap' => 6, 'ar' => 4],
                    ['label' => 'M5', 'ap' => 5, 'ar' => 4],
                    ['label' => 'M6', 'ap' => count($apOverdue), 'ar' => count($arOverdue)],
                ],
                'controlRiskTrend' => [
                    ['label' => 'M1', 'approval' => 6, 'recon' => 5, 'anomaly' => 3],
                    ['label' => 'M2', 'approval' => 5, 'recon' => 6, 'anomaly' => 4],
                    ['label' => 'M3', 'approval' => 4, 'recon' => 5, 'anomaly' => 4],
                    ['label' => 'M4', 'approval' => 4, 'recon' => 4, 'anomaly' => 3],
                    ['label' => 'M5', 'approval' => 3, 'recon' => 4, 'anomaly' => 3],
                    ['label' => 'M6', 'approval' => count($pendingApprovals), 'recon' => count($unreconciled), 'anomaly' => count($anomalies)],
                ],
            ],
        ];

        $financeCommandCenter = [
            'criticalToday' => [
                [
                    'id' => 'CRT-01',
                    'title' => 'Pembayaran vendor di atas batas menunggu persetujuan CFO',
                    'owner' => 'Finance Controller',
                    'dueTime' => 'Hari ini 14:00',
                    'severity' => 'High',
                    'category' => 'Persetujuan',
                ],
                [
                    'id' => 'CRT-02',
                    'title' => 'Transfer masuk belum rekonsiliasi menunggu verifikasi',
                    'owner' => 'Treasury Team',
                    'dueTime' => 'Hari ini 16:30',
                    'severity' => 'Medium',
                    'category' => 'Rekonsiliasi',
                ],
                [
                    'id' => 'CRT-03',
                    'title' => 'Faktur utang usaha tanpa dokumen pendukung',
                    'owner' => 'Accounts Payable',
                    'dueTime' => 'Hari ini 17:00',
                    'severity' => 'High',
                    'category' => 'Kepatuhan',
                ],
            ],
            'overdueItems' => [
                ['reference' => 'INV-008', 'counterpart' => 'Global Tech', 'amount' => 3800, 'overdueDays' => 6, 'module' => 'Utang Usaha'],
                ['reference' => 'REC-1002', 'counterpart' => 'LexCorp', 'amount' => 3200.5, 'overdueDays' => 12, 'module' => 'Piutang Usaha'],
                ['reference' => 'INV-004', 'counterpart' => 'Wayne Enterprises', 'amount' => 1250, 'overdueDays' => 3, 'module' => 'Utang Usaha'],
            ],
            'unreconciledItems' => array_map(
                fn ($item) => [
                    'bankRef' => $item['bankRef'],
                    'candidateDoc' => $item['candidateDoc'],
                    'amount' => $item['bankAmount'],
                    'ageDays' => 4,
                    'confidence' => $item['confidence'],
                ],
                $unreconciled,
            ),
            'pendingApprovals' => array_map(
                fn ($item) => [
                    'requestId' => $item['id'],
                    'approver' => $item['requiredLevels'] > 1 ? 'Direktur/CFO' : 'Manager',
                    'stage' => 'Level '.$item['currentLevel'].' / '.$item['requiredLevels'],
                    'waitHours' => $item['currentLevel'] > 1 ? 29 : 11,
                ],
                $pendingApprovals,
            ),
            'cashRiskSignals' => [
                ['signal' => 'Proyeksi ketahanan kas', 'value' => '36 hari', 'status' => 'Watch', 'note' => 'Di bawah target internal 45 hari.'],
                ['signal' => 'Perkiraan arus keluar 7 hari ke depan', 'value' => 'Rp148.500', 'status' => 'Critical', 'note' => 'Pembayaran vendor besar terkonsentrasi minggu ini.'],
                ['signal' => 'Perkiraan arus masuk 7 hari ke depan', 'value' => 'Rp96.200', 'status' => 'Watch', 'note' => 'Keterlambatan penagihan memicu celah kas sementara.'],
                ['signal' => 'Kesenjangan kas jangka pendek bersih', 'value' => '-Rp52.300', 'status' => 'Critical', 'note' => 'Pertimbangkan penjadwalan ulang pembayaran atau percepat penagihan.'],
            ],
        ];

        return [
            'dashboard' => $dashboard,
            'accountPayable' => ['invoices' => $accountPayableInvoices],
            'accountReceivable' => ['invoices' => $accountReceivableInvoices],
            'generalLedger' => ['coa' => $generalLedgerCoa, 'journals' => $generalLedgerJournals],
            'approvalWorkflow' => [
                'rules' => $approvalRules,
                'requests' => $approvalRequests,
                'approverBottlenecks' => $approverBottlenecks,
                'processBottlenecks' => $processBottlenecks,
            ],
            'reporting' => $reporting,
            'reconciliation' => ['suggestions' => $reconciliationSuggestions],
            'auditTrail' => ['logs' => $auditLogs, 'anomalies' => $anomalies],
            'financeCommandCenter' => $financeCommandCenter,
        ];
    }

    private function currencyToFloat(string $value): float
    {
        $normalized = str_replace(['$', ','], '', $value);

        return (float) $normalized;
    }
}
