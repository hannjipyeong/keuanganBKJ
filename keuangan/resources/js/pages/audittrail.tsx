import { Head, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertTriangle, Copy, FileText, HandCoins, Search, ShieldCheck } from 'lucide-react';

type Props = {
    pageTitle?: string;
};

// Types & Mock Data
type AuditAction = 'Input' | 'Edit' | 'Approve' | 'Reject' | 'Delete' | 'Login';

type AuditLog = {
    id: string;
    user: {
        name: string;
        email: string;
    };
    action: AuditAction;
    module: string;
    description: string;
    timestamp: string;
    document?: {
        name: string;
        size: string;
    };
};

type AnomalyType =
    | 'Duplicate Invoice'
    | 'Unusual Amount'
    | 'Missing Document'
    | 'Suspicious Payment Pattern';

type AnomalyItem = {
    id: string;
    invoiceNo: string;
    vendorOrCustomer: string;
    module: 'Accounts Payable' | 'Accounts Receivable';
    amount: number;
    type: AnomalyType;
    reason: string;
    timestamp: string;
    severity: 'Low' | 'Medium' | 'High';
};

const mockAuditLogs: AuditLog[] = [
    {
        id: 'LOG-8092',
        user: { name: 'Sarah Connor', email: 'sarah.c@example.com' },
        action: 'Approve',
        module: 'Alur Persetujuan',
        description: 'Menyetujui pembelian peralatan REQ-498 (Level 2)',
        timestamp: '2026-07-27 14:30:12',
    },
    {
        id: 'LOG-8091',
        user: { name: 'John Doe', email: 'john.d@example.com' },
        action: 'Input',
        module: 'Utang Usaha',
        description: 'Membuat faktur baru INV-004 untuk Wayne Enterprises (Rp1.250,00)',
        timestamp: '2026-07-27 11:15:05',
        document: { name: 'invoice_wayne_ent.pdf', size: '2.4 MB' }
    },
    {
        id: 'LOG-8090',
        user: { name: 'Jane Smith', email: 'jane.s@example.com' },
        action: 'Edit',
        module: 'Piutang Usaha',
        description: 'Memperbarui jatuh tempo REC-1002 dari 2026-07-15 ke 2026-07-30',
        timestamp: '2026-07-26 16:45:22',
        document: { name: 'agreement_extension.pdf', size: '1.1 MB' }
    },
    {
        id: 'LOG-8089',
        user: { name: 'Mike Ross', email: 'mike.r@example.com' },
        action: 'Reject',
        module: 'Alur Persetujuan',
        description: 'Menolak klaim biaya REQ-499 (alokasi anggaran tidak cukup)',
        timestamp: '2026-07-26 09:20:00',
    },
    {
        id: 'LOG-8088',
        user: { name: 'Bruce Wayne', email: 'bruce.w@example.com' },
        action: 'Input',
        module: 'Buku Besar',
        description: 'Membuat jurnal otomatis JE-003 (biaya server bulanan)',
        timestamp: '2026-07-25 15:10:45',
        document: { name: 'aws_receipt_july.pdf', size: '540 KB' }
    },
    {
        id: 'LOG-8087',
        user: { name: 'System Admin', email: 'admin@example.com' },
        action: 'Login',
        module: 'Autentikasi',
        description: 'Login berhasil dari IP 192.168.1.42',
        timestamp: '2026-07-25 08:00:11',
    },
    {
        id: 'LOG-8086',
        user: { name: 'John Doe', email: 'john.d@example.com' },
        action: 'Delete',
        module: 'Utang Usaha',
        description: 'Menghapus draft faktur INV-DRAFT-99',
        timestamp: '2026-07-24 13:40:02',
    }
];

