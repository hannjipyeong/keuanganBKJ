import { Head, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, Clock, GitMerge, ShieldAlert, ShieldCheck, XCircle } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

type Props = {
    pageTitle?: string;
};

// Types & Initial Data
type ApprovalRule = {
    id: string;
    division: string;
    transactionType: string;
    minAmount: number;
    maxAmount: number | null;
    approvers: string[]; // e.g., ["Manager"], ["Manager", "Director"]
};

type ApprovalRequest = {
    id: string;
    date: string;
    requester: string;
    division: string;
    transactionType: string;
    amount: number;
    description: string;
    currentLevel: number;
    requiredLevels: number;
    status: 'Pending' | 'Approved' | 'Rejected';
    history: { level: number; approver: string; action: string; date: string }[];
};

type ApproverBottleneck = {
    name: string;
    role: string;
    delayedCases: number;
    avgDelayHours: number;
    onTimeRate: number;
};

type ProcessBottleneck = {
    process: string;
    delayedCases: number;
    avgDelayHours: number;
    impactToClosingDays: number;
};

const initialRules: ApprovalRule[] = [
    { id: 'R-001', division: 'All', transactionType: 'Expense Claim', minAmount: 0, maxAmount: 1000, approvers: ['Manager'] },
    { id: 'R-002', division: 'All', transactionType: 'Expense Claim', minAmount: 1001, maxAmount: null, approvers: ['Manager', 'Director'] },
    { id: 'R-003', division: 'IT', transactionType: 'Equipment Purchase', minAmount: 0, maxAmount: 5000, approvers: ['IT Manager', 'CTO'] },
    { id: 'R-004', division: 'Finance', transactionType: 'Vendor Payment', minAmount: 0, maxAmount: 10000, approvers: ['Finance Controller'] },
    { id: 'R-005', division: 'Finance', transactionType: 'Vendor Payment', minAmount: 10001, maxAmount: null, approvers: ['Finance Controller', 'CFO'] },
];

const initialRequests: ApprovalRequest[] = [
    {
        id: 'REQ-501',
        date: '2026-07-25',
        requester: 'John Doe',
        division: 'Sales',
        transactionType: 'Expense Claim',
        amount: 450.00,
        description: 'Client Lunch Meeting',
        currentLevel: 1,
        requiredLevels: 1,
        status: 'Pending',
        history: [],
    },
    {
        id: 'REQ-502',
        date: '2026-07-26',
        requester: 'Jane Smith',
        division: 'IT',
        transactionType: 'Equipment Purchase',
        amount: 4500.00,
        description: 'New Developer Laptops (3x)',
        currentLevel: 1,
        requiredLevels: 2,
        status: 'Pending',
        history: [],
    },
    {
        id: 'REQ-503',
        date: '2026-07-26',
        requester: 'Mike Ross',
        division: 'Finance',
        transactionType: 'Vendor Payment',
        amount: 15000.00,
        description: 'Annual Software License Renewal',
        currentLevel: 2,
        requiredLevels: 2,
        status: 'Pending',
        history: [{ level: 1, approver: 'Finance Controller', action: 'Approved', date: '2026-07-26 10:00 AM' }],
    },
    {
        id: 'REQ-499',
        date: '2026-07-20',
        requester: 'Sarah Connor',
        division: 'Marketing',
        transactionType: 'Expense Claim',
        amount: 2500.00,
        description: 'Ad Campaign Funding',
        currentLevel: 2,
        requiredLevels: 2,
        status: 'Rejected',
        history: [
            { level: 1, approver: 'Manager', action: 'Approved', date: '2026-07-21 09:00 AM' },
            { level: 2, approver: 'Director', action: 'Rejected', date: '2026-07-22 14:30 PM' }
        ],
    },
    {
        id: 'REQ-498',
        date: '2026-07-19',
        requester: 'Bruce Wayne',
        division: 'IT',
        transactionType: 'Equipment Purchase',
        amount: 1200.00,
        description: 'Server Rack Upgrade',
        currentLevel: 2,
        requiredLevels: 2,
        status: 'Approved',
        history: [
            { level: 1, approver: 'IT Manager', action: 'Approved', date: '2026-07-19 11:00 AM' },
            { level: 2, approver: 'CTO', action: 'Approved', date: '2026-07-20 16:00 PM' }
        ],
    }
];

