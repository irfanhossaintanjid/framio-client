import {
  ArrowUpRightIcon,
  BarChart3Icon,
  CheckIcon,
  InboxIcon,
  WalletIcon,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"

const benefits = [
  {
    icon: WalletIcon,
    title: "Fast, predictable payouts",
    description: "Get paid 24 hours after each session, straight to your bank.",
  },
  {
    icon: BarChart3Icon,
    title: "Occupancy you can act on",
    description: "See your best days, slow hours, and repeat guests at a glance.",
  },
  {
    icon: InboxIcon,
    title: "One inbox for requests",
    description: "Approve, reschedule, or message guests without leaving Framio.",
  },
]

type BookingStatus = "Confirmed" | "Pending" | "Completed"

const bookings: Array<{
  studio: string
  guest: string
  date: string
  time: string
  status: BookingStatus
  amount: string
}> = [
  {
    studio: "Northlight Studio",
    guest: "Mara Chen",
    date: "Nov 8",
    time: "10:00 – 13:00",
    status: "Confirmed",
    amount: "$255",
  },
  {
    studio: "Blue Hour Loft",
    guest: "Elena Voss",
    date: "Nov 9",
    time: "14:00 – 18:00",
    status: "Pending",
    amount: "$380",
  },
  {
    studio: "The Sound Room",
    guest: "Devon Ellis",
    date: "Nov 11",
    time: "09:00 – 12:00",
    status: "Confirmed",
    amount: "$195",
  },
  {
    studio: "Meridian Film Stage",
    guest: "Priya Raman",
    date: "Oct 30",
    time: "08:00 – 16:00",
    status: "Completed",
    amount: "$1,120",
  },
]

const payouts = [
  { date: "Nov 2", method: "Bank transfer", status: "Paid", amount: "$610" },
  { date: "Oct 26", method: "Bank transfer", status: "Paid", amount: "$1,420" },
  { date: "Oct 19", method: "Bank transfer", status: "Paid", amount: "$980" },
  { date: "Oct 12", method: "Bank transfer", status: "Processing", amount: "$740" },
]

function statusVariant(status: BookingStatus) {
  if (status === "Confirmed") return "success" as const
  if (status === "Pending") return "warning" as const
  return "info" as const
}

const stats = [
  { label: "Revenue this month", value: "$8,420", detail: "+18% vs. last month" },
  { label: "Occupancy", value: "76%", detail: "+6 pts this month" },
  { label: "Upcoming sessions", value: "12", detail: "3 need confirmation" },
]

export function DashboardSection() {
  return (
    <section
      id="dashboard"
      className="scroll-mt-20 border-t border-border/70 bg-background py-16 sm:py-20"
    >
      <div className="mx-auto grid w-full max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-[0.85fr_1.15fr] lg:gap-14 lg:px-8">
        <div className="flex flex-col gap-6">
          <div>
            <p className="text-sm font-medium tracking-wide text-link uppercase">
              For studios
            </p>
            <h2 className="mt-2 font-heading text-3xl font-semibold tracking-tight sm:text-4xl">
              A dashboard that earns its keep
            </h2>
            <p className="mt-2 text-muted-foreground">
              List your space, set your own availability, and run the whole
              calendar from one calm, readable place.
            </p>
          </div>

          <ul className="flex flex-col gap-4">
            {benefits.map((benefit) => {
              const Icon = benefit.icon
              return (
                <li key={benefit.title} className="flex gap-3">
                  <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary dark:bg-primary/15 dark:text-highlight">
                    <Icon className="size-4" aria-hidden="true" />
                  </span>
                  <div>
                    <p className="text-sm font-medium">{benefit.title}</p>
                    <p className="text-sm text-muted-foreground">
                      {benefit.description}
                    </p>
                  </div>
                </li>
              )
            })}
          </ul>

          <div className="flex flex-wrap items-center gap-3">
            <Button render={<a href="#for-studios" />}>
              List your studio
              <ArrowUpRightIcon aria-hidden="true" />
            </Button>
            <Button variant="link" render={<a href="#how-it-works" />}>
              See how hosting works
            </Button>
          </div>

          <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <CheckIcon className="size-4 text-success" aria-hidden="true" />
            No listing fees. Framio only earns when you book.
          </p>
        </div>

        <div className="flex flex-col gap-4">
          <div className="grid gap-3 sm:grid-cols-3">
            {stats.map((stat) => (
              <Card key={stat.label} size="sm" className="gap-1 px-4 py-3">
                <p className="text-xs text-muted-foreground">{stat.label}</p>
                <p className="font-heading text-xl font-semibold">{stat.value}</p>
                <p className="text-xs text-success">{stat.detail}</p>
              </Card>
            ))}
          </div>

          <Card className="gap-0 overflow-hidden p-0">
            <Tabs defaultValue="bookings" className="gap-0">
              <div className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="font-heading text-sm font-semibold">
                    Studio activity
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Last 30 days · all locations
                  </p>
                </div>
                <TabsList>
                  <TabsTrigger value="bookings">Bookings</TabsTrigger>
                  <TabsTrigger value="payouts">Payouts</TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="bookings">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="pl-4">Studio</TableHead>
                      <TableHead>Guest</TableHead>
                      <TableHead className="hidden md:table-cell">When</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="pr-4 text-right">Amount</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {bookings.map((booking) => (
                      <TableRow key={`${booking.studio}-${booking.date}`}>
                        <TableCell className="pl-4 font-medium">
                          {booking.studio}
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {booking.guest}
                        </TableCell>
                        <TableCell className="hidden text-muted-foreground md:table-cell">
                          {booking.date} · {booking.time}
                        </TableCell>
                        <TableCell>
                          <Badge variant={statusVariant(booking.status)}>
                            {booking.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="pr-4 text-right font-medium">
                          {booking.amount}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TabsContent>

              <TabsContent value="payouts">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="pl-4">Date</TableHead>
                      <TableHead className="hidden sm:table-cell">Method</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="pr-4 text-right">Amount</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {payouts.map((payout) => (
                      <TableRow key={payout.date}>
                        <TableCell className="pl-4 font-medium">
                          {payout.date}
                        </TableCell>
                        <TableCell className="hidden text-muted-foreground sm:table-cell">
                          {payout.method}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              payout.status === "Paid" ? "success" : "info"
                            }
                          >
                            {payout.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="pr-4 text-right font-medium">
                          {payout.amount}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TabsContent>
            </Tabs>
          </Card>
        </div>
      </div>
    </section>
  )
}
