import { Head, usePage } from '@inertiajs/react';
import { AlertTriangle, CheckCircle2, Clock3, ShieldAlert, Wallet } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';

type Props = {
    pageTitle?: string;
};

type CriticalItem = {
    id: string;
    title: string;
    owner: string;
    dueTime: string;
    severity: 'High' | 'Medium';
    category: string;
};

type OverdueItem = {
    reference: string;
    counterpart: string;
    amount: number;
    overdueDays: number;
    module: string;
};

type UnreconciledItem = {
    bankRef: string;
    candidateDoc: string;
    amount: number;
    ageDays: number;
    confidence: number;
};

type PendingApprovalItem = {
    requestId: string;
    approver: string;
    stage: string;
    waitHours: number;
};

type CashRiskSignal = {
    signal: string;
    value: string;
    status: 'Safe' | 'Watch' | 'Critical';
    note: string;
};

const criticalToday: CriticalItem[] = [
    {
        id: 'CRT-01',
        title: 'Pembayaran vendor di atas batas menunggu persetujuan CFO',
        owner: 'Finance Controller',
        dueTime: 'Hari ini 14:00',
        severity: 'High',
        category: 'Persetujuan',
    },
    {
        id: 'CRT-02',
        title: 'Transfer masuk belum rekonsiliasi menunggu verifikasi',
        owner: 'Treasury Team',
        dueTime: 'Hari ini 16:30',
        severity: 'Medium',
        category: 'Rekonsiliasi',
    },
    {
        id: 'CRT-03',
        title: 'Faktur utang usaha tanpa dokumen pendukung',
        owner: 'Accounts Payable',
        dueTime: 'Hari ini 17:00',
        severity: 'High',
        category: 'Kepatuhan',
    },
];

const overdueItems: OverdueItem[] = [
    {
        reference: 'INV-008',
        counterpart: 'Global Tech',
        amount: 3800,
        overdueDays: 6,
        module: 'Utang Usaha',
    },
    {
        reference: 'REC-1002',
        counterpart: 'LexCorp',
        amount: 3200.5,
        overdueDays: 12,
        module: 'Piutang Usaha',
    },
    {
        reference: 'INV-004',
        counterpart: 'Wayne Enterprises',
        amount: 1250,
        overdueDays: 3,
        module: 'Utang Usaha',
    },
];

const unreconciledItems: UnreconciledItem[] = [
    {
        bankRef: 'BNK-TRX-778145',
        candidateDoc: 'INV-008',
        amount: 3800,
        ageDays: 4,
        confidence: 74,
    },
    {
        bankRef: 'BNK-TRX-778167',
        candidateDoc: 'REC-1005',
        amount: 98500,
        ageDays: 2,
        confidence: 67,
    },
    {
        bankRef: 'BNK-TRX-778188',
        candidateDoc: 'REC-1008',
        amount: 4200,
        ageDays: 5,
        confidence: 70,
    },
];

const pendingApprovals: PendingApprovalItem[] = [
    {
        requestId: 'REQ-503',
        approver: 'CFO',
        stage: 'Level 2 Keuangan',
        waitHours: 29,
    },
    {
        requestId: 'REQ-502',
        approver: 'CTO',
        stage: 'Level 2 TI',
        waitHours: 21,
    },
    {
        requestId: 'REQ-501',
        approver: 'Manager',
        stage: 'Level 1 Umum',
        waitHours: 11,
    },
];

const cashRiskSignals: CashRiskSignal[] = [
    {
        signal: 'Proyeksi ketahanan kas',
        value: '36 hari',
        status: 'Watch',
        note: 'Di bawah target internal 45 hari.',
    },
    {
        signal: 'Perkiraan arus keluar 7 hari ke depan',
        value: 'Rp148.500',
        status: 'Critical',
        note: 'Pembayaran vendor besar terkonsentrasi minggu ini.',
    },
    {
        signal: 'Perkiraan arus masuk 7 hari ke depan',
        value: 'Rp96.200',
        status: 'Watch',
        note: 'Keterlambatan penagihan memicu celah kas sementara.',
    },
    {
        signal: 'Kesenjangan kas jangka pendek bersih',
        value: '-Rp52.300',
        status: 'Critical',
        note: 'Pertimbangkan penjadwalan ulang pembayaran atau percepat penagihan.',
    },
];