const approverBottlenecks: ApproverBottleneck[] = [
    {
        name: 'Finance Controller',
        role: 'Level 1 Finance Approval',
        delayedCases: 12,
        avgDelayHours: 28,
        onTimeRate: 62,
    },
    {
        name: 'Director',
        role: 'Level 2 Management Approval',
        delayedCases: 9,
        avgDelayHours: 35,
        onTimeRate: 58,
    },
    {
        name: 'CTO',
        role: 'Level 2 IT Approval',
        delayedCases: 7,
        avgDelayHours: 22,
        onTimeRate: 69,
    },
    {
        name: 'Manager',
        role: 'Level 1 General Approval',
        delayedCases: 4,
        avgDelayHours: 14,
        onTimeRate: 81,
    },
];

const processBottlenecks: ProcessBottleneck[] = [
    {
        process: 'Vendor Payment > 10,000 (Finance + CFO)',
        delayedCases: 11,
        avgDelayHours: 31,
        impactToClosingDays: 3.6,
    },
    {
        process: 'Equipment Purchase (IT Manager + CTO)',
        delayedCases: 8,
        avgDelayHours: 24,
        impactToClosingDays: 2.4,
    },
    {
        process: 'Expense Claim Level 2 (Manager + Director)',
        delayedCases: 6,
        avgDelayHours: 18,
        impactToClosingDays: 1.8,
    },
];

