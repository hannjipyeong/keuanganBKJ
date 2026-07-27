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
import { Badge } from '@/components/ui/badge';
import { Bell, CreditCard, Receipt } from 'lucide-react';

type Props = {
    pageTitle?: string;
};

// Dummy data for accounts receivable
const initialInvoices = [
    { id: 'REC-1001', customer: 'Wayne Enterprises', amount: 5000.00, dueDate: '2026-07-28', status: 'Pending', aging: 0 },
    { id: 'REC-1002', customer: 'LexCorp', amount: 3200.50, dueDate: '2026-07-15', status: 'Overdue', aging: 12 },
    { id: 'REC-1003', customer: 'Daily Planet', amount: 1500.00, dueDate: '2026-08-10', status: 'Pending', aging: 0 },
    { id: 'REC-1004', customer: 'Oscorp', amount: 8900.00, dueDate: '2026-06-20', status: 'Overdue', aging: 37 },
    { id: 'REC-1005', customer: 'Umbrella Corp', amount: 450.00, dueDate: '2026-07-25', status: 'Paid', aging: 0 },
];

export default function AccountReceivable({ pageTitle = 'Piutang Usaha' }: Props) {
    const page = usePage();
    const financeData = page.props.financeData as any;
    const [invoices, setInvoices] = useState(financeData?.accountReceivable?.invoices ?? initialInvoices);
    
    // Form state for new invoice
    const [customer, setCustomer] = useState('');
    const [amount, setAmount] = useState('');
    const [dueDate, setDueDate] = useState('');

    // Form state for settlement (pelunasan)
    const [selectedInvoice, setSelectedInvoice] = useState('');
    const [paymentAmount, setPaymentAmount] = useState('');

    const handleCreateInvoice = (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!customer || !amount || !dueDate) return;
        
        const newInvoice = {
            id: `REC-100${invoices.length + 1}`,
            customer,
            amount: parseFloat(amount),
            dueDate,
            status: 'Pending',
            aging: 0,
        };
        
        setInvoices([...invoices, newInvoice]);
        
        // Reset form
        setCustomer('');
        setAmount('');
        setDueDate('');
    };

    const handleSettlement = (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!selectedInvoice || !paymentAmount) return;

        setInvoices(invoices.map(inv => {
            if (inv.id === selectedInvoice) {
                // In a real app we'd handle partial payments, but for this demo:
                return { ...inv, status: 'Paid', aging: 0 };
            }
            return inv;
        }));

        setSelectedInvoice('');
        setPaymentAmount('');
    };

    const handleSendReminder = (id: string, customerName: string) => {
        alert(`Pengingat dikirim ke ${customerName} untuk faktur ${id}`);
    };

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(value);
    };

    const getStatusLabel = (status: string) => {
        if (status === 'Paid') return 'Lunas';
        if (status === 'Overdue') return 'Terlambat';
        return 'Menunggu';
    };

    // Calculate aging summary
    const agingSummary = {
        current: invoices.filter(i => i.status === 'Pending').reduce((acc, curr) => acc + curr.amount, 0),
        days1to30: invoices.filter(i => i.aging > 0 && i.aging <= 30 && i.status !== 'Paid').reduce((acc, curr) => acc + curr.amount, 0),
        days31to60: invoices.filter(i => i.aging > 30 && i.aging <= 60 && i.status !== 'Paid').reduce((acc, curr) => acc + curr.amount, 0),
        over60: invoices.filter(i => i.aging > 60 && i.status !== 'Paid').reduce((acc, curr) => acc + curr.amount, 0),
    };

    return (
        <div className="flex h-full flex-1 flex-col gap-6 p-4">
            <Head title={pageTitle} />
            
            <Tabs defaultValue="invoices" className="w-full">
                <TabsList className="grid w-full grid-cols-3 mb-4">
                    <TabsTrigger value="invoices">Penagihan & Koleksi</TabsTrigger>
                    <TabsTrigger value="settlement">Pelunasan Pembayaran</TabsTrigger>
                    <TabsTrigger value="aging">Laporan Umur Piutang</TabsTrigger>
                </TabsList>
                
                {/* 1. INVOICES & REMINDERS TAB */}
                <TabsContent value="invoices" className="space-y-6">
                    <div className="grid gap-6 md:grid-cols-3">
                        <div className="md:col-span-1">
                            <Card>
                                <CardHeader>
                                    <div className="flex items-center gap-2">
                                        <Receipt className="h-5 w-5" />
                                        <CardTitle>Buat Faktur</CardTitle>
                                    </div>
                                    <CardDescription>
                                        Tagihkan pelanggan untuk produk atau layanan.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <form onSubmit={handleCreateInvoice} className="flex flex-col gap-4">
                                        <div className="grid gap-2">
                                            <Label htmlFor="customer">Nama Pelanggan</Label>
                                            <Input 
                                                id="customer" 
                                                placeholder="e.g. Wayne Enterprises" 
                                                value={customer}
                                                onChange={(e) => setCustomer(e.target.value)}
                                                required 
                                            />
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor="amount">Nominal (Rp)</Label>
                                            <Input 
                                                id="amount" 
                                                type="number" 
                                                step="0.01" 
                                                placeholder="0.00" 
                                                value={amount}
                                                onChange={(e) => setAmount(e.target.value)}
                                                required 
                                            />
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor="dueDate">Tanggal Jatuh Tempo</Label>
                                            <Input 
                                                id="dueDate" 
                                                type="date" 
                                                value={dueDate}
                                                onChange={(e) => setDueDate(e.target.value)}
                                                required 
                                            />
                                        </div>
                                        <Button type="submit" className="mt-2">Buat Faktur</Button>
                                    </form>
                                </CardContent>
                            </Card>
                        </div>
                        
                        <div className="md:col-span-2">
                            <Card className="h-full">
                                <CardHeader>
                                    <CardTitle>Faktur Pelanggan</CardTitle>
                                    <CardDescription>
                                        Kelola faktur terkirim dan kirim pengingat untuk tagihan terlambat.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="rounded-md border">
                                        <Table>
                                            <TableHeader>
                                                <TableRow>
                                                    <TableHead>ID Faktur</TableHead>
                                                    <TableHead>Pelanggan</TableHead>
                                                    <TableHead>Nominal</TableHead>
                                                    <TableHead>Jatuh Tempo</TableHead>
                                                    <TableHead>Status</TableHead>
                                                    <TableHead className="text-right">Aksi</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {invoices.length === 0 ? (
                                                    <TableRow>
                                                        <TableCell colSpan={6} className="text-center">Tidak ada faktur.</TableCell>
                                                    </TableRow>
                                                ) : (
                                                    invoices.map((inv) => (
                                                        <TableRow key={inv.id}>
                                                            <TableCell className="font-medium">{inv.id}</TableCell>
                                                            <TableCell>{inv.customer}</TableCell>
                                                            <TableCell>{formatCurrency(inv.amount)}</TableCell>
                                                            <TableCell>{inv.dueDate}</TableCell>
                                                            <TableCell>
                                                                <Badge variant={inv.status === 'Paid' ? 'secondary' : inv.status === 'Overdue' ? 'destructive' : 'default'}
                                                                    className={inv.status === 'Paid' ? 'bg-green-100 text-green-800 hover:bg-green-100' : ''}
                                                                >
                                                                    {getStatusLabel(inv.status)}
                                                                </Badge>
                                                            </TableCell>
                                                            <TableCell className="text-right">
                                                                {inv.status !== 'Paid' && (
                                                                    <Button 
                                                                        variant="outline" 
                                                                        size="sm"
                                                                        onClick={() => handleSendReminder(inv.id, inv.customer)}
                                                                        className="flex items-center gap-1"
                                                                    >
                                                                        <Bell className="h-3 w-3" />
                                                                        Ingatkan
                                                                    </Button>
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
                        </div>
                    </div>
                </TabsContent>

                {/* 2. SETTLEMENT (PELUNASAN) TAB */}
                <TabsContent value="settlement">
                    <Card className="max-w-2xl mx-auto">
                        <CardHeader>
                            <div className="flex items-center gap-2">
                                <CreditCard className="h-5 w-5" />
                                <CardTitle>Pelunasan Pembayaran</CardTitle>
                            </div>
                            <CardDescription>
                                Proses pembayaran masuk dari pelanggan dan tandai faktur sebagai lunas.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSettlement} className="flex flex-col gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="invoice-select">Pilih Faktur Pending/Terlambat</Label>
                                    <Select value={selectedInvoice} onValueChange={setSelectedInvoice}>
                                        <SelectTrigger id="invoice-select">
                                            <SelectValue placeholder="-- Pilih Faktur untuk Dilunasi --" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {invoices.filter(i => i.status !== 'Paid').map(inv => (
                                                <SelectItem key={inv.id} value={inv.id}>
                                                    {inv.id} - {inv.customer} ({formatCurrency(inv.amount)})
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="payment-amount">Nominal Pembayaran Diterima (Rp)</Label>
                                    <Input 
                                        id="payment-amount" 
                                        type="number" 
                                        step="0.01" 
                                        placeholder="0.00" 
                                        value={paymentAmount}
                                        onChange={(e) => setPaymentAmount(e.target.value)}
                                        required 
                                    />
                                </div>
                                <Button type="submit" className="mt-2 max-w-xs">Catat Pembayaran</Button>
                            </form>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* 3. AGING PIUTANG TAB */}
                <TabsContent value="aging">
                    <div className="grid gap-4 md:grid-cols-4 mb-6">
                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-medium text-muted-foreground">Lancar (Belum Jatuh Tempo)</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{formatCurrency(agingSummary.current)}</div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-medium text-muted-foreground">Terlambat 1-30 Hari</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">{formatCurrency(agingSummary.days1to30)}</div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-medium text-muted-foreground">Terlambat 31-60 Hari</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">{formatCurrency(agingSummary.days31to60)}</div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-medium text-muted-foreground">&gt; 60 Hari Terlambat</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-red-600 dark:text-red-400">{formatCurrency(agingSummary.over60)}</div>
                            </CardContent>
                        </Card>
                    </div>

                    <Card>
                        <CardHeader>
                            <CardTitle>Detail Umur Piutang</CardTitle>
                            <CardDescription>Rincian saldo piutang berdasarkan pelanggan.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Pelanggan</TableHead>
                                        <TableHead>Total Outstanding</TableHead>
                                        <TableHead>Lancar</TableHead>
                                        <TableHead>1-30 Hari</TableHead>
                                        <TableHead>31-60 Hari</TableHead>
                                        <TableHead>&gt; 60 Hari</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {/* Group by customer logic for the table */}
                                    {Array.from(new Set(invoices.filter(i => i.status !== 'Paid').map(i => i.customer))).map(customerName => {
                                        const customerInvoices = invoices.filter(i => i.customer === customerName && i.status !== 'Paid');
                                        const total = customerInvoices.reduce((sum, i) => sum + i.amount, 0);
                                        const current = customerInvoices.filter(i => i.aging === 0).reduce((sum, i) => sum + i.amount, 0);
                                        const days1to30 = customerInvoices.filter(i => i.aging > 0 && i.aging <= 30).reduce((sum, i) => sum + i.amount, 0);
                                        const days31to60 = customerInvoices.filter(i => i.aging > 30 && i.aging <= 60).reduce((sum, i) => sum + i.amount, 0);
                                        const over60 = customerInvoices.filter(i => i.aging > 60).reduce((sum, i) => sum + i.amount, 0);

                                        return (
                                            <TableRow key={customerName}>
                                                <TableCell className="font-medium">{customerName}</TableCell>
                                                <TableCell className="font-bold">{formatCurrency(total)}</TableCell>
                                                <TableCell>{formatCurrency(current)}</TableCell>
                                                <TableCell className={days1to30 > 0 ? "text-amber-600" : ""}>{formatCurrency(days1to30)}</TableCell>
                                                <TableCell className={days31to60 > 0 ? "text-orange-600" : ""}>{formatCurrency(days31to60)}</TableCell>
                                                <TableCell className={over60 > 0 ? "text-red-600" : ""}>{formatCurrency(over60)}</TableCell>
                                            </TableRow>
                                        );
                                    })}
                                    {invoices.filter(i => i.status !== 'Paid').length === 0 && (
                                        <TableRow>
                                            <TableCell colSpan={6} className="text-center text-muted-foreground h-24">Tidak ada saldo terutang.</TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}

AccountReceivable.layout = (props: { pageTitle?: string }) => {
    return {
        breadcrumbs: [
            {
                title: props.pageTitle || 'Piutang Usaha',
                href: window.location.pathname,
            },
        ],
    };
};