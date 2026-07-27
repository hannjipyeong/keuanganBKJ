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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { AlertCircle, BookOpen, Layers, Plus } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

type Props = {
    pageTitle?: string;
};

// 1. CHART OF ACCOUNTS (COA)
const initialCoa = [
    { code: '1001', name: 'Kas', type: 'Asset', balance: 15500.00 },
    { code: '1002', name: 'Piutang Usaha', type: 'Asset', balance: 5000.00 },
    { code: '2001', name: 'Utang Usaha', type: 'Liability', balance: 2500.00 },
    { code: '3001', name: 'Ekuitas Pemilik', type: 'Equity', balance: 10000.00 },
    { code: '4001', name: 'Pendapatan Penjualan', type: 'Revenue', balance: 15000.00 },
    { code: '5001', name: 'Beban Sewa', type: 'Expense', balance: 1000.00 },
    { code: '5002', name: 'Beban Gaji', type: 'Expense', balance: 6000.00 },
];

// 2. JOURNAL ENTRIES
// A journal entry has a date, description, and multiple lines (debits/credits)
type JournalLine = { accountCode: string; debit: number; credit: number };
type JournalEntry = { id: string; date: string; description: string; lines: JournalLine[]; isPosted: boolean };

const initialJournals: JournalEntry[] = [
    {
        id: 'JE-001',
        date: '2026-07-01',
        description: 'Investasi Awal',
        isPosted: true,
        lines: [
            { accountCode: '1001', debit: 10000.00, credit: 0 },
            { accountCode: '3001', debit: 0, credit: 10000.00 },
        ]
    },
    {
        id: 'JE-002',
        date: '2026-07-05',
        description: 'Sewa Kantor Juli',
        isPosted: true,
        lines: [
            { accountCode: '5001', debit: 1000.00, credit: 0 },
            { accountCode: '1001', debit: 0, credit: 1000.00 },
        ]
    }
];