export default function FinanceCommandCenter({ pageTitle = 'Pusat Komando Keuangan' }: Props) {
    const page = usePage();
    const financeData = page.props.financeData as any;
    const dynamicCenter = financeData?.financeCommandCenter;

    const dynamicCriticalToday = dynamicCenter?.criticalToday ?? criticalToday;
    const dynamicOverdueItems = dynamicCenter?.overdueItems ?? overdueItems;
    const dynamicUnreconciledItems = dynamicCenter?.unreconciledItems ?? unreconciledItems;
    const dynamicPendingApprovals = dynamicCenter?.pendingApprovals ?? pendingApprovals;
    const dynamicCashRiskSignals = dynamicCenter?.cashRiskSignals ?? cashRiskSignals;

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
        }).format(value);
    };

    const totalOverdue = dynamicOverdueItems.reduce((sum, item) => sum + item.amount, 0);
    const unresolvedRecon = dynamicUnreconciledItems.length;
    const criticalCount = dynamicCriticalToday.filter((i) => i.severity === 'High').length;
    const pendingApprovalCount = dynamicPendingApprovals.length;

    const cashRiskLevel =
        dynamicCashRiskSignals.some((s) => s.status === 'Critical')
            ? 'Critical'
            : dynamicCashRiskSignals.some((s) => s.status === 'Watch')
              ? 'Watch'
              : 'Safe';

    const riskBadge =
        cashRiskLevel === 'Critical'
                        ? <Badge variant="destructive">Kritis</Badge>
            : cashRiskLevel === 'Watch'
                            ? <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">Waspada</Badge>
                            : <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Aman</Badge>;

    return (
        <div className="flex h-full flex-1 flex-col gap-6 p-4">
            <Head title={pageTitle} />

            <div>
                <h1 className="text-2xl font-bold tracking-tight">Pusat Komando Keuangan</h1>
                <p className="text-muted-foreground">
                    Ringkasan item kritis harian untuk membantu tim keuangan fokus pada risiko paling berdampak ke closing.
                </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
                <Card>
                    <CardHeader className="pb-2">
                        <CardDescription>Kritis Hari Ini</CardDescription>
                        <CardTitle className="text-2xl">{criticalCount}</CardTitle>
                    </CardHeader>
                    <CardContent className="text-xs text-muted-foreground">
                        Isu prioritas tinggi yang perlu tindakan hari ini.
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-2">
                        <CardDescription>Item Terlambat</CardDescription>
                        <CardTitle className="text-2xl">{overdueItems.length}</CardTitle>
                    </CardHeader>
                    <CardContent className="text-xs text-muted-foreground">
                        Total eksposur: {formatCurrency(totalOverdue)}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-2">
                        <CardDescription>Belum Rekonsiliasi</CardDescription>
                        <CardTitle className="text-2xl">{unresolvedRecon}</CardTitle>
                    </CardHeader>
                    <CardContent className="text-xs text-muted-foreground">
                        Transaksi belum cocok pada rekonsiliasi bank.
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-2">
                        <CardDescription>Persetujuan Tertunda</CardDescription>
                        <CardTitle className="text-2xl">{pendingApprovalCount}</CardTitle>
                    </CardHeader>
                    <CardContent className="text-xs text-muted-foreground">
                        Permintaan yang menunggu di alur persetujuan.
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-2">
                        <CardDescription>Risiko Kas</CardDescription>
                        <CardTitle className="text-2xl flex items-center gap-2">
                            {cashRiskLevel === 'Critical' ? 'Kritis' : cashRiskLevel === 'Watch' ? 'Waspada' : 'Aman'}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {riskBadge}
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-4 xl:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <AlertTriangle className="h-5 w-5 text-amber-600" />
                            Item Kritis Hari Ini
                        </CardTitle>
                        <CardDescription>
                            Daftar isu yang perlu ditindak hari ini agar proses closing tidak meleset.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {dynamicCriticalToday.map((item) => (
                                <div key={item.id} className="rounded-lg border p-3">
                                    <div className="flex items-start justify-between gap-3">
                                        <div>
                                            <div className="font-medium">{item.title}</div>
                                            <div className="text-xs text-muted-foreground mt-1">
                                                Penanggung jawab: {item.owner} | Kategori: {item.category}
                                            </div>
                                        </div>
                                        <Badge variant={item.severity === 'High' ? 'destructive' : 'outline'}>
                                            {item.severity === 'High' ? 'Tinggi' : 'Sedang'}
                                        </Badge>
                                    </div>
                                    <div className="text-xs text-muted-foreground mt-2">Tenggat: {item.dueTime}</div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Wallet className="h-5 w-5 text-red-600" />
                            Risiko Kas
                        </CardTitle>
                        <CardDescription>
                            Sinyal dini kesehatan kas jangka pendek berdasarkan proyeksi inflow/outflow.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {dynamicCashRiskSignals.map((signal) => (
                                <div key={signal.signal} className="rounded-lg border p-3">
                                    <div className="flex items-center justify-between">
                                        <div className="font-medium">{signal.signal}</div>
                                        <div>
                                            {signal.status === 'Critical' && <Badge variant="destructive">Kritis</Badge>}
                                            {signal.status === 'Watch' && (
                                                <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">Waspada</Badge>
                                            )}
                                            {signal.status === 'Safe' && (
                                                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Aman</Badge>
                                            )}
                                        </div>
                                    </div>
                                    <div className="text-lg font-semibold mt-1">{signal.value}</div>
                                    <div className="text-xs text-muted-foreground mt-1">{signal.note}</div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-4 xl:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Clock3 className="h-5 w-5 text-amber-600" />
                            Terlambat dan Persetujuan Tertunda
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="rounded-md border">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Referensi</TableHead>
                                        <TableHead>Pihak Lawan</TableHead>
                                        <TableHead>Terlambat</TableHead>
                                        <TableHead className="text-right">Nominal</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {dynamicOverdueItems.map((item) => (
                                        <TableRow key={item.reference}>
                                            <TableCell className="font-medium">{item.reference}</TableCell>
                                            <TableCell>{item.counterpart}</TableCell>
                                            <TableCell>{item.overdueDays} hari</TableCell>
                                            <TableCell className="text-right">{formatCurrency(item.amount)}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>

                        <div className="rounded-md border">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Permintaan</TableHead>
                                        <TableHead>Approver</TableHead>
                                        <TableHead>Tahap</TableHead>
                                        <TableHead className="text-right">Menunggu</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {dynamicPendingApprovals.map((item) => (
                                        <TableRow key={item.requestId}>
                                            <TableCell className="font-medium">{item.requestId}</TableCell>
                                            <TableCell>{item.approver}</TableCell>
                                            <TableCell>{item.stage}</TableCell>
                                            <TableCell className="text-right">{item.waitHours}j</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <CheckCircle2 className="h-5 w-5 text-blue-600" />
                            Transaksi Bank Belum Rekonsiliasi
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="rounded-md border">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Referensi Bank</TableHead>
                                        <TableHead>Dokumen Kandidat</TableHead>
                                        <TableHead>Usia</TableHead>
                                        <TableHead>Confidence</TableHead>
                                        <TableHead className="text-right">Nominal</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {dynamicUnreconciledItems.map((item) => (
                                        <TableRow key={item.bankRef}>
                                            <TableCell className="font-medium">{item.bankRef}</TableCell>
                                            <TableCell>{item.candidateDoc}</TableCell>
                                            <TableCell>{item.ageDays} hari</TableCell>
                                            <TableCell>
                                                <span className={item.confidence >= 80 ? 'text-green-600' : 'text-amber-600'}>
                                                    {item.confidence}%
                                                </span>
                                            </TableCell>
                                            <TableCell className="text-right">{formatCurrency(item.amount)}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

FinanceCommandCenter.layout = (props: { pageTitle?: string }) => {
    return {
        breadcrumbs: [
            {
                title: props.pageTitle || 'Pusat Komando Keuangan',
                href: window.location.pathname,
            },
        ],
    };
};