const mockAnomalies: AnomalyItem[] = [
    {
        id: 'ANM-101',
        invoiceNo: 'INV-004',
        vendorOrCustomer: 'Wayne Enterprises',
        module: 'Accounts Payable',
        amount: 1250,
        type: 'Duplicate Invoice',
        reason: 'Nomor invoice dan nominal sama terdeteksi dua kali dalam 24 jam.',
        timestamp: '2026-07-27 11:20:10',
        severity: 'High',
    },
    {
        id: 'ANM-102',
        invoiceNo: 'REC-1005',
        vendorOrCustomer: 'Daily Planet',
        module: 'Accounts Receivable',
        amount: 98500,
        type: 'Unusual Amount',
        reason: 'Nilai transaksi jauh di atas rata-rata historis (+340%).',
        timestamp: '2026-07-27 10:04:18',
        severity: 'High',
    },
    {
        id: 'ANM-103',
        invoiceNo: 'INV-008',
        vendorOrCustomer: 'Global Tech',
        module: 'Accounts Payable',
        amount: 3800,
        type: 'Missing Document',
        reason: 'Transaksi diposting tanpa lampiran faktur atau tanda terima.',
        timestamp: '2026-07-26 15:42:57',
        severity: 'Medium',
    },
    {
        id: 'ANM-104',
        invoiceNo: 'REC-1002',
        vendorOrCustomer: 'LexCorp',
        module: 'Accounts Receivable',
        amount: 3200.5,
        type: 'Suspicious Payment Pattern',
        reason: 'Pembayaran dipecah menjadi beberapa nominal kecil berulang dalam 1 hari.',
        timestamp: '2026-07-26 09:12:03',
        severity: 'Medium',
    },
];


