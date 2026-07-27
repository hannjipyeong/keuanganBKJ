import { Head, usePage } from '@inertiajs/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { BarChart3, PieChart, Activity, Target, Download, TrendingDown, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';

type Props = {
    pageTitle?: string;
};

// --- DUMMY DATA FOR REPORTS ---

// 1. Profit & Loss (Laba Rugi)
const profitAndLoss = {
    period: 'July 2026',
    revenue: [
        { account: 'Sales Revenue', amount: 125000 },
        { account: 'Service Revenue', amount: 45000 },
        { account: 'Interest Income', amount: 1500 },
    ],
    cogs: [
        { account: 'Cost of Goods Sold', amount: -65000 },
    ],
    expenses: [
        { account: 'Salaries & Wages', amount: -35000 },
        { account: 'Rent Expense', amount: -10000 },
        { account: 'Utilities', amount: -2500 },
        { account: 'Marketing & Advertising', amount: -8000 },
        { account: 'Depreciation', amount: -4000 },
    ]
};

// 2. Balance Sheet (Neraca)
const balanceSheet = {
    period: 'As of July 31, 2026',
    assets: {
        current: [
            { account: 'Cash & Equivalents', amount: 85000 },
            { account: 'Accounts Receivable', amount: 42000 },
            { account: 'Inventory', amount: 35000 },
        ],
        fixed: [
            { account: 'Property & Equipment', amount: 150000 },
            { account: 'Accumulated Depreciation', amount: -45000 },
        ]
    },
    liabilities: [
        { account: 'Accounts Payable', amount: 28000 },
        { account: 'Short-term Debt', amount: 15000 },
        { account: 'Long-term Loans', amount: 65000 },
    ],
    equity: [
        { account: 'Owner\'s Capital', amount: 100000 },
        { account: 'Retained Earnings', amount: 59000 }, // Matches exactly to balance Assets
    ]
};

// 3. Cash Flow (Arus Kas)
const cashFlow = {
    period: 'July 2026',
    operating: [
        { account: 'Net Income', amount: 47000 },
        { account: 'Depreciation (Non-cash)', amount: 4000 },
        { account: 'Increase in Accounts Receivable', amount: -5000 },
        { account: 'Increase in Accounts Payable', amount: 3000 },
    ],
    investing: [
        { account: 'Purchase of Equipment', amount: -15000 },
    ],
    financing: [
        { account: 'Repayment of Bank Loan', amount: -5000 },
        { account: 'Dividend Paid', amount: -8000 },
    ],
    beginningCash: 64000
};

// 4. Budget vs Actual
const budgetVsActual = [
    { department: 'Sales Division', budget: 150000, actual: 170000 },
    { department: 'Marketing', budget: 12000, actual: 8000 },
    { department: 'IT & Infrastructure', budget: 25000, actual: 28000 },
    { department: 'Operations', budget: 50000, actual: 48000 },
    { department: 'Human Resources', budget: 40000, actual: 38000 },
];

// 5. Flux Analysis (MoM movement by account)
const fluxAnalysisData = [
    { account: 'Cash & Equivalents', previousMonth: 72000, currentMonth: 85000, expectedVolatilityPct: 20 },
    { account: 'Accounts Receivable', previousMonth: 30000, currentMonth: 42000, expectedVolatilityPct: 25 },
    { account: 'Inventory', previousMonth: 36000, currentMonth: 35000, expectedVolatilityPct: 15 },
    { account: 'Accounts Payable', previousMonth: 21000, currentMonth: 28000, expectedVolatilityPct: 20 },
    { account: 'Marketing Expense', previousMonth: 5000, currentMonth: 8000, expectedVolatilityPct: 18 },
    { account: 'Utilities Expense', previousMonth: 2100, currentMonth: 2500, expectedVolatilityPct: 15 },
    { account: 'Service Revenue', previousMonth: 36000, currentMonth: 45000, expectedVolatilityPct: 20 },
];