export default function GeneralLedger({ pageTitle = 'Buku Besar' }: Props) {
    const page = usePage();
    const financeData = page.props.financeData as any;
    const [coa, setCoa] = useState(financeData?.generalLedger?.coa ?? initialCoa);
    const [journals, setJournals] = useState<JournalEntry[]>(financeData?.generalLedger?.journals ?? initialJournals);

    // Form state for automated journal input
    const [jDate, setJDate] = useState('');
    const [jDesc, setJDesc] = useState('');
    // Store current lines being created
    const [jLines, setJLines] = useState<JournalLine[]>([
        { accountCode: '', debit: 0, credit: 0 },
        { accountCode: '', debit: 0, credit: 0 }
    ]);
    const [journalError, setJournalError] = useState('');

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(value);
    };

    // Calculate Trial Balance dynamically based on posted journals
    const calculateTrialBalance = () => {
        const tb: Record<string, { name: string; debit: number; credit: number }> = {};
        
        coa.forEach(account => {
            tb[account.code] = { name: account.name, debit: 0, credit: 0 };
        });

        journals.filter(j => j.isPosted).forEach(journal => {
            journal.lines.forEach(line => {
                if (tb[line.accountCode]) {
                    tb[line.accountCode].debit += line.debit;
                    tb[line.accountCode].credit += line.credit;
                }
            });
        });

        const balances = Object.keys(tb).map(code => {
            const acc = coa.find(c => c.code === code);
            const type = acc?.type;
            let normalBalance = 0;
            let finalDebit = 0;
            let finalCredit = 0;

            // Normal balances: Assets & Expenses = Debit. Liabilities, Equity, Revenue = Credit.
            if (type === 'Asset' || type === 'Expense') {
                normalBalance = tb[code].debit - tb[code].credit;
                if (normalBalance >= 0) finalDebit = normalBalance;
                else finalCredit = Math.abs(normalBalance);
            } else {
                normalBalance = tb[code].credit - tb[code].debit;
                if (normalBalance >= 0) finalCredit = normalBalance;
                else finalDebit = Math.abs(normalBalance);
            }

            return {
                code,
                name: tb[code].name,
                debit: finalDebit,
                credit: finalCredit
            };
        }).filter(b => b.debit > 0 || b.credit > 0);

        return balances;
    };

    const trialBalance = calculateTrialBalance();
    const totalTbDebit = trialBalance.reduce((sum, item) => sum + item.debit, 0);
    const totalTbCredit = trialBalance.reduce((sum, item) => sum + item.credit, 0);

    const handleAddJournalLine = () => {
        setJLines([...jLines, { accountCode: '', debit: 0, credit: 0 }]);
    };

    const handleRemoveJournalLine = (index: number) => {
        if (jLines.length <= 2) return; // Minimum 2 lines
        const newLines = [...jLines];
        newLines.splice(index, 1);
        setJLines(newLines);
    };

    const updateJournalLine = (index: number, field: keyof JournalLine, value: any) => {
        const newLines = [...jLines];
        newLines[index] = { ...newLines[index], [field]: value };
        // Clean up opposing field: if user enters debit, clear credit
        if (field === 'debit' && value > 0) newLines[index].credit = 0;
        if (field === 'credit' && value > 0) newLines[index].debit = 0;
        setJLines(newLines);
    };

    const handleSaveJournal = (e: React.FormEvent) => {
        e.preventDefault();
        setJournalError('');

        if (!jDate || !jDesc) {
            setJournalError('Tanggal dan deskripsi wajib diisi.');
            return;
        }

        // Validate entries
        const validLines = jLines.filter(l => l.accountCode !== '' && (l.debit > 0 || l.credit > 0));
        if (validLines.length < 2) {
            setJournalError('Minimal dua baris jurnal valid harus diisi.');
            return;
        }

        const totalDebit = validLines.reduce((sum, line) => sum + Number(line.debit), 0);
        const totalCredit = validLines.reduce((sum, line) => sum + Number(line.credit), 0);

        if (totalDebit !== totalCredit) {
            setJournalError('Total Debit harus sama dengan Kredit.');
            return;
        }

        const newJournal: JournalEntry = {
            id: `JE-00${journals.length + 1}`,
            date: jDate,
            description: jDesc,
            lines: validLines.map(l => ({ ...l, debit: Number(l.debit), credit: Number(l.credit) })),
            isPosted: false // Simpan sebagai draft terlebih dahulu
        };

        setJournals([newJournal, ...journals]);
        
        // Reset form
        setJDate('');
        setJDesc('');
        setJLines([{ accountCode: '', debit: 0, credit: 0 }, { accountCode: '', debit: 0, credit: 0 }]);
    };

    const handlePostJournal = (id: string) => {
        setJournals(journals.map(j => j.id === id ? { ...j, isPosted: true } : j));
        // Note: In real app, posting would also update the actual COA balances permanently.
    };

    return (
        <div className="flex h-full flex-1 flex-col gap-6 p-4">
            <Head title={pageTitle} />

            <Tabs defaultValue="automated-journal" className="w-full">
                <TabsList className="grid w-full grid-cols-4 mb-4">
                    <TabsTrigger value="automated-journal">Buat Jurnal</TabsTrigger>
                    <TabsTrigger value="journal-list">Posting & Daftar Jurnal</TabsTrigger>
                    <TabsTrigger value="coa">Daftar Akun</TabsTrigger>
                    <TabsTrigger value="trial-balance">Neraca Saldo</TabsTrigger>
                </TabsList>

                {/* 1. AUTOMATED JOURNAL ENTRY TAB */}
                <TabsContent value="automated-journal">
                    <Card className="max-w-4xl mx-auto">
                        <CardHeader>
                            <div className="flex items-center gap-2">
                                <BookOpen className="h-5 w-5" />
                                <CardTitle>Entri Jurnal Otomatis</CardTitle>
                            </div>
                            <CardDescription>
                                Buat dan catat jurnal pembukuan berpasangan, manual maupun otomatis.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {journalError && (
                                <Alert variant="destructive" className="mb-6">
                                    <AlertCircle className="h-4 w-4" />
                                    <AlertTitle>Validasi Gagal</AlertTitle>
                                    <AlertDescription>{journalError}</AlertDescription>
                                </Alert>
                            )}
                            <form onSubmit={handleSaveJournal} className="space-y-6">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="jDate">Tanggal</Label>
                                        <Input id="jDate" type="date" value={jDate} onChange={e => setJDate(e.target.value)} required />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="jDesc">Deskripsi</Label>
                                        <Input id="jDesc" placeholder="contoh: Tagihan utilitas bulanan" value={jDesc} onChange={e => setJDesc(e.target.value)} required />
                                    </div>
                                </div>

                                <div className="rounded-md border p-4 bg-muted/20">
                                    <div className="grid grid-cols-12 gap-2 mb-2 font-medium text-sm text-muted-foreground px-2">
                                        <div className="col-span-6">Akun</div>
                                        <div className="col-span-3 text-right">Debit</div>
                                        <div className="col-span-3 text-right">Credit</div>
                                    </div>
                                    
                                    <ScrollArea className="h-[250px] pr-4">
                                        <div className="space-y-3">
                                            {jLines.map((line, index) => (
                                                <div key={index} className="grid grid-cols-12 gap-2 items-center">
                                                    <div className="col-span-6">
                                                        <Select value={line.accountCode} onValueChange={(val) => updateJournalLine(index, 'accountCode', val)}>
                                                            <SelectTrigger>
                                                                <SelectValue placeholder="Pilih Akun..." />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                <ScrollArea className="h-[200px]">
                                                                    {coa.map((acc) => (
                                                                        <SelectItem key={acc.code} value={acc.code}>
                                                                            {acc.code} - {acc.name} ({acc.type})
                                                                        </SelectItem>
                                                                    ))}
                                                                </ScrollArea>
                                                            </SelectContent>
                                                        </Select>
                                                    </div>
                                                    <div className="col-span-3">
                                                        <Input 
                                                            type="number" step="0.01" min="0" placeholder="0.00" 
                                                            className="text-right"
                                                            value={line.debit || ''} 
                                                            onChange={(e) => updateJournalLine(index, 'debit', e.target.value)} 
                                                            disabled={line.credit > 0}
                                                        />
                                                    </div>
                                                    <div className="col-span-2">
                                                        <Input 
                                                            type="number" step="0.01" min="0" placeholder="0.00" 
                                                            className="text-right"
                                                            value={line.credit || ''} 
                                                            onChange={(e) => updateJournalLine(index, 'credit', e.target.value)} 
                                                            disabled={line.debit > 0}
                                                        />
                                                    </div>
                                                    <div className="col-span-1 text-right">
                                                        {jLines.length > 2 && (
                                                            <Button type="button" variant="ghost" size="icon" onClick={() => handleRemoveJournalLine(index)} className="text-destructive h-8 w-8 hover:text-destructive">
                                                                <span className="sr-only">Hapus</span>
                                                                &times;
                                                            </Button>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </ScrollArea>

                                    <Button type="button" variant="outline" size="sm" onClick={handleAddJournalLine} className="mt-4">
                                        <Plus className="h-4 w-4 mr-1" /> Tambah Baris
                                    </Button>

                                    <Separator className="my-4" />

                                    <div className="grid grid-cols-12 gap-2 font-bold px-2">
                                        <div className="col-span-6 text-right">Total:</div>
                                        <div className="col-span-3 text-right">
                                            {formatCurrency(jLines.reduce((sum, line) => sum + Number(line.debit || 0), 0))}
                                        </div>
                                        <div className="col-span-3 text-right pr-8">
                                            {formatCurrency(jLines.reduce((sum, line) => sum + Number(line.credit || 0), 0))}
                                        </div>
                                    </div>
                                </div>
                                <Button type="submit" className="w-full">Simpan Jurnal (Draft)</Button>
                            </form>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* 2. POSTING & JOURNAL LIST TAB */}
                <TabsContent value="journal-list">
                    <Card>
                        <CardHeader>
                            <CardTitle>Entri Jurnal & Posting</CardTitle>
                            <CardDescription>
                                Tinjau jurnal draft dan posting untuk memperbarui Buku Besar dan Neraca Saldo.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-6">
                                {journals.map((journal) => (
                                    <div key={journal.id} className={`rounded-lg border p-4 shadow-sm ${!journal.isPosted ? 'border-primary/40 bg-primary/5' : 'bg-background'}`}>
                                        <div className="flex items-center justify-between mb-4">
                                            <div>
                                                <h3 className="font-semibold text-lg">{journal.id} — {journal.description}</h3>
                                                <p className="text-sm text-muted-foreground">Tanggal: {journal.date}</p>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <span className={`text-sm font-bold ${journal.isPosted ? 'text-green-600' : 'text-amber-600'}`}>
                                                    {journal.isPosted ? 'TERPOSTING' : 'DRAFT'}
                                                </span>
                                                {!journal.isPosted && (
                                                    <Button size="sm" onClick={() => handlePostJournal(journal.id)}>Posting ke Buku Besar</Button>
                                                )}
                                            </div>
                                        </div>
                                        
                                        <Table>
                                            <TableHeader>
                                                <TableRow>
                                                    <TableHead>Akun</TableHead>
                                                    <TableHead className="text-right">Debit</TableHead>
                                                    <TableHead className="text-right">Credit</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {journal.lines.map((line, idx) => (
                                                    <TableRow key={idx}>
                                                        <TableCell>{line.accountCode} - {coa.find(c => c.code === line.accountCode)?.name}</TableCell>
                                                        <TableCell className="text-right">{line.debit > 0 ? formatCurrency(line.debit) : '-'}</TableCell>
                                                        <TableCell className="text-right">{line.credit > 0 ? formatCurrency(line.credit) : '-'}</TableCell>
                                                    </TableRow>
                                                ))}
                                                <TableRow className="font-bold bg-muted/50">
                                                    <TableCell className="text-right">Total Buku Besar:</TableCell>
                                                    <TableCell className="text-right">
                                                        {formatCurrency(journal.lines.reduce((s, l) => s + l.debit, 0))}
                                                    </TableCell>
                                                    <TableCell className="text-right">
                                                        {formatCurrency(journal.lines.reduce((s, l) => s + l.credit, 0))}
                                                    </TableCell>
                                                </TableRow>
                                            </TableBody>
                                        </Table>
                                    </div>
                                ))}
                                {journals.length === 0 && (
                                    <div className="text-center p-8 text-muted-foreground">Tidak ada entri jurnal.</div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* 3. CHART OF ACCOUNTS TAB */}
                <TabsContent value="coa">
                    <Card>
                        <CardHeader>
                            <div className="flex items-center gap-2">
                                <Layers className="h-5 w-5" />
                                <CardTitle>Daftar Akun (COA)</CardTitle>
                            </div>
                            <CardDescription>
                                Daftar master seluruh akun pada buku besar.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="rounded-md border">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Kode</TableHead>
                                            <TableHead>Nama Akun</TableHead>
                                            <TableHead>Type</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {coa.map((account) => (
                                            <TableRow key={account.code}>
                                                <TableCell className="font-medium">{account.code}</TableCell>
                                                <TableCell>{account.name}</TableCell>
                                                <TableCell>{account.type}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* 4. TRIAL BALANCE TAB */}
                <TabsContent value="trial-balance">
                    <Card>
                        <CardHeader>
                            <CardTitle>Neraca Saldo</CardTitle>
                            <CardDescription>
                                Verifikasi bahwa total debit dan kredit seimbang dari seluruh jurnal TERPOSTING.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="rounded-md border">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Kode Akun</TableHead>
                                            <TableHead>Nama Akun</TableHead>
                                            <TableHead className="text-right text-blue-600 dark:text-blue-400">Debit</TableHead>
                                            <TableHead className="text-right text-blue-600 dark:text-blue-400">Credit</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {trialBalance.length === 0 ? (
                                            <TableRow><TableCell colSpan={4} className="text-center">Belum ada aktivitas terposting.</TableCell></TableRow>
                                        ) : (
                                            trialBalance.map((item) => (
                                                <TableRow key={item.code}>
                                                    <TableCell>{item.code}</TableCell>
                                                    <TableCell>{item.name}</TableCell>
                                                    <TableCell className="text-right font-medium">
                                                        {item.debit > 0 ? formatCurrency(item.debit) : '-'}
                                                    </TableCell>
                                                    <TableCell className="text-right font-medium">
                                                        {item.credit > 0 ? formatCurrency(item.credit) : '-'}
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                        )}
                                        <TableRow className="bg-muted font-bold text-lg">
                                            <TableCell colSpan={2} className="text-right uppercase">Total Neraca:</TableCell>
                                            <TableCell className={`text-right ${totalTbDebit !== totalTbCredit ? 'text-red-500' : 'text-green-600'}`}>
                                                {formatCurrency(totalTbDebit)}
                                            </TableCell>
                                            <TableCell className={`text-right ${totalTbDebit !== totalTbCredit ? 'text-red-500' : 'text-green-600'}`}>
                                                {formatCurrency(totalTbCredit)}
                                            </TableCell>
                                        </TableRow>
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

GeneralLedger.layout = (props: { pageTitle?: string }) => {
    return {
        breadcrumbs: [
            {
                title: props.pageTitle || 'Buku Besar',
                href: window.location.pathname,
            },
        ],
    };
};