export default function ApprovalWorkflow({ pageTitle = 'Alur Persetujuan' }: Props) {
    const page = usePage();
    const financeData = page.props.financeData as any;
    const [requests, setRequests] = useState<ApprovalRequest[]>(financeData?.approvalWorkflow?.requests ?? initialRequests);
    const [rules, setRules] = useState<ApprovalRule[]>(financeData?.approvalWorkflow?.rules ?? initialRules);

    // Filter states
    const pendingRequests = requests.filter(r => r.status === 'Pending');
    const historyRequests = requests.filter(r => r.status !== 'Pending');
    const dynamicApproverBottlenecks = financeData?.approvalWorkflow?.approverBottlenecks ?? approverBottlenecks;
    const dynamicProcessBottlenecks = financeData?.approvalWorkflow?.processBottlenecks ?? processBottlenecks;
    const topApproverBottleneck = [...dynamicApproverBottlenecks].sort((a, b) => b.delayedCases - a.delayedCases)[0];
    const topProcessBottleneck = [...dynamicProcessBottlenecks].sort((a, b) => b.delayedCases - a.delayedCases)[0];

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(value);
    };

    const handleAction = (id: string, action: 'Approve' | 'Reject') => {
        setRequests(requests.map(req => {
            if (req.id === id) {
                const newHistory = [...req.history, {
                    level: req.currentLevel,
                    approver: 'Current User Role (Simulated)',
                    action: action + 'd',
                    date: new Date().toLocaleString()
                }];

                if (action === 'Reject') {
                    return { ...req, status: 'Rejected', history: newHistory };
                } else {
                    // Approve logic
                    if (req.currentLevel >= req.requiredLevels) {
                        return { ...req, status: 'Approved', history: newHistory };
                    } else {
                        // Move to next level
                        return { ...req, currentLevel: req.currentLevel + 1, history: newHistory };
                    }
                }
            }
            return req;
        }));
    };

    return (
        <div className="flex h-full flex-1 flex-col gap-6 p-4">
            <Head title={pageTitle} />
            
            <div className="mb-2 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Mesin Alur Persetujuan</h1>
                    <p className="text-muted-foreground">Kelola persetujuan bertingkat berdasarkan divisi, batas nominal, dan jenis transaksi.</p>
                </div>
            </div>

            <Tabs defaultValue="pending" className="w-full">
                <TabsList className="grid w-full grid-cols-4 mb-4 max-w-4xl">
                    <TabsTrigger value="pending">Persetujuan Tertunda</TabsTrigger>
                    <TabsTrigger value="rules">Konfigurasi Aturan</TabsTrigger>
                    <TabsTrigger value="history">Riwayat Persetujuan</TabsTrigger>
                    <TabsTrigger value="bottleneck">Detektor Bottleneck</TabsTrigger>
                </TabsList>

                {/* 1. PENDING APPROVALS */}
                <TabsContent value="pending" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <div className="flex items-center gap-2">
                                <Clock className="h-5 w-5 text-amber-500" />
                                <CardTitle>Perlu Tindakan</CardTitle>
                            </div>
                            <CardDescription>
                                Transaksi yang menunggu peninjauan dan otorisasi Anda.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="rounded-md border">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>ID Permintaan</TableHead>
                                            <TableHead>Peminta</TableHead>
                                            <TableHead>Detail</TableHead>
                                            <TableHead>Nominal</TableHead>
                                            <TableHead>Progress Level</TableHead>
                                            <TableHead className="text-right">Aksi</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {pendingRequests.length === 0 ? (
                                            <TableRow>
                                                <TableCell colSpan={6} className="text-center h-24">Tidak ada persetujuan tertunda saat ini.</TableCell>
                                            </TableRow>
                                        ) : (
                                            pendingRequests.map(req => (
                                                <TableRow key={req.id}>
                                                    <TableCell className="font-medium">{req.id}</TableCell>
                                                    <TableCell>
                                                        <div className="font-medium">{req.requester}</div>
                                                        <div className="text-xs text-muted-foreground">{req.date}</div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <div>{req.transactionType}</div>
                                                        <div className="text-xs text-muted-foreground">Div: {req.division} - {req.description}</div>
                                                    </TableCell>
                                                    <TableCell className="font-bold">{formatCurrency(req.amount)}</TableCell>
                                                    <TableCell>
                                                        <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950 dark:text-amber-400">
                                                            Level {req.currentLevel} dari {req.requiredLevels}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell className="text-right">
                                                        <div className="flex justify-end gap-2">
                                                            <Button size="sm" variant="outline" className="text-green-600 border-green-200 hover:bg-green-50 hover:text-green-700" onClick={() => handleAction(req.id, 'Approve')}>
                                                                <CheckCircle2 className="h-4 w-4 mr-1" /> Setujui
                                                            </Button>
                                                            <Button size="sm" variant="outline" className="text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700" onClick={() => handleAction(req.id, 'Reject')}>
                                                                <XCircle className="h-4 w-4 mr-1" /> Tolak
                                                            </Button>
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                        )}
                                    </TableBody>
                                </Table>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* 2. WORKFLOW RULES CONFIGURATION */}
                <TabsContent value="rules" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <div className="flex items-center gap-2 flex-row justify-between">
                                <div>
                                    <div className="flex items-center gap-2">
                                        <GitMerge className="h-5 w-5 text-blue-500" />
                                        <CardTitle>Aturan Hierarki & Logika</CardTitle>
                                    </div>
                                    <CardDescription>
                                        Atur alur transaksi dalam organisasi berdasarkan batas nominal.
                                    </CardDescription>
                                </div>
                                <Button size="sm">Tambah Aturan</Button>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="rounded-md border">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Divisi</TableHead>
                                            <TableHead>Jenis Transaksi</TableHead>
                                            <TableHead>Batas Nominal</TableHead>
                                            <TableHead>Rantai Persetujuan (Level 1 → Level N)</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {rules.map((rule) => (
                                            <TableRow key={rule.id}>
                                                <TableCell className="font-medium">{rule.division}</TableCell>
                                                <TableCell>{rule.transactionType}</TableCell>
                                                <TableCell>
                                                    {rule.maxAmount 
                                                        ? `${formatCurrency(rule.minAmount)} - ${formatCurrency(rule.maxAmount)}`
                                                        : `> ${formatCurrency(rule.minAmount)}`}
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-2">
                                                        {rule.approvers.map((approver, index) => (
                                                            <span key={index} className="flex items-center gap-2 text-sm">
                                                                <Badge variant="secondary">{approver}</Badge>
                                                                {index < rule.approvers.length - 1 && <span className="text-muted-foreground">→</span>}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* 3. APPROVAL HISTORY */}
                <TabsContent value="history" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <div className="flex items-center gap-2">
                                <ShieldCheck className="h-5 w-5 text-slate-500" />
                                <CardTitle>Log Persetujuan</CardTitle>
                            </div>
                            <CardDescription>
                                Arsip seluruh persetujuan dan penolakan yang telah diproses.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="rounded-md border">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>ID</TableHead>
                                            <TableHead>Detail</TableHead>
                                            <TableHead>Nominal</TableHead>
                                            <TableHead>Status Akhir</TableHead>
                                            <TableHead>Jejak Audit</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {historyRequests.length === 0 ? (
                                            <TableRow>
                                                <TableCell colSpan={5} className="text-center h-24">Belum ada riwayat.</TableCell>
                                            </TableRow>
                                        ) : (
                                            historyRequests.map(req => (
                                                <TableRow key={req.id}>
                                                    <TableCell className="font-medium">{req.id}</TableCell>
                                                    <TableCell>
                                                        <div>{req.transactionType} ({req.division})</div>
                                                        <div className="text-xs text-muted-foreground">{req.requester} - {req.description}</div>
                                                    </TableCell>
                                                    <TableCell>{formatCurrency(req.amount)}</TableCell>
                                                    <TableCell>
                                                        {req.status === 'Approved' ? (
                                                            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                                                                <CheckCircle2 className="h-3 w-3 mr-1" /> Disetujui
                                                            </Badge>
                                                        ) : (
                                                            <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                                                                <XCircle className="h-3 w-3 mr-1" /> Ditolak
                                                            </Badge>
                                                        )}
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="text-xs space-y-1">
                                                            {req.history.map((h, i) => (
                                                                <div key={i} className="text-muted-foreground">
                                                                    L{h.level}: {h.approver} ({h.action}) <span className="italic text-[10px]">{h.date}</span>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                        )}
                                    </TableBody>
                                </Table>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* 4. BOTTLENECK DETECTOR */}
                <TabsContent value="bottleneck" className="space-y-6">
                    <div className="grid gap-4 md:grid-cols-2">
                        <Card>
                            <CardHeader>
                                <div className="flex items-center gap-2">
                                    <ShieldAlert className="h-5 w-5 text-amber-600" />
                                    <CardTitle>Approver Paling Sering Telat</CardTitle>
                                </div>
                                <CardDescription>
                                    Identifikasi approver yang paling sering menahan proses closing.
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="text-sm text-muted-foreground">Approver bottleneck teratas</div>
                                <div className="mt-1 text-xl font-semibold">{topApproverBottleneck.name}</div>
                                <div className="text-sm text-muted-foreground">{topApproverBottleneck.role}</div>
                                <div className="mt-3 flex items-center gap-2">
                                    <Badge variant="destructive">{topApproverBottleneck.delayedCases} kasus terlambat</Badge>
                                    <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                                        Rata-rata terlambat {topApproverBottleneck.avgDelayHours}j
                                    </Badge>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <div className="flex items-center gap-2">
                                    <Clock className="h-5 w-5 text-red-600" />
                                    <CardTitle>Proses Paling Menghambat Closing</CardTitle>
                                </div>
                                <CardDescription>
                                    Rute approval yang paling sering menyebabkan closing telat.
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="text-sm text-muted-foreground">Proses bottleneck teratas</div>
                                <div className="mt-1 text-xl font-semibold">{topProcessBottleneck.process}</div>
                                <div className="mt-3 flex items-center gap-2">
                                    <Badge variant="destructive">{topProcessBottleneck.delayedCases} kasus terlambat</Badge>
                                    <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                                        Dampak closing {topProcessBottleneck.impactToClosingDays} hari
                                    </Badge>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <Card>
                        <CardHeader>
                            <CardTitle>Peringkat Bottleneck per Approver</CardTitle>
                            <CardDescription>
                                Menampilkan siapa approver yang paling sering menimbulkan keterlambatan approval.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="rounded-md border">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Approver</TableHead>
                                            <TableHead>Role</TableHead>
                                            <TableHead className="text-right">Kasus Terlambat</TableHead>
                                            <TableHead className="text-right">Rata-rata Keterlambatan (Jam)</TableHead>
                                            <TableHead className="text-right">Tingkat Tepat Waktu</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {dynamicApproverBottlenecks.map((item) => (
                                            <TableRow key={item.name}>
                                                <TableCell className="font-medium">{item.name}</TableCell>
                                                <TableCell>{item.role}</TableCell>
                                                <TableCell className="text-right">{item.delayedCases}</TableCell>
                                                <TableCell className="text-right">{item.avgDelayHours}j</TableCell>
                                                <TableCell className="text-right">
                                                    <span className={item.onTimeRate >= 75 ? 'text-green-600' : 'text-red-600'}>
                                                        {item.onTimeRate}%
                                                    </span>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Peringkat Bottleneck per Proses</CardTitle>
                            <CardDescription>
                                Menampilkan proses approval mana yang paling sering membuat closing telat.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="rounded-md border">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Proses</TableHead>
                                            <TableHead className="text-right">Kasus Terlambat</TableHead>
                                            <TableHead className="text-right">Rata-rata Keterlambatan (Jam)</TableHead>
                                            <TableHead className="text-right">Dampak ke Closing (Hari)</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {dynamicProcessBottlenecks.map((item) => (
                                            <TableRow key={item.process}>
                                                <TableCell className="font-medium">{item.process}</TableCell>
                                                <TableCell className="text-right">{item.delayedCases}</TableCell>
                                                <TableCell className="text-right">{item.avgDelayHours}j</TableCell>
                                                <TableCell className="text-right">
                                                    <span className={item.impactToClosingDays >= 3 ? 'text-red-600 font-semibold' : 'text-amber-600'}>
                                                        {item.impactToClosingDays.toFixed(1)} hari
                                                    </span>
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

ApprovalWorkflow.layout = (props: { pageTitle?: string }) => {
    return {
        breadcrumbs: [
            {
                title: props.pageTitle || 'Alur Persetujuan',
                href: window.location.pathname,
            },
        ],
    };
};