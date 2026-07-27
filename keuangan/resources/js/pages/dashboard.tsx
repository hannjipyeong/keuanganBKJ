import { Head, usePage } from '@inertiajs/react';
import { useState } from 'react';
import PendingInvitationsModal from '@/components/pending-invitations-modal';
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
import { AlertTriangle, CheckCircle2, Clock3, FileWarning, Wallet } from 'lucide-react';
import type { DashboardInvitation } from '@/types';

type Props = {
    pendingInvitations?: DashboardInvitation[];
    pageTitle?: string;
};

type AreaSeries = {
    key: string;
    label: string;
    stroke: string;
    fill: string;
};

type TrendPoint = {
    label: string;
    [key: string]: string | number;
};

const overdueTrendData: TrendPoint[] = [
    { label: 'M1', ap: 6, ar: 5 },
    { label: 'M2', ap: 5, ar: 6 },
    { label: 'M3', ap: 7, ar: 5 },
    { label: 'M4', ap: 6, ar: 4 },
    { label: 'M5', ap: 5, ar: 4 },
    { label: 'M6', ap: 4, ar: 3 },
];

const controlRiskTrendData: TrendPoint[] = [
    { label: 'M1', approval: 6, recon: 5, anomaly: 3 },
    { label: 'M2', approval: 5, recon: 6, anomaly: 4 },
    { label: 'M3', approval: 4, recon: 5, anomaly: 4 },
    { label: 'M4', approval: 4, recon: 4, anomaly: 3 },
    { label: 'M5', approval: 3, recon: 4, anomaly: 3 },
    { label: 'M6', approval: 3, recon: 3, anomaly: 2 },
];

function getSeriesMax(data: TrendPoint[], series: AreaSeries[]) {
    const values = data.flatMap((point) =>
        series.map((item) => Number(point[item.key] ?? 0)),
    );

    return Math.max(1, ...values);
}

function getX(index: number, points: number, width: number, padding: number) {
    if (points <= 1) {
        return width / 2;
    }

    return padding + (index * (width - padding * 2)) / (points - 1);
}

function getY(value: number, maxValue: number, height: number, padding: number) {
    return height - padding - (value / maxValue) * (height - padding * 2);
}

function buildLinePath(data: TrendPoint[], key: string, maxValue: number, width: number, height: number, padding: number) {
    return data
        .map((point, index) => {
            const x = getX(index, data.length, width, padding);
            const y = getY(Number(point[key] ?? 0), maxValue, height, padding);

            return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
        })
        .join(' ');
}

function buildAreaPath(data: TrendPoint[], key: string, maxValue: number, width: number, height: number, padding: number) {
    if (data.length === 0) {
        return '';
    }

    const linePath = buildLinePath(data, key, maxValue, width, height, padding);
    const firstX = getX(0, data.length, width, padding);
    const lastX = getX(data.length - 1, data.length, width, padding);
    const baselineY = height - padding;

    return `${linePath} L ${lastX} ${baselineY} L ${firstX} ${baselineY} Z`;
}