export default function AuditTrail({ pageTitle = 'Jejak Audit' }: Props) {
    const page = usePage();
    const financeData = page.props.financeData as any;
    const [logs] = useState<AuditLog[]>(financeData?.auditTrail?.logs ?? mockAuditLogs);
    const [anomalies] = useState<AnomalyItem[]>(financeData?.auditTrail?.anomalies ?? mockAnomalies);
    const [searchQuery, setSearchQuery] = useState('');
    const [actionFilter, setActionFilter] = useState('All');
    const [anomalyTypeFilter, setAnomalyTypeFilter] = useState('All');

    // Filter logic
    const filteredLogs = logs.filter(log => {
        const matchesSearch = 
            log.user.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
            log.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
            log.module.toLowerCase().includes(searchQuery.toLowerCase());
        
        const matchesAction = actionFilter === 'All' ? true : log.action === actionFilter;

        return matchesSearch && matchesAction;
    });

    const filteredAnomalies = anomalies.filter((item) => {
        const matchesSearch =
            item.invoiceNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.vendorOrCustomer.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.reason.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesType = anomalyTypeFilter === 'All' ? true : item.type === anomalyTypeFilter;

        return matchesSearch && matchesType;
    });

    const anomalyCounts = {
        duplicate: anomalies.filter((a) => a.type === 'Duplicate Invoice').length,
        unusual: anomalies.filter((a) => a.type === 'Unusual Amount').length,
        noDocument: anomalies.filter((a) => a.type === 'Missing Document').length,
        suspicious: anomalies.filter((a) => a.type === 'Suspicious Payment Pattern').length,
    };


    const getActionBadge = (action: AuditAction) => {
        switch (action) {
            case 'Input': return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Input</Badge>;
            case 'Edit': return <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">Ubah</Badge>;
            case 'Approve': return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Setujui</Badge>;
            case 'Reject': return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Tolak</Badge>;
            case 'Delete': return <Badge variant="destructive">Hapus</Badge>;
            default: return <Badge variant="secondary">{action}</Badge>;
        }
    };

    const getSeverityBadge = (severity: 'Low' | 'Medium' | 'High') => {
        if (severity === 'High') {
            return <Badge variant="destructive">Tinggi</Badge>;
        }

        if (severity === 'Medium') {
            return (
                <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                    Sedang
                </Badge>
            );
        }

        return <Badge variant="secondary">Rendah</Badge>;
    };


    return (
        <div className="flex h-full flex-1 flex-col gap-6 p-4">
            <Head title={pageTitle} />

            <div className="mb-2 flex items-center justify-between">
                <div>
                    <div className="flex items-center gap-2">
                        <ShieldCheck className="h-6 w-6 text-primary" />
                        <h1 className="text-2xl font-bold tracking-tight">Jejak Audit Sistem</h1>
                    </div>
                    <p className="text-muted-foreground mt-1">
                        Lacak setiap interaksi pengguna, perubahan, dan persetujuan di seluruh sistem keuangan.
                    </p>
                </div>
            </div>

            <Card className="flex-1 flex flex-col">
                <CardHeader className="pb-4">
                    <div className="flex flex-col sm:flex-row justify-between gap-4">
                        <div className="flex items-center gap-2 flex-1 max-w-sm">
                            <div className="relative w-full">
                                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    type="text"
                                        placeholder="Cari berdasarkan pengguna, deskripsi, atau modul..."
                                    className="pl-9"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="flex items-center gap-2 w-full sm:w-auto">
                            <Select value={actionFilter} onValueChange={setActionFilter}>
                                <SelectTrigger className="w-full sm:w-[150px]">
                                    <SelectValue placeholder="Filter Aksi" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="All">Semua Aksi</SelectItem>
                                    <SelectItem value="Input">Input</SelectItem>
                                    <SelectItem value="Edit">Ubah</SelectItem>
                                    <SelectItem value="Approve">Setujui</SelectItem>
                                    <SelectItem value="Reject">Tolak</SelectItem>
                                    <SelectItem value="Delete">Hapus</SelectItem>
                                </SelectContent>
                            </Select>
                            <Button variant="outline">Ekspor CSV</Button>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="flex-1">
                    <div className="rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[180px]">Waktu</TableHead>
                                    <TableHead>Pengguna / Aktor</TableHead>
                                    <TableHead>Aksi</TableHead>
                                    <TableHead>Modul</TableHead>
                                    <TableHead className="min-w-[300px]">Deskripsi & Detail</TableHead>
                                    <TableHead className="text-right">Dokumen Pendukung</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredLogs.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={6} className="text-center h-32 text-muted-foreground">
                                            Tidak ada log audit yang sesuai dengan kriteria.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    filteredLogs.map((log) => (
                                        <TableRow key={log.id}>
                                            <TableCell className="text-xs whitespace-nowrap text-muted-foreground">
                                                {log.timestamp}
                                            </TableCell>
                                            <TableCell>
                                                <div className="font-medium text-sm">{log.user.name}</div>
                                                <div className="text-xs text-muted-foreground">{log.user.email}</div>
                                            </TableCell>
                                            <TableCell>
                                                {getActionBadge(log.action)}
                                            </TableCell>
                                            <TableCell className="text-sm font-medium">
                                                {log.module}
                                            </TableCell>
                                            <TableCell className="text-sm">
                                                {log.description}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                {log.document ? (
                                                    <Button variant="ghost" size="sm" className="h-8 text-blue-600 hover:text-blue-800 hover:bg-blue-50 justify-end w-full px-2" title={log.document.name}>
                                                        <FileText className="h-4 w-4 mr-2" />
                                                        <span className="text-xs ml-1 max-w-[100px] truncate">{log.document.name}</span>
                                                    </Button>
                                                ) : (
                                                    <span className="text-muted-foreground text-xs italic pr-4">-</span>
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>

            <Card className="flex-1 flex flex-col">
                <CardHeader className="pb-4">
                    <div className="flex flex-col sm:flex-row justify-between gap-4">
                        <div>
                            <CardTitle className="flex items-center gap-2">
                                <AlertTriangle className="h-5 w-5 text-amber-600" />
                                Deteksi Anomali
                            </CardTitle>
                            <CardDescription className="mt-1">
                                Tandai invoice duplikat, nominal tidak wajar, transaksi tanpa dokumen, dan pola pembayaran mencurigakan.
                            </CardDescription>
                        </div>
                        <div className="w-full sm:w-[260px]">
                            <Select value={anomalyTypeFilter} onValueChange={setAnomalyTypeFilter}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Filter Anomali" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="All">Semua Jenis</SelectItem>
                                    <SelectItem value="Duplicate Invoice">Faktur Duplikat</SelectItem>
                                    <SelectItem value="Unusual Amount">Nominal Tidak Wajar</SelectItem>
                                    <SelectItem value="Missing Document">Dokumen Tidak Lengkap</SelectItem>
                                    <SelectItem value="Suspicious Payment Pattern">Pola Pembayaran Mencurigakan</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                        <div className="rounded-lg border bg-background p-3">
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Copy className="h-4 w-4" /> Faktur Duplikat
                            </div>
                            <div className="mt-1 text-2xl font-semibold">{anomalyCounts.duplicate}</div>
                        </div>
                        <div className="rounded-lg border bg-background p-3">
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <HandCoins className="h-4 w-4" /> Nominal Tidak Wajar
                            </div>
                            <div className="mt-1 text-2xl font-semibold">{anomalyCounts.unusual}</div>
                        </div>
                        <div className="rounded-lg border bg-background p-3">
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <FileText className="h-4 w-4" /> Dokumen Tidak Lengkap
                            </div>
                            <div className="mt-1 text-2xl font-semibold">{anomalyCounts.noDocument}</div>
                        </div>
                        <div className="rounded-lg border bg-background p-3">
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <AlertTriangle className="h-4 w-4" /> Pola Mencurigakan
                            </div>
                            <div className="mt-1 text-2xl font-semibold">{anomalyCounts.suspicious}</div>
                        </div>
                    </div>

                    <div className="rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Waktu</TableHead>
                                    <TableHead>Faktur</TableHead>
                                    <TableHead>Pihak Lawan</TableHead>
                                    <TableHead>Modul</TableHead>
                                    <TableHead>Jenis Anomali</TableHead>
                                    <TableHead>Nominal</TableHead>
                                    <TableHead>Tingkat</TableHead>
                                    <TableHead>Alasan</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredAnomalies.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={8} className="text-center h-24 text-muted-foreground">
                                            Tidak ada anomali untuk filter saat ini.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    filteredAnomalies.map((item) => (
                                        <TableRow key={item.id}>
                                            <TableCell className="text-xs whitespace-nowrap text-muted-foreground">
                                                {item.timestamp}
                                            </TableCell>
                                            <TableCell className="font-medium">{item.invoiceNo}</TableCell>
                                            <TableCell>{item.vendorOrCustomer}</TableCell>
                                            <TableCell>{item.module === 'Accounts Payable' ? 'Utang Usaha' : 'Piutang Usaha'}</TableCell>
                                            <TableCell>
                                                {item.type === 'Duplicate Invoice' && 'Faktur Duplikat'}
                                                {item.type === 'Unusual Amount' && 'Nominal Tidak Wajar'}
                                                {item.type === 'Missing Document' && 'Dokumen Tidak Lengkap'}
                                                {item.type === 'Suspicious Payment Pattern' && 'Pola Pembayaran Mencurigakan'}
                                            </TableCell>
                                            <TableCell>
                                                {new Intl.NumberFormat('id-ID', {
                                                    style: 'currency',
                                                    currency: 'IDR',
                                                }).format(item.amount)}
                                            </TableCell>
                                            <TableCell>{getSeverityBadge(item.severity)}</TableCell>
                                            <TableCell className="max-w-[360px]">{item.reason}</TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>

        </div>
    );
}

AuditTrail.layout = (props: { pageTitle?: string }) => {
    return {
        breadcrumbs: [
            {
                title: props.pageTitle || 'Jejak Audit',
                href: window.location.pathname,
            },
        ],
    };
};