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
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Link2, Search } from 'lucide-react';

type Props = {
    pageTitle?: string;
};

type ReconciliationSuggestion = {
    id: string;
    bankRef: string;
    bankDate: string;
    bankAmount: number;
    direction: 'Incoming' | 'Outgoing';
    candidateDoc: string;
    candidateParty: string;
    matchReason: string;
    confidence: number;
    status: 'Disarankan' | 'Perlu Tinjauan' | 'Cocok Otomatis';
};

const mockReconciliationSuggestions: ReconciliationSuggestion[] = [
    {
        id: 'REC-SUG-01',
        bankRef: 'BNK-TRX-778102',
        bankDate: '2026-07-27 08:19:44',
        bankAmount: 1250,
        direction: 'Outgoing',
        candidateDoc: 'INV-004',
        candidateParty: 'Wayne Enterprises',
        matchReason: 'Nominal sama, vendor sama, tanggal jatuh tempo selisih 1 hari.',
        confidence: 96,
        status: 'Cocok Otomatis',
    },
    {
        id: 'REC-SUG-02',
        bankRef: 'BNK-TRX-778123',
        bankDate: '2026-07-27 11:03:21',
        bankAmount: 3200.5,
        direction: 'Incoming',
        candidateDoc: 'REC-1002',
        candidateParty: 'LexCorp',
        matchReason: 'Nominal sama, customer sama, memo transfer mirip nomor invoice.',
        confidence: 91,
        status: 'Disarankan',
    },
    {
        id: 'REC-SUG-03',
        bankRef: 'BNK-TRX-778145',
        bankDate: '2026-07-26 16:12:09',
        bankAmount: 3800,
        direction: 'Outgoing',
        candidateDoc: 'INV-008',
        candidateParty: 'Global Tech',
        matchReason: 'Nominal cocok, namun dokumen pendukung belum tersedia.',
        confidence: 74,
        status: 'Perlu Tinjauan',
    },
    {
        id: 'REC-SUG-04',
        bankRef: 'BNK-TRX-778167',
        bankDate: '2026-07-26 10:40:11',
        bankAmount: 98500,
        direction: 'Incoming',
        candidateDoc: 'REC-1005',
        candidateParty: 'Daily Planet',
        matchReason: 'Nilai mendekati setelah potongan biaya transfer bank.',
        confidence: 67,
        status: 'Perlu Tinjauan',
    },
];

export default function Reconciliation({ pageTitle = 'Rekonsiliasi' }: Props) {
    const page = usePage();
    const financeData = page.props.financeData as any;
    const [searchQuery, setSearchQuery] = useState('');
    const [confidenceFilter, setConfidenceFilter] = useState('Semua');
    const [suggestions] = useState<ReconciliationSuggestion[]>(financeData?.reconciliation?.suggestions ?? mockReconciliationSuggestions);

    const filteredSuggestions = suggestions.filter((item) => {
        const matchesSearch =
            item.bankRef.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.candidateDoc.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.candidateParty.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.matchReason.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesConfidence =
                        confidenceFilter === 'Semua'
                ? true
                                : confidenceFilter === 'Tinggi'
                  ? item.confidence >= 90
                                    : confidenceFilter === 'Menengah'
                    ? item.confidence >= 75 && item.confidence < 90
                    : item.confidence < 75;

        return matchesSearch && matchesConfidence;
    });

    const getSuggestionStatusBadge = (status: 'Disarankan' | 'Perlu Tinjauan' | 'Cocok Otomatis') => {
        if (status === 'Cocok Otomatis') {
            return (
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                    Cocok Otomatis
                </Badge>
            );
        }

        if (status === 'Perlu Tinjauan') {
            return (
                <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                    Perlu Tinjauan
                </Badge>
            );
        }

        return <Badge variant="secondary">Disarankan</Badge>;
    };

    const getDirectionLabel = (direction: 'Incoming' | 'Outgoing') => {
        return direction === 'Incoming' ? 'Masuk' : 'Keluar';
    };

    return (
        <div className="flex h-full flex-1 flex-col gap-6 p-4">
            <Head title={pageTitle} />

            <Card className="flex-1 flex flex-col">
                <CardHeader className="pb-4">
                    <div className="flex flex-col gap-4">
                        <div>
                            <CardTitle className="flex items-center gap-2">
                                <Link2 className="h-5 w-5 text-blue-600" />
                                Saran Rekonsiliasi Cerdas
                            </CardTitle>
                            <CardDescription className="mt-1">
                                Sistem memberi kandidat match transaksi dengan confidence score agar proses rekonsiliasi lebih cepat.
                            </CardDescription>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-2">
                            <div className="relative w-full sm:max-w-md">
                                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    type="text"
                                    placeholder="Cari bank ref, dokumen, counterpart, atau alasan match..."
                                    className="pl-9"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>

                            <div className="w-full sm:w-[220px]">
                                <Select value={confidenceFilter} onValueChange={setConfidenceFilter}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Tingkat Keyakinan" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Semua">Semua Tingkat Keyakinan</SelectItem>
                                        <SelectItem value="Tinggi">Tinggi (&gt;= 90%)</SelectItem>
                                        <SelectItem value="Menengah">Menengah (75-89%)</SelectItem>
                                        <SelectItem value="Rendah">Rendah (&lt; 75%)</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </div>
                </CardHeader>

                <CardContent>
                    <div className="rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Bank Ref</TableHead>
                                    <TableHead>Tanggal</TableHead>
                                    <TableHead>Arah</TableHead>
                                    <TableHead>Nominal</TableHead>
                                    <TableHead>Kandidat Pencocokan</TableHead>
                                    <TableHead>Alasan</TableHead>
                                    <TableHead>Tingkat Keyakinan</TableHead>
                                    <TableHead>Status</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredSuggestions.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={8} className="text-center h-24 text-muted-foreground">
                                            Tidak ada saran rekonsiliasi untuk filter saat ini.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    filteredSuggestions.map((item) => (
                                        <TableRow key={item.id}>
                                            <TableCell className="font-medium">{item.bankRef}</TableCell>
                                            <TableCell className="text-xs whitespace-nowrap text-muted-foreground">
                                                {item.bankDate}
                                            </TableCell>
                                            <TableCell>{getDirectionLabel(item.direction)}</TableCell>
                                            <TableCell>
                                                {new Intl.NumberFormat('id-ID', {
                                                    style: 'currency',
                                                    currency: 'IDR',
                                                }).format(item.bankAmount)}
                                            </TableCell>
                                            <TableCell>
                                                <div className="font-medium">{item.candidateDoc}</div>
                                                <div className="text-xs text-muted-foreground">{item.candidateParty}</div>
                                            </TableCell>
                                            <TableCell className="max-w-[320px]">{item.matchReason}</TableCell>
                                            <TableCell>
                                                <div className="min-w-[130px]">
                                                    <div className="mb-1 text-xs font-medium">{item.confidence}%</div>
                                                    <div className="h-2 w-full rounded-full bg-muted">
                                                        <div
                                                            className={`h-2 rounded-full ${
                                                                item.confidence >= 90
                                                                    ? 'bg-green-500'
                                                                    : item.confidence >= 75
                                                                      ? 'bg-amber-500'
                                                                      : 'bg-red-500'
                                                            }`}
                                                            style={{ width: `${item.confidence}%` }}
                                                        />
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>{getSuggestionStatusBadge(item.status)}</TableCell>
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

Reconciliation.layout = (props: { pageTitle?: string }) => {
    return {
        breadcrumbs: [
            {
                title: props.pageTitle || 'Rekonsiliasi',
                href: window.location.pathname,
            },
        ],
    };
};
