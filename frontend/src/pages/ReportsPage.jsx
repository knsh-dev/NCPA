import { useState } from 'react'
import { AlertTriangle, Calendar, Clock, Download, TrendingDown } from 'lucide-react'
import { REPORTS_DATA, SCHEDULE_HOURS } from '../data/mockData'
import { useApp } from '../context/AppContext'
import { Badge } from '../components/ui/badge'
import { Button } from '../components/ui/button'
import { Card } from '../components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../components/ui/table'
import { Tabs, TabsList, TabsTrigger } from '../components/ui/tabs'
import { ScopeBar } from '../components/shared/ScopeBar'

/** Reports page with Y-axis scales, distinct Lapsed bars, reconciled Court 6 & unique member counts, and aligned chronological ordering. */
export function ReportsPage() {
  const { currentClub, showToast } = useApp()
  const [range, setRange] = useState('6mo')
  const [duesView, setDuesView] = useState('month')

  const data = REPORTS_DATA[range] || REPORTS_DATA['6mo']

  function exportReport(reportTitle, format, rows) {
    if (format === 'CSV' && rows?.length) {
      const headers = Object.keys(rows[0])
      const csv = [
        headers.join(','),
        ...rows.map((r) => headers.map((h) => `"${r[h]}"`).join(',')),
      ].join('\n')
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${reportTitle.toLowerCase().replace(/\s+/g, '-')}-${range}.csv`
      a.click()
      URL.revokeObjectURL(url)
    }
    showToast(`Exported ${reportTitle} (${range}) as ${format}.`)
  }

  const maxNew = Math.max(
    1,
    ...data.membership.rows.map((r) => r.newCount)
  )
  const maxDues = Math.max(
    1,
    ...data.dues.byMonth.map((r) => r.collected)
  )
  const maxCourtBookings = Math.max(
    1,
    ...data.utilization.courts.map((c) => c.bookings)
  )
  const maxHourly = Math.max(1, ...data.utilization.hourly)
  const maxEntries = Math.max(
    1,
    ...data.tournaments.rows.map((t) => t.entries)
  )

  const duesByTypeRows = [
    { tier: 'Standard', collected: '₱162,000', dueSoon: 14, overdue: 8 },
    { tier: 'Premier', collected: '₱96,000', dueSoon: 5, overdue: 3 },
    { tier: 'Family', collected: '₱40,000', dueSoon: 4, overdue: 5 },
    { tier: 'Junior / Senior', collected: '₱23,300', dueSoon: 4, overdue: 3 },
  ]

  return (
    <div className="mx-auto max-w-[1280px] px-4 pt-10">
      <ScopeBar
        club={currentClub}
        title="Reports"
        right={
          <div className="flex items-center gap-2 rounded-xl border border-[#ddd6c4] bg-[#fbf8f1] p-1 pl-3">
            <span className="flex items-center gap-1.5 text-xs font-medium text-[#5e6b5a]">
              <Calendar className="h-3.5 w-3.5" />
              Date range
            </span>
            <Tabs value={range} onValueChange={setRange}>
              <TabsList className="border-0 bg-transparent p-0">
                <TabsTrigger value="3mo" className="h-8 text-xs">
                  3 mo
                </TabsTrigger>
                <TabsTrigger value="6mo" className="h-8 text-xs">
                  6 mo
                </TabsTrigger>
                <TabsTrigger value="12mo" className="h-8 text-xs">
                  12 mo
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        }
      />

      <p className="mt-2 text-sm text-[#5e6b5a]">{data.label}</p>

      <div className="mt-6 space-y-6">
        {/* Report 1: Membership summary */}
        <Card className="p-6">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[1.4px] text-[#6b8f57]">
                Report 1
              </p>
              <h2 className="font-display text-2xl font-extrabold text-[#1e2a1f]">
                Membership summary
              </h2>
            </div>
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() =>
                  exportReport(
                    'Membership summary',
                    'CSV',
                    data.membership.rows
                  )
                }
              >
                <Download className="h-3.5 w-3.5" />
                CSV
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => exportReport('Membership summary', 'PDF')}
              >
                PDF
              </Button>
            </div>
          </div>

          <div className="mt-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
            {[
              { value: data.membership.total, label: 'Total members' },
              { value: data.membership.active, label: 'Active' },
              { value: data.membership.newPeriod, label: 'New in period' },
              { value: data.membership.lapsed, label: 'Lapsed in period' },
            ].map((k) => (
              <Card key={k.label} className="p-4">
                <p className="font-display text-2xl font-extrabold text-[#1e2a1f]">
                  {k.value}
                </p>
                <p className="mt-1 text-xs text-[#5e6b5a]">{k.label}</p>
              </Card>
            ))}
          </div>

          <div className="mt-6 grid grid-cols-1 items-start gap-6 lg:grid-cols-12">
            <div className="lg:col-span-6">
              <div className="flex gap-2">
                <div className="flex h-44 flex-col justify-between pb-1 pt-4 font-mono-num text-[11px] text-[#5e6b5a]">
                  <span>{maxNew}</span>
                  <span>{Math.round(maxNew / 2)}</span>
                  <span>0</span>
                </div>
                <div className="flex h-44 flex-1 items-end justify-around gap-3 border-b border-[#ddd6c4] px-3 pt-4">
                  {data.membership.rows.map((r) => (
                    <div
                      key={r.month}
                      className="flex h-full flex-1 flex-col items-center justify-end gap-1"
                    >
                      <div className="flex h-32 items-end gap-1">
                        <div className="flex flex-col items-center justify-end h-full">
                          <span className="mb-1 font-mono-num text-[10px] text-[#5e6b5a]">
                            {r.newCount}
                          </span>
                          <div
                            className="w-5 rounded-t-md bg-[#6b8f57]"
                            style={{
                              height: `${Math.max(12, (r.newCount / maxNew) * 84)}%`,
                            }}
                            title={`New: ${r.newCount}`}
                          />
                        </div>
                        <div className="flex flex-col items-center justify-end h-full">
                          <span className="mb-1 font-mono-num text-[10px] text-[#b0453a]">
                            {r.lapsed}
                          </span>
                          <div
                            className="w-3 rounded-t-md bg-[#b0453a]/75"
                            style={{
                              height: `${Math.max(12, (r.lapsed / maxNew) * 84)}%`,
                            }}
                            title={`Lapsed: ${r.lapsed}`}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="mt-1.5 flex justify-around pl-6 pr-3 font-mono-num text-xs text-[#5e6b5a]">
                {data.membership.rows.map((r) => (
                  <span key={r.month}>{r.month}</span>
                ))}
              </div>
              <div className="mt-3 flex items-center gap-4 text-xs text-[#5e6b5a]">
                <span className="inline-flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-[#6b8f57]" />
                  New
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-[#b0453a]/75" />
                  Lapsed
                </span>
              </div>
            </div>

            <div className="lg:col-span-6">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Month</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Active</TableHead>
                    <TableHead>New</TableHead>
                    <TableHead>Lapsed</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.membership.rows.map((r) => (
                    <TableRow key={r.month}>
                      <TableCell className="font-semibold">{r.month}</TableCell>
                      <TableCell className="font-mono-num">{r.total}</TableCell>
                      <TableCell className="font-mono-num">{r.active}</TableCell>
                      <TableCell className="font-mono-num">
                        {r.newCount}
                      </TableCell>
                      <TableCell className="font-mono-num">{r.lapsed}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </Card>

        {/* Report 2: Dues collected */}
        <Card className="p-6">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[1.4px] text-[#6b8f57]">
                Report 2
              </p>
              <h2 className="font-display text-2xl font-extrabold text-[#1e2a1f]">
                Dues collected
              </h2>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Tabs value={duesView} onValueChange={setDuesView}>
                <TabsList>
                  <TabsTrigger value="month" className="h-8 text-xs">
                    By month
                  </TabsTrigger>
                  <TabsTrigger value="type" className="h-8 text-xs">
                    By type
                  </TabsTrigger>
                </TabsList>
              </Tabs>
              <Button
                size="sm"
                variant="outline"
                onClick={() =>
                  exportReport('Dues collected', 'CSV', data.dues.byMonth)
                }
              >
                <Download className="h-3.5 w-3.5" />
                CSV
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => exportReport('Dues collected', 'PDF')}
              >
                PDF
              </Button>
            </div>
          </div>

          <div className="mt-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
            <Card className="p-4">
              <p className="font-display text-2xl font-extrabold text-[#1e2a1f]">
                {data.dues.collected}
              </p>
              <p className="mt-1 text-xs text-[#5e6b5a]">Collected</p>
            </Card>
            <Card className="p-4">
              <div className="flex items-start justify-between gap-2">
                <p className="font-display text-2xl font-extrabold text-[#1e2a1f]">
                  {data.dues.dueSoon}
                </p>
                <Badge variant="openPlay">
                  <Clock className="h-3 w-3" />
                  Due soon
                </Badge>
              </div>
              <p className="mt-1 text-xs text-[#5e6b5a]">
                Current due soon (members)
              </p>
            </Card>
            <Card className="p-4">
              <div className="flex items-start justify-between gap-2">
                <p className="font-display text-2xl font-extrabold text-[#1e2a1f]">
                  {data.dues.overdue}
                </p>
                <Badge variant="overdue">
                  <AlertTriangle className="h-3 w-3" />
                  Overdue
                </Badge>
              </div>
              <p className="mt-1 text-xs text-[#5e6b5a]">
                Current overdue (members)
              </p>
            </Card>
            <Card className="p-4">
              <p className="font-display text-2xl font-extrabold text-[#1e2a1f]">
                {data.dues.rate}
              </p>
              <p className="mt-1 text-xs text-[#5e6b5a]">Collection rate</p>
            </Card>
          </div>

          <div className="mt-6 grid grid-cols-1 items-start gap-6 lg:grid-cols-12">
            <div className="lg:col-span-6">
              <div className="flex gap-2">
                <div className="flex h-44 flex-col justify-between pb-1 pt-4 font-mono-num text-[11px] text-[#5e6b5a]">
                  <span>₱{Math.round(maxDues / 1000)}k</span>
                  <span>₱{Math.round(maxDues / 2000)}k</span>
                  <span>₱0</span>
                </div>
                <div className="flex h-44 flex-1 items-end justify-around gap-3 border-b border-[#ddd6c4] px-3 pt-4">
                  {data.dues.byMonth.map((r) => (
                    <div
                      key={r.month}
                      className="flex h-full flex-1 flex-col items-center justify-end"
                    >
                      <span className="mb-1 font-mono-num text-[10px] text-[#5e6b5a]">
                        {(r.collected / 1000).toFixed(1)}k
                      </span>
                      <div
                        className="w-6 rounded-t-md bg-[#6b8f57]"
                        style={{
                          height: `${Math.max(20, (r.collected / maxDues) * 80)}%`,
                        }}
                        title={`₱${r.collected.toLocaleString()}`}
                      />
                    </div>
                  ))}
                </div>
              </div>
              <div className="mt-1.5 flex justify-around pl-10 pr-3 font-mono-num text-xs text-[#5e6b5a]">
                {data.dues.byMonth.map((r) => (
                  <span key={r.month}>{r.month}</span>
                ))}
              </div>
              <p className="mt-3 flex items-center gap-1.5 text-xs text-[#5e6b5a]">
                <span className="h-2.5 w-2.5 rounded-full bg-[#6b8f57]" />
                Collected (₱ thousands, recorded manually)
              </p>
            </div>

            <div className="lg:col-span-6">
              {duesView === 'month' ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Month</TableHead>
                      <TableHead>Collected ₱</TableHead>
                      <TableHead>Due soon</TableHead>
                      <TableHead>Overdue</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data.dues.byMonth.map((r) => (
                      <TableRow key={r.month}>
                        <TableCell className="font-semibold">
                          {r.month}
                        </TableCell>
                        <TableCell className="font-mono-num">
                          {r.collected.toLocaleString()}
                        </TableCell>
                        <TableCell className="font-mono-num">
                          {r.dueSoon}
                        </TableCell>
                        <TableCell className="font-mono-num">
                          {r.overdue}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Plan type</TableHead>
                      <TableHead>Collected</TableHead>
                      <TableHead>Due soon</TableHead>
                      <TableHead>Overdue</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {duesByTypeRows.map((r) => (
                      <TableRow key={r.tier}>
                        <TableCell className="font-semibold">
                          {r.tier}
                        </TableCell>
                        <TableCell className="font-mono-num">
                          {r.collected}
                        </TableCell>
                        <TableCell className="font-mono-num">
                          {r.dueSoon}
                        </TableCell>
                        <TableCell className="font-mono-num">
                          {r.overdue}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </div>
          </div>
        </Card>

        {/* Report 3: Court utilization */}
        <Card className="p-6">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[1.4px] text-[#6b8f57]">
                Report 3
              </p>
              <h2 className="font-display text-2xl font-extrabold text-[#1e2a1f]">
                Court utilization
              </h2>
            </div>
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() =>
                  exportReport(
                    'Court utilization',
                    'CSV',
                    data.utilization.courts
                  )
                }
              >
                <Download className="h-3.5 w-3.5" />
                CSV
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => exportReport('Court utilization', 'PDF')}
              >
                PDF
              </Button>
            </div>
          </div>

          <div className="mt-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
            <Card className="p-4">
              <p className="font-display text-2xl font-extrabold text-[#1e2a1f]">
                {data.utilization.totalBookings}
              </p>
              <p className="mt-1 text-xs text-[#5e6b5a]">Total bookings</p>
            </Card>
            <Card className="p-4">
              <p className="font-display text-2xl font-extrabold text-[#1e2a1f]">
                {data.utilization.avgPct}
              </p>
              <p className="mt-1 text-xs text-[#5e6b5a]">Avg utilization</p>
            </Card>
            <Card className="p-4">
              <p className="font-display text-2xl font-extrabold text-[#1e2a1f]">
                {data.utilization.peakHour}
              </p>
              <p className="mt-1 text-xs text-[#5e6b5a]">Peak hour</p>
            </Card>
            <Card className="p-4">
              <div className="flex items-start justify-between gap-2">
                <p className="font-display text-2xl font-extrabold text-[#1e2a1f]">
                  {data.utilization.underusedCount}
                </p>
                <Badge variant="neutral">
                  <TrendingDown className="h-3 w-3" />
                  Underused
                </Badge>
              </div>
              <p className="mt-1 text-xs text-[#5e6b5a]">
                Idle courts (&lt;30%)
              </p>
            </Card>
          </div>

          <div className="mt-6 grid grid-cols-1 items-start gap-6 lg:grid-cols-12">
            <div className="space-y-6 lg:col-span-6">
              <div>
                <div className="flex gap-2">
                  <div className="flex h-36 flex-col justify-between pb-1 pt-3 font-mono-num text-[11px] text-[#5e6b5a]">
                    <span>{maxCourtBookings}</span>
                    <span>{Math.round(maxCourtBookings / 2)}</span>
                    <span>0</span>
                  </div>
                  <div className="flex h-36 flex-1 items-end justify-around gap-3 border-b border-[#ddd6c4] px-3 pt-3">
                    {data.utilization.courts.map((c) => (
                      <div
                        key={c.court}
                        className="flex h-full flex-1 flex-col items-center justify-end"
                      >
                        <span className="mb-1 font-mono-num text-[10px] text-[#5e6b5a]">
                          {c.bookings}
                        </span>
                        <div
                          className="w-6 rounded-t-md bg-[#6b8f57]"
                          style={{
                            height: `${Math.max(18, (c.bookings / maxCourtBookings) * 80)}%`,
                          }}
                          title={`${c.court}: ${c.bookings} bookings (${c.util}%)`}
                        />
                      </div>
                    ))}
                  </div>
                </div>
                <div className="mt-1.5 flex justify-around pl-9 pr-3 font-mono-num text-xs text-[#5e6b5a]">
                  {data.utilization.courts.map((_, idx) => (
                    <span key={idx}>C{idx + 1}</span>
                  ))}
                </div>
                <p className="mt-2 flex items-center gap-1.5 text-xs text-[#5e6b5a]">
                  <span className="h-2.5 w-2.5 rounded-full bg-[#6b8f57]" />
                  Bookings per court
                </p>
              </div>

              <div>
                <div className="flex gap-2">
                  <div className="flex h-28 flex-col justify-between pb-1 pt-3 font-mono-num text-[11px] text-[#5e6b5a]">
                    <span>{maxHourly}</span>
                    <span>0</span>
                  </div>
                  <div className="flex h-28 flex-1 items-end justify-between gap-1.5 border-b border-[#ddd6c4] px-2 pt-3">
                    {data.utilization.hourly.map((val, idx) => (
                      <div
                        key={idx}
                        className="flex-1 rounded-t-sm bg-[#c9d6b8]"
                        style={{
                          height: `${Math.max(14, (val / maxHourly) * 90)}%`,
                        }}
                        title={`${SCHEDULE_HOURS[idx]}: ${val} avg bookings`}
                      />
                    ))}
                  </div>
                </div>
                <div className="mt-1.5 flex justify-between gap-0.5 pl-8 pr-1 font-mono-num text-[9px] text-[#5e6b5a] sm:text-[10px]">
                  {SCHEDULE_HOURS.map((h) => (
                    <span key={h}>{h}</span>
                  ))}
                </div>
                <p className="mt-2 flex items-center gap-1.5 text-xs text-[#5e6b5a]">
                  <span className="h-2.5 w-2.5 rounded-full bg-[#c9d6b8]" />
                  Avg bookings by start hour
                </p>
              </div>
            </div>

            <div className="lg:col-span-6">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Court</TableHead>
                    <TableHead>Bookings</TableHead>
                    <TableHead>Utilization</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.utilization.courts.map((c) => (
                    <TableRow key={c.court}>
                      <TableCell className="font-semibold">{c.court}</TableCell>
                      <TableCell className="font-mono-num">
                        {c.bookings}
                      </TableCell>
                      <TableCell className="font-mono-num">{c.util}%</TableCell>
                      <TableCell className="text-[#5e6b5a]">
                        {c.status}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </Card>

        {/* Report 4: Tournament participation (chronological order aligned across chart and table) */}
        <Card className="p-6">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[1.4px] text-[#6b8f57]">
                Report 4
              </p>
              <h2 className="font-display text-2xl font-extrabold text-[#1e2a1f]">
                Tournament participation
              </h2>
            </div>
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() =>
                  exportReport(
                    'Tournament participation',
                    'CSV',
                    data.tournaments.rows
                  )
                }
              >
                <Download className="h-3.5 w-3.5" />
                CSV
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => exportReport('Tournament participation', 'PDF')}
              >
                PDF
              </Button>
            </div>
          </div>

          <div className="mt-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
            {[
              { value: data.tournaments.events, label: 'Events' },
              { value: data.tournaments.totalEntries, label: 'Total entries' },
              { value: data.tournaments.avgEvent, label: 'Avg per event' },
              {
                value: data.tournaments.avgDivision,
                label: 'Avg per division',
              },
            ].map((k) => (
              <Card key={k.label} className="p-4">
                <p className="font-display text-2xl font-extrabold text-[#1e2a1f]">
                  {k.value}
                </p>
                <p className="mt-1 text-xs text-[#5e6b5a]">{k.label}</p>
              </Card>
            ))}
          </div>

          <div className="mt-6 grid grid-cols-1 items-start gap-6 lg:grid-cols-12">
            <div className="lg:col-span-6">
              <div className="flex gap-2">
                <div className="flex h-40 flex-col justify-between pb-1 pt-4 font-mono-num text-[11px] text-[#5e6b5a]">
                  <span>{maxEntries}</span>
                  <span>{Math.round(maxEntries / 2)}</span>
                  <span>0</span>
                </div>
                <div className="flex h-40 flex-1 items-end justify-around gap-4 border-b border-[#ddd6c4] px-4 pt-4">
                  {data.tournaments.rows.map((t) => (
                    <div
                      key={t.name}
                      className="flex h-full flex-1 flex-col items-center justify-end"
                    >
                      <span className="mb-1 font-mono-num text-[10px] text-[#5e6b5a]">
                        {t.entries}
                      </span>
                      <div
                        className="w-7 rounded-t-md bg-[#6b8f57]"
                        style={{
                          height: `${Math.max(25, (t.entries / maxEntries) * 80)}%`,
                        }}
                        title={`${t.name}: ${t.entries} entries`}
                      />
                    </div>
                  ))}
                </div>
              </div>
              <div className="mt-1.5 flex justify-around pl-9 pr-4 font-mono-num text-xs text-[#5e6b5a]">
                {data.tournaments.rows.map((t) => (
                  <span key={t.name}>{t.date}</span>
                ))}
              </div>
              <p className="mt-3 flex items-center gap-1.5 text-xs text-[#5e6b5a]">
                <span className="h-2.5 w-2.5 rounded-full bg-[#6b8f57]" />
                Team entries per event (oldest → newest)
              </p>
            </div>

            <div className="lg:col-span-6">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tournament</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Entries</TableHead>
                    <TableHead>Divisions</TableHead>
                    <TableHead>Per division</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.tournaments.rows.map((t) => (
                    <TableRow key={t.name}>
                      <TableCell className="font-semibold">{t.name}</TableCell>
                      <TableCell className="text-[#5e6b5a]">{t.date}</TableCell>
                      <TableCell className="font-mono-num">
                        {t.entries}
                      </TableCell>
                      <TableCell className="font-mono-num">
                        {t.divisions}
                      </TableCell>
                      <TableCell className="font-mono-num">
                        {t.perDiv}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