function SimpleAreaChart({
    data,
    series,
}: {
    data: TrendPoint[];
    series: AreaSeries[];
}) {
    const width = 640;
    const height = 220;
    const padding = 28;
    const maxValue = getSeriesMax(data, series);
    const guideLevels = [0, 0.25, 0.5, 0.75, 1];

    return (
        <div>
            <svg viewBox={`0 0 ${width} ${height}`} className="h-56 w-full overflow-visible" role="img" aria-label="Area chart tren operasional">
                {guideLevels.map((level) => {
                    const y = height - padding - level * (height - padding * 2);

                    return (
                        <line
                            key={level}
                            x1={padding}
                            y1={y}
                            x2={width - padding}
                            y2={y}
                            stroke="currentColor"
                            strokeOpacity="0.12"
                            strokeWidth="1"
                        />
                    );
                })}

                {series.map((item) => (
                    <path
                        key={`${item.key}-area`}
                        d={buildAreaPath(data, item.key, maxValue, width, height, padding)}
                        fill={item.fill}
                        fillOpacity="0.32"
                    />
                ))}

                {series.map((item) => (
                    <path
                        key={`${item.key}-line`}
                        d={buildLinePath(data, item.key, maxValue, width, height, padding)}
                        fill="none"
                        stroke={item.stroke}
                        strokeWidth="2"
                    />
                ))}

                {data.map((point, index) => {
                    const x = getX(index, data.length, width, padding);

                    return (
                        <text
                            key={point.label}
                            x={x}
                            y={height - 8}
                            textAnchor="middle"
                            fontSize="11"
                            fill="currentColor"
                            opacity="0.65"
                        >
                            {point.label}
                        </text>
                    );
                })}
            </svg>

            <div className="mt-2 flex flex-wrap gap-4 text-xs">
                {series.map((item) => (
                    <div key={item.key} className="flex items-center gap-2 text-muted-foreground">
                        <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: item.stroke }} />
                        <span>{item.label}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default function Dashboard({ pendingInvitations = [], pageTitle = 'Dashboard' }: Props) {
    const page = usePage();
    const financeData = page.props.financeData as any;
    const dashboardData = financeData?.dashboard;
    const kpi = dashboardData?.kpi;
    const operationalSnapshot = dashboardData?.operationalSnapshot ?? [];
    const overdueTrend = dashboardData?.areaChart?.overdueTrend ?? overdueTrendData;
    const controlRiskTrend = dashboardData?.areaChart?.controlRiskTrend ?? controlRiskTrendData;

    const [showInvitations, setShowInvitations] = useState(
        pendingInvitations.length > 0,
    );

    return (
        <>
            <Head title={pageTitle} />
            <PendingInvitationsModal
                invitations={pendingInvitations}
                open={pendingInvitations.length > 0 && showInvitations}
                onOpenChange={setShowInvitations}
            />
            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto rounded-xl p-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Dashboard Keuangan</h1>
                    <p className="text-muted-foreground">Ringkasan statistik semua fitur untuk membantu kontrol operasional harian.</p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
                    <Card>
                        <CardHeader className="pb-2">
                            <CardDescription>Total Jatuh Tempo</CardDescription>
                            <CardTitle className="text-2xl">{kpi?.totalOverdueCount ?? 7}</CardTitle>
                        </CardHeader>
                        <CardContent className="text-xs text-muted-foreground">Utang usaha dan piutang usaha yang lewat jatuh tempo.</CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="pb-2">
                            <CardDescription>Persetujuan Tertunda</CardDescription>
                            <CardTitle className="text-2xl">{kpi?.pendingApprovalCount ?? 3}</CardTitle>
                        </CardHeader>
                        <CardContent className="text-xs text-muted-foreground">Permintaan menunggu aksi pemberi persetujuan.</CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="pb-2">
                            <CardDescription>Transaksi Bank Belum Rekonsiliasi</CardDescription>
                            <CardTitle className="text-2xl">{kpi?.unreconciledCount ?? 3}</CardTitle>
                        </CardHeader>
                        <CardContent className="text-xs text-muted-foreground">Perlu verifikasi pada modul rekonsiliasi.</CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="pb-2">
                            <CardDescription>Peringatan Anomali</CardDescription>
                            <CardTitle className="text-2xl">{kpi?.anomalyCount ?? 4}</CardTitle>
                        </CardHeader>
                        <CardContent className="text-xs text-muted-foreground">Faktur duplikat, nominal tidak wajar, dan pola mencurigakan.</CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="pb-2">
                            <CardDescription>Tingkat Risiko Kas</CardDescription>
                            <CardTitle className="text-2xl">{kpi?.cashRiskLevel ?? 'Kritis'}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Badge variant="destructive">Butuh Tindakan</Badge>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid gap-4 xl:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>Area Chart Tren Keterlambatan AP/AR</CardTitle>
                            <CardDescription>
                                Menampilkan pergerakan jumlah item terlambat dari fitur Utang Usaha dan Piutang Usaha.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <SimpleAreaChart
                                data={overdueTrend}
                                series={[
                                    {
                                        key: 'ap',
                                        label: 'Utang Usaha Terlambat',
                                        stroke: '#dc2626',
                                        fill: '#fca5a5',
                                    },
                                    {
                                        key: 'ar',
                                        label: 'Piutang Usaha Terlambat',
                                        stroke: '#d97706',
                                        fill: '#fdba74',
                                    },
                                ]}
                            />
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Area Chart Beban Kontrol Operasional</CardTitle>
                            <CardDescription>
                                Menyatukan tren dari Alur Persetujuan, Rekonsiliasi, dan Deteksi Anomali untuk melihat beban tindak lanjut.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <SimpleAreaChart
                                data={controlRiskTrend}
                                series={[
                                    {
                                        key: 'approval',
                                        label: 'Persetujuan Tertunda',
                                        stroke: '#2563eb',
                                        fill: '#93c5fd',
                                    },
                                    {
                                        key: 'recon',
                                        label: 'Belum Rekonsiliasi',
                                        stroke: '#0f766e',
                                        fill: '#5eead4',
                                    },
                                    {
                                        key: 'anomaly',
                                        label: 'Anomali Aktif',
                                        stroke: '#7c3aed',
                                        fill: '#c4b5fd',
                                    },
                                ]}
                            />
                        </CardContent>
                    </Card>
                </div>

                <div className="grid gap-4 xl:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Clock3 className="h-5 w-5 text-amber-600" />
                                Ringkasan Operasional
                            </CardTitle>
                            <CardDescription>Statistik utama dari Utang Usaha, Piutang Usaha, dan Alur Persetujuan.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="rounded-md border">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Modul</TableHead>
                                            <TableHead className="text-right">Item Terbuka</TableHead>
                                            <TableHead className="text-right">Terlambat</TableHead>
                                            <TableHead className="text-right">Nilai Berisiko</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {operationalSnapshot.length === 0 ? (
                                            <TableRow>
                                                <TableCell colSpan={4} className="text-center h-20 text-muted-foreground">Data operasional belum tersedia.</TableCell>
                                            </TableRow>
                                        ) : (
                                            operationalSnapshot.map((row: any) => (
                                                <TableRow key={row.module}>
                                                    <TableCell className="font-medium">{row.module}</TableCell>
                                                    <TableCell className="text-right">{row.openItems}</TableCell>
                                                    <TableCell className="text-right text-red-600">{row.overdueItems}</TableCell>
                                                    <TableCell className="text-right">
                                                        {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(Number(row.riskValue ?? 0))}
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                        )}
                                    </TableBody>
                                </Table>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Wallet className="h-5 w-5 text-red-600" />
                                Ringkasan Risiko dan Kontrol
                            </CardTitle>
                            <CardDescription>Ringkasan status kontrol dari Rekonsiliasi, Jejak Audit, dan Pusat Komando Keuangan.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                <div className="rounded-lg border p-3">
                                    <div className="flex items-center justify-between">
                                        <div className="text-sm font-medium">Tingkat Keyakinan Rekonsiliasi &lt; 75%</div>
                                        <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">2 kasus</Badge>
                                    </div>
                                    <div className="mt-1 text-xs text-muted-foreground">Perlu tinjauan manual sebelum posting.</div>
                                </div>
                                <div className="rounded-lg border p-3">
                                    <div className="flex items-center justify-between">
                                        <div className="text-sm font-medium">Anomali Tingkat Tinggi</div>
                                        <Badge variant="destructive">2 peringatan</Badge>
                                    </div>
                                    <div className="mt-1 text-xs text-muted-foreground">Fokus pada faktur duplikat dan nominal tidak wajar.</div>
                                </div>
                                <div className="rounded-lg border p-3">
                                    <div className="flex items-center justify-between">
                                        <div className="text-sm font-medium">Dampak Bottleneck Persetujuan</div>
                                        <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">3.6 hari</Badge>
                                    </div>
                                    <div className="mt-1 text-xs text-muted-foreground">Proses pembayaran vendor &gt; 10,000 paling sering terlambat.</div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <FileWarning className="h-5 w-5 text-amber-600" />
                            Skor Kesehatan Lintas Fitur
                        </CardTitle>
                        <CardDescription>Skor kesehatan operasional berdasarkan semua fitur yang sudah aktif.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-3 md:grid-cols-4">
                            <div className="rounded-lg border p-3">
                                <div className="text-xs text-muted-foreground">Likuiditas</div>
                                <div className="mt-1 text-xl font-semibold text-red-600">58 / 100</div>
                                <div className="mt-1 text-xs text-muted-foreground">Kesenjangan kas jangka pendek masih tinggi.</div>
                            </div>
                            <div className="rounded-lg border p-3">
                                <div className="text-xs text-muted-foreground">Penagihan</div>
                                <div className="mt-1 text-xl font-semibold text-amber-600">71 / 100</div>
                                <div className="mt-1 text-xs text-muted-foreground">Perlu percepatan tindak lanjut piutang terlambat.</div>
                            </div>
                            <div className="rounded-lg border p-3">
                                <div className="text-xs text-muted-foreground">Kepatuhan</div>
                                <div className="mt-1 text-xl font-semibold text-amber-600">74 / 100</div>
                                <div className="mt-1 text-xs text-muted-foreground">Masih ada transaksi tanpa dokumen.</div>
                            </div>
                            <div className="rounded-lg border p-3">
                                <div className="text-xs text-muted-foreground">Otomasi</div>
                                <div className="mt-1 text-xl font-semibold text-green-600">83 / 100</div>
                                <div className="mt-1 text-xs text-muted-foreground">Pencocokan cerdas dan detektor sudah berjalan.</div>
                            </div>
                        </div>

                        <div className="mt-4 rounded-lg border bg-muted/20 p-3 text-sm">
                            <div className="flex items-start gap-2">
                                <AlertTriangle className="mt-0.5 h-4 w-4 text-amber-600" />
                                <div>
                                    Prioritas hari ini: selesaikan persetujuan level akhir yang tertunda, kurangi rekonsiliasi dengan keyakinan rendah, dan mitigasi kesenjangan kas 7 hari.
                                </div>
                            </div>
                            <div className="mt-2 flex items-center gap-2 text-green-700">
                                <CheckCircle2 className="h-4 w-4" />
                                    <span>Mesin rekomendasi aktif dan membantu prioritas tindakan kritis.</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

Dashboard.layout = (props: { pageTitle?: string, currentTeam?: { slug: string } | null }) => {
    return {
        breadcrumbs: [
            {
                title: props.pageTitle || 'Dashboard',
                href: window.location.pathname,
            },
        ],
    };
};
