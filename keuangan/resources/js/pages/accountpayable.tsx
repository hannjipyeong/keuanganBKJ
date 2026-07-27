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

type Props = {
    pageTitle?: string;
};

// Dummy data for accounts payable
const initialInvoices = [
    { id: 'INV-001', vendor: 'Acme Corp', amount: 1200.00, dueDate: '2026-08-01', status: 'Pending' },
    { id: 'INV-002', vendor: 'Global Tech', amount: 3500.00, dueDate: '2026-07-30', status: 'Paid' },
    { id: 'INV-003', vendor: 'Stark Industries', amount: 850.00, dueDate: '2026-08-15', status: 'Pending' },
];

export default function AccountPayable({ pageTitle = 'Utang Usaha' }: Props) {
    const page = usePage();
    const financeData = page.props.financeData as any;
    const [invoices, setInvoices] = useState(financeData?.accountPayable?.invoices ?? initialInvoices);
    
    // Form state
    const [vendor, setVendor] = useState('');
    const [amount, setAmount] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [status, setStatus] = useState('Pending');

    const getStatusLabel = (value: string) => {
        if (value === 'Paid') return 'Lunas';
        if (value === 'Overdue') return 'Terlambat';
        return 'Menunggu';
    };

    const formatInvoiceAmount = (value: string | number) => {
        if (typeof value === 'number') {
            return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(value);
        }

        return value;
    };

    const handleAddInvoice = (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!vendor || !amount || !dueDate) return;
        
        const newInvoice = {
            id: `INV-00${invoices.length + 1}`,
            vendor,
            amount: parseFloat(amount),
            dueDate,
            status,
        };
        
        setInvoices([...invoices, newInvoice]);
        
        // Reset form
        setVendor('');
        setAmount('');
        setDueDate('');
        setStatus('Pending');
    };

    return (
        <div className="flex h-full flex-1 flex-col gap-6 p-4">
            <Head title={pageTitle} />
            
            <div className="grid gap-6 md:grid-cols-3">
                <div className="md:col-span-1">
                    <Card>
                        <CardHeader>
                            <CardTitle>Input Faktur Vendor</CardTitle>
                            <CardDescription>
                                Tambahkan data utang usaha baru.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleAddInvoice} className="flex flex-col gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="vendor">Nama Vendor</Label>
                                    <Input 
                                        id="vendor" 
                                        placeholder="e.g. Acme Corp" 
                                        value={vendor}
                                        onChange={(e) => setVendor(e.target.value)}
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
                                <div className="grid gap-2">
                                    <Label htmlFor="status">Status Pembayaran</Label>
                                    <Select value={status} onValueChange={setStatus}>
                                        <SelectTrigger id="status">
                                            <SelectValue placeholder="Pilih status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Pending">Menunggu</SelectItem>
                                            <SelectItem value="Paid">Lunas</SelectItem>
                                            <SelectItem value="Overdue">Terlambat</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <Button type="submit" className="mt-2 text-white bg-sidebar-primary hover:bg-sidebar-primary/90">Tambah Faktur</Button>
                            </form>
                        </CardContent>
                    </Card>
                </div>
                
                <div className="md:col-span-2">
                    <Card className="h-full">
                        <CardHeader>
                            <CardTitle>Jadwal Pembayaran</CardTitle>
                            <CardDescription>
                                Ringkasan seluruh faktur vendor dan statusnya.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="rounded-md border">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Invoice ID</TableHead>
                                            <TableHead>Vendor</TableHead>
                                            <TableHead>Nominal</TableHead>
                                            <TableHead>Jatuh Tempo</TableHead>
                                            <TableHead>Status</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {invoices.length === 0 ? (
                                            <TableRow>
                                                <TableCell colSpan={5} className="text-center">
                                                    Tidak ada faktur.
                                                </TableCell>
                                            </TableRow>
                                        ) : (
                                            invoices.map((inv) => (
                                                <TableRow key={inv.id}>
                                                    <TableCell className="font-medium">{inv.id}</TableCell>
                                                    <TableCell>{inv.vendor}</TableCell>
                                                    <TableCell>{formatInvoiceAmount(inv.amount)}</TableCell>
                                                    <TableCell>{inv.dueDate}</TableCell>
                                                    <TableCell>
                                                        <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                                                            inv.status === 'Paid' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 
                                                            inv.status === 'Overdue' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' : 
                                                            'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                                                        }`}>
                                                            {getStatusLabel(inv.status)}
                                                        </span>
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
        </div>
    );
}

AccountPayable.layout = (props: { pageTitle?: string }) => {
    return {
        breadcrumbs: [
            {
                title: props.pageTitle || 'Utang Usaha',
                href: window.location.pathname,
            },
        ],
    };
};