export default function Reporting({ pageTitle = 'Pelaporan' }: Props) {
    const page = usePage();
    const financeData = page.props.financeData as any;
    const dynamicReporting = financeData?.reporting;

    const profitAndLossData = dynamicReporting?.profitAndLoss ?? profitAndLoss;
    const balanceSheetData = dynamicReporting?.balanceSheet ?? balanceSheet;
    const cashFlowData = dynamicReporting?.cashFlow ?? cashFlow;
    const budgetVsActualData = dynamicReporting?.budgetVsActual ?? budgetVsActual;
    const fluxAnalysisRows = dynamicReporting?.fluxAnalysisData ?? fluxAnalysisData;

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            signDisplay: 'exceptZero'
        }).format(value);
    };

    // Calculate Totals for P&L
    const totalRevenue = profitAndLossData.revenue.reduce((sum, item) => sum + item.amount, 0);
    const totalCogs = profitAndLossData.cogs.reduce((sum, item) => sum + item.amount, 0);
    const grossProfit = totalRevenue + totalCogs;
    const totalExpenses = profitAndLossData.expenses.reduce((sum, item) => sum + item.amount, 0);
    const netIncome = grossProfit + totalExpenses;

    // Calculate Totals for Balance Sheet
    const totalCurrentAssets = balanceSheetData.assets.current.reduce((sum, i) => sum + i.amount, 0);
    const totalFixedAssets = balanceSheetData.assets.fixed.reduce((sum, i) => sum + i.amount, 0);
    const totalAssets = totalCurrentAssets + totalFixedAssets;
    
    const totalLiabilities = balanceSheetData.liabilities.reduce((sum, i) => sum + i.amount, 0);
    const totalEquity = balanceSheetData.equity.reduce((sum, i) => sum + i.amount, 0);
    const totalLiabilitiesAndEquity = totalLiabilities + totalEquity;

    // Calculate Totals for Cash Flow
    const netOperating = cashFlowData.operating.reduce((sum, i) => sum + i.amount, 0);
    const netInvesting = cashFlowData.investing.reduce((sum, i) => sum + i.amount, 0);
    const netFinancing = cashFlowData.financing.reduce((sum, i) => sum + i.amount, 0);
    const netCashIncrease = netOperating + netInvesting + netFinancing;
    const endingCash = cashFlowData.beginningCash + netCashIncrease;

    const fluxRows = fluxAnalysisRows.map((item) => {
        const delta = item.currentMonth - item.previousMonth;
        const pctChange = item.previousMonth === 0 ? 0 : (delta / item.previousMonth) * 100;
        const isAbnormal = Math.abs(pctChange) > item.expectedVolatilityPct;

        return {
            ...item,
            delta,
            pctChange,
            isAbnormal,
        };
    });

    const abnormalAccounts = fluxRows.filter((row) => row.isAbnormal);
    const biggestIncrease = [...fluxRows].sort((a, b) => b.delta - a.delta)[0];
    const biggestDecrease = [...fluxRows].sort((a, b) => a.delta - b.delta)[0];

    return (
        <div className="flex h-full flex-1 flex-col gap-6 p-4">
            <Head title={pageTitle} />
            
            <div className="mb-2 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Laporan Keuangan</h1>
                    <p className="text-muted-foreground">Laporan keuangan komprehensif dan analisis kinerja bisnis.</p>
                </div>
                <Button variant="outline" className="flex items-center gap-2">
                    <Download className="h-4 w-4" /> Ekspor Laporan
                </Button>
            </div>

            <Tabs defaultValue="pl" className="w-full">
                <TabsList className="grid w-full grid-cols-5 mb-4">
                    <TabsTrigger value="pl" className="flex items-center gap-2"><BarChart3 className="h-4 w-4 hidden sm:block" /> Laba Rugi</TabsTrigger>
                    <TabsTrigger value="bs" className="flex items-center gap-2"><PieChart className="h-4 w-4 hidden sm:block" /> Neraca</TabsTrigger>
                    <TabsTrigger value="cf" className="flex items-center gap-2"><Activity className="h-4 w-4 hidden sm:block" /> Arus Kas</TabsTrigger>
                    <TabsTrigger value="bva" className="flex items-center gap-2"><Target className="h-4 w-4 hidden sm:block" /> Anggaran vs Realisasi</TabsTrigger>
                    <TabsTrigger value="flux" className="flex items-center gap-2"><TrendingUp className="h-4 w-4 hidden sm:block" /> Analisis Flux</TabsTrigger>
                </TabsList>

                {/* 1. PROFIT & LOSS */}
                <TabsContent value="pl">
                    <Card className="max-w-4xl mx-auto shadow-sm">
                        <CardHeader className="text-center border-b pb-6">
                            <CardTitle className="text-2xl uppercase tracking-wider">Laporan Laba Rugi</CardTitle>
                            <CardDescription className="text-base font-medium text-foreground">Untuk periode berakhir {profitAndLossData.period}</CardDescription>
                        </CardHeader>
                        <CardContent className="pt-6">
                            <Table>
                                <TableHeader>
                                    <TableRow className="bg-muted/50 hover:bg-muted/50">
                                        <TableHead className="font-bold text-foreground">Pendapatan</TableHead>
                                        <TableHead className="text-right"></TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {profitAndLossData.revenue.map((item, idx) => (
                                        <TableRow key={idx} className="border-none">
                                            <TableCell className="pl-8">{item.account}</TableCell>
                                            <TableCell className="text-right">{formatCurrency(item.amount)}</TableCell>
                                        </TableRow>
                                    ))}
                                    <TableRow>
                                        <TableCell className="font-semibold text-foreground">Total Pendapatan</TableCell>
                                        <TableCell className="text-right font-bold text-foreground border-t-2">{formatCurrency(totalRevenue)}</TableCell>
                                    </TableRow>

                                    {/* COGS */}
                                    <TableRow className="border-none"><TableCell colSpan={2} className="h-4"></TableCell></TableRow>
                                    <TableRow className="border-none">
                                        <TableCell className="font-semibold text-foreground">Harga Pokok Penjualan (HPP)</TableCell>
                                        <TableCell className="text-right"></TableCell>
                                    </TableRow>
                                    {profitAndLossData.cogs.map((item, idx) => (
                                        <TableRow key={idx} className="border-none">
                                            <TableCell className="pl-8">{item.account}</TableCell>
                                            <TableCell className="text-right">{formatCurrency(item.amount)}</TableCell>
                                        </TableRow>
                                    ))}
                                    
                                    {/* Gross Profit */}
                                    <TableRow className="bg-primary/5 hover:bg-primary/5">
                                        <TableCell className="font-bold text-foreground text-base">Laba Kotor</TableCell>
                                        <TableCell className="text-right font-bold text-foreground text-base">{formatCurrency(grossProfit)}</TableCell>
                                    </TableRow>

                                    {/* Expenses */}
                                    <TableRow className="border-none"><TableCell colSpan={2} className="h-4"></TableCell></TableRow>
                                    <TableRow className="border-none">
                                        <TableCell className="font-semibold text-foreground">Beban Operasional</TableCell>
                                        <TableCell className="text-right"></TableCell>
                                    </TableRow>
                                    {profitAndLossData.expenses.map((item, idx) => (
                                        <TableRow key={idx} className="border-none">
                                            <TableCell className="pl-8">{item.account}</TableCell>
                                            <TableCell className="text-right">{formatCurrency(item.amount)}</TableCell>
                                        </TableRow>
                                    ))}
                                    <TableRow>
                                        <TableCell className="font-semibold text-foreground">Total Beban Operasional</TableCell>
                                        <TableCell className="text-right font-bold text-foreground border-y border-dashed">{formatCurrency(totalExpenses)}</TableCell>
                                    </TableRow>

                                    {/* Net Income */}
                                    <TableRow className="bg-primary text-primary-foreground hover:bg-primary/90">
                                        <TableCell className="font-bold text-lg">Net Income (Laba Bersih)</TableCell>
                                        <TableCell className="text-right font-bold text-lg">{formatCurrency(netIncome)}</TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* 2. BALANCE SHEET (NERACA) */}
                <TabsContent value="bs">
                    <Card className="max-w-4xl mx-auto shadow-sm">
                        <CardHeader className="text-center border-b pb-6">
                            <CardTitle className="text-2xl uppercase tracking-wider">Neraca</CardTitle>
                            <CardDescription className="text-base font-medium text-foreground">{balanceSheetData.period}</CardDescription>
                        </CardHeader>
                        <CardContent className="pt-6 grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* ASSETS */}
                            <div>
                                <h3 className="font-bold text-lg mb-4 text-primary border-b pb-2">ASET</h3>
                                <Table>
                                    <TableBody>
                                        {/* Current Assets */}
                                        <TableRow className="border-none hover:bg-transparent"><TableCell colSpan={2} className="font-semibold italic text-muted-foreground pt-0">Aset Lancar</TableCell></TableRow>
                                        {balanceSheetData.assets.current.map((item, idx) => (
                                            <TableRow key={idx} className="border-none hover:bg-transparent">
                                                <TableCell className="pl-4 py-1">{item.account}</TableCell>
                                                <TableCell className="text-right py-1">{formatCurrency(item.amount)}</TableCell>
                                            </TableRow>
                                        ))}
                                        <TableRow className="hover:bg-transparent">
                                            <TableCell className="font-medium pb-4">Total Aset Lancar</TableCell>
                                            <TableCell className="text-right font-medium pb-4 border-t border-dashed">{formatCurrency(totalCurrentAssets)}</TableCell>
                                        </TableRow>

                                        {/* Fixed Assets */}
                                        <TableRow className="border-none hover:bg-transparent"><TableCell colSpan={2} className="font-semibold italic text-muted-foreground pt-4">Aset Tetap</TableCell></TableRow>
                                        {balanceSheetData.assets.fixed.map((item, idx) => (
                                            <TableRow key={idx} className="border-none hover:bg-transparent">
                                                <TableCell className="pl-4 py-1">{item.account}</TableCell>
                                                <TableCell className="text-right py-1">{formatCurrency(item.amount)}</TableCell>
                                            </TableRow>
                                        ))}
                                        <TableRow className="hover:bg-transparent">
                                            <TableCell className="font-medium pb-4">Total Aset Tetap</TableCell>
                                            <TableCell className="text-right font-medium pb-4 border-t border-dashed">{formatCurrency(totalFixedAssets)}</TableCell>
                                        </TableRow>

                                        {/* TOTAL ASSETS */}
                                        <TableRow className="bg-primary/10 hover:bg-primary/10 border-t-2 border-primary">
                                            <TableCell className="font-bold text-base">Total Aset</TableCell>
                                            <TableCell className="text-right font-bold text-base">{formatCurrency(totalAssets)}</TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </div>

                            {/* LIABILITIES & EQUITY */}
                            <div>
                                <h3 className="font-bold text-lg mb-4 text-primary border-b pb-2">LIABILITAS & EKUITAS</h3>
                                <Table>
                                    <TableBody>
                                        {/* Liabilities */}
                                        <TableRow className="border-none hover:bg-transparent"><TableCell colSpan={2} className="font-semibold italic text-muted-foreground pt-0">Liabilitas</TableCell></TableRow>
                                        {balanceSheetData.liabilities.map((item, idx) => (
                                            <TableRow key={idx} className="border-none hover:bg-transparent">
                                                <TableCell className="pl-4 py-1">{item.account}</TableCell>
                                                <TableCell className="text-right py-1">{formatCurrency(item.amount)}</TableCell>
                                            </TableRow>
                                        ))}
                                        <TableRow className="hover:bg-transparent">
                                            <TableCell className="font-medium pb-4">Total Liabilitas</TableCell>
                                            <TableCell className="text-right font-medium pb-4 border-t border-dashed">{formatCurrency(totalLiabilities)}</TableCell>
                                        </TableRow>

                                        {/* Equity */}
                                        <TableRow className="border-none hover:bg-transparent"><TableCell colSpan={2} className="font-semibold italic text-muted-foreground pt-4">Ekuitas Pemilik</TableCell></TableRow>
                                        {balanceSheetData.equity.map((item, idx) => (
                                            <TableRow key={idx} className="border-none hover:bg-transparent">
                                                <TableCell className="pl-4 py-1">{item.account}</TableCell>
                                                <TableCell className="text-right py-1">{formatCurrency(item.amount)}</TableCell>
                                            </TableRow>
                                        ))}
                                        <TableRow className="hover:bg-transparent">
                                            <TableCell className="font-medium pb-4">Total Ekuitas</TableCell>
                                            <TableCell className="text-right font-medium pb-4 border-t border-dashed">{formatCurrency(totalEquity)}</TableCell>
                                        </TableRow>

                                        {/* TOTAL L&E */}
                                        <TableRow className="bg-primary/10 hover:bg-primary/10 border-t-2 border-primary">
                                            <TableCell className="font-bold text-base">Total Liabilitas & Ekuitas</TableCell>
                                            <TableCell className="text-right font-bold text-base">{formatCurrency(totalLiabilitiesAndEquity)}</TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* 3. CASH FLOW (ARUS KAS) */}
                <TabsContent value="cf">
                    <Card className="max-w-4xl mx-auto shadow-sm">
                        <CardHeader className="text-center border-b pb-6">
                            <CardTitle className="text-2xl uppercase tracking-wider">Laporan Arus Kas</CardTitle>
                            <CardDescription className="text-base font-medium text-foreground">Untuk periode berakhir {cashFlowData.period}</CardDescription>
                        </CardHeader>
                        <CardContent className="pt-6">
                            <Table>
                                <TableBody>
                                    {/* Operating Activities */}
                                    <TableRow className="bg-muted/50 hover:bg-muted/50"><TableCell colSpan={2} className="font-bold text-foreground">Arus Kas dari Aktivitas Operasi</TableCell></TableRow>
                                    {cashFlowData.operating.map((item, idx) => (
                                        <TableRow key={idx} className="border-none">
                                            <TableCell className="pl-8">{item.account}</TableCell>
                                            <TableCell className="text-right">{formatCurrency(item.amount)}</TableCell>
                                        </TableRow>
                                    ))}
                                    <TableRow>
                                        <TableCell className="font-semibold text-foreground pl-4">Kas Bersih dari Aktivitas Operasi</TableCell>
                                        <TableCell className="text-right font-bold text-foreground border-t-2">{formatCurrency(netOperating)}</TableCell>
                                    </TableRow>

                                    {/* Investing Activities */}
                                    <TableRow className="border-none"><TableCell colSpan={2} className="h-2"></TableCell></TableRow>
                                    <TableRow className="bg-muted/50 hover:bg-muted/50"><TableCell colSpan={2} className="font-bold text-foreground">Arus Kas dari Aktivitas Investasi</TableCell></TableRow>
                                    {cashFlowData.investing.map((item, idx) => (
                                        <TableRow key={idx} className="border-none">
                                            <TableCell className="pl-8">{item.account}</TableCell>
                                            <TableCell className="text-right">{formatCurrency(item.amount)}</TableCell>
                                        </TableRow>
                                    ))}
                                    <TableRow>
                                        <TableCell className="font-semibold text-foreground pl-4">Kas Bersih dari Aktivitas Investasi</TableCell>
                                        <TableCell className="text-right font-bold text-foreground border-y border-dashed">{formatCurrency(netInvesting)}</TableCell>
                                    </TableRow>

                                    {/* Financing Activities */}
                                    <TableRow className="border-none"><TableCell colSpan={2} className="h-2"></TableCell></TableRow>
                                    <TableRow className="bg-muted/50 hover:bg-muted/50"><TableCell colSpan={2} className="font-bold text-foreground">Arus Kas dari Aktivitas Pendanaan</TableCell></TableRow>
                                    {cashFlowData.financing.map((item, idx) => (
                                        <TableRow key={idx} className="border-none">
                                            <TableCell className="pl-8">{item.account}</TableCell>
                                            <TableCell className="text-right">{formatCurrency(item.amount)}</TableCell>
                                        </TableRow>
                                    ))}
                                    <TableRow>
                                        <TableCell className="font-semibold text-foreground pl-4">Kas Bersih dari Aktivitas Pendanaan</TableCell>
                                        <TableCell className="text-right font-bold text-foreground border-y border-dashed">{formatCurrency(netFinancing)}</TableCell>
                                    </TableRow>

                                    {/* Cash Summary */}
                                    <TableRow className="border-none"><TableCell colSpan={2} className="h-4"></TableCell></TableRow>
                                    <TableRow className="border-none bg-amber-50/50 hover:bg-amber-50/50 dark:bg-amber-950/20">
                                        <TableCell className="font-medium text-foreground">Kenaikan (Penurunan) Bersih Kas</TableCell>
                                        <TableCell className="text-right font-medium border-b-2">{formatCurrency(netCashIncrease)}</TableCell>
                                    </TableRow>
                                    <TableRow className="border-none hover:bg-transparent">
                                        <TableCell className="font-medium text-foreground">Kas pada Awal Periode</TableCell>
                                        <TableCell className="text-right font-medium">{formatCurrency(cashFlowData.beginningCash)}</TableCell>
                                    </TableRow>
                                    <TableRow className="bg-primary text-primary-foreground hover:bg-primary/90 mt-2">
                                        <TableCell className="font-bold text-lg rounded-l-md">Kas pada Akhir Periode</TableCell>
                                        <TableCell className="text-right font-bold text-lg rounded-r-md">{formatCurrency(endingCash)}</TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* 4. BUDGET VS ACTUAL */}
                <TabsContent value="bva">
                    <Card>
                        <CardHeader>
                            <CardTitle>Kinerja Anggaran vs Realisasi</CardTitle>
                            <CardDescription>
                                Pantau pengeluaran per divisi dibandingkan anggaran yang dialokasikan agar tidak overrun.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="rounded-md border">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Departemen / Kategori</TableHead>
                                            <TableHead className="text-right">Budget (Anggaran)</TableHead>
                                            <TableHead className="text-right">Actual (Realisasi)</TableHead>
                                            <TableHead className="text-right">Selisih (Rp)</TableHead>
                                            <TableHead className="text-right">Selisih (%)</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {budgetVsActualData.map((item, idx) => {
                                            const isRevenue = item.department === 'Sales Division';
                                            const variance = isRevenue 
                                                ? item.actual - item.budget // For revenue, more is good
                                                : item.budget - item.actual; // For expense, less is good
                                            
                                            const variancePercent = (variance / item.budget) * 100;
                                            const isFavorable = variance >= 0;

                                            return (
                                                <TableRow key={idx}>
                                                    <TableCell className="font-medium">{item.department}</TableCell>
                                                    <TableCell className="text-right">{formatCurrency(item.budget)}</TableCell>
                                                    <TableCell className="text-right">{formatCurrency(item.actual)}</TableCell>
                                                    <TableCell className="text-right">
                                                        <span className={`font-medium ${isFavorable ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                                                            {isFavorable ? '+' : ''}{formatCurrency(variance)}
                                                        </span>
                                                    </TableCell>
                                                    <TableCell className="text-right">
                                                        <Badge variant={isFavorable ? 'outline' : 'destructive'} 
                                                            className={isFavorable ? 'bg-green-50 text-green-700 border-green-200 dark:bg-green-900/30' : ''}>
                                                            {isFavorable ? '+' : ''}{variancePercent.toFixed(1)}%
                                                        </Badge>
                                                    </TableCell>
                                                </TableRow>
                                            )
                                        })}
                                        {/* Total Summary */}
                                        <TableRow className="bg-muted font-bold text-base border-t-2">
                                            <TableCell>TOTAL BEBAN</TableCell>
                                            <TableCell className="text-right">{formatCurrency(budgetVsActualData.filter(i => i.department !== 'Sales Division').reduce((s, i) => s + i.budget, 0))}</TableCell>
                                            <TableCell className="text-right">{formatCurrency(budgetVsActualData.filter(i => i.department !== 'Sales Division').reduce((s, i) => s + i.actual, 0))}</TableCell>
                                            <TableCell colSpan={2}></TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* 5. FLUX ANALYSIS */}
                <TabsContent value="flux">
                    <Card>
                        <CardHeader>
                            <CardTitle>Flux Analysis Otomatis</CardTitle>
                            <CardDescription>
                                Penjelasan perubahan saldo bulan ke bulan dan highlight akun dengan pergerakan di luar pola normal.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-3 md:grid-cols-3">
                                <div className="rounded-lg border p-3">
                                    <div className="text-xs text-muted-foreground">Akun Bergerak Tidak Normal</div>
                                    <div className="mt-1 text-2xl font-semibold">{abnormalAccounts.length}</div>
                                </div>
                                <div className="rounded-lg border p-3">
                                    <div className="text-xs text-muted-foreground">Kenaikan Terbesar</div>
                                    <div className="mt-1 text-sm font-medium">{biggestIncrease?.account}</div>
                                    <div className="text-lg font-semibold text-green-600">{formatCurrency(biggestIncrease?.delta ?? 0)}</div>
                                </div>
                                <div className="rounded-lg border p-3">
                                    <div className="text-xs text-muted-foreground">Penurunan Terbesar</div>
                                    <div className="mt-1 text-sm font-medium">{biggestDecrease?.account}</div>
                                    <div className="text-lg font-semibold text-red-600">{formatCurrency(biggestDecrease?.delta ?? 0)}</div>
                                </div>
                            </div>

                            <div className="rounded-md border">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Akun</TableHead>
                                            <TableHead className="text-right">Bulan Lalu</TableHead>
                                            <TableHead className="text-right">Bulan Ini</TableHead>
                                            <TableHead className="text-right">Perubahan</TableHead>
                                            <TableHead className="text-right">Perubahan (%)</TableHead>
                                            <TableHead>Analisis Otomatis</TableHead>
                                            <TableHead>Status</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {fluxRows.map((row) => (
                                            <TableRow key={row.account}>
                                                <TableCell className="font-medium">{row.account}</TableCell>
                                                <TableCell className="text-right">{formatCurrency(row.previousMonth)}</TableCell>
                                                <TableCell className="text-right">{formatCurrency(row.currentMonth)}</TableCell>
                                                <TableCell className="text-right">
                                                    <span className={row.delta >= 0 ? 'text-green-600' : 'text-red-600'}>
                                                        {row.delta >= 0 ? '+' : ''}{formatCurrency(row.delta)}
                                                    </span>
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <span className={row.pctChange >= 0 ? 'text-green-600' : 'text-red-600'}>
                                                        {row.pctChange >= 0 ? '+' : ''}{row.pctChange.toFixed(1)}%
                                                    </span>
                                                </TableCell>
                                                <TableCell>
                                                    {row.delta >= 0 ? (
                                                        <div className="flex items-center gap-2 text-sm">
                                                            <TrendingUp className="h-4 w-4 text-green-600" />
                                                            Saldo naik dibanding bulan lalu.
                                                        </div>
                                                    ) : (
                                                        <div className="flex items-center gap-2 text-sm">
                                                            <TrendingDown className="h-4 w-4 text-red-600" />
                                                            Saldo turun dibanding bulan lalu.
                                                        </div>
                                                    )}
                                                </TableCell>
                                                <TableCell>
                                                    {row.isAbnormal ? (
                                                        <Badge variant="destructive">Tidak Normal</Badge>
                                                    ) : (
                                                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Normal</Badge>
                                                    )}
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

            </Tabs>
        </div>
    );
}

Reporting.layout = (props: { pageTitle?: string }) => {
    return {
        breadcrumbs: [
            {
                title: props.pageTitle || 'Pelaporan',
                href: window.location.pathname,
            },
        ],
    };
};